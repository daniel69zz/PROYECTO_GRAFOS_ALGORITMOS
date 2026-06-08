export const exportar_grafo = (nodos, aristas, nextId, nombreArchivo = `grafo_${Date.now()}`) => {
  const grafo = {
    version: "1.1",
    timestamp: new Date().toISOString(),
    graph: {
      nodos: nodos,
      aristas: aristas,
      nextId: nextId,
      metadata: {
        total_nodos: nodos.length,
        total_aristas: aristas.length,
        aristas_dirigidas: aristas.filter(
          (ar) => ar.tipo === "dirigida" || ar.tipo === undefined,
        ).length,
        aristas_no_dirigidas: aristas.filter((ar) => ar.tipo === "no_dirigida")
          .length,
      },
    },
  };

  const data_export = JSON.stringify(grafo, null, 2);

  const data_blob = new Blob([data_export], { type: "application/json" });

  const url_temp = URL.createObjectURL(data_blob);

  const link = document.createElement("a");
  link.href = url_temp;

  const finalName = nombreArchivo.toLowerCase().endsWith(".json")
    ? nombreArchivo
    : `${nombreArchivo}.json`;

  link.download = finalName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url_temp);
};

export const importar_grafo = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".json")) {
      reject(new Error("Error, el archivo debe estar en formato JSON"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const grafo_data = JSON.parse(e.target.result);

        if (!grafo_data.graph) {
          throw new Error(
            "Formato inválido, no se encontró la propiedad 'graph'",
          );
        }

        const { nodos, aristas, nextId } = grafo_data.graph;

        if (!Array.isArray(nodos) || !Array.isArray(aristas)) {
          throw new Error(
            "Formato inválido: nodos y aristas tienen que ser arreglos",
          );
        }

        const nodos_validos = nodos.every(
          (n) =>
            n.id !== undefined &&
            n.x !== undefined &&
            n.y !== undefined &&
            n.label !== undefined,
        );

        if (!nodos_validos) {
          throw new Error("El arreglo de nodos no sigue un formato válido");
        }

        const aristas_validas = aristas.every(
          (ar) =>
            ar.from !== undefined &&
            ar.to !== undefined &&
            ar.weight !== undefined,
        );

        if (!aristas_validas) {
          throw new Error("El arreglo de aristas no sigue un formato válido");
        }

        const aristas_normalizadas = aristas.map((ar) => ({
          ...ar,
          tipo: ar.tipo || "dirigida",
        }));

        const id_nodos = new Set(nodos.map((nodo) => nodo.id));

        const aristas_nodos_validos = aristas_normalizadas.every(
          (ar) => id_nodos.has(ar.from) && id_nodos.has(ar.to),
        );

        if (!aristas_nodos_validos) {
          throw new Error("Algunas aristas tienen nodos que no existen");
        }

        // El nextId debe ser SIEMPRE mayor que el id mas alto de los nodos
        // existentes. Si confiamos solo en el nextId del archivo y este quedo
        // desactualizado o por debajo del id maximo real, un nodo nuevo podria
        // reusar un id existente y enlazar aristas a un nodo equivocado.
        const idMaximoNodos = nodos.reduce((max, nodo) => {
          const idNumerico = Number(nodo.id);
          return Number.isFinite(idNumerico) && idNumerico > max
            ? idNumerico
            : max;
        }, 0);
        const nextIdGuardado = Number(nextId);
        const nextIdSeguro = Math.max(
          Number.isFinite(nextIdGuardado) ? nextIdGuardado : 0,
          idMaximoNodos + 1,
        );

        resolve({
          nodos,
          aristas: aristas_normalizadas,
          nextId: nextIdSeguro,
          metadata: grafo_data.graph.metadata || {},
          version: grafo_data.version,
          timestamp: grafo_data.timestamp,
        });
      } catch (e) {
        reject(new Error(`Error al procesar el archivo: ${e.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsText(file);
  });
};
