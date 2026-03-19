/**
 * Convierte un grafo (nodos + aristas) en una matriz de costos n×n
 * para el algoritmo de asignación.
 *
 * Reglas:
 * - La matriz es n×n donde n = cantidad de nodos
 * - Cada celda [i][j] = peso de la arista del nodo i al nodo j
 * - Peso 0 es un valor VÁLIDO
 * - Conexión inexistente → ERROR (no se usa 0 como placeholder)
 * - Solo aristas dirigidas son aceptadas
 *
 * @param {Array} nodos - Array de nodos del grafo: [{ id, label, x, y, ... }]
 * @param {Array} aristas - Array de aristas: [{ from, to, weight, tipo }]
 * @returns {{ valida: boolean, error: string|null, matriz: number[][]|null, nombresNodos: string[]|null, aristasFaltantes: Array|null }}
 */
export function grafoAMatrizAsignacion(nodos, aristas) {
  // --- Validación 1: Al menos 2 nodos ---
  if (!nodos || nodos.length < 2) {
    return {
      valida: false,
      error: "Se necesitan al menos 2 nodos para crear una matriz de asignación.",
      matriz: null,
      nombresNodos: null,
      aristasFaltantes: null,
    };
  }

  // --- Validación 2: Todas las aristas deben ser dirigidas ---
  const noDirigidas = aristas.filter((ar) => ar.tipo === "no_dirigida");
  if (noDirigidas.length > 0) {
    return {
      valida: false,
      error: `El grafo tiene ${noDirigidas.length} arista(s) no dirigida(s). El algoritmo de asignación requiere un grafo completamente dirigido.`,
      matriz: null,
      nombresNodos: null,
      aristasFaltantes: null,
    };
  }

  const n = nodos.length;
  const idToIndex = new Map();
  const nombresNodos = [];

  // Mapear nodos a índices
  nodos.forEach((nodo, idx) => {
    idToIndex.set(nodo.id, idx);
    nombresNodos.push(nodo.label || `Nodo ${nodo.id}`);
  });

  // Crear mapa de aristas para búsqueda rápida
  const aristaMap = new Map();
  for (const ar of aristas) {
    const key = `${ar.from}->${ar.to}`;
    aristaMap.set(key, ar);
  }

  // --- Validación 3: Verificar que TODAS las conexiones i→j existen (i ≠ j) ---
  const aristasFaltantes = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Lazos no son necesarios para asignación
      const fromId = nodos[i].id;
      const toId = nodos[j].id;
      const key = `${fromId}->${toId}`;
      if (!aristaMap.has(key)) {
        aristasFaltantes.push({
          from: nombresNodos[i],
          to: nombresNodos[j],
          fromId,
          toId,
        });
      }
    }
  }

  if (aristasFaltantes.length > 0) {
    const maxMostrar = 5;
    const ejemplos = aristasFaltantes
      .slice(0, maxMostrar)
      .map((f) => `  • ${f.from} → ${f.to}`)
      .join("\n");
    const restante =
      aristasFaltantes.length > maxMostrar
        ? `\n  ... y ${aristasFaltantes.length - maxMostrar} más`
        : "";

    return {
      valida: false,
      error: `El grafo no es completo. Faltan ${aristasFaltantes.length} conexión(es):\n${ejemplos}${restante}\n\nPara asignación se requiere que cada nodo tenga una arista dirigida hacia todos los demás.`,
      matriz: null,
      nombresNodos,
      aristasFaltantes,
    };
  }

  // --- Construir la matriz n×n ---
  const matriz = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        // Diagonal: usar lazo si existe, sino 0
        const key = `${nodos[i].id}->${nodos[j].id}`;
        const ar = aristaMap.get(key);
        matriz[i][j] = ar ? Number(ar.weight) || 0 : 0;
      } else {
        const key = `${nodos[i].id}->${nodos[j].id}`;
        const ar = aristaMap.get(key);
        matriz[i][j] = Number(ar.weight) || 0;
      }
    }
  }

  // --- Validación 4: No deben haber valores negativos ---
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matriz[i][j] < 0) {
        return {
          valida: false,
          error: `La arista ${nombresNodos[i]} → ${nombresNodos[j]} tiene peso negativo (${matriz[i][j]}). El algoritmo Húngaro requiere valores ≥ 0.`,
          matriz: null,
          nombresNodos,
          aristasFaltantes: null,
        };
      }
    }
  }

  return {
    valida: true,
    error: null,
    matriz,
    nombresNodos,
    aristasFaltantes: null,
  };
}
