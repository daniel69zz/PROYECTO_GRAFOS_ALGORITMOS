import { useState, useEffect, useCallback } from "react";

import { Graph } from "../components/Graph";
import { GraphToolbar } from "../components/GraphToolbar";
import styled from "styled-components";

export function GraphPage() {
  // 1 -> moverse, 2 -> editar nodo o arista, 3 -> eliminar nodo o arista en especifico
  const [herramienta, setHerramienta] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [clearFlag, setClearFlag] = useState(false);
  const handleClear = () => setClearFlag((f) => !f);

  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === "INPUT") return;

    const num = Number(e.key);
    if (num >= 1 && num <= 4) setHerramienta(num);
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
      />
      <Graph
        herramienta={herramienta}
        setHerramienta={setHerramienta}
        clearFlag={clearFlag}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
