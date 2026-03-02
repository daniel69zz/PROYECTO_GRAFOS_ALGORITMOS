export const exportar_grafo = (nodos, aristas, nextId) => {
  const grafo = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    graph: {
      nodos: nodos,
      aristas: aristas,
      nextId: nextId,
      metadata: {
        total_nodos: nodos.length,
        total_aristas: aristas.length,
      },
    },
  };

  const data_export = JSON.stringify(grafo, null, 2);

  const data_blob = new Blob([data_export], { type: "application/json" });

  const url_temp = URL.createObjectURL(data_blob);

  const link = document.createElement("a");
  link.href = url_temp;
  link.download = `grafo_${Date.now()}.json`;

  document.body.appendChild(link);
  link.click(); // simula un autoclick al enlace de descarga lo cual genera que se autodescargue el archivo

  document.body.removeChild(link);
  URL.revokeObjectURL(url_temp);
};

export const importar_grafo = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".json")) {
      reject(new Error("Error, el archivo debe estar en formado JSON"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const grafo_data = JSON.parse(e.target.result);

        if (!grafo_data.graph) {
          throw new Error(
            "Formalo Invalido, no se encontró la propiedad 'graph'",
          );
        }

        const { nodos, aristas, nextId } = grafo_data.graph;

        if (!Array.isArray(nodos) || !Array.isArray(aristas)) {
          throw new Error(
            "Formato invalido: nodos y aristas tienen que ser arreglos",
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
          throw new Error("El arreglo de nodos no sigue un formato valido");
        }

        const aristas_validas = aristas.every(
          (ar) =>
            ar.from !== undefined &&
            ar.to !== undefined &&
            ar.weight !== undefined,
        );

        if (!aristas_validas) {
          throw new Error("El arreglo de aristas no sigue un formato valido");
        }

        const id_nodos = new Set(nodos.map((nodo) => nodo.id));

        const aristas_nodos_validos = aristas.every(
          (ar) => id_nodos.has(ar.from) && id_nodos.has(ar.to),
        );

        if (!aristas_nodos_validos) {
          throw new Error("Algunas aristas tienen nodos que no existen");
        }

        resolve({
          nodos,
          aristas,
          nextId: nextId || Math.max(...nodos.map((nodo) => nodo.id), 0) + 1,
          metadata: grafo_data.graph.metadata || {},
          version: grafo_data.version,
          timestamp: grafo_data.timestamp,
        });
      } catch (e) {
        reject(new Error(`Error al procesar el archivo ${e.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsText(file);
  });
};
