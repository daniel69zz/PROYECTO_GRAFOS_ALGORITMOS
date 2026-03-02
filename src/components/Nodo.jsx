import styled from "styled-components";
import { useRef } from "react";

export function Nodo({ nodo, seleccionado, onClick, onDrag, herramienta }) {
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();

    if (herramienta !== 1) {
      onClick();
      return;
    }

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
      <Label>{nodo.label}</Label>
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
  border: 3px solid black;
  cursor: ${(props) => (props.$herramienta === 1 ? "grab" : "pointer")};
  user-select: none;
  transition: transform 0.1s ease;

  &:active {
    cursor: ${(props) => (props.$herramienta === 1 ? "grabbing" : "pointer")};
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    left: ${(props) => props.$nodo.x - 35}px;
    top: ${(props) => props.$nodo.y - 35}px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    left: ${(props) => props.$nodo.x - 30}px;
    top: ${(props) => props.$nodo.y - 30}px;
    border-width: 2px;
  }
`;

const Label = styled.span`
  font-size: 14px;
  padding: 4px;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
