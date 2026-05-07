import { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FaTree } from "react-icons/fa";
import { TbRouteSquare2, TbLayoutGrid, TbCompass } from "react-icons/tb";
import { Graph } from "../components/Graph";
import { GraphToolbar } from "../components/GraphToolbar";

const algorithmButtons = [
  {
    label: "Algoritmo de Johnson",
    title: "Algoritmo de Johnson",
    tool: 5,
    Icon: TbRouteSquare2,
  },
  {
    label: "Algoritmo de Asignacion",
    title: "Algoritmo de Asignacion",
    tool: 6,
    Icon: TbLayoutGrid,
  },
  {
    label: "Northwest",
    title: "Metodo Northwest",
    tool: 7,
    Icon: TbCompass,
    color: "northwest",
  },
  {
    label: "Arboles Binarios",
    title: "Arboles Binarios",
    tool: 8,
    Icon: FaTree,
    color: "tree",
  },
  {
    label: "Dijkstra",
    title: "Algoritmo de Dijkstra",
    tool: 9,
    Icon: TbRouteSquare2,
    color: "dijkstra",
  },
  {
    label: "Kruskal",
    title: "Algoritmo de Kruskal",
    tool: 10,
    Icon: TbLayoutGrid,
    color: "kruskal",
  },
];

export function GraphPage() {
  const [herramienta, setHerramienta] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [clearFlag, setClearFlag] = useState(false);

  const graphRef = useRef(null);

  const handleClear = () => setClearFlag((flag) => !flag);

  const handleExportar = () => {
    graphRef.current?.handleExportar();
  };

  const handleImportar = () => {
    graphRef.current?.abrirSelectorArchivo();
  };

  const handleKeyDown = useCallback((event) => {
    if (event.target.tagName === "INPUT") return;

    const num = Number(event.key);
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
          {algorithmButtons.map(({ label, title, tool, Icon, color }) => (
            <AlgoritmoButton
              key={tool}
              $color={color}
              onClick={() => setHerramienta(tool)}
              title={title}
            >
              <Icon />
              <span>{label}</span>
            </AlgoritmoButton>
          ))}
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
  flex-wrap: wrap;
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

const buttonColorMap = {
  default: {
    background: "rgba(88, 166, 255, 0.1)",
    border: "rgba(88, 166, 255, 0.2)",
    text: "var(--accent-color)",
    hoverBackground: "var(--accent-color)",
    hoverShadow: "0 4px 12px var(--accent-glow)",
  },
  northwest: {
    background: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#f59e0b",
    hoverBackground: "#f59e0b",
    hoverShadow: "0 4px 12px rgba(245,158,11,0.4)",
  },
  tree: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.28)",
    text: "#34d399",
    hoverBackground: "#10b981",
    hoverShadow: "0 4px 12px rgba(16,185,129,0.35)",
  },
  dijkstra: {
    background: "rgba(139, 92, 246, 0.12)",
    border: "rgba(139, 92, 246, 0.28)",
    text: "#a78bfa",
    hoverBackground: "#8b5cf6",
    hoverShadow: "0 4px 12px rgba(139,92,246,0.35)",
  },
  kruskal: {
    background: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.28)",
    text: "#fb923c",
    hoverBackground: "#f97316",
    hoverShadow: "0 4px 12px rgba(249,115,22,0.35)",
  },
};

const AlgoritmoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid
    ${({ $color }) => (buttonColorMap[$color] ?? buttonColorMap.default).border};
  background:
    ${({ $color }) =>
      (buttonColorMap[$color] ?? buttonColorMap.default).background};
  color: ${({ $color }) => (buttonColorMap[$color] ?? buttonColorMap.default).text};
  font-size: 0.85rem;
  font-weight: 600;

  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  &:hover {
    background:
      ${({ $color }) =>
        (buttonColorMap[$color] ?? buttonColorMap.default).hoverBackground};
    color: white;
    transform: translateY(-1px);
    box-shadow:
      ${({ $color }) =>
        (buttonColorMap[$color] ?? buttonColorMap.default).hoverShadow};
  }

  &:active {
    transform: translateY(0);
  }
`;
