import { useEffect, useRef } from "react";
import styled from "styled-components";
import cytoscape from "cytoscape";

const sizeByRole = {
  root: 62,
  internal: 54,
  leaf: 48,
};

const clearTimers = (timersRef) => {
  timersRef.current.forEach((timer) => window.clearTimeout(timer));
  timersRef.current = [];
};

export function TreeVisualizer({
  elements,
  treeSignature,
  animationPreset,
  animationNonce,
  focusValue,
  visitedValues,
  activeValue,
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [],
      autoungrabify: true,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.2,
      style: [
        {
          selector: "core",
          style: {
            "selection-box-opacity": 0,
            "active-bg-opacity": 0,
            "outside-texture-bg-opacity": 0,
          },
        },
        {
          selector: "node",
          style: {
            label: "data(label)",
            color: "#f8fafc",
            "font-size": 15,
            "font-weight": 800,
            "text-valign": "center",
            "text-halign": "center",
            width: 54,
            height: 54,
            "border-width": 4,
            "border-color": "#bfdbfe",
            "background-color": "#2563eb",
            "overlay-opacity": 0,
            "text-outline-width": 0,
            opacity: 1,
            "transition-property":
              "background-color border-color width height opacity shadow-blur shadow-opacity line-color target-arrow-color",
            "transition-duration": "180ms",
            "transition-timing-function": "ease-out",
            "shadow-blur": 20,
            "shadow-color": "#0f172a",
            "shadow-opacity": 0.25,
            "shadow-offset-x": 0,
            "shadow-offset-y": 8,
          },
        },
        {
          selector: 'node[role = "root"]',
          style: {
            width: 62,
            height: 62,
            "background-color": "#f59e0b",
            "border-color": "#fef3c7",
          },
        },
        {
          selector: 'node[role = "internal"]',
          style: {
            "background-color": "#2563eb",
            "border-color": "#bfdbfe",
          },
        },
        {
          selector: 'node[role = "leaf"]',
          style: {
            "background-color": "#059669",
            "border-color": "#bbf7d0",
          },
        },
        {
          selector: "node.visited",
          style: {
            "background-color": "#8b5cf6",
            "border-color": "#ddd6fe",
            "shadow-color": "#8b5cf6",
            "shadow-opacity": 0.45,
          },
        },
        {
          selector: "node.active",
          style: {
            width: 74,
            height: 74,
            "border-width": 6,
            "background-color": "#f97316",
            "border-color": "#ffedd5",
            "shadow-color": "#fb923c",
            "shadow-opacity": 0.65,
            "shadow-blur": 30,
          },
        },
        {
          selector: "node.pulse",
          style: {
            width: 74,
            height: 74,
            "border-width": 6,
            "shadow-color": "#38bdf8",
            "shadow-opacity": 0.55,
            "shadow-blur": 30,
          },
        },
        {
          selector: "node.muted",
          style: {
            opacity: 0.24,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            opacity: 0.86,
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
            "target-arrow-shape": "triangle",
            "curve-style": "straight",
            "arrow-scale": 0.95,
            "overlay-opacity": 0,
            "transition-property":
              "line-color target-arrow-color width opacity shadow-blur shadow-opacity",
            "transition-duration": "180ms",
            "transition-timing-function": "ease-out",
          },
        },
        {
          selector: "edge.visited",
          style: {
            width: 4,
            "line-color": "#8b5cf6",
            "target-arrow-color": "#8b5cf6",
          },
        },
        {
          selector: "edge.active",
          style: {
            width: 5,
            "line-color": "#f97316",
            "target-arrow-color": "#f97316",
          },
        },
        {
          selector: "edge.muted",
          style: {
            opacity: 0.18,
          },
        },
      ],
    });

    const observer = new ResizeObserver(() => {
      if (!cyRef.current) return;
      cyRef.current.resize();

      if (cyRef.current.elements().length > 0) {
        cyRef.current.fit(cyRef.current.elements(), 60);
      }
    });

    observer.observe(containerRef.current);

    return () => {
      clearTimers(timersRef);
      observer.disconnect();
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    clearTimers(timersRef);
    cy.elements().remove();

    if (!elements.length) {
      return;
    }

    cy.add(elements);
    cy.fit(cy.elements(), 60);

    if (animationPreset === "insert" && focusValue != null) {
      const focusNode = cy.getElementById(`node-${focusValue}`);

      if (focusNode.length > 0) {
        focusNode.addClass("pulse");

        timersRef.current.push(
          window.setTimeout(() => {
            focusNode.removeClass("pulse");
          }, 420),
        );
      }

      return;
    }

    cy.nodes().forEach((node) => {
      node.style({
        opacity: 0,
        width: 12,
        height: 12,
      });
    });

    cy.edges().forEach((edge) => {
      edge.style({
        opacity: 0,
      });
    });

    cy.nodes().forEach((node, index) => {
      timersRef.current.push(
        window.setTimeout(() => {
          const role = node.data("role");
          const nodeSize = sizeByRole[role] ?? 54;

          node.animate(
            {
              style: {
                opacity: 1,
                width: nodeSize,
                height: nodeSize,
              },
            },
            {
              duration: animationPreset === "rebuild" ? 320 : 180,
              easing: "ease-out-cubic",
            },
          );
        }, index * (animationPreset === "rebuild" ? 75 : 30)),
      );
    });

    cy.edges().forEach((edge, index) => {
      timersRef.current.push(
        window.setTimeout(() => {
          edge.animate(
            {
              style: {
                opacity: 0.86,
              },
            },
            {
              duration: animationPreset === "rebuild" ? 260 : 140,
              easing: "ease-out",
            },
          );
        }, 120 + index * (animationPreset === "rebuild" ? 35 : 20)),
      );
    });
  }, [treeSignature, animationPreset, animationNonce, focusValue]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const visitedSet = new Set(visitedValues);
    const hasTraversalFocus = visitedSet.size > 0 || activeValue != null;

    cy.nodes().forEach((node) => {
      const nodeValue = Number(node.data("value"));

      node.removeClass("visited active muted");

      if (activeValue != null && nodeValue === activeValue) {
        node.addClass("active");
        return;
      }

      if (visitedSet.has(nodeValue)) {
        node.addClass("visited");
        return;
      }

      if (hasTraversalFocus) {
        node.addClass("muted");
      }
    });

    cy.edges().forEach((edge) => {
      const sourceValue = Number(edge.source().data("value"));
      const targetValue = Number(edge.target().data("value"));

      edge.removeClass("visited active muted");

      if (
        activeValue != null &&
        (sourceValue === activeValue || targetValue === activeValue)
      ) {
        edge.addClass("active");
        return;
      }

      if (visitedSet.has(sourceValue) && visitedSet.has(targetValue)) {
        edge.addClass("visited");
        return;
      }

      if (hasTraversalFocus) {
        edge.addClass("muted");
      }
    });
  }, [visitedValues, activeValue]);

  return <Canvas ref={containerRef} />;
}

const Canvas = styled.div`
  width: 100%;
  height: 100%;
`;
