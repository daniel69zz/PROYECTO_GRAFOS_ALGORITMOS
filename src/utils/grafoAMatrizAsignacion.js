/**
 * Convierte un grafo (nodos + aristas) en una matriz de costos
 * para el algoritmo de asignación.
 *
 * Nuevo modelo: clasifica los nodos en Orígenes y Destinos
 * según las aristas dirigidas. La matriz resultante puede ser rectangular.
 * Si no es cuadrada, se indica para que el caller añada variables artificiales.
 *
 * @param {Array} nodos - Array de nodos del grafo: [{ id, label, x, y, ... }]
 * @param {Array} aristas - Array de aristas: [{ from, to, weight, tipo }]
 * @returns {{ valida: boolean, error: string|null, matriz: number[][]|null, nombresOrigenes: string[]|null, nombresDestinos: string[]|null }}
 */
export function grafoAMatrizAsignacion(nodos, aristas) {
  // --- Validación 1: Al menos 1 arista ---
  if (!aristas || aristas.length < 1) {
    return {
      valida: false,
      error: "Se necesita al menos 1 arista dirigida para crear una matriz de asignación.",
      matriz: null,
      nombresOrigenes: null,
      nombresDestinos: null,
    };
  }

  // --- Validación 2: Todas las aristas deben ser dirigidas ---
  const noDirigidas = aristas.filter((ar) => ar.tipo === "no_dirigida");
  if (noDirigidas.length > 0) {
    return {
      valida: false,
      error: `El grafo tiene ${noDirigidas.length} arista(s) no dirigida(s). El algoritmo de asignación requiere aristas dirigidas.`,
      matriz: null,
      nombresOrigenes: null,
      nombresDestinos: null,
    };
  }

  // Mapear nodos por ID para búsqueda rápida
  const nodoMap = new Map();
  for (const nodo of nodos) {
    nodoMap.set(nodo.id, nodo);
  }

  // Clasificar nodos: los que aparecen como "from" son orígenes,
  // los que aparecen como "to" son destinos
  const origenIds = new Set();
  const destinoIds = new Set();
  for (const ar of aristas) {
    origenIds.add(ar.from);
    destinoIds.add(ar.to);
  }

  // Convertir a arrays ordenados
  const origenes = [...origenIds].map((id) => {
    const nodo = nodoMap.get(id);
    return { id, label: nodo?.label || `Nodo ${id}` };
  });
  const destinos = [...destinoIds].map((id) => {
    const nodo = nodoMap.get(id);
    return { id, label: nodo?.label || `Nodo ${id}` };
  });

  if (origenes.length < 1 || destinos.length < 1) {
    return {
      valida: false,
      error: "Se necesita al menos 1 origen y 1 destino.",
      matriz: null,
      nombresOrigenes: null,
      nombresDestinos: null,
    };
  }

  const m = origenes.length;
  const n = destinos.length;

  // Crear mapa de aristas para búsqueda rápida
  const aristaMap = new Map();
  for (const ar of aristas) {
    const key = `${ar.from}->${ar.to}`;
    aristaMap.set(key, ar);
  }

  // Construir la matriz m×n
  const nombresOrigenes = origenes.map((o) => o.label);
  const nombresDestinos = destinos.map((d) => d.label);
  const matriz = Array.from({ length: m }, () => Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = `${origenes[i].id}->${destinos[j].id}`;
      const ar = aristaMap.get(key);
      if (ar) {
        const peso = Number(ar.weight);
        if (peso < 0) {
          return {
            valida: false,
            error: `La arista ${nombresOrigenes[i]} → ${nombresDestinos[j]} tiene peso negativo (${peso}). El algoritmo Húngaro requiere valores ≥ 0.`,
            matriz: null,
            nombresOrigenes,
            nombresDestinos,
          };
        }
        matriz[i][j] = peso || 0;
      }
      // Si no existe la arista, queda en 0
    }
  }

  return {
    valida: true,
    error: null,
    matriz,
    nombresOrigenes,
    nombresDestinos,
  };
}
