/**
 * Método de la Esquina Noroeste (Northwest Corner Method)
 *
 * MINIMIZAR: Algoritmo clásico — parte desde la esquina (0,0) y avanza
 *   hacia abajo o la derecha según se agote oferta o demanda.
 *
 * MAXIMIZAR: Greedy por mayor beneficio — ordena todas las celdas de
 *   mayor a menor costo y asigna lo máximo posible a cada una.
 *   Esto produce la solución básica factible de mayor beneficio posible.
 *
 * @param {number[][]} costos  Matriz m×n de costos/beneficios
 * @param {number[]}   oferta  Vector de oferta (orígenes)
 * @param {number[]}   demanda Vector de demanda (destinos)
 * @param {string}     modo    "minimizar" | "maximizar"
 */
export function resolverNorthwest(costos, oferta, demanda, modo = "minimizar") {
  const m = oferta.length;
  const n = demanda.length;
  const pasos = [];

  const ofertaRest = [...oferta];
  const demandaRest = [...demanda];
  const matrizAsig = Array.from({ length: m }, () => Array(n).fill(0));

  pasos.push({
    titulo: `Inicio — ${modo === "maximizar" ? "Maximizar (Greedy por mayor beneficio)" : "Minimizar (Esquina Noroeste clásica)"}`,
    descripcion:
      `Oferta: [${oferta.join(", ")}] | Demanda: [${demanda.join(", ")}]. ` +
      (modo === "maximizar"
        ? "Se asignan primero las celdas de MAYOR costo para maximizar el beneficio total."
        : "Se avanza desde la esquina superior-izquierda satisfaciendo oferta y demanda."),
    matriz: matrizAsig.map(f => [...f]),
  });

  if (modo === "maximizar") {
    // ── MAXIMIZAR: Greedy descendente por costo ──────────────────────────────
    // Construir lista de todas las celdas ordenadas de mayor a menor costo
    const celdas = [];
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        celdas.push({ i, j, costo: costos[i][j] });
      }
    }
    celdas.sort((a, b) => b.costo - a.costo);

    for (const { i, j, costo } of celdas) {
      if (ofertaRest[i] <= 0 || demandaRest[j] <= 0) continue;

      const cantidad = Math.min(ofertaRest[i], demandaRest[j]);
      matrizAsig[i][j] = cantidad;
      ofertaRest[i] -= cantidad;
      demandaRest[j] -= cantidad;

      pasos.push({
        titulo: `Asignar a celda (O${i + 1} → D${j + 1}) — costo ${costo}`,
        descripcion:
          `Celda de mayor beneficio disponible: costo ${costo}. ` +
          `Se asignan ${cantidad} unidades. ` +
          `Oferta restante O${i + 1}: ${ofertaRest[i]}. ` +
          `Demanda restante D${j + 1}: ${demandaRest[j]}.`,
        matriz: matrizAsig.map(f => [...f]),
      });
    }
  } else {
    // ── MINIMIZAR: Esquina Noroeste clásica ──────────────────────────────────
    let i = 0;
    let j = 0;

    while (i < m && j < n) {
      const cantidad = Math.min(ofertaRest[i], demandaRest[j]);
      matrizAsig[i][j] = cantidad;
      ofertaRest[i] -= cantidad;
      demandaRest[j] -= cantidad;

      pasos.push({
        titulo: `Asignar a celda (O${i + 1} → D${j + 1})`,
        descripcion:
          `Esquina actual: fila ${i + 1}, columna ${j + 1}. ` +
          `Se asignan ${cantidad} unidades. ` +
          `Oferta restante O${i + 1}: ${ofertaRest[i]}. ` +
          `Demanda restante D${j + 1}: ${demandaRest[j]}.`,
        matriz: matrizAsig.map(f => [...f]),
      });

      if (ofertaRest[i] === 0 && demandaRest[j] === 0) {
        i++; j++;
      } else if (ofertaRest[i] === 0) {
        i++;
      } else {
        j++;
      }
    }
  }

  // ── Calcular costo/beneficio total ───────────────────────────────────────
  let costoTotal = 0;
  const asignaciones = [];

  for (let fi = 0; fi < m; fi++) {
    for (let fj = 0; fj < n; fj++) {
      if (matrizAsig[fi][fj] > 0) {
        const costo = costos[fi][fj];
        const subtotal = matrizAsig[fi][fj] * costo;
        costoTotal += subtotal;
        asignaciones.push({
          fila: fi,
          columna: fj,
          cantidad: matrizAsig[fi][fj],
          costo,
          subtotal,
        });
      }
    }
  }

  pasos.push({
    titulo: `✅ Solución obtenida — ${modo === "maximizar" ? "Beneficio" : "Costo"} total: ${costoTotal}`,
    descripcion: `Se asignaron ${asignaciones.length} rutas activas.`,
    matriz: matrizAsig.map(f => [...f]),
  });

  return { asignaciones, costoTotal, pasos, matrizResultado: matrizAsig };
}
