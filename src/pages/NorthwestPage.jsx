import { useState, useRef, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "../components/Notification";
import { TbArrowBackUp } from "react-icons/tb";
import {
  FiPlay, FiChevronDown, FiChevronUp, FiArrowRight,
  FiPlus, FiMinus, FiUpload, FiHelpCircle, FiX
} from "react-icons/fi";
import { resolverNorthwest } from "../utils/northwest";

// ── helpers canvas ──────────────────────────────────────────────────────────
import { Nodo }   from "../components/Nodo";
import { Arista } from "../components/Arista";
import { existeAristaContraria } from "../utils/canvasUtils";

// ── importar grafo estándar (ya existente en el proyecto) ───────────────────
import { importar_grafo } from "../utils/exp_imp_grafo";

const DIVIDER_X = 500;

// ── estado inicial ──────────────────────────────────────────────────────────
const defaultCosts  = [["","",""],["","",""],["","",""]];
const defaultSupply = ["", "", ""];
const defaultDemand = ["", "", ""];

function makeMatrix(rows, cols, fill = "") {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

// Construye nodos y aristas para canvas a partir de la matriz
function matrizACanvas(costs, supply, demand) {
  const m = costs.length;
  const n = costs[0]?.length ?? 0;
  const nodos   = [];
  const aristas = [];
  let id = 1;
  const oIds = [], dIds = [];

  const stepO = 560 / (m + 1);
  const stepD = 560 / (n + 1);

  for (let i = 0; i < m; i++) {
    const nodo = { id: id++, x: 160, y: stepO * (i + 1), label: `O${i+1}`, color: "#4fc3f7" };
    nodos.push(nodo); oIds.push(nodo.id);
  }
  for (let j = 0; j < n; j++) {
    const nodo = { id: id++, x: 820, y: stepD * (j + 1), label: `D${j+1}`, color: "#4ade80" };
    nodos.push(nodo); dIds.push(nodo.id);
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      aristas.push({ from: oIds[i], to: dIds[j], weight: costs[i][j], tipo: "dirigida" });
    }
  }
  return { nodos, aristas, oIds, dIds };
}

// ── Componente ──────────────────────────────────────────────────────────────
export function NorthwestPage() {
  const location = useNavigate ? useLocation() : {};
  const navigate  = useNavigate();

  const originalNodos   = (location.state?.nodos   ?? []).map(({ cpm, ...r }) => r);
  const originalAristas =  location.state?.aristas ?? [];

  // ── Estado de la matriz ─────────────────────────────────────────────────
  const [costs,  setCosts]  = useState(() => defaultCosts.map(r => [...r]));
  const [supply, setSupply] = useState([...defaultSupply]);
  const [demand, setDemand] = useState([...defaultDemand]);

  const rows = costs.length;
  const cols = costs[0]?.length ?? 0;

  // ── Estado algoritmo ────────────────────────────────────────────────────
  const [modo,         setModo]         = useState("minimizar");
  const [resultado,    setResultado]    = useState(null);
  const [mostrarPasos, setMostrarPasos] = useState(false);
  const [mostrarGrafo, setMostrarGrafo] = useState(false);

  // ── Canvas (visual) ─────────────────────────────────────────────────────
  const [canvasData,   setCanvasData]   = useState(null); // {nodos,aristas,oIds,dIds}
  const [offset,       setOffset]       = useState({ x: 0, y: 0 });
  const [isPanning,    setIsPanning]    = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  // ── Misc ─────────────────────────────────────────────────────────────────
  const [notification, setNotification] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = (msg, type = "info") => setNotification({ message: msg, type });

  // ── Sincronizar canvas cuando cambia la matriz ──────────────────────────
  useEffect(() => {
    if (rows > 0 && cols > 0) {
      setCanvasData(matrizACanvas(costs, supply, demand));
      setOffset({ x: 0, y: 0 });
    }
  }, [costs, supply, demand]);

  // ── Editar celda de costos ───────────────────────────────────────────────
  const setCost = (i, j, val) => {
    setCosts(prev => {
      const next = prev.map(r => [...r]);
      next[i][j] = val === "" ? "" : Number(val);
      return next;
    });
    setResultado(null);
  };

  const setSupplyI = (i, val) => {
    setSupply(prev => { const n=[...prev]; n[i] = val === "" ? "" : Number(val); return n; });
    setResultado(null);
  };

  const setDemandJ = (j, val) => {
    setDemand(prev => { const n=[...prev]; n[j] = val === "" ? "" : Number(val); return n; });
    setResultado(null);
  };

  // ── Agregar / quitar filas y columnas ───────────────────────────────────
  const agregarFila = () => {
    setCosts(prev => [...prev, Array(cols).fill("")]);
    setSupply(prev => [...prev, ""]);
    setResultado(null);
  };

  const quitarFila = () => {
    if (rows <= 1) return showNotification("Debe haber al menos 1 origen.", "warning");
    setCosts(prev => prev.slice(0, -1));
    setSupply(prev => prev.slice(0, -1));
    setResultado(null);
  };

  const agregarColumna = () => {
    setCosts(prev => prev.map(r => [...r, ""]));
    setDemand(prev => [...prev, ""]);
    setResultado(null);
  };

  const quitarColumna = () => {
    if (cols <= 1) return showNotification("Debe haber al menos 1 destino.", "warning");
    setCosts(prev => prev.map(r => r.slice(0, -1)));
    setDemand(prev => prev.slice(0, -1));
    setResultado(null);
  };

  const limpiar = () => {
    setCosts(makeMatrix(3, 3, ""));
    setSupply(["","",""]);
    setDemand(["","",""]);
    setResultado(null);
  };

  // ── Importar JSON universal {costs, supply, demand} ──────────────────────
  // También acepta el formato interno del proyecto (con .graph)
  const handleImportarJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Formato estándar northwest: { costs, supply, demand }
      if (json.costs && json.supply && json.demand) {
        if (!Array.isArray(json.costs) || !Array.isArray(json.supply) || !Array.isArray(json.demand))
          throw new Error("costs, supply y demand deben ser arreglos.");
        setCosts(json.costs.map(r => [...r]));
        setSupply([...json.supply]);
        setDemand([...json.demand]);
        setResultado(null);
        showNotification("JSON importado correctamente ✅", "success");
      }
      // Formato interno del proyecto: { version, graph: { nodos, aristas, ... } }
      else if (json.graph) {
        // Solo avisamos — el grafo interno no tiene supply/demand, ignorar
        showNotification("Ese archivo es un grafo del proyecto. Usa un JSON con costs, supply y demand.", "warning");
      }
      else {
        throw new Error("Formato no reconocido. Usa: { costs, supply, demand }");
      }
    } catch (err) {
      showNotification(`Error: ${err.message}`, "error");
    }
    e.target.value = "";
  };

  // ── Resolver ─────────────────────────────────────────────────────────────
  const handleResolver = () => {
    const supplyPad  = supply.map(s => s === "" ? 0 : Number(s));
    const demandPad  = demand.map(d => d === "" ? 0 : Number(d));
    const costosPad  = costs.map(r => r.map(c => c === "" ? 0 : Number(c)));

    const totalO = supplyPad.reduce((s, v) => s + v, 0);
    const totalD = demandPad.reduce((s, v) => s + v, 0);

    if (totalO === 0 || totalD === 0)
      return showNotification("Oferta y demanda no pueden ser todas cero.", "error");

    // Balancear si hace falta
    let costosPadBalanced  = costosPad.map(r => [...r]);
    let supplyPadBalanced  = [...supplyPad];
    let demandPadBalanced  = [...demandPad];
    let ficticio   = null;

    if (totalO > totalD) {
      const d = totalO - totalD;
      demandPadBalanced  = [...demandPadBalanced, d];
      costosPadBalanced  = costosPadBalanced.map(r => [...r, 0]);
      ficticio   = { tipo: "columna", valor: d };
    } else if (totalD > totalO) {
      const d = totalD - totalO;
      supplyPadBalanced  = [...supplyPadBalanced, d];
      costosPadBalanced  = [...costosPadBalanced, Array(cols).fill(0)];
      ficticio   = { tipo: "fila", valor: d };
    }

    // Actualizar visualmente la matriz para que incluya la ficticia
    setCosts(costosPadBalanced);
    setSupply(supplyPadBalanced);
    setDemand(demandPadBalanced);

    try {
      const res = resolverNorthwest(costosPadBalanced, supplyPadBalanced, demandPadBalanced, modo);

      // Como la matriz ahora incluye la fila/columna ficticia visualmente,
      // mostramos todas las asignaciones.
      const asignacionesReales = res.asignaciones;
      const costoReal = res.costoTotal;

      setResultado({
        ...res,
        asignacionesReales,
        costoReal,
        ficticio,
        matrizOriginal: costosPadBalanced,
        supply: supplyPadBalanced,
        demand: demandPadBalanced,
      });
    } catch (err) {
      showNotification(`Error: ${err.message}`, "error");
    }
  };

  // ── Canvas helpers ────────────────────────────────────────────────────────
  const aristasCanvas = canvasData
    ? canvasData.aristas.map(ar => {
        if (!resultado) return { ...ar, isOptimal: false };
        const oIdx = canvasData.oIds.indexOf(ar.from);
        const dIdx = canvasData.dIds.indexOf(ar.to);
        const isOptimal = resultado.asignacionesReales.some(
          a => a.fila === oIdx && a.columna === dIdx
        );
        return { ...ar, isOptimal };
      })
    : [];

  const handleMouseDown = (e) => {
    if (e.target.closest("[data-nodo]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  // ── totales ───────────────────────────────────────────────────────────────
  const totalOferta  = supply.reduce((s, v) => s + (v === "" ? 0 : Number(v)), 0);
  const totalDemanda = demand.reduce((s, v) => s + (v === "" ? 0 : Number(v)), 0);
  const balanceado   = totalOferta === totalDemanda;

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <Header>
        <BackButton onClick={() => navigate("/graph", { state: { nodos: originalNodos, aristas: originalAristas } })}>
          <TbArrowBackUp /> Volver al Grafo
        </BackButton>
        <Title>🧭 Método Northwest Corner</Title>
        <HelpButton onClick={() => setShowHelp(true)} title="Ayuda">
          <FiHelpCircle />
        </HelpButton>
      </Header>

      {showHelp && (
        <HelpOverlay onClick={() => setShowHelp(false)}>
          <HelpModal onClick={(e) => e.stopPropagation()}>
            <HelpHeader>
              <h2><FiHelpCircle /> Como usar Northwest</h2>
              <CloseButton onClick={() => setShowHelp(false)} title="Cerrar"><FiX /></CloseButton>
            </HelpHeader>

            <HelpBody>
              <HelpStep>
                <strong>1. Define la matriz de costos</strong>
                <p>
                  Cada celda es el costo (o beneficio) de transportar de un <em>Origen</em> a
                  un <em>Destino</em>. Usa <em>Agregar/Eliminar Fila</em> y{" "}
                  <em>Agregar/Eliminar Columna</em> para ajustar el tamano de la matriz.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>2. Ingresa oferta y demanda</strong>
                <p>
                  Escribe la <em>Oferta</em> de cada origen (columna derecha) y la{" "}
                  <em>Demanda</em> de cada destino (fila inferior). Abajo veras las sumas
                  <em> Σ Oferta</em> y <em>Σ Demanda</em>.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>3. Balanceo automatico</strong>
                <p>
                  Si la oferta total y la demanda total no coinciden, al resolver se agrega
                  automaticamente un origen o destino <em>ficticio</em> con costo 0 para
                  balancear el problema.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>4. Elige el modo y resuelve</strong>
                <p>
                  Selecciona <em>Minimizar</em> o <em>Maximizar</em> y pulsa{" "}
                  <em>Resolver</em>. Las celdas asignadas se resaltan en la matriz con la
                  cantidad transportada.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>5. Revisa el resultado y los pasos</strong>
                <p>
                  Veras el costo/beneficio total y el detalle de cada asignacion. Pulsa{" "}
                  <em>Ver pasos de resolucion</em> para seguir el recorrido de la esquina
                  noroeste paso a paso.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>6. Vista de grafo e importar</strong>
                <p>
                  Despliega <em>Vista de grafo</em> para ver origenes, destinos y las rutas
                  optimas resaltadas (arrastra para mover la vista). Tambien puedes{" "}
                  <em>Importar JSON</em> con el formato{" "}
                  <code>{'{ "costs": [...], "supply": [...], "demand": [...] }'}</code>.
                </p>
              </HelpStep>
            </HelpBody>
          </HelpModal>
        </HelpOverlay>
      )}

      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      <input ref={fileInputRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImportarJSON} />

      <MainScroll>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 1 — CONTROLES + MATRIZ
        ══════════════════════════════════════════════════════════════════ */}
        <Section>

          {/* Barra de controles */}
          <ControlBar>
            <CtrlGroup>
              <CtrlBtn $color="blue" onClick={agregarFila}><FiPlus /> Agregar Fila</CtrlBtn>
              <CtrlBtn $color="blue" onClick={agregarColumna}><FiPlus /> Agregar Columna</CtrlBtn>
              <CtrlBtn $color="rose" onClick={quitarFila}><FiMinus /> Eliminar Fila</CtrlBtn>
              <CtrlBtn $color="rose" onClick={quitarColumna}><FiMinus /> Eliminar Columna</CtrlBtn>
              <CtrlBtn $color="violet" onClick={() => fileInputRef.current?.click()}>
                <FiUpload /> Importar JSON
              </CtrlBtn>
            </CtrlGroup>
            <CtrlGroup>
              <ModoBtn $active={modo === "minimizar"} $color="green"
                onClick={() => { setModo("minimizar"); setResultado(null); }}>
                ⬇ Minimizar
              </ModoBtn>
              <ModoBtn $active={modo === "maximizar"} $color="amber"
                onClick={() => { setModo("maximizar"); setResultado(null); }}>
                ⬆ Maximizar
              </ModoBtn>
              <SolveBtn $modo={modo} onClick={handleResolver}>
                <FiPlay /> Resolver
              </SolveBtn>
              <CtrlBtn $color="gray" onClick={limpiar}>Limpiar</CtrlBtn>
            </CtrlGroup>
          </ControlBar>

          {/* Tabla editable */}
          <TableWrapper>
            <MatrizTable>
              <thead>
                <tr>
                  <ThCorner />
                  {Array.from({ length: cols }, (_, j) => (
                    <Th key={j}>Destino {j + 1}</Th>
                  ))}
                  <ThOferta>Oferta</ThOferta>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }, (_, i) => (
                  <tr key={i}>
                    <TdLabel>Origen {i + 1}</TdLabel>
                    {Array.from({ length: cols }, (_, j) => {
                      const isOpt = resultado?.asignacionesReales.some(
                        a => a.fila === i && a.columna === j
                      );
                      return (
                        <TdCell key={j} $isOptimal={isOpt} $modo={modo}>
                          <CellInput
                            type="number"
                            value={costs[i][j]}
                            onChange={e => setCost(i, j, e.target.value)}
                            $isOptimal={isOpt}
                            $modo={modo}
                          />
                          {isOpt && resultado && (
                            <CellBadge $modo={modo}>
                              {resultado.asignacionesReales.find(a=>a.fila===i&&a.columna===j)?.cantidad}
                            </CellBadge>
                          )}
                        </TdCell>
                      );
                    })}
                    <TdOferta>
                      <OfDemInput
                        type="number"
                        value={supply[i]}
                        onChange={e => setSupplyI(i, e.target.value)}
                      />
                    </TdOferta>
                  </tr>
                ))}
                {/* Fila demanda */}
                <tr>
                  <TdLabel $demanda>Demanda</TdLabel>
                  {Array.from({ length: cols }, (_, j) => (
                    <TdDemanda key={j}>
                      <OfDemInput
                        type="number"
                        value={demand[j]}
                        onChange={e => setDemandJ(j, e.target.value)}
                      />
                    </TdDemanda>
                  ))}
                  <TdTotales>
                    <TotalLine $ok={balanceado}>Σ Oferta: <b>{totalOferta}</b></TotalLine>
                    <TotalLine $ok={balanceado}>Σ Demanda: <b>{totalDemanda}</b></TotalLine>
                  </TdTotales>
                </tr>
              </tbody>
            </MatrizTable>
          </TableWrapper>

          {!balanceado && totalOferta > 0 && totalDemanda > 0 && (
            <BalanceWarn>
              ⚠️ Oferta ({totalOferta}) ≠ Demanda ({totalDemanda}). Al resolver se añadirá un nodo ficticio automáticamente.
            </BalanceWarn>
          )}
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 2 — RESULTADO
        ══════════════════════════════════════════════════════════════════ */}
        {resultado && (
          <Section>
            <SectionTitle>📊 Resultado — {modo === "maximizar" ? "Maximizar" : "Minimizar"}</SectionTitle>

            <ResultGrid>
              <ResultCard $modo={modo}>
                <ResultLabel>{modo === "maximizar" ? "Beneficio Total" : "Costo Total"}</ResultLabel>
                <ResultValor $modo={modo}>{resultado.costoReal}</ResultValor>
              </ResultCard>

              <Asignaciones>
                {resultado.asignacionesReales.map((a, idx) => (
                  <AsignRow key={idx} $modo={modo}>
                    <OBadge>O{a.fila + 1}</OBadge>
                    <FiArrowRight style={{ color: modo === "maximizar" ? "#f59e0b" : "#10b981", flexShrink: 0 }} />
                    <DBadge>D{a.columna + 1}</DBadge>
                    <AsignDetail>
                      {a.cantidad} × {a.costo} = <AsignSub $modo={modo}>{a.subtotal}</AsignSub>
                    </AsignDetail>
                  </AsignRow>
                ))}
              </Asignaciones>
            </ResultGrid>

            {resultado.ficticio && (
              <FictBox>
                ⚖️ Se añadió un {resultado.ficticio.tipo === "columna" ? "Destino" : "Origen"} ficticio
                con {resultado.ficticio.tipo === "columna" ? "demanda" : "oferta"} = {resultado.ficticio.valor} (costo 0) para balancear.
              </FictBox>
            )}

            {/* Pasos */}
            <PasosToggle onClick={() => setMostrarPasos(p => !p)}>
              {mostrarPasos ? <FiChevronUp /> : <FiChevronDown />}
              {mostrarPasos ? "Ocultar pasos de resolución" : "Ver pasos de resolución"}
            </PasosToggle>

            {mostrarPasos && (
              <PasosList>
                {resultado.pasos.map((paso, idx) => (
                  <PasoCard key={idx}>
                    <PasoNum $modo={modo}>{idx + 1}</PasoNum>
                    <PasoBody>
                      <PasoTitle>{paso.titulo}</PasoTitle>
                      <PasoDesc>{paso.descripcion}</PasoDesc>
                      {paso.matriz && (
                        <PasoMatrizScroll>
                          <PasoTable>
                            <tbody>
                              {paso.matriz.map((fila, fi) => (
                                <tr key={fi}>
                                  {fila.map((val, fj) => {
                                    const isO = resultado.asignacionesReales.some(
                                      a => a.fila === fi && a.columna === fj
                                    );
                                    return (
                                      <PasoTd key={fj} $isOptimal={isO} $modo={modo}>
                                        {val > 0 ? val : val === 0 && isO ? "0" : "–"}
                                      </PasoTd>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </PasoTable>
                        </PasoMatrizScroll>
                      )}
                    </PasoBody>
                  </PasoCard>
                ))}
              </PasosList>
            )}
          </Section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 3 — CANVAS VISUAL (plus al final)
        ══════════════════════════════════════════════════════════════════ */}
        {canvasData && canvasData.nodos.length > 0 && (
          <Section>
            <GrafoHeader onClick={() => setMostrarGrafo(p => !p)}>
              <SectionTitle>🗺️ Vista de grafo (referencia visual)</SectionTitle>
              {mostrarGrafo ? <FiChevronUp /> : <FiChevronDown />}
            </GrafoHeader>
            {mostrarGrafo && (
              <CanvasCard
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                $isPanning={isPanning}
              >
                <CanvasInner $ox={offset.x} $oy={offset.y}>
                  <SvgLayer>
                    <defs>
                      <marker id="arr-nw" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <polygon points="0 0, 10 3, 0 6" fill={modo === "maximizar" ? "#f59e0b" : "#10b981"} />
                      </marker>
                      <marker id="arr-def" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                      </marker>
                    </defs>
                    <line x1={DIVIDER_X} y1={-2000} x2={DIVIDER_X} y2={2000}
                      stroke="#94a3b8" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
                    <text x={DIVIDER_X - 16} y={30} fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="end" opacity="0.6">ORÍGENES</text>
                    <text x={DIVIDER_X + 16} y={30} fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="start" opacity="0.6">DESTINOS</text>

                    {aristasCanvas.map((ar, idx) => (
                      <Arista
                        key={idx}
                        ar={ar}
                        nodos={canvasData.nodos}
                        existeContraria={existeAristaContraria(aristasCanvas, ar.from, ar.to)}
                        herramienta={1}
                        onAristaClick={() => {}}
                        customStroke={ar.isOptimal ? (modo === "maximizar" ? "#f59e0b" : "#10b981") : "#94a3b8"}
                        customStrokeWidth={ar.isOptimal ? 3 : 1}
                        customMarkerEnd={ar.isOptimal ? "url(#arr-nw)" : "url(#arr-def)"}
                      />
                    ))}
                  </SvgLayer>

                  {canvasData.nodos.map(node => (
                    <Nodo
                      key={node.id}
                      nodo={node}
                      onClick={() => {}}
                      seleccionado={false}
                      onDrag={() => {}}
                      herramienta={1}
                    />
                  ))}
                </CanvasInner>
                <CanvasHint>Arrastra para mover la vista • Las rutas resaltadas son la solución</CanvasHint>
              </CanvasCard>
            )}
          </Section>
        )}

      </MainScroll>
    </PageWrapper>
  );
}

// ── Styled Components ────────────────────────────────────────────────────────

const fadeIn = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}`;

const PageWrapper = styled.div`
  display: flex; flex-direction: column; height: 100vh;
  background-color: var(--bg-color); overflow: hidden;
`;

const Header = styled.div`
  display: flex; align-items: center; gap: 16px; padding: 10px 28px;
  background: var(--glass-bg); backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border); flex-shrink: 0; z-index: 10;
`;

const BackButton = styled.button`
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border);
  border-radius: 8px; padding: 7px 14px; color: var(--text-primary);
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.16); }
  svg { font-size: 19px; }
`;

const Title = styled.h1`font-size: 16px; font-weight: 800; color: var(--text-primary); margin: 0;`;

const HelpButton = styled.button`
  margin-left: auto;
  width: 38px; height: 38px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
  border: 1px solid rgba(96,165,250,0.4);
  background: rgba(96,165,250,0.14);
  color: #60a5fa; font-size: 19px;
  &:hover { color: #fff; background: #3b82f6; transform: translateY(-1px); }
`;

const HelpOverlay = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 18px;
  background: rgba(2,6,16,0.72); backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease both;
`;

const HelpModal = styled.div`
  width: min(640px, 100%); max-height: 85vh; overflow: auto;
  border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
  background: linear-gradient(180deg,#0c1322 0%,#111a2c 100%);
  box-shadow: 0 24px 60px rgba(0,0,0,0.55);
`;

const HelpHeader = styled.div`
  position: sticky; top: 0; display: flex; align-items: center;
  justify-content: space-between; gap: 12px; padding: 16px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(12,19,34,0.94);
  h2 {
    display: flex; align-items: center; gap: 8px; margin: 0;
    font-size: 16px; font-weight: 800; color: #fff;
    svg { color: #60a5fa; font-size: 20px; }
  }
`;

const CloseButton = styled.button`
  width: 34px; height: 34px; flex-shrink: 0; border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.2s; font-size: 18px;
  &:hover { color: #fff; background: rgba(244,63,94,0.22); border-color: rgba(244,63,94,0.4); }
`;

const HelpBody = styled.div`
  display: flex; flex-direction: column; gap: 14px; padding: 18px;
`;

const HelpStep = styled.div`
  display: flex; flex-direction: column; gap: 4px;
  strong { color: #fff; font-size: 14px; }
  p { margin: 0; color: rgba(255,255,255,0.65); font-size: 13px; line-height: 1.55; }
  code {
    padding: 1px 6px; border-radius: 5px; background: rgba(255,255,255,0.08);
    color: #93c5fd; font-size: 12px;
  }
  em { color: #fff; font-style: normal; font-weight: 700; }
`;

const MainScroll = styled.div`
  flex: 1; overflow-y: auto; padding: 28px 32px 48px;
  display: flex; flex-direction: column; gap: 32px;
  &::-webkit-scrollbar { width: 7px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
`;

const Section = styled.section`
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 18px;
  animation: ${fadeIn} 0.3s ease both;
`;

const SectionTitle = styled.h2`
  font-size: 15px; font-weight: 800; color: #fff; margin: 0;
  letter-spacing: 0.03em;
`;

// ── Controles ────────────────────────────────────────────────────────────────

const ControlBar = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  justify-content: space-between;
`;

const CtrlGroup = styled.div`display: flex; flex-wrap: wrap; gap: 8px; align-items: center;`;

const CtrlBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 8px; border: none;
  font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  ${p => p.$color === "blue"   && css`background:#3b82f6;color:#fff;&:hover{background:#2563eb;}`}
  ${p => p.$color === "rose"   && css`background:#f43f5e;color:#fff;&:hover{background:#e11d48;}`}
  ${p => p.$color === "violet" && css`background:#7c3aed;color:#fff;&:hover{background:#6d28d9;}`}
  ${p => p.$color === "gray"   && css`background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.15);&:hover{background:rgba(255,255,255,0.18);}`}
  svg { font-size: 14px; }
`;

const ModoBtn = styled.button`
  padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: all 0.2s;
  border: 1px solid ${p => p.$active
    ? (p.$color==="amber" ? "#f59e0b" : "#10b981")
    : "rgba(255,255,255,0.15)"};
  background: ${p => p.$active
    ? (p.$color==="amber" ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)")
    : "rgba(255,255,255,0.06)"};
  color: ${p => p.$active
    ? (p.$color==="amber" ? "#fcd34d" : "#6ee7b7")
    : "rgba(255,255,255,0.6)"};
`;

const SolveBtn = styled.button`
  display: flex; align-items: center; gap: 7px;
  padding: 8px 20px; border-radius: 8px; border: none;
  background: ${p => p.$modo === "maximizar"
    ? "linear-gradient(135deg,#f59e0b,#d97706)"
    : "linear-gradient(135deg,#10b981,#059669)"};
  color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s;
  box-shadow: ${p => p.$modo==="maximizar"
    ? "0 4px 12px rgba(245,158,11,0.35)"
    : "0 4px 12px rgba(16,185,129,0.35)"};
  &:hover { transform: translateY(-1px); }
  svg { font-size: 15px; }
`;

// ── Tabla ─────────────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow-x: auto; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;

const MatrizTable = styled.table`
  border-collapse: collapse; min-width: max-content; width: 100%;
`;

const ThCorner = styled.th`
  width: 110px; background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.06); padding: 12px;
`;

const Th = styled.th`
  padding: 10px 14px; font-size: 12px; font-weight: 700; color: #4ade80;
  background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap; letter-spacing: 0.04em;
`;

const ThOferta = styled(Th)`color: #93c5fd;`;

const TdLabel = styled.td`
  padding: 8px 14px; font-size: 12px; font-weight: 700;
  color: ${p => p.$demanda ? "#fbbf24" : "#60a5fa"};
  background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
`;

const TdCell = styled.td`
  padding: 4px; border: 1px solid rgba(255,255,255,0.06); position: relative;
  background: ${p => p.$isOptimal
    ? (p.$modo==="maximizar" ? "rgba(245,158,11,0.18)" : "rgba(16,185,129,0.18)")
    : "transparent"};
  transition: background 0.25s;
`;

const CellInput = styled.input`
  width: 80px; padding: 8px; text-align: center;
  background: ${p => p.$isOptimal
    ? (p.$modo==="maximizar" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)")
    : "rgba(255,255,255,0.06)"};
  border: 1px solid ${p => p.$isOptimal
    ? (p.$modo==="maximizar" ? "#f59e0b" : "#10b981")
    : "rgba(255,255,255,0.12)"};
  border-radius: 6px; color: #fff; font-size: 14px; font-weight: 700;
  outline: none; transition: all 0.2s;
  &:focus { border-color: #60a5fa; background: rgba(96,165,250,0.12); }
`;

const CellBadge = styled.div`
  position: absolute; top: 2px; right: 3px;
  font-size: 9px; font-weight: 900; padding: 1px 4px; border-radius: 4px;
  background: ${p => p.$modo==="maximizar" ? "#f59e0b" : "#10b981"};
  color: #000; line-height: 1.4;
`;

const TdOferta = styled.td`
  padding: 4px 6px; border: 1px solid rgba(255,255,255,0.06);
  background: rgba(96,165,250,0.06);
`;

const TdDemanda = styled.td`
  padding: 4px 6px; border: 1px solid rgba(255,255,255,0.06);
  background: rgba(251,191,36,0.06);
`;

const TdTotales = styled.td`
  padding: 8px 12px; border: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.3);
`;

const OfDemInput = styled.input`
  width: 80px; padding: 7px; text-align: center;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px; color: #fff; font-size: 13px; font-weight: 700;
  outline: none;
  &:focus { border-color: #60a5fa; }
`;

const TotalLine = styled.div`
  font-size: 12px; font-weight: 600;
  color: ${p => p.$ok ? "#4ade80" : "#fb923c"};
  b { font-weight: 900; }
  & + & { margin-top: 3px; }
`;

const BalanceWarn = styled.div`
  padding: 10px 14px; border-radius: 8px; font-size: 13px;
  background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.3);
  color: #fdba74;
`;

// ── Resultado ─────────────────────────────────────────────────────────────────

const ResultGrid = styled.div`
  display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: start;
  @media(max-width:700px){ grid-template-columns: 1fr; }
`;

const ResultCard = styled.div`
  text-align: center; padding: 20px 28px; border-radius: 14px; min-width: 160px;
  background: ${p => p.$modo==="maximizar"
    ? "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(217,119,6,0.1))"
    : "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(5,150,105,0.1))"};
  border: 1px solid ${p => p.$modo==="maximizar" ? "rgba(245,158,11,0.35)" : "rgba(16,185,129,0.35)"};
`;

const ResultLabel = styled.div`
  font-size: 11px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.12em; color: rgba(255,255,255,0.55); margin-bottom: 6px;
`;

const ResultValor = styled.div`
  font-size: 52px; font-weight: 900; line-height: 1;
  background: ${p => p.$modo==="maximizar"
    ? "linear-gradient(135deg,#fbbf24,#f97316)"
    : "linear-gradient(135deg,#4ade80,#34d399)"};
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
`;

const Asignaciones = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const AsignRow = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 10px 13px;
  background: rgba(0,0,0,0.25); border-radius: 8px;
  border: 1px solid ${p => p.$modo==="maximizar" ? "rgba(245,158,11,0.18)" : "rgba(16,185,129,0.18)"};
  animation: ${fadeIn} 0.3s ease both;
`;

const OBadge = styled.span`
  padding: 3px 9px; border-radius: 5px; font-weight: 800; font-size: 12px;
  background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.4);
