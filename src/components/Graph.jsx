import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
import { Nodo } from "./Nodo";
import { Arista } from "./Arista";
import { EditMenu } from "./EditMenu";
import { DragMatrix } from "./DragMatrix";
import { Notification } from "./Notification";
import { CpmControls } from "./CpmControls";

import { exportar_grafo, importar_grafo } from "../utils/exp_imp_grafo";

const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

const calcularPosicionMenu = (
  nodoX,
  nodoY,
  offsetX,
  offsetY,
  tipo = "nodo",
) => {
  const menuWidth = 240;
  const menuHeight = tipo === "nodo" ? 320 : 220;
  const padding = 16;
  const nodoRadius = 40; // Radio del nodo

  // Posición absoluta del nodo en viewport
  const nodoViewportX = nodoX + offsetX;
  const nodoViewportY = nodoY + offsetY;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let menuX = nodoViewportX + nodoRadius + 10; // A la derecha del nodo
  let menuY = nodoViewportY - menuHeight / 2; // Centrado verticalmente

  // Si no cabe a la derecha, ponerlo a la izquierda
  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = nodoViewportX - nodoRadius - menuWidth - 10;
  }

  // Si aún no cabe a la izquierda, forzar dentro del viewport
  if (menuX < padding) {
    menuX = padding;
  }
  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = viewportWidth - menuWidth - padding;
  }

  // Ajustar verticalmente
  if (menuY < padding) {
    menuY = padding;
  }
  if (menuY + menuHeight + padding > viewportHeight) {
    menuY = viewportHeight - menuHeight - padding;
  }

  return { x: menuX, y: menuY };
};

const calcularPosicionMenuArista = (clickX, clickY, tipo = "arista") => {
  const menuWidth = 240;
  const menuHeight = 220;
  const padding = 16;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let menuX = clickX + 20; // Offset desde el click
  let menuY = clickY - menuHeight / 2;

  // Ajustar horizontalmente
  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = clickX - menuWidth - 20;
  }
  if (menuX < padding) {
    menuX = padding;
  }

  // Ajustar verticalmente
  if (menuY < padding) {
    menuY = padding;
  }
  if (menuY + menuHeight + padding > viewportHeight) {
    menuY = viewportHeight - menuHeight - padding;
  }

  return { x: menuX, y: menuY };
};

