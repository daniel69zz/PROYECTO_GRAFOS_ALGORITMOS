
export function grafoAMatrizAsignacion(nodos, aristas) {

  if (!aristas || aristas.length < 1) {
    return {
      valida: false,
      error: "Se necesita al menos 1 arista dirigida para crear una matriz de asignación.",
      matriz: null,
      nombresOrigenes: null,
      nombresDestinos: null,
    };
  }


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


  const nodoMap = new Map();
  for (const nodo of nodos) {
    nodoMap.set(nodo.id, nodo);
  }



  const origenIds = new Set();
  const destinoIds = new Set();
  for (const ar of aristas) {
    origenIds.add(ar.from);
    destinoIds.add(ar.to);
  }


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


  const aristaMap = new Map();
  for (const ar of aristas) {
    const key = `${ar.from}->${ar.to}`;
    aristaMap.set(key, ar);
  }


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