`;

const DBadge = styled.span`
  padding: 3px 9px; border-radius: 5px; font-weight: 800; font-size: 12px;
  background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4);
`;

const AsignDetail = styled.span`
  margin-left: auto; font-size: 13px; color: rgba(255,255,255,0.6); white-space: nowrap;
  display: flex; align-items: center; gap: 4px;
`;

const AsignSub = styled.b`
  font-weight: 900; font-size: 14px;
  color: ${p => p.$modo==="maximizar" ? "#fcd34d" : "#6ee7b7"};
`;

const FictBox = styled.div`
  padding: 10px 14px; border-radius: 8px; font-size: 13px;
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #fcd34d;
`;

const PasosToggle = styled.button`
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; color: #fff; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: all 0.2s; align-self: flex-start;
  &:hover { background: rgba(255,255,255,0.1); }
`;

const PasosList = styled.div`display: flex; flex-direction: column; gap: 10px;`;

const PasoCard = styled.div`
  display: flex; gap: 12px; padding: 13px;
  background: rgba(0,0,0,0.25); border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);
`;

const PasoNum = styled.div`
  width: 26px; height: 26px; min-width: 26px; border-radius: 7px;
  background: ${p => p.$modo==="maximizar" ? "#f59e0b" : "#10b981"};
  color: #000; display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 12px;
