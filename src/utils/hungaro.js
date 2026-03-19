/**
 * Algoritmo Húngaro (Hungarian Algorithm)
 * Resuelve el problema de asignación para minimización y maximización.
 *
 * @param {number[][]} matrizOriginal - Matriz de costos n×n
 * @param {"minimizar"|"maximizar"} modo - Objetivo de optimización
 * @returns {{ asignaciones, costoTotal, pasos, matrizResultado }}
 */
export function resolverAsignacion(matrizOriginal, modo = "minimizar") {
  const n = matrizOriginal.length;
  const pasos = [];

  // Clonar la matriz original
  let matriz = matrizOriginal.map((f) => [...f]);

  // --- Para MAXIMIZACIÓN: convertir a minimización ---
  if (modo === "maximizar") {
    const maxVal = Math.max(...matriz.flat());
    matriz = matriz.map((fila) => fila.map((v) => maxVal - v));
    pasos.push({
      titulo: "Conversión a minimización",
      descripcion: `Se resta cada valor del máximo global (${maxVal}) para convertir el problema de maximización en minimización.`,
      matriz: matriz.map((f) => [...f]),
    });
  }

  // --- PASO 1: Restar mínimo de cada fila ---
  for (let i = 0; i < n; i++) {
    const minFila = Math.min(...matriz[i]);
    for (let j = 0; j < n; j++) {
      matriz[i][j] -= minFila;
    }
  }
  pasos.push({
    titulo: "Paso 1: Reducción por filas",
    descripcion:
      "Se resta el valor mínimo de cada fila a todos los elementos de esa fila.",
    matriz: matriz.map((f) => [...f]),
  });

  // --- PASO 2: Restar mínimo de cada columna ---
  for (let j = 0; j < n; j++) {
    let minCol = Infinity;
    for (let i = 0; i < n; i++) {
      if (matriz[i][j] < minCol) minCol = matriz[i][j];
    }
    for (let i = 0; i < n; i++) {
      matriz[i][j] -= minCol;
    }
  }
  pasos.push({
    titulo: "Paso 2: Reducción por columnas",
    descripcion:
      "Se resta el valor mínimo de cada columna a todos los elementos de esa columna.",
    matriz: matriz.map((f) => [...f]),
  });

  // --- PASO 3–5: Cubrir ceros con líneas mínimas y ajustar ---
  let iteracion = 0;
  const MAX_ITER = 100;

  while (iteracion < MAX_ITER) {
    iteracion++;

    // Intentar asignación óptima
    const asignacion = encontrarAsignacionOptima(matriz, n);

    if (asignacion.length === n) {
      // ¡Asignación completa encontrada!
      pasos.push({
        titulo: `Paso 3: Asignación óptima encontrada (iteración ${iteracion})`,
        descripcion: `Se encontró una asignación completa de ${n} elementos con ${n} ceros independientes.`,
        matriz: matriz.map((f) => [...f]),
      });

      // Calcular costo con la matriz ORIGINAL
      const asignaciones = asignacion.map(({ fila, columna }) => ({
        fila,
        columna,
        costo: matrizOriginal[fila][columna],
      }));

      const costoTotal = asignaciones.reduce((sum, a) => sum + a.costo, 0);

      // Matriz resultado con marcas
      const matrizResultado = matrizOriginal.map((f) => [...f]);

      return { asignaciones, costoTotal, pasos, matrizResultado };
    }

    // Cubrir ceros con líneas mínimas
    const { filasCubiertas, columnasCubiertas } = cubrirCeros(matriz, n);
    const totalLineas = filasCubiertas.size + columnasCubiertas.size;

    pasos.push({
      titulo: `Paso 3.${iteracion}: Cobertura de ceros`,
      descripcion: `Se necesitan ${totalLineas} líneas para cubrir todos los ceros (se necesitan ${n}). Filas cubiertas: [${[...filasCubiertas].join(", ")}], Columnas cubiertas: [${[...columnasCubiertas].join(", ")}].`,
      matriz: matriz.map((f) => [...f]),
    });

    if (totalLineas >= n) {
      // Debería haberse encontrado asignación, forzar salida
      const asignacionForzada = encontrarAsignacionOptima(matriz, n);
      const asignaciones = asignacionForzada.map(({ fila, columna }) => ({
        fila,
        columna,
        costo: matrizOriginal[fila][columna],
      }));
      const costoTotal = asignaciones.reduce((sum, a) => sum + a.costo, 0);
      const matrizResultado = matrizOriginal.map((f) => [...f]);
      return { asignaciones, costoTotal, pasos, matrizResultado };
    }

    // Encontrar el mínimo no cubierto
    let minNoCubierto = Infinity;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!filasCubiertas.has(i) && !columnasCubiertas.has(j)) {
          if (matriz[i][j] < minNoCubierto) minNoCubierto = matriz[i][j];
        }
      }
    }

    // Ajustar la matriz
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!filasCubiertas.has(i) && !columnasCubiertas.has(j)) {
          matriz[i][j] -= minNoCubierto;
        } else if (filasCubiertas.has(i) && columnasCubiertas.has(j)) {
          matriz[i][j] += minNoCubierto;
        }
      }
    }

    pasos.push({
      titulo: `Paso 4.${iteracion}: Ajuste de la matriz`,
      descripcion: `El mínimo no cubierto es ${minNoCubierto}. Se resta de los elementos no cubiertos y se suma a los doblemente cubiertos.`,
      matriz: matriz.map((f) => [...f]),
    });
  }

  // Fallback: devolver la mejor asignación encontrada
  const asignacionFinal = encontrarAsignacionOptima(matriz, n);
  const asignaciones = asignacionFinal.map(({ fila, columna }) => ({
    fila,
    columna,
    costo: matrizOriginal[fila][columna],
  }));
  const costoTotal = asignaciones.reduce((sum, a) => sum + a.costo, 0);
  const matrizResultado = matrizOriginal.map((f) => [...f]);
  return { asignaciones, costoTotal, pasos, matrizResultado };
}

