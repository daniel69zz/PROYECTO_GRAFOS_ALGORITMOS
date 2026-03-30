import { useState, useEffect, useCallback, useRef } from "react";
import { Graph } from "../components/Graph";
import { GraphToolbar } from "../components/GraphToolbar";
import { TbRouteSquare2 } from "react-icons/tb";
import styled from "styled-components";

export function GraphPage() {
  const [herramienta, setHerramienta] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [clearFlag, setClearFlag] = useState(false);

  const graphRef = useRef(null);

  const handleClear = () => setClearFlag((f) => !f);

  const handleExportar = () => {
    graphRef.current?.handleExportar();
  };

  const handleImportar = () => {
    graphRef.current?.abrirSelectorArchivo();
  };

  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === "INPUT") return;

    const num = Number(e.key);
    if (num >= 1 && num <= 6) setHerramienta(num);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Container>
      <GraphToolbar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        herramienta={herramienta}
        setHerramienta={setHerramienta}
        onClear={handleClear}
        onExportar={handleExportar}
        onImportar={handleImportar}
      />
      <MainContent>
        <AlgoritmosHeader>
          <AlgoritmosTitle>Algoritmos</AlgoritmosTitle>
          <AlgoritmoButton
            onClick={() => setHerramienta(5)}
            title="Algoritmo de Johnson"
          >
            <TbRouteSquare2 />
            <span>Algoritmo de Johnson</span>
          </AlgoritmoButton>
        </AlgoritmosHeader>
        <Graph
          ref={graphRef}
          herramienta={herramienta}
          setHerramienta={setHerramienta}
          clearFlag={clearFlag}
        />
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AlgoritmosHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  margin: 8px 16px 0 8px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
`;

const AlgoritmosTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-right: 1px solid var(--glass-border);
  padding-right: 16px;
`;

const AlgoritmoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(88, 166, 255, 0.1);
  border: 1px solid rgba(88, 166, 255, 0.2);
  border-radius: 8px;
  color: var(--accent-color);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    background: var(--accent-color);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--accent-glow);
  }

  &:active {
    transform: translateY(0);
  }
`;
