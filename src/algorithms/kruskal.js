class DisjointSet {
  constructor(elements) {
    this.parent = new Map();
    this.rank = new Map();

    for (const e of elements) {
      this.parent.set(e, e);
      this.rank.set(e, 0);
    }
  }

  find(x) {
    const parentX = this.parent.get(x);
    if (parentX === undefined || parentX === x) {
      return x;
    }

    const root = this.find(parentX);
    this.parent.set(x, root);
    return root;
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX) ?? 0;
    const rankY = this.rank.get(rootY) ?? 0;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    return true;
  }
}

const parseWeight = (weight) => {
  const parsed = Number(String(weight ?? "").trim());
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function buildGraphFromState(nodos = [], aristas = []) {
  const nodes = nodos.map((n) => n.id);
  const knownNodes = new Set(nodes);

  const edges = aristas
    .filter(
      (ar) =>
        ar &&
        ar.from != null &&
        ar.to != null &&
        knownNodes.has(ar.from) &&
        knownNodes.has(ar.to),
    )
    .map((ar) => ({
      u: ar.from,
      v: ar.to,
      w: parseWeight(ar.weight),
      sourceEdge: ar,
    }));

  return { nodes, edges };
}

export function kruskal(g, mode = "asc") {
  if (!g.nodes?.length) return { mst: [], totalWeight: 0 };

  const sortedEdges = [...g.edges].sort((a, b) =>
    mode === "asc" ? a.w - b.w : b.w - a.w,
  );

  const ds = new DisjointSet(g.nodes);
  const mst = [];

  for (const edge of sortedEdges) {
    if (ds.union(edge.u, edge.v)) {
      mst.push(edge);
    }

    if (mst.length === g.nodes.length - 1) break;
  }

  const totalWeight = mst.reduce((sum, e) => sum + e.w, 0);
  return { mst, totalWeight };
}

export function totalWeight(edges = []) {
  return edges.reduce((sum, edge) => sum + parseWeight(edge?.w), 0);
}

