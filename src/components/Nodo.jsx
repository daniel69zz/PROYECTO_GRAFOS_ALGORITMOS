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
      {herramienta === 5 && (
        <CpmLayer>
          <CpmTop>{nodo.label}</CpmTop>

          <CpmBottom>
            <CpmBL>{nodo?.cpm?.bl ?? ""}</CpmBL>
            <CpmBR>{nodo?.cpm?.br ?? ""}</CpmBR>
          </CpmBottom>
        </CpmLayer>
      )}
      {herramienta !== 5 && <Label>{nodo.label}</Label>}
    </Container>
  );
}
const CpmLayer = styled.div`
  position: absolute;
  inset: 6px; /* separa un poco del borde negro del nodo */
  border-radius: 50%;
  pointer-events: none;
  overflow: hidden; /* clave para que las líneas no salgan del círculo */

  display: flex;
  flex-direction: column;
`;

/* Mitad superior (donde va el +) */
const CpmTop = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 900;
  font-size: 15px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);
`;

/* Mitad inferior (2 celdas con separadores) */
const CpmBottom = styled.div`
  height: 34px; /* ajusta este valor si quieres más espacio para números */
  display: grid;
  grid-template-columns: 1fr 1fr;

  /* línea horizontal que separa arriba/abajo */
  border-top: 3px solid rgba(0, 0, 0, 0.85);

  /* para que se parezca a la imagen: fondo claro abajo */
  background: rgba(255, 255, 255, 0.92);

  /* texto negro */
  color: #000;
`;

/* celda inferior izquierda */
const CpmBL = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 900;
  font-size: 18px;

  /* línea vertical (solo abajo) */
  border-right: 3px solid rgba(0, 0, 0, 0.85);
`;

/* celda inferior derecha */
const CpmBR = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 900;
  font-size: 18px;
`;

const CpmOverlay = styled.div`
  position: absolute;
  inset: 8px; /* margen interno dentro del círculo */
  border-radius: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  align-items: center;
  justify-items: center;
  pointer-events: none; /* no bloquea click/drag */

  /* “placa” semitransparente para que siempre se lea */
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
`;

const CpmPlus = styled.div`
  grid-column: 1 / -1; /* ocupa ambas columnas */
  grid-row: 1;
  line-height: 1;
  font-weight: 900;
  font-size: 30px;
  letter-spacing: -0.02em;

  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);

  /* pequeño “badge” detrás del + para que resalte */
  padding: 2px 10px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const CpmBottomLeft = styled.div`
  grid-column: 1;
  grid-row: 2;
  justify-self: start;
  align-self: end;

  min-width: 26px; /* espacio mínimo para 2-3 dígitos */
  padding: 2px 6px;
  margin: 0 0 2px 2px;

  font-size: 12px;
  font-weight: 800;
  color: #0b1220; /* texto oscuro sobre fondo claro */
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
`;

const CpmBottomRight = styled.div`
  grid-column: 2;
  grid-row: 2;
  justify-self: end;
  align-self: end;

  min-width: 26px;
  padding: 2px 6px;
  margin: 0 2px 2px 0;

  font-size: 12px;
  font-weight: 800;
  color: #0b1220;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
`;

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
