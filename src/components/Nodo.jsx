import styled from "styled-components";
import { useRef } from "react";

export function Nodo({ nodo, seleccionado, onClick, onDrag, herramienta }) {
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();

    // ── Herramientas que NO arrastran (editar, eliminar, etc.) ──
    if (herramienta !== 1) {
      onClick();
      return;
    }

    // ── Herramienta 1: drag ──
    isDragging.current = true;
    hasMoved.current = false;

    const startX = e.clientX;
    const startY = e.clientY;
    const originX = nodo.x;
    const originY = nodo.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMoved.current = true;
      }

      onDrag(nodo.id, originX + dx, originY + dy);
    };

    const handleMouseUp = () => {
      isDragging.current = false;

      if (!hasMoved.current) {
        onClick();
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Container
      data-nodo="true"
      $nodo={nodo}
      $seleccionado={seleccionado}
      $herramienta={herramienta}
      onMouseDown={handleMouseDown}
    >
      {nodo.label}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  left: ${(props) => props.$nodo.x - 40}px;
  top: ${(props) => props.$nodo.y - 40}px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$seleccionado ? "#ff9800" : props.$nodo.color};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  border-color: black;
  border-width: 3px;
  border-style: solid;
  cursor: ${(props) => (props.$herramienta === 1 ? "grab" : "pointer")};
  user-select: none;

  &:active {
    cursor: ${(props) => (props.$herramienta === 1 ? "grabbing" : "pointer")};
  }
`;
