
export function padMatrizCuadrada(matriz) {
  const filas = matriz.length;
  const columnas = matriz[0]?.length ?? 0;
  const n = Math.max(filas, columnas);

  const filasFicticias = [];
  const columnasFicticias = [];


  const matrizCuadrada = matriz.map((fila) => {
    const nuevaFila = [...fila];
    while (nuevaFila.length < n) {
      nuevaFila.push(0);
    }
    return nuevaFila;
  });


  for (let j = columnas; j < n; j++) {
    columnasFicticias.push(j);
  }


  while (matrizCuadrada.length < n) {
    const idx = matrizCuadrada.length;
    filasFicticias.push(idx);
    matrizCuadrada.push(Array(n).fill(0));
  }

  return {
    matrizCuadrada,
    filasFicticias,
    columnasFicticias,
    tamanoOriginal: { filas, columnas },
  };
}


export function resolverAsignacion(matrizOriginal, modo = "minimizar") {
  const n = matrizOriginal.length;
  const pasos = [];


  let matriz = matrizOriginal.map((f) => [...f]);


  if (modo === "maximizar") {
    const maxVal = Math.max(...matriz.flat());
    matriz = matriz.map((fila) => fila.map((v) => maxVal - v));
    pasos.push({
      titulo: "Conversión a minimización",
      descripcion: `Se resta cada valor del máximo global (${maxVal}) para convertir el problema de maximización en minimización.`,
      matriz: matriz.map((f) => [...f]),
    });
  }


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


  let iteracion = 0;
  const MAX_ITER = 100;

  while (iteracion < MAX_ITER) {
    iteracion++;


    const asignacion = encontrarAsignacionOptima(matriz, n);

    if (asignacion.length === n) {

      pasos.push({
        titulo: `Paso 3: Asignación óptima encontrada (iteración ${iteracion})`,
        descripcion: `Se encontró una asignación completa de ${n} elementos con ${n} ceros independientes.`,
        matriz: matriz.map((f) => [...f]),
      });


      const asignaciones = asignacion.map(({ fila, columna }) => ({
        fila,
        columna,
        costo: matrizOriginal[fila][columna],
      }));

      const costoTotal = asignaciones.reduce((sum, a) => sum + a.costo, 0);


      const matrizResultado = matrizOriginal.map((f) => [...f]);

      return { asignaciones, costoTotal, pasos, matrizResultado };
    }


    const { filasCubiertas, columnasCubiertas } = cubrirCeros(matriz, n);
    const totalLineas = filasCubiertas.size + columnasCubiertas.size;

    pasos.push({
      titulo: `Paso 3.${iteracion}: Cobertura de ceros`,
      descripcion: `Se necesitan ${totalLineas} líneas para cubrir todos los ceros (se necesitan ${n}). Filas cubiertas: [${[...filasCubiertas].join(", ")}], Columnas cubiertas: [${[...columnasCubiertas].join(", ")}].`,
      matriz: matriz.map((f) => [...f]),
    });

    if (totalLineas >= n) {

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


    let minNoCubierto = Infinity;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!filasCubiertas.has(i) && !columnasCubiertas.has(j)) {
          if (matriz[i][j] < minNoCubierto) minNoCubierto = matriz[i][j];
        }
      }
    }


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


function encontrarAsignacionOptima(matriz, n) {
  const mejorAsignacion = { valor: [] };

  function backtrack(fila, columnaUsada, asignActual) {
    if (fila === n) {
      if (asignActual.length > mejorAsignacion.valor.length) {
        mejorAsignacion.valor = [...asignActual];
      }
      return;
    }


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


    backtrack(fila + 1, columnaUsada, asignActual);
  }

  backtrack(0, new Set(), []);
  return mejorAsignacion.valor;
}


function cubrirCeros(matriz, n) {

  const asignFilaACol = new Array(n).fill(-1);
  const asignColAFila = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matriz[i][j] === 0 && asignFilaACol[i] === -1 && asignColAFila[j] === -1) {
        asignFilaACol[i] = j;
        asignColAFila[j] = i;
      }
    }
  }


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


  const filasNoAsignadas = new Set();
  for (let i = 0; i < n; i++) {
    if (asignFilaACol[i] === -1) filasNoAsignadas.add(i);
  }

  const filasMarcadas = new Set(filasNoAsignadas);
  const columnasMarcadas = new Set();
  let cambio = true;

  while (cambio) {
    cambio = false;


    for (const i of filasMarcadas) {
      for (let j = 0; j < n; j++) {
        if (matriz[i][j] === 0 && !columnasMarcadas.has(j)) {
          columnasMarcadas.add(j);
          cambio = true;
        }
      }
    }


    for (const j of columnasMarcadas) {
      const fila = asignColAFila[j];
      if (fila !== -1 && !filasMarcadas.has(fila)) {
        filasMarcadas.add(fila);
        cambio = true;
      }
    }
  }


  const filasCubiertas = new Set();
  for (let i = 0; i < n; i++) {
    if (!filasMarcadas.has(i)) filasCubiertas.add(i);
  }

  return { filasCubiertas, columnasCubiertas: columnasMarcadas };
}


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


export function validarMatriz(m) {
  if (!Array.isArray(m) || m.length === 0) return { valida: false, error: "La matriz está vacía." };

  const numCols = m[0]?.length ?? 0;
  if (numCols === 0) return { valida: false, error: "La matriz no tiene columnas." };

  for (let i = 0; i < m.length; i++) {
    if (!Array.isArray(m[i]) || m[i].length !== numCols) {
      return { valida: false, error: `La fila ${i + 1} no tiene ${numCols} columnas. Todas las filas deben tener la misma cantidad de columnas.` };
    }
    for (let j = 0; j < numCols; j++) {
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
