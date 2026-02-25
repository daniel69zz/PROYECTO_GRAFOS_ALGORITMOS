import { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { MatrizPonderadaDir } from "./MatrizPonderadaDir";

export function DragMatrix({ title, onClose, nodos, aristas }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  }, []);

  const onMouseDown = useCallback(
    (e) => {
      dragging.current = true;
      offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [pos, onMouseMove, onMouseUp],
  );

  return (
    <WindowWrapper $top={pos.y} $left={pos.x}>
      <TitleBar onMouseDown={onMouseDown}>
        <TitleInfo>
          <TitleIcon>⊞</TitleIcon>
          <TitleText>{title}</TitleText>
        </TitleInfo>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </TitleBar>

      <WindowBody>
        <MatrizPonderadaDir nodos={nodos} aristas={aristas} />
      </WindowBody>
    </WindowWrapper>
  );
}

const WindowWrapper = styled.div`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  border-radius: 12px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  user-select: none;
  background: #fff;
  border: 1px solid #e2e8f0;
`;

const TitleBar = styled.div`
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  padding: 10px 14px;
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:active {
    cursor: grabbing;
  }
`;

const TitleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleIcon = styled.span`
  font-size: 18px;
  opacity: 0.9;
`;

const TitleText = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 4px 7px;
  border-radius: 6px;
  transition:
    opacity 0.2s ease,
    background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const WindowBody = styled.div`
  padding: 16px;
  font-size: inherit;
  color: inherit;
  max-height: 500px;
  overflow-y: auto;

  /* scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;
