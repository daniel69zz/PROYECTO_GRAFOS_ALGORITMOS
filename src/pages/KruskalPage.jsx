import { useState, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Nodo } from "../components/Nodo";
import { Arista } from "../components/Arista";
import { Notification } from "../components/Notification";
import { KruskalControls } from "../components/KruskalControls";
import { TbArrowBackUp } from "react-icons/tb";
import { ExportModal } from "../components/ExportModal";
import { BiExport, BiImport } from "react-icons/bi";
import { exportar_grafo, importar_grafo } from "../utils/exp_imp_grafo";
import { buildGraphFromState, kruskal, computeEdgeSlacks } from "../algorithms/kruskal";

const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

export function KruskalPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const originalNodos = location.state?.nodos ?? [];
  const originalAristas = location.state?.aristas ?? [];

  const [nodos, setNodos] = useState(location.state?.nodos || []);
  const [aristas, setAristas] = useState(location.state?.aristas || []);

  const [kruskalMode, setKruskalMode] = useState("minimizar");

  const [showConfigModal, setShowConfigModal] = useState(true);
  const [notification, setNotification] = useState(() => {
    if (!location.state?.nodos || location.state.nodos.length === 0) {
      return {
        message: "No se recibió ningún grafo para aplicar Kruskal.",
        type: "error",
      };
    }
    return null;
  });

  const [showResultModal, setShowResultModal] = useState(false);
  const [kruskalResult, setKruskalResult] = useState(null); // { totalWeight, edges: [{from, to}], nodes: [id1, id2...] }

  const [exportModal, setExportModal] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const fileInputRef = useRef(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  function showNotification(message, type = "info") {
    setNotification({ message, type });
  }

  const closeNotification = () => {
    setNotification(null);
  };

  const calculateKruskal = () => {
    const tieneAristaDirigida = aristas.some(
      (ar) => ar.tipo === "dirigida" || ar.tipo === undefined,
    );
    if (tieneAristaDirigida) {
      showNotification(
        "Kruskal requiere un grafo no dirigido. Hay aristas dirigidas en el grafo.",
        "error",
      );
      return;
    }

    const graph = buildGraphFromState(nodos, aristas);

    if (!graph.nodes.length) {
      showNotification("No hay nodos para aplicar Kruskal.", "warning");
      return;
    }

    if (!graph.edges.length) {
      showNotification(
        "No hay aristas válidas para aplicar Kruskal (los lazos u=v se ignoran).",
        "warning",
      );
      return;
    }

    const mode = kruskalMode === "minimizar" ? "asc" : "desc";
    const { mst, totalWeight, components, isSpanningTree } = kruskal(graph, mode);

    if (!mst.length) {
      setKruskalResult(null);
      setShowResultModal(false);
      showNotification(
        "No se pudo construir un árbol de expansión. Verifica que el grafo tenga aristas válidas.",
        "error",
      );
      return;
    }

    const mstEdges = mst.map(({ id, u, v, w, order, sourceEdge }) => ({
      id,
      from: u,
      to: v,
      weight: w,
      originalWeight: sourceEdge?.weight ?? w,
      tipo: sourceEdge?.tipo,
      order,
    }));

    const mstEdgeIds = new Set(mstEdges.map((e) => e.id));
    const mstNodes = new Set();
    mst.forEach(({ u, v }) => {
      mstNodes.add(u);
      mstNodes.add(v);
    });

    const slacks = computeEdgeSlacks(graph, mst, mode);

    setKruskalResult({
      totalWeight,
      edges: mstEdges,
      edgeIds: mstEdgeIds,
      nodes: Array.from(mstNodes),
      mode: kruskalMode,
      isSpanningTree,
      components,
      slacks,
    });

    setShowResultModal(true);

    if (isSpanningTree) {
      showNotification(
        `Árbol de expansión ${kruskalMode === "minimizar" ? "mínimo" : "máximo"} calculado con éxito.`,
        "success",
      );
      return;
    }

    showNotification(
      `Se obtuvo un bosque con ${components.length} componentes (grafo desconectado).`,
      "warning",
    );
  };

  const handleClear = () => {
    setKruskalResult(null);
    setShowResultModal(false);
    setShowConfigModal(true);
  };

  const handleExportar = () => {
    const nombreSugerido = `grafo_kruskal_${new Date().toLocaleDateString().replace(/\//g, "-")}`;
    setSuggestedName(nombreSugerido);
    setExportModal(true);
  };

  const confirmExport = (nombreArchivo) => {
    try {
      const nombreFinal = nombreArchivo.trim() || suggestedName;
      const nextId = Math.max(...nodos.map((n) => n.id), 0) + 1;
      exportar_grafo(nodos, aristas, nextId, nombreFinal);
      showNotification("Grafo exportado correctamente", "success");
      setExportModal(false);
    } catch (e) {
      console.error("Error al exportar:", e);
      showNotification(`Error al exportar el grafo:\n${e.message}`, "error");
    }
  };

  const handleImportar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const grafo_data = await importar_grafo(file);
      setNodos(grafo_data.nodos);
      setAristas(grafo_data.aristas);
      
      setKruskalResult(null);
      setShowResultModal(false);
      setShowConfigModal(true);
      
      showNotification("Grafo importado correctamente", "success");
    } catch (e) {
      console.error("Error al importar:", e);
      showNotification(`Grafo NO IMPORTADO\n${e.message}`, "error");
    }
    event.target.value = "";
  };

  const abrirSelectorArchivo = () => {
    fileInputRef.current?.click();
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("[data-nodo]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setOffset({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  const isOptimalEdgeByIndex = (index) => {
    if (!kruskalResult) return false;
    return kruskalResult.edgeIds.has(index);
  };

  const isOptimalNode = (id) => {
    if (!kruskalResult) return false;
    return kruskalResult.nodes.includes(id);
  };

  const getLabelById = (id) => nodos.find((n) => n.id === id)?.label ?? `#${id}`;

  return (
    <PageWrapper>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleImportar}
      />
      {exportModal && (
        <ExportModal
          defaultName={suggestedName}
          onConfirm={confirmExport}
          onCancel={() => setExportModal(false)}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <Header>
        <BackButton
          onClick={() =>
            navigate("/graph", {
              state: { nodos: originalNodos, aristas: originalAristas },
            })
          }
        >
          <TbArrowBackUp /> Volver al Grafo
        </BackButton>
        <Title>Aplicar Kruskal</Title>
        <div style={{ flex: 1 }} />
        <HeaderAction onClick={handleExportar} title="Exportar">
          <BiExport />
        </HeaderAction>
        <HeaderAction onClick={abrirSelectorArchivo} title="Importar">
          <BiImport />
        </HeaderAction>
      </Header>

      <ContentWrapper>
        <CanvasArea
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          $isPanning={isPanning}
        >
          <Canvas $offsetX={offset.x} $offsetY={offset.y}>
            <SvgCanvas>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="black" />
                </marker>
                <marker id="arrowhead-optimal-kruskal" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3, 0 6" fill="#fb923c" />
                </marker>
              </defs>

              {aristas.map((ar, index) => {
                const optimal = isOptimalEdgeByIndex(index);
                const slack = kruskalResult?.slacks?.get(index);
                return (
                  <Arista
                    key={index}
                    ar={{ ...ar, isOptimalKruskal: optimal }}
                    nodos={nodos}
                    existeContraria={existeAristaContraria(
                      aristas,
                      ar.from,
                      ar.to,
                    )}
                    herramienta={10}
                    onAristaClick={() => {}}
                    customStroke={optimal ? "#fb923c" : null}
                    customStrokeWidth={optimal ? 4 : null}
                    customMarkerEnd={optimal ? "url(#arrowhead-optimal-kruskal)" : null}
                    customSlack={kruskalResult ? slack : undefined}
                    customSlackColor={optimal ? "#fb923c" : "#1e40af"}
                  />
                );
              })}
            </SvgCanvas>

            {nodos.map((node) => (
              <Nodo
                key={node.id}
                nodo={node}
                onClick={() => {}}
                seleccionado={false}
                onDrag={() => {}}
                herramienta={10}
                customStroke={isOptimalNode(node.id) ? "#fb923c" : null}
                customStrokeWidth={isOptimalNode(node.id) ? 4 : null}
              />
            ))}
          </Canvas>

          {showConfigModal && (
            <ModalOverlay>
              <ModalContent>
                <h2>Configuración Kruskal</h2>

                {nodos.length === 0 ? (
                  <>
                    <p
                      style={{
                        color: "#ff8a80",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                      }}
                    >
                      No se encontró ningún grafo válido. Por favor, vuelve al
                      editor y asegúrate de tener nodos creados antes de aplicar
                      Kruskal.
                    </p>
                    <ModalActions style={{ justifyContent: "flex-end" }}>
                      <Button
                        onClick={() =>
                          navigate("/graph", {
                            state: {
                              nodos: originalNodos,
                              aristas: originalAristas,
                            },
                          })
                        }
                        style={{ background: "#4caf50" }}
                      >
                        Cancelar
                      </Button>
                    </ModalActions>
                  </>
                ) : (
                  <>
                    <FormGroup>
                      <label>Objetivo</label>
                      <RadioGroup>
                        <label>
                          <input
                            type="radio"
                            name="kruskalMode"
                            value="minimizar"
                            checked={kruskalMode === "minimizar"}
                            onChange={() => setKruskalMode("minimizar")}
                          />
                          Minimizar (Árbol Mínimo)
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="kruskalMode"
                            value="maximizar"
                            checked={kruskalMode === "maximizar"}
                            onChange={() => setKruskalMode("maximizar")}
                          />
                          Maximizar (Árbol Máximo)
                        </label>
                      </RadioGroup>
                    </FormGroup>

                    <ModalActions style={{ justifyContent: "space-between" }}>
                      <Button
                        onClick={() =>
                          navigate("/graph", {
                            state: {
                              nodos: originalNodos,
                              aristas: originalAristas,
                            },
                          })
                        }
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#fff",
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          setShowConfigModal(false);
                        }}
                      >
                        Comenzar
                      </Button>
                    </ModalActions>
                  </>
                )}
              </ModalContent>
            </ModalOverlay>
          )}

          {showResultModal && kruskalResult && (
            <ModalOverlay>
              <ResultModalContent>
                <ResultIcon>{kruskalResult.mode === "minimizar" ? "⚡" : "🏆"}</ResultIcon>
                <ResultTitle>
                  Árbol de Expansión {kruskalResult.mode === "minimizar" ? "Mínimo" : "Máximo"}
                </ResultTitle>
                <ResultLabel>Peso Total</ResultLabel>
                <ResultValue>{kruskalResult.totalWeight}</ResultValue>
                <ResultSub>
                  Aristas incluidas: {kruskalResult.edges.length}
                  {kruskalResult.isSpanningTree
                    ? ""
                    : ` · Bosque con ${kruskalResult.components.length} componentes`}
                </ResultSub>

                <EdgeList>
                  <EdgeListTitle>Orden de selección</EdgeListTitle>
                  {kruskalResult.edges.map((e) => (
                    <EdgeRow key={e.id}>
                      <EdgeStep>{e.order}</EdgeStep>
                      <EdgePair>
                        {getLabelById(e.from)} — {getLabelById(e.to)}
                      </EdgePair>
                      <EdgeWeight>w = {e.weight}</EdgeWeight>
                    </EdgeRow>
                  ))}
                </EdgeList>

                {!kruskalResult.isSpanningTree && (
                  <ComponentBox>
                    {kruskalResult.components.map((comp, i) => (
                      <ComponentLine key={i}>
                        <strong>C{i + 1}:</strong>{" "}
                        {comp.map((id) => getLabelById(id)).join(", ")}
                      </ComponentLine>
                    ))}
                  </ComponentBox>
                )}

                <ResultCloseBtn onClick={() => setShowResultModal(false)}>
                  Cerrar
                </ResultCloseBtn>
              </ResultModalContent>
            </ModalOverlay>
          )}
        </CanvasArea>

        {!showConfigModal && (
          <KruskalControls
            mode={kruskalMode}
            result={kruskalResult}
            onClear={handleClear}
            onCalculate={calculateKruskal}
            onShowResult={() => kruskalResult && setShowResultModal(true)}
            disabledCalculate={false}
          />
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 24px;
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 8px 16px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    font-size: 20px;
  }
`;

const Title = styled.h1`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const HeaderAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 8px;
  }
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #f5f5f5;
  background-image:
    linear-gradient(to right, #ccc 1px, transparent 1px),
    linear-gradient(to bottom, #ccc 1px, transparent 1px);
  background-size: 40px 40px;
  overflow: hidden;
  cursor: ${({ $isPanning }) => ($isPanning ? "grabbing" : "default")};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(
    ${({ $offsetX }) => $offsetX}px,
    ${({ $offsetY }) => $offsetY}px
  );
`;

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: inherit;
`;

const ModalContent = styled.div`
  background: var(--glass-bg, rgba(20, 25, 30, 0.85));
  backdrop-filter: var(--glass-blur, blur(16px));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  padding: 24px;
  border-radius: 16px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: #fff;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.95rem;
    color: #fff;
    cursor: pointer;
    font-weight: normal;

    input[type="radio"] {
      width: 18px;
      height: 18px;
      accent-color: #fb923c;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button`
  background: var(--accent-color, #fb923c);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-hover, #f97316);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResultModalContent = styled.div`
  background: var(--glass-bg, rgba(15, 20, 28, 0.92));
  backdrop-filter: var(--glass-blur, blur(20px));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  padding: 28px 32px;
  border-radius: 20px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(249, 115, 22, 0.15);
  color: #fff;
  animation: slideInResult 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideInResult {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.92);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ResultIcon = styled.div`
  font-size: 2.4rem;
  line-height: 1;
`;

const ResultTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-color, #fb923c);
  letter-spacing: 0.02em;
`;

const ResultLabel = styled.p`
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const ResultValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  text-shadow: 0 0 24px rgba(249, 115, 22, 0.5);
`;

const ResultSub = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`;

const EdgeList = styled.div`
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  background: rgba(249, 115, 22, 0.06);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(249, 115, 22, 0.35);
    border-radius: 3px;
  }
`;

const EdgeListTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 4px;
`;

const EdgeRow = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #fed7aa;
  padding: 3px 4px;
  border-radius: 6px;

  &:hover {
    background: rgba(249, 115, 22, 0.1);
  }
`;

const EdgeStep = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.25);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
`;

const EdgePair = styled.span`
  font-weight: 600;
  color: #fff;
`;

const EdgeWeight = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
`;

const ComponentBox = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ComponentLine = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);

  strong {
    color: #fb923c;
  }
`;

const ResultCloseBtn = styled.button`
  margin-top: 12px;
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.35);
  color: var(--accent-color, #fed7aa); /* adjusted */
  padding: 8px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(249, 115, 22, 0.28);
    border-color: rgba(249, 115, 22, 0.6);
  }
`;
