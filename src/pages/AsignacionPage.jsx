import { useState, useRef, useCallback, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { GraphToolbar } from "../components/GraphToolbar";
import { Nodo } from "../components/Nodo";
import { Arista } from "../components/Arista";
import { EditMenu } from "../components/EditMenu";
import { Notification } from "../components/Notification";
import { ExportModal } from "../components/ExportModal";
import { exportar_grafo, importar_grafo } from "../utils/exp_imp_grafo";
import { TbArrowBackUp } from "react-icons/tb";
import { existeAristaContraria, calcularPosicionMenu, calcularPosicionMenuArista } from "../utils/canvasUtils";
import { useAsignacionAlgorithm } from "../hooks/useAsignacionAlgorithm";
import { ResultadosPanel } from "../components/Asignacion/ResultadosPanel";

const DIVIDER_X = 500;

export function AsignacionPage() {
  const location = useLocation();
  const navigate = useNavigate();


  const [nodos, setNodos] = useState(() => location.state?.nodos || []);
  const [aristas, setAristas] = useState(() => location.state?.aristas || []);
  const [nodo_seleccionado, setNodo_seleccionado] = useState(null);


  const originalNodos = (location.state?.nodos ?? []).map(
    ({ cpm, ...rest }) => rest,
  );
  const originalAristas = location.state?.aristas ?? [];


  const [herramienta, setHerramienta] = useState(1);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const nextId = useRef(Math.max(0, ...nodos.map(n => n.id)) + 1);


  const [weight_input, setWeight_input] = useState(null);
  const [weight_value, setWeight_value] = useState("1");
  const inputRef = useRef(null);


  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });


  const [editMenu, setEditMenu] = useState(null);
  const [notification, setNotification] = useState(null);
  const [exportModal, setExportModal] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const fileInputRef = useRef(null);

  const tieneAristasNoDirigidas = aristas.some((ar) => ar.tipo === "no_dirigida");

  const showNotification = (message, type = "info") => setNotification({ message, type });

  const {
    modo,
    setModo,
    resultado,
    setResultado,
    mostrarPasos,
    setMostrarPasos,
    infoPadding,
    handleResolver
  } = useAsignacionAlgorithm({
    nodos,
    aristas,
    DIVIDER_X,
    herramienta,
    setHerramienta,
    showNotification
  });

  useEffect(() => {

    if (herramienta === 4 || herramienta === 5) {
      if (herramienta === 4 && tieneAristasNoDirigidas) {
        showNotification("No se puede mostrar la matriz para grafos con aristas no dirigidas.", "warning");
        setHerramienta(1);
        return;
      }
      navigate("/graph", { state: { nodos, aristas } });
    }
  }, [herramienta, navigate, nodos, aristas, tieneAristasNoDirigidas]);


  const handleExportar = () => {
    const nombreSugerido = `asignacion_${new Date().toLocaleDateString().replace(/\//g, "-")}`;
    setSuggestedName(nombreSugerido);
    setExportModal(true);
  };

  const confirmExport = (nombreArchivo) => {
    try {
      const nombreFinal = nombreArchivo.trim() || suggestedName;
      exportar_grafo(nodos, aristas, nextId.current, nombreFinal);
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
      nextId.current = grafo_data.nextId;
      setNodo_seleccionado(null);
      setWeight_input(null);
      setWeight_value("1");
      setEditMenu(null);
      setOffset({ x: 0, y: 0 });
      setResultado(null);

      showNotification("Grafo importado correctamente", "success");
    } catch (e) {
      console.error("Error al importar:", e);
      showNotification(`Grafo NO IMPORTADO\n${e.message}`, "error");
    }
    event.target.value = "";
  };


  const handleDoubleClick = (e) => {
    if (weight_input || editMenu) return;
    if (herramienta !== 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    const id = nextId.current++;
    const isOrigen = x < DIVIDER_X;

    setNodos((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        label: isOrigen ? `Origen ${id}` : `Destino ${id}`,
        color: isOrigen ? "#4fc3f7" : "#4ade80",
      },
    ]);
    setResultado(null);
  };

  const handleNodeClick = (id, e) => {
    if (weight_input) return;

    if (herramienta === 2) {
      const nodo = nodos.find((n) => n.id === id);
      const posicionSegura = calcularPosicionMenu(nodo.x, nodo.y, offset.x, offset.y, "nodo");
      setEditMenu({ tipo: "nodo", datos: nodo, posicion: posicionSegura });
      return;
    }

    if (herramienta === 3) {
      setNodos((prev) => prev.filter((n) => n.id !== id));
      setAristas((prev) => prev.filter((ar) => ar.from !== id && ar.to !== id));
      setResultado(null);
      return;
    }

    if (nodo_seleccionado === null) {
      setNodo_seleccionado(id);
    } else {
      const yaExiste = aristas.some((ar) => ar.from === nodo_seleccionado && ar.to === id);
      if (yaExiste) {
        setNodo_seleccionado(null);
        return;
      }

      const nodoA = nodos.find((n) => n.id === nodo_seleccionado);
      const nodoB = nodos.find((n) => n.id === id);


      if ((nodoA.x < DIVIDER_X && nodoB.x < DIVIDER_X) || (nodoA.x >= DIVIDER_X && nodoB.x >= DIVIDER_X)) {
        showNotification("Solo puedes conectar Orígenes (izquierda) con Destinos (derecha).", "warning");
        setNodo_seleccionado(null);
        return;
      }

      const midX = (nodoA.x + nodoB.x) / 2;
      const midY = (nodoA.y + nodoB.y) / 2;

      setWeight_input({ from: nodo_seleccionado, to: id, x: midX, y: midY });
      setWeight_value("1");
      setNodo_seleccionado(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleAristaClick = (arista, posicion) => {
    if (herramienta === 3) {
      setAristas((prev) => prev.filter((ar) => !(ar.from === arista.from && ar.to === arista.to)));
      setResultado(null);
      return;
    }
    if (herramienta === 2) {
      const posicionSegura = calcularPosicionMenuArista(posicion.x, posicion.y, "arista");
      setEditMenu({ tipo: "arista", datos: arista, posicion: posicionSegura });
    }
  };

  const handleGuardarEdit = (datoActualizado) => {
    if (editMenu.tipo === "nodo") {
      setNodos((prev) => prev.map((n) => (n.id === datoActualizado.id ? datoActualizado : n)));
    } else {
      setAristas((prev) =>
        prev.map((ar) =>
          ar.from === datoActualizado.from && ar.to === datoActualizado.to ? datoActualizado : ar
        )
      );
      setResultado(null);
    }
    setEditMenu(null);
  };

  const handleClear = () => {
    setNodos([]);
    setAristas([]);
    setNodo_seleccionado(null);
    setResultado(null);
  };

  const confirmarPeso = () => {
    const peso = parseFloat(weight_value);
    const pesoFinal = isNaN(peso) || peso < 0 ? 1 : peso;

    if (weight_value.trim() !== "") {
      setAristas((prev) => [...prev, { from: weight_input.from, to: weight_input.to, weight: pesoFinal, tipo: "dirigida" }]);
    }
    setWeight_input(null);
    setWeight_value("1");
    setResultado(null);
  };

  const cancelarPeso = () => {
    setWeight_input(null);
    setWeight_value("1");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") confirmarPeso();
    if (e.key === "Escape") cancelarPeso();
  };

  const handleNodeDrag = (id, newX, newY) => {
    setNodos((prev) => prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n)));
  };

  const handleMouseDown = (e) => {
    if (weight_input || editMenu) return;
    if (e.target.closest("[data-nodo]")) return;
    if (herramienta !== 1) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handleMouseMove = (e) => {
    if (!isPanning || herramienta !== 1) return;
    setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  const abrirSelectorArchivo = () => {
    fileInputRef.current?.click();
  };



  const aristasParaDibujar = aristas.map(ar => {
      let isOptimal = false;
      if (resultado) {
          const fromIdx = resultado.origenes.findIndex(o => o.id === ar.from || o.id === ar.to);
          const toIdx = resultado.destinos.findIndex(d => d.id === ar.to || d.id === ar.from);
          if (fromIdx !== -1 && toIdx !== -1) {
             isOptimal = resultado.asignacionesReales.some(a => a.fila === fromIdx && a.columna === toIdx);
          }
      }
      return { ...ar, isOptimal };
  });


  const liveOrigenes = nodos.filter(n => n.x < DIVIDER_X).sort((a,b) => a.y - b.y);
  const liveDestinos = nodos.filter(n => n.x >= DIVIDER_X).sort((a,b) => a.y - b.y);

  return (
    <PageWrapper>
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
        <Title>Algoritmo de Asignación</Title>
      </Header>

      <Container>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleImportar}
      />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      {exportModal && (
        <ExportModal
          defaultName={suggestedName}
          onConfirm={confirmExport}
          onCancel={() => setExportModal(false)}
        />
      )}

      <GraphToolbar
        isOpen={isToolbarOpen}
        setIsOpen={setIsToolbarOpen}
        herramienta={herramienta}
        setHerramienta={setHerramienta}
        onClear={handleClear}
        onExportar={handleExportar}
        onImportar={abrirSelectorArchivo}
        tieneAristasNoDirigidas={tieneAristasNoDirigidas}
      />

      <ContentWrapper>
        {}
        <CanvasArea
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          $isPanning={isPanning}
        >
          <Canvas $offsetX={offset.x} $offsetY={offset.y}>
            <SvgCanvas>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3, 0 6" fill="black" />
                </marker>
                <marker id="arrowhead-optimal" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
                </marker>
              </defs>

              {}
              <line x1={DIVIDER_X} y1={-5000} x2={DIVIDER_X} y2={5000} stroke="#94a3b8" strokeWidth="4" strokeDasharray="10,10" opacity="0.4" />
              <text x={DIVIDER_X - 20} y={offset.y > 0 ? -offset.y + 40 : 40} fill="#64748b" fontSize="18" fontWeight="bold" textAnchor="end" letterSpacing="2" opacity="0.6">ORÍGENES</text>
              <text x={DIVIDER_X + 20} y={offset.y > 0 ? -offset.y + 40 : 40} fill="#64748b" fontSize="18" fontWeight="bold" textAnchor="start" letterSpacing="2" opacity="0.6">DESTINOS</text>

              {aristasParaDibujar.map((ar, index) => (
                <Arista
                  key={index}
                  ar={ar}
                  nodos={nodos}
                  existeContraria={existeAristaContraria(aristas, ar.from, ar.to)}
                  herramienta={herramienta}
                  onAristaClick={handleAristaClick}
                  customStroke={ar.isOptimal ? "#ef4444" : null}
                  customStrokeWidth={ar.isOptimal ? 4 : null}
                  customMarkerEnd={ar.isOptimal ? "url(#arrowhead-optimal)" : null}
                />
              ))}
            </SvgCanvas>

            {nodos.map((node) => (
              <Nodo
                key={node.id}
                nodo={node}
                onClick={(e) => handleNodeClick(node.id, e)}
                seleccionado={node.id === nodo_seleccionado}
                onDrag={handleNodeDrag}
                herramienta={herramienta}
              />
            ))}

            {weight_input && (
              <PesoContainer x={weight_input.x} y={weight_input.y}>
                <PesoLabel>Peso</PesoLabel>
                <PesoInput
                  ref={inputRef}
                  type="number"
                  value={weight_value}
                  onChange={(e) => setWeight_value(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                />
                <PesoButtons>
                  <BtnConfirmar onClick={confirmarPeso}>✓</BtnConfirmar>
                  <BtnCancelar onClick={cancelarPeso}>✕</BtnCancelar>
                </PesoButtons>
              </PesoContainer>
            )}

            {editMenu && (
              <EditMenu
                tipo={editMenu.tipo}
                datos={editMenu.datos}
                posicion={editMenu.posicion}
                onGuardar={handleGuardarEdit}
                onCerrar={() => setEditMenu(null)}
              />
            )}
          </Canvas>

          {nodos.length === 0 && !weight_input && (
            <HintBox>
              <strong>Doble clic</strong> para crear nodos.<br/>
              Izquierda = Origen, Derecha = Destino.<br/>
              Conecta nodos seleccionando uno y luego el otro.
            </HintBox>
          )}
        </CanvasArea>

        {}
        <ResultadosPanel
          modo={modo}
          setModo={setModo}
          setResultado={setResultado}
          handleResolver={handleResolver}
          liveOrigenes={liveOrigenes}
          liveDestinos={liveDestinos}
          aristas={aristas}
          resultado={resultado}
          infoPadding={infoPadding}
          mostrarPasos={mostrarPasos}
          setMostrarPasos={setMostrarPasos}
        />
      </ContentWrapper>
    </Container>
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
  z-index: 100;
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

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 110px);
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) { padding: 8px; gap: 8px; }
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  border: 2px solid #334155;
  border-radius: 12px;
  background-color: #f8fafc;
  background-image:
    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
  background-size: 40px 40px;
  overflow: hidden;
  cursor: ${(p) => (p.$isPanning ? "grabbing" : "default")};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transform: translate(${(p) => p.$offsetX}px, ${(p) => p.$offsetY}px);
  transform-origin: 0 0;
`;

const SvgCanvas = styled.svg`
  width: 100%; height: 100%;
  position: absolute;
  top: 0; left: 0;
  overflow: visible;
  pointer-events: none;
`;

const HintBox = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.85);
  color: #fff;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  pointer-events: none;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);

  strong { color: #38bdf8; }
`;

const PesoContainer = styled.div`
  position: absolute;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #334155;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 50;
`;
const PesoLabel = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: #334155;
`;
const PesoInput = styled.input`
  width: 60px;
  padding: 5px 8px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  outline: none;
  font-weight: 600;
  &:focus { border-color: #3b82f6; }
`;
const PesoButtons = styled.div` display: flex; gap: 4px; `;
const BtnConfirmar = styled.button`
  background: #22c55e;
  color: white; border: none; border-radius: 6px;
  width: 30px; height: 30px;
  font-size: 16px; cursor: pointer;
  &:hover { background: #16a34a; }
`;
const BtnCancelar = styled.button`
  background: #ef4444;
  color: white; border: none; border-radius: 6px;
  width: 30px; height: 30px;
  font-size: 16px; cursor: pointer;
  &:hover { background: #dc2626; }
`;