export const Graph = forwardRef(
  ({ herramienta, setHerramienta, clearFlag }, ref) => {
    const [nodos, setNodos] = useState([]);
    const [aristas, setAristas] = useState([]);
    const [nodo_seleccionado, setNodo_seleccionado] = useState(null);

    const [weight_input, setWeight_input] = useState(null);
    const [weight_value, setWeight_value] = useState("1");
    const inputRef = useRef(null);

    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });

    const [editMenu, setEditMenu] = useState(null);
    const [notification, setNotification] = useState(null);
    const nextId = useRef(1);

    const fileInputRef = useRef(null);

    const [cpmOrigen, setCpmOrigen] = useState(null);
    const [cpmDestino, setCpmDestino] = useState(null);
    const [cpmOrigenId, setCpmOrigenId] = useState(null);
    const [cpmDestinoId, setCpmDestinoId] = useState(null);
    const [cpmStep, setCpmStep] = useState(0);

    const [cpmPickTarget, setCpmPickTarget] = useState("origen"); // "origen" | "destino"

    const getLabelById = (id) => nodos.find((n) => n.id === id)?.label ?? "";
    const cpmOrigenLabel = cpmOrigenId != null ? getLabelById(cpmOrigenId) : "";
    const cpmDestinoLabel =
      cpmDestinoId != null ? getLabelById(cpmDestinoId) : "";

    const handleCpmPickNode = (id) => {
      // si aún no hay origen, set origen
      if (cpmOrigenId == null) {
        setCpmOrigenId(nodeId);
        return;
      }

      // si aún no hay destino, set destino
      if (cpmDestinoId == null) {
        setCpmDestinoId(nodeId);
        return;
      }

      // si ya hay ambos, podrías: resetear y empezar con nuevo origen
      setCpmOrigenId(nodeId);
      setCpmDestinoId(null);
    };

    const cpmPrev = () => setCpmStep((s) => Math.max(0, s - 1));
    const cpmNext = () => setCpmStep((s) => s + 1);
    const cpmFinish = () => {
      setCpmRunning(false);
    };

    const showNotification = (message, type = "info") => {
      setNotification({ message, type });
    };

    const closeNotification = () => {
      setNotification(null);
    };

    const handleExportar = () => {
      try {
        exportar_grafo(nodos, aristas, nextId.current);
        showNotification("Grafo exportado correctamente", "success");
        console.log("Grafo exportado correctamente");
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

        showNotification("Grafo importado correctamente", "success");
        console.log("Metadata:", grafo_data.metadata);
      } catch (e) {
        console.error("Error al importar:", e);
        showNotification(`Grafo NO IMPORTADO\n${e.message}`, "error");
      }

      event.target.value = "";
    };

    const abrirSelectorArchivo = () => {
      fileInputRef.current?.click();
    };

    useImperativeHandle(ref, () => ({
      handleExportar,
      abrirSelectorArchivo,
    }));

    const handleDoubleClick = (e) => {
      if (weight_input || editMenu) return;
      if (herramienta !== 1) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;

      const id = nextId.current++;

      setNodos((prev) => [
        ...prev,
        {
          id,
          x,
          y,
          label: `Nodo ${id}`,
          color: "#4fc3f7",
        },
      ]);
    };

    const handleNodeClick = (id, e) => {
      if (weight_input) return;

      if (herramienta === 2) {
        const nodo = nodos.find((n) => n.id === id);
        const posicionSegura = calcularPosicionMenu(
          nodo.x,
          nodo.y,
          offset.x,
          offset.y,
          "nodo",
        );

        setEditMenu({
          tipo: "nodo",
          datos: nodo,
          posicion: posicionSegura,
        });
        return;
      }

      if (herramienta === 3) {
        setNodos((prev) => prev.filter((n) => n.id !== id));
        setAristas((prev) =>
          prev.filter((ar) => ar.from !== id && ar.to !== id),
        );
        return;
      }

      if (herramienta === 5) {
        handleCpmPickNode(id);
        return;
      }

      if (nodo_seleccionado === null) {
        setNodo_seleccionado(id);
      } else {
        const yaExiste = aristas.some(
          (ar) => ar.from === nodo_seleccionado && ar.to === id,
        );
        if (yaExiste) {
          setNodo_seleccionado(null);
          return;
        }

        const nodoA = nodos.find((n) => n.id === nodo_seleccionado);
        const nodoB = nodos.find((n) => n.id === id);
        const midX =
          nodo_seleccionado === id ? nodoA.x : (nodoA.x + nodoB.x) / 2;
        const midY =
          nodo_seleccionado === id ? nodoA.y - 80 : (nodoA.y + nodoB.y) / 2;

        setWeight_input({ from: nodo_seleccionado, to: id, x: midX, y: midY });
        setWeight_value("1");
        setNodo_seleccionado(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    const handleAristaClick = (arista, posicion) => {
      if (herramienta === 3) {
        setAristas((prev) =>
          prev.filter(
            (ar) => !(ar.from === arista.from && ar.to === arista.to),
          ),
        );
        return;
      }
      if (herramienta === 2) {
        const posicionSegura = calcularPosicionMenuArista(
          posicion.x,
          posicion.y,
          "arista",
        );

        setEditMenu({
          tipo: "arista",
          datos: arista,
          posicion: posicionSegura,
        });
      }
    };

    const handleGuardarEdit = (datoActualizado) => {
      if (editMenu.tipo === "nodo") {
        setNodos((prev) =>
          prev.map((n) => (n.id === datoActualizado.id ? datoActualizado : n)),
        );
      } else {
        setAristas((prev) =>
          prev.map((ar) =>
            ar.from === datoActualizado.from && ar.to === datoActualizado.to
              ? datoActualizado
              : ar,
          ),
        );
      }
      setEditMenu(null);
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
      setOffset({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
    };

    const handleMouseUp = () => {
      if (herramienta !== 1) return;
      setIsPanning(false);
    };

    const handleMouseLeave = () => {
      if (herramienta !== 1) return;
      setIsPanning(false);
    };

    const handleClear = () => {
      setNodos([]);
      setAristas([]);
      setNodo_seleccionado(null);
      setWeight_input(null);
      setWeight_value("1");
      setOffset({ x: 0, y: 0 });
      nextId.current = 1;
    };

    useEffect(() => {
      handleClear();
    }, [clearFlag]);

    const confirmarPeso = () => {
      const peso = parseFloat(weight_value);
      const pesoFinal = isNaN(peso) || peso < 0 ? 1 : peso;

      if (weight_value.trim() !== "") {
        setAristas((prev) => [
          ...prev,
          {
            from: weight_input.from,
            to: weight_input.to,
            weight: pesoFinal,
            tipo: "dirigida",
          },
        ]);
      }
      setWeight_input(null);
      setWeight_value("1");
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
      setNodos((prev) =>
        prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n)),
      );
    };

    const tieneAristasNoDirigidas = aristas.some(
      (ar) => ar.tipo === "no_dirigida",
    );

    useEffect(() => {
      if (herramienta === 4 && tieneAristasNoDirigidas) {
        showNotification(
          "No se puede mostrar la matriz para grafos con aristas no dirigidas.\n\nLa matriz de adyacencia está diseñada solo para grafos dirigidos.",
          "warning",
        );
        setHerramienta(1);
      }
    }, [herramienta, tieneAristasNoDirigidas, setHerramienta]);

    return (
      <Wrapper>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImportar}
        />

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}

        <CanvasArea
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          $isPanning={isPanning}
        >
          {herramienta === 4 && !tieneAristasNoDirigidas && (
            <DragMatrix
              title="Matriz Ponderada Dirigida"
              nodos={nodos}
              aristas={aristas}
              onClose={() => setHerramienta(1)}
            />
          )}
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
              </defs>

              {aristas.map((ar, index) => (
                <Arista
                  key={index}
                  ar={ar}
                  nodos={nodos}
                  existeContraria={existeAristaContraria(
                    aristas,
                    ar.from,
                    ar.to,
                  )}
                  herramienta={herramienta}
                  onAristaClick={handleAristaClick}
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
        </CanvasArea>

        {herramienta === 5 && (
          <CpmControls
            origen={cpmOrigenLabel}
            destino={cpmDestinoLabel}
            step={cpmStep}
            pickTarget={cpmPickTarget}
            onClear={() => {
              setCpmOrigen(null);
              setCpmDestino(null);
              setCpmPickTarget("origen");
            }}
            onPrev={cpmPrev}
            onNext={cpmNext}
            onFinish={cpmFinish}
            disabledPrev={cpmStep === 0}
            disabledNext={cpmOrigen == null || cpmDestino == null}
            disabledFinish={cpmOrigen == null || cpmDestino == null}
          />
        )}
      </Wrapper>
    );
  },
);

Graph.displayName = "Graph";

const CpmBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);

  color: #fff;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    transform 0.12s ease,
    background 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const CpmBtnFinish = styled(CpmBtn)`
  background: rgba(94, 224, 144, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: #000;

  &:hover {
    background: rgba(94, 224, 144, 1);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 4px;
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

  @media (max-width: 768px) {
    background-size: 30px 30px;
  }
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

const PesoContainer = styled.div`
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 10;

  @media (max-width: 768px) {
    padding: 6px 10px;
    gap: 6px;
  }
`;

const PesoLabel = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const PesoInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #2196f3;
  }

  @media (max-width: 768px) {
    width: 50px;
    font-size: 12px;
    padding: 3px 6px;
  }
`;

const PesoButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const BtnConfirmar = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #388e3c;
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
`;

const BtnCancelar = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #c62828;
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
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
