export function Arista({
  ar,
  nodos,
  existeContraria,
  herramienta,
  onAristaClick,
}) {
  const nodo_a = nodos.find((n) => n.id === ar.from);
  const nodo_b = nodos.find((n) => n.id === ar.to);

  if (!nodo_a || !nodo_b) return null;

  const clickStyle = {
    stroke: "transparent",
    strokeWidth: 20,
    fill: "none",
    cursor: herramienta === 2 || herramienta === 3 ? "pointer" : "default",
    pointerEvents: herramienta === 2 || herramienta === 3 ? "stroke" : "none",
  };

  const handleClick = (e) => {
    if (herramienta !== 2 && herramienta !== 3) return;
    const svg = e.currentTarget.closest("svg");
    const rect = svg.getBoundingClientRect();
    onAristaClick(ar, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // ── CASO 1: LOOP ──
  if (ar.from === ar.to) {
    const loopRadius = 35;
    const cx = nodo_a.x;
    const cy = nodo_a.y - 40;
    const pathD = `
      M ${cx - 10} ${cy}
      C ${cx - loopRadius - 30} ${cy - loopRadius - 40},
        ${cx + loopRadius + 30} ${cy - loopRadius - 40},
        ${cx + 10} ${cy}
    `;
    const pesoX = cx;
    const pesoY = cy - loopRadius - 25;

    return (
      <g>
        <path
          d={pathD}
          stroke="black"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <path d={pathD} style={clickStyle} onClick={handleClick} />
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

  const EDGE_OFFSET = 40;
  const dx = nodo_b.x - nodo_a.x;
  const dy = nodo_b.y - nodo_a.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;
  const x1 = nodo_a.x + ux * EDGE_OFFSET;
  const y1 = nodo_a.y + uy * EDGE_OFFSET;
  const x2 = nodo_b.x - ux * EDGE_OFFSET;
  const y2 = nodo_b.y - uy * EDGE_OFFSET;

  // ── CASO 2: BIDIRECCIONAL ──
  if (existeContraria) {
    const CURVE_OFFSET = 75;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const nodo_menor = nodos.find((n) => n.id === Math.min(ar.from, ar.to));
    const nodo_mayor = nodos.find((n) => n.id === Math.max(ar.from, ar.to));
    const refDx = nodo_mayor.x - nodo_menor.x;
    const refDy = nodo_mayor.y - nodo_menor.y;
    const refLength = Math.sqrt(refDx * refDx + refDy * refDy);
    const perpX = -refDy / refLength;
    const perpY = refDx / refLength;
    const direccion = ar.from < ar.to ? 1 : -1;
    const controlX = midX + perpX * CURVE_OFFSET * direccion;
    const controlY = midY + perpY * CURVE_OFFSET * direccion;
    const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
    const t = 0.5;
    const pesoX =
      (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * controlX + t * t * x2;
    const pesoY =
      (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * controlY + t * t * y2;

    return (
      <g>
        <path
          d={pathD}
          stroke="black"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <path d={pathD} style={clickStyle} onClick={handleClick} />
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

  // ── CASO 3: UNIDIRECCIONAL ──
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="black"
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        style={clickStyle}
        onClick={handleClick}
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