`;

const PasoBody = styled.div`flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px;`;
const PasoTitle = styled.h4`font-size: 13px; font-weight: 800; color: #fff; margin: 0;`;
const PasoDesc  = styled.p`font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.5; margin: 0;`;
const PasoMatrizScroll = styled.div`overflow-x: auto; margin-top: 8px;`;

const PasoTable = styled.table`border-collapse: collapse; min-width: max-content;`;

const PasoTd = styled.td`
  padding: 6px 10px; text-align: center; font-size: 13px; font-weight: 700;
  border: 1px solid rgba(255,255,255,0.08);
  background: ${p => p.$isOptimal
    ? (p.$modo==="maximizar" ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)")
    : "rgba(255,255,255,0.04)"};
  color: ${p => p.$isOptimal ? "#fff" : "rgba(255,255,255,0.55)"};
  border-color: ${p => p.$isOptimal
    ? (p.$modo==="maximizar" ? "#f59e0b" : "#10b981")
    : "rgba(255,255,255,0.08)"};
`;

// ── Canvas visual ─────────────────────────────────────────────────────────────

const CanvasCard = styled.div`
  position: relative; height: 400px; border-radius: 12px; overflow: hidden;
  background: #f8fafc;
  background-image: linear-gradient(to right,#e2e8f0 1px,transparent 1px),
    linear-gradient(to bottom,#e2e8f0 1px,transparent 1px);
  background-size: 36px 36px;
  border: 2px solid #334155;
  cursor: ${p => p.$isPanning ? "grabbing" : "grab"};
`;

const CanvasInner = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  transform: translate(${p=>p.$ox}px, ${p=>p.$oy}px); transform-origin: 0 0;
`;

const SvgLayer = styled.svg`
  width: 100%; height: 100%; position: absolute; top:0; left:0;
  overflow: visible; pointer-events: none;
`;

const CanvasHint = styled.div`
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  background: rgba(15,23,42,0.75); color: rgba(255,255,255,0.7);
  padding: 5px 14px; border-radius: 20px; font-size: 11px;
  pointer-events: none; white-space: nowrap;
  backdrop-filter: blur(8px);
`;

const GrafoHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; padding: 4px 0;
  &:hover { opacity: 0.8; }
  svg { font-size: 20px; color: #fff; }
`;
