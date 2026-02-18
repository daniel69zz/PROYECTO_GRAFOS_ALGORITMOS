import { useState, useRef } from "react";
import styled from "styled-components";
import { Nodo } from "../components/Nodo";
import { Arista } from "../components/Arista";
import { SidebarNodo } from "../components/SidebarNodo";

export function GraphPage() {
  const [nodos, setNodos] = useState([]);
  const [aristas, setAristas] = useState([]);
  const [nodo_seleccionado, setNodo_seleccionado] = useState(null);

  const [nodoSidebar, setNodoSidebar] = useState(null);

  // Estado para el input de peso
  const [weight_input, setWeight_input] = useState(null);
  const [weight_value, setWeight_value] = useState("1");
  const inputRef = useRef(null);

  // Estado para el pan
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  // Funcion crear nodo
  const handleDoubleClick = (e) => {
    if (weight_input) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    setNodos((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        x,
        y,
        label: `Nodo ${prev.length + 1}`,
      },
    ]);
  };

  // Funcion crear arista con peso
  const handleNodeClick = (id) => {
    if (weight_input) return;

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

      let midX, midY;

      if (nodo_seleccionado === id) {
        midX = nodoA.x;
        midY = nodoA.y - 80;
      } else {
        midX = (nodoA.x + nodoB.x) / 2;
        midY = (nodoA.y + nodoB.y) / 2;
      }

      setWeight_input({ from: nodo_seleccionado, to: id, x: midX, y: midY });
      setWeight_value("1");
      setNodo_seleccionado(null);

      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleNodeDoubleClick = (id) => {
    const nodo = nodos.find((nodo) => nodo.id === id);

    if (nodo) {
      setNodoSidebar(nodo);
    }
  };

  // --- PAN ---
  const handleMouseDown = (e) => {
    if (weight_input) return;
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
  // --- FIN PAN ---

  const confirmarPeso = () => {
    if (weight_value.trim() !== "") {
      setAristas((prev) => [
        ...prev,
        {
          from: weight_input.from,
          to: weight_input.to,
          weight: parseFloat(weight_value) || 1,
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
    if (e.key === "Enter") {
      confirmarPeso();
    } else if (e.key === "Escape") {
      cancelarPeso();
    }
  };

  return (
    <Container
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      $isPanning={isPanning}
    >
      <Canvas $offsetX={offset.x} $offsetY={offset.y}>
        <Arista aristas={aristas} nodos={nodos} />
        {nodos.map((node) => (
          <Nodo
            key={node.id}
            nodo={node}
            onClick={() => handleNodeClick(node.id)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
            seleccionado={node.id === nodo_seleccionado}
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
      </Canvas>

      {nodoSidebar && (
        <SidebarNodo
          nodo={nodoSidebar}
          aristas={aristas}
          nodos={nodos}
          onClose={() => setNodoSidebar(null)}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  border: 2px solid black;
  background-color: #f5f5f5;
  background-image:
    linear-gradient(to right, #ccc 1px, transparent 1px),
    linear-gradient(to bottom, #ccc 1px, transparent 1px);
  background-size: 40px 40px;
  overflow: hidden;
  cursor: ${(props) => (props.$isPanning ? "grabbing" : "default")};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(
    ${(props) => props.$offsetX}px,
    ${(props) => props.$offsetY}px
  );
`;

const PesoContainer = styled.div`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
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
`;

const PesoLabel = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #333;
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
`;
