import styled from "styled-components";

export function Arista({ aristas, nodos }) {
  const existeAristaContraria = (from, to) => {
    return aristas.some((ar) => ar.from === to && ar.to === from);
  };

  return (
    <Svg>
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

      {aristas.map((ar, index) => {
        const nodo_a = nodos.find((n) => n.id === ar.from);
        const nodo_b = nodos.find((n) => n.id === ar.to);

        if (!nodo_a || !nodo_b) {
          return null;
        }

        // CASO 1: LOOP (arista a sí mismo)
        if (ar.from === ar.to) {
          const loopRadius = 35;
          const cx = nodo_a.x;
          const cy = nodo_a.y - 40; // Empieza desde arriba del nodo

          const pathD = `
            M ${cx - 10} ${cy}
            C ${cx - loopRadius - 30} ${cy - loopRadius - 40},
              ${cx + loopRadius + 30} ${cy - loopRadius - 40},
              ${cx + 10} ${cy}
          `;

          // Posición del peso (arriba del loop)
          const pesoX = cx;
          const pesoY = cy - loopRadius - 25;

          return (
            <g key={index}>
              <path
                d={pathD}
                stroke="black"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
              />

              <rect
                x={pesoX - 15}
                y={pesoY - 12}
                width="30"
                height="24"
                fill="white"
                stroke="black"
                strokeWidth="1"
                rx="4"
              />

              <text
                x={pesoX}
                y={pesoY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="black"
              >
                {ar.weight}
              </text>
            </g>
          );
        }

        const esBidireccional = existeAristaContraria(ar.from, ar.to);

        const offset = 40;

        const dx = nodo_b.x - nodo_a.x;
        const dy = nodo_b.y - nodo_a.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        const ux = dx / length;
        const uy = dy / length;

        const x1 = nodo_a.x + ux * offset;
        const y1 = nodo_a.y + uy * offset;
        const x2 = nodo_b.x - ux * offset;
        const y2 = nodo_b.y - uy * offset;

        // CASO 2: BIDIRECCIONAL (curvas paralelas)
        if (esBidireccional) {
          const curveOffset = 75;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          const nodo_menor = nodos.find(
            (n) => n.id === Math.min(ar.from, ar.to),
          );
          const nodo_mayor = nodos.find(
            (n) => n.id === Math.max(ar.from, ar.to),
          );

          const refDx = nodo_mayor.x - nodo_menor.x;
          const refDy = nodo_mayor.y - nodo_menor.y;
          const refLength = Math.sqrt(refDx * refDx + refDy * refDy);

          const refUx = refDx / refLength;
          const refUy = refDy / refLength;

          const perpX = -refUy;
          const perpY = refUx;

          const direccion = ar.from < ar.to ? 1 : -1;
          const controlX = midX + perpX * curveOffset * direccion;
          const controlY = midY + perpY * curveOffset * direccion;

          const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

          const t = 0.5;
          const pesoX =
            (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * controlX + t * t * x2;
          const pesoY =
            (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * controlY + t * t * y2;

          return (
            <g key={index}>
              <path
                d={pathD}
                stroke="black"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
              />

              <rect
                x={pesoX - 15}
                y={pesoY - 12}
                width="30"
                height="24"
                fill="white"
                stroke="black"
                strokeWidth="1"
                rx="4"
              />

              <text
                x={pesoX}
                y={pesoY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="black"
              >
                {ar.weight}
              </text>
            </g>
          );
        } else {
          // CASO 3: UNIDIRECCIONAL (línea recta)
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={index}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="black"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />

              <rect
                x={midX - 15}
                y={midY - 12}
                width="30"
                height="24"
                fill="white"
                stroke="black"
                strokeWidth="1"
                rx="4"
              />

              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="black"
              >
                {ar.weight}
              </text>
            </g>
          );
        }
      })}
    </Svg>
  );
}

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible;
  top: 0;
  left: 0;
  pointer-events: none;
`;