/**
 * Encuentra una asignación óptima (máximo matching de ceros independientes).
 * Usa búsqueda con backtracking.
 */
function encontrarAsignacionOptima(matriz, n) {
  const mejorAsignacion = { valor: [] };

  function backtrack(fila, columnaUsada, asignActual) {
    if (fila === n) {
      if (asignActual.length > mejorAsignacion.valor.length) {
        mejorAsignacion.valor = [...asignActual];
      }
      return;
    }

    // Intentar asignar un cero en esta fila
    let asignado = false;
    for (let j = 0; j < n; j++) {
      if (matriz[fila][j] === 0 && !columnaUsada.has(j)) {
        columnaUsada.add(j);
        asignActual.push({ fila, columna: j });
        backtrack(fila + 1, columnaUsada, asignActual);
        asignActual.pop();
        columnaUsada.delete(j);
        asignado = true;
      }
    }

    // También intentar no asignar en esta fila (por si hay mejor matching más adelante)
    backtrack(fila + 1, columnaUsada, asignActual);
  }

  backtrack(0, new Set(), []);
  return mejorAsignacion.valor;
}

/**
 * Cubre todos los ceros con el mínimo número de líneas (filas y columnas).
 * Usa el método de König.
 */
function cubrirCeros(matriz, n) {
  // Paso 1: Encontrar un matching máximo de ceros
  const asignFilaACol = new Array(n).fill(-1); // fila → columna asignada
  const asignColAFila = new Array(n).fill(-1); // columna → fila asignada

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matriz[i][j] === 0 && asignFilaACol[i] === -1 && asignColAFila[j] === -1) {
        asignFilaACol[i] = j;
        asignColAFila[j] = i;
      }
    }
  }

  // Mejorar matching con caminos alternantes (Hopcroft-Karp simplificado)
  let mejorado = true;
  while (mejorado) {
    mejorado = false;
    for (let i = 0; i < n; i++) {
      if (asignFilaACol[i] === -1) {
        const visitado = new Set();
        if (aumentar(i, matriz, n, asignFilaACol, asignColAFila, visitado)) {
          mejorado = true;
        }
      }
    }
  }

  // Paso 2: Encontrar cobertura mínima con König
  const filasNoAsignadas = new Set();
  for (let i = 0; i < n; i++) {
    if (asignFilaACol[i] === -1) filasNoAsignadas.add(i);
  }

  const filasMarcadas = new Set(filasNoAsignadas);
  const columnasMarcadas = new Set();
  let cambio = true;

  while (cambio) {
    cambio = false;

    // Marcar columnas con ceros en filas marcadas (no asignados al matching)
    for (const i of filasMarcadas) {
      for (let j = 0; j < n; j++) {
        if (matriz[i][j] === 0 && !columnasMarcadas.has(j)) {
          columnasMarcadas.add(j);
          cambio = true;
        }
      }
    }

    // Marcar filas asignadas a columnas marcadas
    for (const j of columnasMarcadas) {
      const fila = asignColAFila[j];
      if (fila !== -1 && !filasMarcadas.has(fila)) {
        filasMarcadas.add(fila);
        cambio = true;
      }
    }
  }

  // Líneas = filas NO marcadas + columnas marcadas
  const filasCubiertas = new Set();
  for (let i = 0; i < n; i++) {
    if (!filasMarcadas.has(i)) filasCubiertas.add(i);
  }

  return { filasCubiertas, columnasCubiertas: columnasMarcadas };
}

/**
 * Intenta encontrar un camino aumentante desde la fila dada.
 */
function aumentar(fila, matriz, n, asignFilaACol, asignColAFila, visitado) {
  for (let j = 0; j < n; j++) {
    if (matriz[fila][j] === 0 && !visitado.has(j)) {
      visitado.add(j);
      if (asignColAFila[j] === -1 || aumentar(asignColAFila[j], matriz, n, asignFilaACol, asignColAFila, visitado)) {
        asignFilaACol[fila] = j;
        asignColAFila[j] = fila;
        return true;
      }
    }
  }
  return false;
}

/**
 * Valida que la matriz sea cuadrada, sin celdas vacías, y con números válidos.
 */
export function validarMatriz(m) {
  if (!Array.isArray(m) || m.length === 0) return { valida: false, error: "La matriz está vacía." };

  const n = m.length;
  for (let i = 0; i < n; i++) {
    if (!Array.isArray(m[i]) || m[i].length !== n) {
      return { valida: false, error: `La fila ${i + 1} no tiene ${n} columnas. La matriz debe ser cuadrada.` };
    }
    for (let j = 0; j < n; j++) {
      const val = m[i][j];
      if (val === null || val === undefined || val === "" || isNaN(Number(val))) {
        return { valida: false, error: `La celda (${i + 1}, ${j + 1}) no tiene un valor numérico válido.` };
      }
      if (Number(val) < 0) {
        return { valida: false, error: `La celda (${i + 1}, ${j + 1}) tiene un valor negativo. Solo se permiten valores ≥ 0.` };
      }
    }
  }

  return { valida: true, error: null };
}
