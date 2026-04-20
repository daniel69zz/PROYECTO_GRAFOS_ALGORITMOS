import { useState } from "react";
import { resolverAsignacion, padMatrizCuadrada } from "../utils/hungaro";

export function useAsignacionAlgorithm({ nodos, aristas, DIVIDER_X, herramienta, setHerramienta, showNotification }) {
  const [modo, setModo] = useState("minimizar");
  const [resultado, setResultado] = useState(null);
  const [mostrarPasos, setMostrarPasos] = useState(false);
  const [infoPadding, setInfoPadding] = useState(null);

  const handleResolver = () => {
    if (herramienta !== 1) setHerramienta(1);

    const origenes = nodos.filter(n => n.x < DIVIDER_X).sort((a,b) => a.y - b.y);
    const destinos = nodos.filter(n => n.x >= DIVIDER_X).sort((a,b) => a.y - b.y);

    if (origenes.length === 0 || destinos.length === 0) {
      showNotification("Debe haber al menos un Origen (izq) y un Destino (der).", "error");
      return;
    }

    const m = origenes.length;
    const n = destinos.length;

    const matriz = Array.from({ length: m }, () => Array(n).fill(modo === "minimizar" ? 999999 : -999999));

    let aristaExistente = false;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const ar = aristas.find(a => (a.from === origenes[i].id && a.to === destinos[j].id) || (a.to === origenes[i].id && a.from === destinos[j].id));
            if (ar) {
                matriz[i][j] = ar.weight;
                aristaExistente = true;
            }
        }
    }

    if (!aristaExistente) {
      showNotification("No hay conexiones entre Orígenes y Destinos.", "error");
      return;
    }

    try {
      let matrizParaResolver = matriz.map(row => [...row]);
      let padding = null;

      if (m !== n) {
        const padResult = padMatrizCuadrada(matrizParaResolver);
        matrizParaResolver = padResult.matrizCuadrada;
        padding = padResult;
        setInfoPadding({
          filasFicticias: padResult.filasFicticias,
          columnasFicticias: padResult.columnasFicticias,
          tamanoOriginal: padResult.tamanoOriginal,
          tamanoFinal: matrizParaResolver.length,
        });
      } else {
        setInfoPadding(null);
      }

      const res = resolverAsignacion(matrizParaResolver, modo);

      const asignacionesReales = res.asignaciones.filter((a) => {
        if (padding) {
          if (padding.filasFicticias.includes(a.fila)) return false;
          if (padding.columnasFicticias.includes(a.columna)) return false;
        }
        return true;
      });

      const asignacionImposible = asignacionesReales.some(a => matriz[a.fila][a.columna] === 999999 || matriz[a.fila][a.columna] === -999999);
      if (asignacionImposible) {
        showNotification("No hay suficientes conexiones válidas para completar la asignación óptima. Faltan aristas.", "error");
        setResultado(null);
        return;
      }

      const costoReal = asignacionesReales.reduce((sum, a) => sum + matriz[a.fila][a.columna], 0);

      const asignacionesFicticias = res.asignaciones.filter((a) => {
        if (padding) {
          if (padding.filasFicticias.includes(a.fila)) return true;
          if (padding.columnasFicticias.includes(a.columna)) return true;
        }
        return false;
      });

      setResultado({
        ...res,
        origenes,
        destinos,
        matrizOriginal: matriz,
        asignacionesReales,
        asignacionesFicticias,
        costoReal,
      });

    } catch (err) {
      showNotification(`Error al resolver: ${err.message}`, "error");
    }
  };

  return {
    modo,
    setModo,
    resultado,
    setResultado,
    mostrarPasos,
    setMostrarPasos,
    infoPadding,
    handleResolver
  };
}
