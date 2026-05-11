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
    let root = x;
    while (this.parent.get(root) !== root) {
      root = this.parent.get(root);
    }
    let curr = x;
    while (this.parent.get(curr) !== root) {
      const next = this.parent.get(curr);
      this.parent.set(curr, root);
      curr = next;
    }
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

  components() {
    const groups = new Map();
    for (const node of this.parent.keys()) {
      const root = this.find(node);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(node);
    }
    return Array.from(groups.values());
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
    .map((ar, idx) => ({ ar, idx }))
    .filter(
      ({ ar }) =>
        ar &&
        ar.from != null &&
        ar.to != null &&
        ar.from !== ar.to &&
        knownNodes.has(ar.from) &&
        knownNodes.has(ar.to),
    )
    .map(({ ar, idx }) => ({
      id: idx,
      u: ar.from,
      v: ar.to,
      w: parseWeight(ar.weight),
      sourceEdge: ar,
    }));

  return { nodes, edges };
}

export function kruskal(g, mode = "asc") {
  if (!g.nodes?.length) {
    return {
      mst: [],
      totalWeight: 0,
      components: [],
      isSpanningTree: false,
    };
  }

  const sortedEdges = [...g.edges].sort((a, b) =>
    mode === "asc" ? a.w - b.w : b.w - a.w,
  );

  const ds = new DisjointSet(g.nodes);
  const mst = [];
  const targetEdgeCount = g.nodes.length - 1;

  for (const edge of sortedEdges) {
    if (ds.union(edge.u, edge.v)) {
      mst.push({ ...edge, order: mst.length + 1 });
    }
    if (mst.length === targetEdgeCount) break;
  }

  const totalWeight = mst.reduce((sum, e) => sum + e.w, 0);
  const components = ds.components();
  const isSpanningTree = mst.length === targetEdgeCount;

  return { mst, totalWeight, components, isSpanningTree };
}

export function totalWeight(edges = []) {
  return edges.reduce((sum, edge) => sum + parseWeight(edge?.w), 0);
}

export function computeEdgeSlacks(graph, mstEdges, mode = "asc") {
  const slacks = new Map();
  const mstIds = new Set(mstEdges.map((e) => e.id));

  const adj = new Map();
  for (const e of mstEdges) {
    if (!adj.has(e.u)) adj.set(e.u, []);
    if (!adj.has(e.v)) adj.set(e.v, []);
    adj.get(e.u).push({ to: e.v, w: e.w });
    adj.get(e.v).push({ to: e.u, w: e.w });
  }

  const findExtremeInPath = (start, end) => {
    if (start === end) return null;
    const visited = new Set([start]);
    const stack = [{ node: start, extreme: mode === "asc" ? -Infinity : Infinity }];
    while (stack.length) {
      const { node, extreme } = stack.pop();
      if (node === end) return extreme;
      const neighbors = adj.get(node) || [];
      for (const { to, w } of neighbors) {
        if (visited.has(to)) continue;
        visited.add(to);
        const next = mode === "asc" ? Math.max(extreme, w) : Math.min(extreme, w);
        stack.push({ node: to, extreme: next });
      }
    }
    return null;
  };

  for (const e of graph.edges) {
    if (mstIds.has(e.id)) {
      slacks.set(e.id, 0);
      continue;
    }
    const extreme = findExtremeInPath(e.u, e.v);
    if (extreme === null) {
      slacks.set(e.id, null);
      continue;
    }
    const slack = mode === "asc" ? e.w - extreme : extreme - e.w;
    slacks.set(e.id, slack);
  }

  return slacks;
}
