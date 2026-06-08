import { useState, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Nodo } from "../components/Nodo";
import { Arista } from "../components/Arista";
import { Notification } from "../components/Notification";
import { DijkstraControls } from "../components/DijkstraControls";
import { TbArrowBackUp } from "react-icons/tb";
import { ExportModal } from "../components/ExportModal";
import { BiExport, BiImport } from "react-icons/bi";
import { FiHelpCircle, FiX } from "react-icons/fi";
import { exportar_grafo, importar_grafo } from "../utils/exp_imp_grafo";

const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

export function DijkstraPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const originalNodos = location.state?.nodos ?? [];
  const originalAristas = location.state?.aristas ?? [];

  const [nodos, setNodos] = useState(location.state?.nodos || []);
  const [aristas, setAristas] = useState(location.state?.aristas || []);

  const [dijkstraOrigenId, setDijkstraOrigenId] = useState(null);
  const [dijkstraDestinoId, setDijkstraDestinoId] = useState(null);
  const [pickTarget, setPickTarget] = useState("origen");
  const [dijkstraMode, setDijkstraMode] = useState("minimizar");

  const [showConfigModal, setShowConfigModal] = useState(true);
  const [notification, setNotification] = useState(() => {
    if (!location.state?.nodos || location.state.nodos.length === 0) {
      return {
        message: "No se recibió ningún grafo para aplicar Dijkstra.",
        type: "error",
      };
    }
    return null;
  });

  const [showResultModal, setShowResultModal] = useState(false);
  const [dijkstraResult, setDijkstraResult] = useState(null); // { distance, path: [nodeIds], edges: [{from, to}] }

  const [exportModal, setExportModal] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  const getLabelById = (id) => nodos.find((n) => n.id === id)?.label ?? "";
  const origenLabel = dijkstraOrigenId != null ? getLabelById(dijkstraOrigenId) : "";
  const destinoLabel = dijkstraDestinoId != null ? getLabelById(dijkstraDestinoId) : "";

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handlePickNode = (id) => {
    if (pickTarget === "origen") {
      setDijkstraOrigenId(id);
      setPickTarget("destino");
    } else {
      setDijkstraDestinoId(id);
      setPickTarget("origen");
    }
  };

  const parseWeight = (w) => {
    const n = Number(w);
    return Number.isFinite(n) ? n : 1;
  };

  const calculateDijkstra = () => {
    if (dijkstraOrigenId == null || dijkstraDestinoId == null) {
      showNotification("Selecciona primero un nodo origen y un nodo final.", "warning");
      return;
    }

    const tieneAristaNoDirigida = aristas.some(
      (ar) => ar.tipo === "no_dirigida",
    );
    if (tieneAristaNoDirigida) {
      showNotification(
        "Dijkstra requiere un grafo dirigido. Hay aristas no dirigidas en el grafo.",
        "error",
      );
      return;
    }

    const hasNegativeWeights = aristas.some((ar) => {
      const n = Number(ar.weight);
      return Number.isFinite(n) && n < 0;
    });
    if (hasNegativeWeights) {
      showNotification(
        "Dijkstra no admite pesos negativos. Corrige las aristas con peso negativo.",
        "error",
      );
      return;
    }

    if (dijkstraOrigenId === dijkstraDestinoId) {
      setDijkstraResult({
        distance: 0,
        path: [dijkstraOrigenId],
        edges: [],
        edgeIds: new Set(),
        steps: [],
        mode: dijkstraMode,
      });
      setShowResultModal(true);
      showNotification("Origen y destino son el mismo nodo (distancia 0).", "info");
      return;
    }

    const distances = new Map();
    const previous = new Map();
    const previousEdgeIdx = new Map();
    const unvisited = new Set();
    const adjList = new Map();

    const isMinimizing = dijkstraMode === "minimizar";
    const initialDistance = isMinimizing ? Infinity : -Infinity;

    nodos.forEach((n) => {
      distances.set(n.id, initialDistance);
      previous.set(n.id, null);
      previousEdgeIdx.set(n.id, null);
      unvisited.add(n.id);
      adjList.set(n.id, []);
    });

    distances.set(dijkstraOrigenId, 0);

    aristas.forEach((ar, idx) => {
      if (ar.from === ar.to) return;
      const weight = parseWeight(ar.weight);
      adjList.get(ar.from).push({ to: ar.to, weight, idx });
      if (ar.tipo === "no_dirigida") {
        adjList.get(ar.to).push({ to: ar.from, weight, idx });
      }
    });

    while (unvisited.size > 0) {
      let current = null;
      let bestDistance = initialDistance;

      unvisited.forEach((nodeId) => {
        const d = distances.get(nodeId);
        if (isMinimizing ? d < bestDistance : d > bestDistance) {
          bestDistance = d;
          current = nodeId;
        }
      });

      if (current === null) break;
      if (current === dijkstraDestinoId) break;

      unvisited.delete(current);

      adjList.get(current).forEach((neighbor) => {
        if (!unvisited.has(neighbor.to)) return;
        const alt = distances.get(current) + neighbor.weight;
        const shouldUpdate = isMinimizing
          ? alt < distances.get(neighbor.to)
          : alt > distances.get(neighbor.to);

        if (shouldUpdate) {
          distances.set(neighbor.to, alt);
          previous.set(neighbor.to, current);
          previousEdgeIdx.set(neighbor.to, neighbor.idx);
        }
      });
    }

    const finalDistance = distances.get(dijkstraDestinoId);

    if (finalDistance === initialDistance) {
      showNotification("No existe ruta alcanzable desde el origen hasta el destino.", "error");
      return;
    }

    const pathNodes = [];
    const steps = [];
    const edgeIds = new Set();
    let cursor = dijkstraDestinoId;

    while (cursor !== null) {
      pathNodes.unshift(cursor);
      const prev = previous.get(cursor);
      const edgeIdx = previousEdgeIdx.get(cursor);
      if (prev !== null && edgeIdx !== null) {
        const ar = aristas[edgeIdx];
        steps.unshift({
          from: prev,
          to: cursor,
          weight: parseWeight(ar.weight),
          edgeIdx,
        });
        edgeIds.add(edgeIdx);
      }
      cursor = prev;
    }

    setDijkstraResult({
      distance: finalDistance,
      path: pathNodes,
      edges: steps,
      edgeIds,
      steps,
      mode: dijkstraMode,
    });
    setShowResultModal(true);

    if (dijkstraMode === "maximizar") {
      showNotification(
        "Ruta máxima calculada. Nota: en grafos con ciclos no se garantiza el óptimo global.",
        "warning",
      );
    } else {
      showNotification("Ruta más corta calculada con éxito.", "success");
    }
  };

  const handleClear = () => {
    setDijkstraOrigenId(null);
    setDijkstraDestinoId(null);
    setPickTarget("origen");
    setDijkstraResult(null);
    setShowResultModal(false);
    setShowConfigModal(true);
  };

  const handleExportar = () => {
    const nombreSugerido = `grafo_dijkstra_${new Date().toLocaleDateString().replace(/\//g, "-")}`;
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
      
      setDijkstraOrigenId(null);
      setDijkstraDestinoId(null);
      setPickTarget("origen");
      setDijkstraResult(null);
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

  const handleNodeClick = (id) => {
    handlePickNode(id);
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
    if (!dijkstraResult) return false;
    return dijkstraResult.edgeIds.has(index);
  };

  const isOptimalNode = (id) => {
    if (!dijkstraResult) return false;
    return dijkstraResult.path.includes(id);
  };

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
        <Title>Aplicar Dijkstra</Title>
        <div style={{ flex: 1 }} />
        <HeaderAction onClick={handleExportar} title="Exportar">
          <BiExport />
        </HeaderAction>
        <HeaderAction onClick={abrirSelectorArchivo} title="Importar">
          <BiImport />
        </HeaderAction>
        <HeaderAction onClick={() => setShowHelp(true)} title="Ayuda">
          <FiHelpCircle />
        </HeaderAction>
      </Header>

      {showHelp && (
        <HelpOverlay onClick={() => setShowHelp(false)}>
          <HelpModal onClick={(e) => e.stopPropagation()}>
            <HelpHeader>
              <h2><FiHelpCircle /> Como usar Dijkstra</h2>
              <CloseButton onClick={() => setShowHelp(false)} title="Cerrar"><FiX /></CloseButton>
            </HelpHeader>

            <HelpBody>
              <HelpStep>
                <strong>1. Llega con un grafo dirigido</strong>
                <p>
                  Esta vista recibe el grafo que armaste en el editor. Dijkstra requiere
                  un grafo <em>dirigido</em> y sin pesos <em>negativos</em>; si hay aristas
                  no dirigidas o negativas se mostrara un aviso al calcular.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>2. Configura origen y destino</strong>
                <p>
                  En el modal inicial elige el <em>Nodo Origen</em> y el{" "}
                  <em>Nodo Destino</em>. Tambien puedes hacer click directamente sobre los
                  nodos del lienzo: el primer click fija el origen y el segundo el destino.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>3. Elige el objetivo</strong>
                <p>
                  <em>Minimizar</em> busca la ruta mas corta. <em>Maximizar</em> busca la
                  mas larga (heuristico: en grafos con ciclos no se garantiza el optimo
                  global). Pulsa <em>Comenzar</em> para confirmar.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>4. Calcula la ruta</strong>
                <p>
                  Pulsa <em>Calcular</em> en el panel lateral. La ruta optima se resalta en
                  morado sobre el grafo y se abre un resumen con la distancia total, el
                  camino y los pasos.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>5. Navega y reinicia</strong>
                <p>
                  Arrastra el fondo para mover la vista. Usa <em>Limpiar</em> para volver a
                  elegir origen y destino, o <em>Ver resultado</em> para reabrir el resumen.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>6. Importar / exportar</strong>
                <p>
                  Con los iconos del encabezado puedes <em>exportar</em> el grafo actual a
                  JSON o <em>importar</em> uno guardado para aplicarle Dijkstra.
                </p>
              </HelpStep>
            </HelpBody>
          </HelpModal>
        </HelpOverlay>
      )}

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
                <marker id="arrowhead-optimal-dijkstra" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
                </marker>
              </defs>

              {aristas.map((ar, index) => {
                const optimal = isOptimalEdgeByIndex(index);
                return (
                  <Arista
                    key={index}
                    ar={{ ...ar, isOptimalDijkstra: optimal }}
                    nodos={nodos}
                    existeContraria={existeAristaContraria(
                      aristas,
                      ar.from,
                      ar.to,
                    )}
                    herramienta={9}
                    onAristaClick={() => {}}
                    customStroke={optimal ? "#8b5cf6" : null}
                    customStrokeWidth={optimal ? 4 : null}
                  />
                );
              })}
            </SvgCanvas>

            {nodos.map((node) => (
              <Nodo
                key={node.id}
                nodo={node}
                onClick={() => handleNodeClick(node.id)}
                seleccionado={
                  node.id === dijkstraOrigenId || node.id === dijkstraDestinoId
                }
                onDrag={() => {}}
                herramienta={9}
                customStroke={isOptimalNode(node.id) ? "#8b5cf6" : null}
                customStrokeWidth={isOptimalNode(node.id) ? 4 : null}
              />
            ))}
          </Canvas>

          {showConfigModal && (
            <ModalOverlay>
              <ModalContent>
                <h2>Configuración Dijkstra</h2>

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
                      Dijkstra.
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
                      <label>Nodo Origen</label>
                      <Select
                        value={dijkstraOrigenId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") return;
                          setDijkstraOrigenId(Number(v));
                          setPickTarget("destino");
                        }}
                      >
                        <option value="" disabled>
                          Seleccione un origen
                        </option>
                        {nodos.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <label>Nodo Destino</label>
                      <Select
                        value={dijkstraDestinoId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") return;
                          setDijkstraDestinoId(Number(v));
                          setPickTarget("origen");
                        }}
                      >
                        <option value="" disabled>
                          Seleccione un destino
                        </option>
                        {nodos.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <label>Objetivo</label>
                      <RadioGroup>
                        <label>
                          <input
                            type="radio"
                            name="dijkstraMode"
                            value="minimizar"
                            checked={dijkstraMode === "minimizar"}
                            onChange={() => setDijkstraMode("minimizar")}
                          />
                          Minimizar (Ruta Más Corta)
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="dijkstraMode"
                            value="maximizar"
                            checked={dijkstraMode === "maximizar"}
                            onChange={() => setDijkstraMode("maximizar")}
                          />
                          Maximizar (Ruta Más Larga)
                        </label>
                      </RadioGroup>
                      {dijkstraMode === "maximizar" && (
                        <WarningBox>
                          ⚠ El camino más largo es NP-difícil. Dijkstra greedy
                          puede no encontrar el óptimo global en grafos con ciclos.
                        </WarningBox>
                      )}
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
                          if (dijkstraOrigenId && dijkstraDestinoId) {
                            setShowConfigModal(false);
                          } else {
                            showNotification(
                              "Selecciona origen y destino",
                              "warning",
                            );
                          }
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

          {showResultModal && dijkstraResult && (
            <ModalOverlay>
              <ResultModalContent>
                <ResultIcon>{dijkstraResult.mode === "minimizar" ? "⚡" : "🏆"}</ResultIcon>
                <ResultTitle>
                  {dijkstraResult.mode === "minimizar" ? "Ruta Más Corta" : "Ruta Más Larga"}
                </ResultTitle>
                <ResultLabel>Distancia Total</ResultLabel>
                <ResultValue>{dijkstraResult.distance}</ResultValue>
                <ResultSub>
                  Desde {origenLabel} → {destinoLabel}
                </ResultSub>
                <ResultPath>
                  {dijkstraResult.path.map(id => getLabelById(id)).join(" ➔ ")}
                </ResultPath>

                {dijkstraResult.steps && dijkstraResult.steps.length > 0 && (
                  <StepList>
                    <StepListTitle>Pasos</StepListTitle>
                    {dijkstraResult.steps.map((s, i) => (
                      <StepRow key={i}>
                        <StepNum>{i + 1}</StepNum>
                        <StepPair>
                          {getLabelById(s.from)} → {getLabelById(s.to)}
                        </StepPair>
                        <StepWeight>+{s.weight}</StepWeight>
                      </StepRow>
                    ))}
                  </StepList>
                )}

                {dijkstraResult.mode === "maximizar" && (
                  <WarningBox>
                    ⚠ Resultado heurístico: no garantizado óptimo global.
                  </WarningBox>
                )}

                <ResultCloseBtn onClick={() => setShowResultModal(false)}>
                  Cerrar
                </ResultCloseBtn>
              </ResultModalContent>
            </ModalOverlay>
          )}
        </CanvasArea>

        {!showConfigModal && (
          <DijkstraControls
            origen={origenLabel}
            destino={destinoLabel}
            mode={dijkstraMode}
            result={dijkstraResult}
            pickTarget={pickTarget}
            onClear={handleClear}
            onCalculate={calculateDijkstra}
            onShowResult={() => dijkstraResult && setShowResultModal(true)}
            disabledCalculate={dijkstraOrigenId == null || dijkstraDestinoId == null}
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

const HelpOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
`;

const HelpModal = styled.div`
  width: min(640px, 100%);
  max-height: 85vh;
  overflow: auto;
  border-radius: 18px;
  border: 1px solid rgba(139, 92, 246, 0.25);
  background: linear-gradient(180deg, rgba(17, 20, 30, 0.98), rgba(22, 18, 36, 0.98));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  color: #fff;
`;

const HelpHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(17, 20, 30, 0.96);

  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;

    svg {
      color: #a78bfa;
      font-size: 1.3rem;
    }
  }
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.1rem;

  &:hover {
    color: #fff;
    background: rgba(244, 63, 94, 0.22);
    border-color: rgba(244, 63, 94, 0.4);
  }
`;

const HelpBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
`;

const HelpStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #fff;
    font-size: 0.98rem;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.9rem;
    line-height: 1.55;
  }

  em {
    color: #fff;
    font-style: normal;
    font-weight: 700;
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

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #8b5cf6;
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: #1a1a1a;
    color: #fff;
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
      accent-color: #8b5cf6;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button`
  background: var(--accent-color, #8b5cf6);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-hover, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
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
    0 0 0 1px rgba(139, 92, 246, 0.15);
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
  color: var(--accent-color, #8b5cf6);
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
  text-shadow: 0 0 24px rgba(139, 92, 246, 0.5);
`;

const ResultSub = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`;

const ResultPath = styled.p`
  margin: 8px 0 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #d8b4fe;
  text-align: center;
  background: rgba(139, 92, 246, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
`;

const StepList = styled.div`
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(139, 92, 246, 0.06);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 10px;
  padding: 8px 12px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.4);
    border-radius: 3px;
  }
`;

const StepListTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 4px;
`;

const StepRow = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #ddd6fe;
  padding: 3px 4px;
  border-radius: 6px;

  &:hover {
    background: rgba(139, 92, 246, 0.12);
  }
`;

const StepNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.3);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
`;

const StepPair = styled.span`
  font-weight: 600;
  color: #fff;
`;

const StepWeight = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.75);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
`;

const WarningBox = styled.div`
  background: rgba(252, 211, 77, 0.1);
  border: 1px solid rgba(252, 211, 77, 0.35);
  color: #fde68a;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 8px;
  text-align: center;
  line-height: 1.35;
`;

const ResultCloseBtn = styled.button`
  margin-top: 12px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.35);
  color: var(--accent-color, #b48ead); /* adjusted */
  padding: 8px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.28);
    border-color: rgba(139, 92, 246, 0.6);
  }
`;
