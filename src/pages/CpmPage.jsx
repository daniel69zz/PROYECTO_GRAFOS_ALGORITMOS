import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Nodo } from "../components/Nodo";
import { Arista } from "../components/Arista";
import { Notification } from "../components/Notification";
import { CpmControls } from "../components/CpmControls";
import { TbArrowBackUp } from "react-icons/tb"; // Usa icon o boton estandar

const clearTEOnNodes = (nodos, id) =>
  nodos.map((n) =>
    n.id === id ? { ...n, cpm: { ...(n.cpm ?? {}), bl: "" } } : n,
  );

const clearTLOnNodes = (nodos, id) =>
  nodos.map((n) =>
    n.id === id ? { ...n, cpm: { ...(n.cpm ?? {}), br: "" } } : n,
  );

const buildReachableFromOrigin = (nodos, aristas, originId) => {
  const out = new Map();
  for (const n of nodos) out.set(n.id, []);
  for (const e of aristas) {
    if (out.has(e.from)) out.get(e.from).push(e);
  }

  const reachable = new Set();
  const q = [originId];
  reachable.add(originId);

  while (q.length) {
    const u = q.shift();
    for (const e of out.get(u) ?? []) {
      const v = e.to;
      if (!reachable.has(v)) {
        reachable.add(v);
        q.push(v);
      }
    }
  }
  return reachable;
};

const buildTopoForReachable = (nodos, aristas, reachableSet) => {
  const ids = nodos.map((n) => n.id).filter((id) => reachableSet.has(id));

  const indeg = new Map();
  const inEdges = new Map();
  const outEdges = new Map();

  for (const id of ids) {
    indeg.set(id, 0);
    inEdges.set(id, []);
    outEdges.set(id, []);
  }

  for (const e of aristas) {
    if (!reachableSet.has(e.from) || !reachableSet.has(e.to)) continue;
    outEdges.get(e.from).push(e);
    inEdges.get(e.to).push(e);
    indeg.set(e.to, indeg.get(e.to) + 1);
  }

  const queue = [];
  for (const id of ids) if (indeg.get(id) === 0) queue.push(id);

  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const e of outEdges.get(u)) {
      const v = e.to;
      indeg.set(v, indeg.get(v) - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }

  const hasCycle = order.length !== ids.length;
  return { order, hasCycle, inEdges, outEdges };
};

const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

export function CpmPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load the graph from location state
  // Keep a clean snapshot (no CPM data) to return to the graph editor
  const originalNodos = (location.state?.nodos ?? []).map(({ cpm, ...rest }) => rest);
  const originalAristas = location.state?.aristas ?? [];

  const [nodos, setNodos] = useState(location.state?.nodos || []);
  const [aristas, setAristas] = useState(location.state?.aristas || []);

  const [cpmPhase, setCpmPhase] = useState("forward");
  const [cpmForwardOrder, setCpmForwardOrder] = useState(null);
  const [cpmForwardIndex, setCpmForwardIndex] = useState(0);

  const [cpmBackwardOrder, setCpmBackwardOrder] = useState(null);
  const [cpmBackwardIndex, setCpmBackwardIndex] = useState(0);

  const [showConfigModal, setShowConfigModal] = useState(true);
  const [cpmMode, setCpmMode] = useState("maximizar"); // "maximizar" | "minimizar"

  const [cpmOrigenId, setCpmOrigenId] = useState(null);
  const [cpmDestinoId, setCpmDestinoId] = useState(null);
  const [cpmStep, setCpmStep] = useState(0);

  const [cpmPickTarget, setCpmPickTarget] = useState("origen");

  const [notification, setNotification] = useState(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Si no hay nodos, o alguien entró por URL directo sin `state`
    if (!location.state?.nodos || location.state.nodos.length === 0) {
      showNotification("No se recibió ningún grafo para aplicar CPM.", "error");
    }

    // Al entrar, limpiar los TEs/TLs pasados por si venian calculados
    if (location.state?.nodos) {
      setNodos((prev) =>
        prev.map((n) => ({
          ...n,
          cpm: { ...(n.cpm ?? {}), bl: "", br: "" },
        })),
      );
    }
  }, [location.state]);

  const getLabelById = (id) => nodos.find((n) => n.id === id)?.label ?? "";
  const cpmOrigenLabel = cpmOrigenId != null ? getLabelById(cpmOrigenId) : "";
  const cpmDestinoLabel =
    cpmDestinoId != null ? getLabelById(cpmDestinoId) : "";

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const getTE = (node) => {
    const val = node?.cpm?.bl;
    if (val === "" || val == null) return null;
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  };

  const getTL = (node) => {
    const val = node?.cpm?.br;
    if (val === "" || val == null) return null;
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  };

  const setTEOnNodes = (nodos, id, te) =>
    nodos.map((n) =>
      n.id === id ? { ...n, cpm: { ...(n.cpm ?? {}), bl: te } } : n,
    );

  const setTLOnNodes = (nodos, id, tl) =>
    nodos.map((n) =>
      n.id === id ? { ...n, cpm: { ...(n.cpm ?? {}), br: tl } } : n,
    );

  const cpmNextForwardOneNode = () => {
    const reachable = buildReachableFromOrigin(nodos, aristas, cpmOrigenId);
    const topo = buildTopoForReachable(nodos, aristas, reachable);

    if (topo.hasCycle) {
      showNotification(
        "Hay un ciclo en el subgrafo alcanzable. CPM requiere DAG.",
        "error",
      );
      return;
    }

    const order = cpmForwardOrder ?? topo.order;
    const inEdges = topo.inEdges;

    if (!cpmForwardOrder) {
      setCpmForwardOrder(order);
      setCpmForwardIndex(0);
    }

    if (cpmForwardIndex >= order.length) {
      setCpmPhase("backward");
      setCpmBackwardOrder([...order].reverse());
      setCpmBackwardIndex(0);
      showNotification("Forward terminado. Iniciando Backward.", "info");
      return;
    }

    const v = order[cpmForwardIndex];
    const vNode = nodos.find((n) => n.id === v);

    if (getTE(vNode) != null) {
      setCpmForwardIndex((i) => i + 1);
      return;
    }

    if (v === cpmOrigenId) {
      setNodos((prev) => setTEOnNodes(prev, v, 0));
      setCpmForwardIndex((i) => i + 1);
      showNotification("Forward: Origen resuelto (TE=0).", "success");
      return;
    }

    const preds = inEdges.get(v) ?? [];
    for (const e of preds) {
      const uNode = nodos.find((n) => n.id === e.from);
      if (getTE(uNode) == null) {
        showNotification(
          `No se puede resolver ${getLabelById(v)} aún. Falta TE de ${getLabelById(e.from)}.`,
          "warning",
        );
        return;
      }
    }

    let best = null;
    for (const e of preds) {
      const uNode = nodos.find((n) => n.id === e.from);
      const cand = (getTE(uNode) ?? 0) + (Number(e.weight) || 0);
      best =
        best == null
          ? cand
          : cpmMode === "maximizar"
            ? Math.max(best, cand)
            : Math.min(best, cand);
    }

    setNodos((prev) => setTEOnNodes(prev, v, best));
    setCpmForwardIndex((i) => i + 1);

    if (v === cpmDestinoId) {
      setCpmPhase("backward");
      setCpmBackwardOrder([...order].reverse());
      setCpmBackwardIndex(0);
      showNotification(
        "Forward: destino resuelto. Iniciando Backward.",
        "success",
      );
    }
  };

  const cpmNextBackwardOneNode = () => {
    const reachable = buildReachableFromOrigin(nodos, aristas, cpmOrigenId);
    const topo = buildTopoForReachable(nodos, aristas, reachable);

    if (topo.hasCycle) {
      showNotification(
        "Hay un ciclo en el subgrafo alcanzable. CPM requiere DAG.",
        "error",
      );
      return;
    }

    const order = cpmForwardOrder ?? topo.order;
    const outEdges = topo.outEdges;

    const backOrder = cpmBackwardOrder ?? [...order].reverse();
    if (!cpmBackwardOrder) {
      setCpmBackwardOrder(backOrder);
      setCpmBackwardIndex(0);
    }

    if (cpmBackwardIndex >= backOrder.length) {
      showNotification(
        "Backward terminado (no hay más nodos por resolver).",
        "success",
      );
      return;
    }

    const u = backOrder[cpmBackwardIndex];
    const uNode = nodos.find((n) => n.id === u);

    if (getTL(uNode) != null) {
      setCpmBackwardIndex((i) => i + 1);
      return;
    }

    if (u === cpmDestinoId) {
      const teDest = getTE(nodos.find((n) => n.id === cpmDestinoId));
      if (teDest == null) {
        showNotification(
          "Primero resuelve el forward hasta el destino.",
          "warning",
        );
        return;
      }
      setNodos((prev) => setTLOnNodes(prev, u, teDest));
      setCpmBackwardIndex((i) => i + 1);
      showNotification(
        "Backward: Destino resuelto (TL = TE(destino)).",
        "success",
      );
      return;
    }

    const outs = outEdges.get(u) ?? [];

    let best = null;
    for (const e of outs) {
      const vNode = nodos.find((n) => n.id === e.to);
      const tlV = getTL(vNode);
      if (tlV == null) continue;
      const cand = tlV - (Number(e.weight) || 0);
      best =
        best == null
          ? cand
          : cpmMode === "maximizar"
            ? Math.min(best, cand)
            : Math.max(best, cand);
    }

    if (best == null) {
      showNotification(
        `No se puede resolver TL(${getLabelById(u)}) aún (no hay sucesores con TL).`,
        "warning",
      );
      return;
    }

    setNodos((prev) => setTLOnNodes(prev, u, best));
    setCpmBackwardIndex((i) => i + 1);
  };

  const handleCpmPickNode = (id) => {
    if (cpmOrigenId == null) {
      setCpmOrigenId(id);
      return;
    }
    if (cpmDestinoId == null) {
      setCpmDestinoId(id);
      return;
    }
    setCpmOrigenId(id);
    setCpmDestinoId(null);
  };

  const cpmPrev = () => {
    if (cpmOrigenId == null || cpmDestinoId == null) {
      showNotification("No hay CPM iniciado para retroceder.", "warning");
      return;
    }

    if (cpmPhase === "backward") {
      if (cpmBackwardOrder && cpmBackwardIndex > 0) {
        const lastResolvedId = cpmBackwardOrder[cpmBackwardIndex - 1];
        setNodos((prev) => clearTLOnNodes(prev, lastResolvedId));
        setCpmBackwardIndex((i) => i - 1);
        return;
      }
      setCpmPhase("forward");
    }

    if (cpmForwardOrder && cpmForwardIndex > 0) {
      const lastResolvedId = cpmForwardOrder[cpmForwardIndex - 1];
      setNodos((prev) => clearTEOnNodes(prev, lastResolvedId));
      setCpmForwardIndex((i) => i - 1);
      return;
    }

    showNotification(
      "Ya estás en el inicio (no hay más pasos por deshacer).",
      "info",
    );
  };

  const cpmNext = () => {
    if (cpmOrigenId == null || cpmDestinoId == null) {
      showNotification(
        "Selecciona primero un nodo origen y un nodo final.",
        "warning",
      );
      return;
    }

    if (cpmPhase === "forward") {
      cpmNextForwardOneNode();
    } else {
      cpmNextBackwardOneNode();
    }
  };

  const cpmFinish = () => {
    if (cpmOrigenId == null || cpmDestinoId == null) {
      showNotification(
        "Selecciona primero un nodo origen y un nodo final.",
        "warning",
      );
      return;
    }

    const reachable = buildReachableFromOrigin(nodos, aristas, cpmOrigenId);
    const topo = buildTopoForReachable(nodos, aristas, reachable);

    if (topo.hasCycle) {
      showNotification(
        "Hay un ciclo en el subgrafo alcanzable. CPM requiere DAG.",
        "error",
      );
      return;
    }

    const { order, inEdges, outEdges } = topo;

    const TE = new Map();
    for (const n of nodos) TE.set(n.id, null);
    TE.set(cpmOrigenId, 0);

    for (const v of order) {
      if (v === cpmOrigenId) continue;

      let best = null;
      for (const e of inEdges.get(v) ?? []) {
        const teU = TE.get(e.from);
        if (teU == null) continue;
        const cand = teU + (Number(e.weight) || 0);
        best =
          best == null
            ? cand
            : cpmMode === "maximizar"
              ? Math.max(best, cand)
              : Math.min(best, cand);
      }
      TE.set(v, best);
    }

    const teDest = TE.get(cpmDestinoId);
    if (teDest == null) {
      showNotification(
        "No existe ruta alcanzable desde el origen hasta el destino.",
        "error",
      );
      return;
    }

    const TL = new Map();
    for (const n of nodos) TL.set(n.id, null);
    TL.set(cpmDestinoId, teDest);

    const rev = [...order].reverse();
    for (const u of rev) {
      if (u === cpmDestinoId) continue;

      let best = null;
      for (const e of outEdges.get(u) ?? []) {
        const tlV = TL.get(e.to);
        if (tlV == null) continue;
        const cand = tlV - (Number(e.weight) || 0);
        best =
          best == null
            ? cand
            : cpmMode === "maximizar"
              ? Math.min(best, cand)
              : Math.max(best, cand);
      }
      TL.set(u, best);
    }

    setNodos((prev) =>
      prev.map((n) => ({
        ...n,
        cpm: {
          ...(n.cpm ?? {}),
          bl: TE.get(n.id) ?? "",
          br: TL.get(n.id) ?? "",
        },
      })),
    );

    setCpmForwardOrder(order);
    setCpmForwardIndex(order.length);

    setCpmBackwardOrder([...order].reverse());
    setCpmBackwardIndex([...order].reverse().length);

    setCpmPhase("backward");
    showNotification(
      "CPM completo: Forward (TE) + Backward (TL) calculados.",
      "success",
    );
  };

  const disabledPrev =
    (cpmBackwardIndex ?? 0) === 0 && (cpmForwardIndex ?? 0) === 0;

  // Visual/Canvas Interactions
  const handleNodeClick = (id, e) => {
    // Si el modal está abierto, ignorar clicks en el canvas manuales (opcional).
    // Lo dejamos para que si lo cierran, sigan pudiendo.
    handleCpmPickNode(id);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("[data-nodo]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setOffset({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  return (
    <PageWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <Header>
        <BackButton onClick={() => navigate("/graph", { state: { nodos: originalNodos, aristas: originalAristas } })}>
          <TbArrowBackUp /> Volver al Grafo
        </BackButton>
        <Title>Aplicar CPM</Title>
      </Header>

      <ContentWrapper>
        <CanvasArea
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          $isPanning={isPanning}
        >
          <Canvas $offsetX={offset.x} $offsetY={offset.y}>
            <SvgCanvas>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="black" />
                </marker>
              </defs>

              {aristas.map((ar, index) => (
                <Arista
                  key={index}
                  ar={ar}
                  nodos={nodos}
                  existeContraria={existeAristaContraria(
                    aristas,
                    ar.from,
                    ar.to,
                  )}
                  herramienta={5} // Herramienta 5 siempre que representa al CPM
                  onAristaClick={() => {}} // no editable
                />
              ))}
            </SvgCanvas>

            {nodos.map((node) => (
              <Nodo
                key={node.id}
                nodo={node}
                onClick={(e) => handleNodeClick(node.id, e)}
                seleccionado={
                  node.id === cpmOrigenId || node.id === cpmDestinoId
                }
                onDrag={() => {}} // no se mueven
                herramienta={5} // CPM read-only node style
              />
            ))}
          </Canvas>

          {showConfigModal && (
            <ModalOverlay>
              <ModalContent>
                <h2>Configuración CPM</h2>

                {nodos.length === 0 ? (
                  <>
                    <p style={{ color: "#ff8a80", fontSize: "0.95rem", lineHeight: "1.5" }}>
                      No se encontró ningún grafo válido. Por favor, vuelve al editor y asegúrate de tener nodos creados antes de aplicar CPM.
                    </p>
                    <ModalActions style={{ justifyContent: "flex-end" }}>
                      <Button
                        onClick={() => navigate("/graph", { state: { nodos: originalNodos, aristas: originalAristas } })}
                        style={{ background: "#4caf50" }}
                      >
                        Cancelar
                      </Button>
                    </ModalActions>
                  </>
                ) : (
                  <>
                    <FormGroup>
                      <label>Nodo Origen</label>
                      <Select
                        value={cpmOrigenId || ""}
                        onChange={(e) => setCpmOrigenId(Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Seleccione un origen
                        </option>
                        {nodos.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <label>Nodo Destino</label>
                      <Select
                        value={cpmDestinoId || ""}
                        onChange={(e) => setCpmDestinoId(Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Seleccione un destino
                        </option>
                        {nodos.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <label>Objetivo</label>
                      <RadioGroup>
                        <label>
                          <input
                            type="radio"
                            name="cpmMode"
                            value="maximizar"
                            checked={cpmMode === "maximizar"}
                            onChange={() => setCpmMode("maximizar")}
                          />
                          Maximizar (Ruta Crítica)
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="cpmMode"
                            value="minimizar"
                            checked={cpmMode === "minimizar"}
                            onChange={() => setCpmMode("minimizar")}
                          />
                          Minimizar (Ruta Más Corta)
                        </label>
                      </RadioGroup>
                    </FormGroup>

                    <ModalActions style={{ justifyContent: "space-between" }}>
                      <Button
                        onClick={() => navigate("/graph", { state: { nodos: originalNodos, aristas: originalAristas } })}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#fff",
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          if (cpmOrigenId && cpmDestinoId) {
                            setShowConfigModal(false);
                          } else {
                            showNotification(
                              "Selecciona origen y destino",
                              "warning",
                            );
                          }
                        }}
                      >
                        Comenzar
                      </Button>
                    </ModalActions>
                  </>
                )}
              </ModalContent>
            </ModalOverlay>
          )}
        </CanvasArea>

        <CpmControls
          disabledPrev={disabledPrev}
          origen={cpmOrigenLabel}
          destino={cpmDestinoLabel}
          step={cpmStep}
          pickTarget={cpmPickTarget}
          onClear={() => {
            setNodos((prev) =>
              prev.map((n) => ({
                ...n,
                cpm: { ...(n.cpm ?? {}), bl: "", br: "" },
              })),
            );
            setCpmOrigenId(null);
            setCpmDestinoId(null);
            setCpmPhase("forward");
            setCpmStep(0);
            setCpmPickTarget("origen");
            setCpmForwardOrder(null);
            setCpmForwardIndex(0);
            setCpmBackwardOrder(null);
            setCpmBackwardIndex(0);
            setShowConfigModal(true); // Vuelve a abrir el modal
          }}
          onPrev={cpmPrev}
          onNext={cpmNext}
          onFinish={cpmFinish}
          disabledNext={cpmOrigenId == null || cpmDestinoId == null}
          disabledFinish={cpmOrigenId == null || cpmDestinoId == null}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 24px;
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 8px 16px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    font-size: 20px;
  }
`;

const Title = styled.h1`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 8px;
  }
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #f5f5f5;
  background-image:
    linear-gradient(to right, #ccc 1px, transparent 1px),
    linear-gradient(to bottom, #ccc 1px, transparent 1px);
  background-size: 40px 40px;
  overflow: hidden;
  cursor: ${({ $isPanning }) => ($isPanning ? "grabbing" : "default")};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(
    ${({ $offsetX }) => $offsetX}px,
    ${({ $offsetY }) => $offsetY}px
  );
`;

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: inherit;
`;

const ModalContent = styled.div`
  background: var(--glass-bg, rgba(20, 25, 30, 0.85));
  backdrop-filter: var(--glass-blur, blur(16px));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  padding: 24px;
  border-radius: 16px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: #fff;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4fc3f7;
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: #1a1a1a;
    color: #fff;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.95rem;
    color: #fff;
    cursor: pointer;
    font-weight: normal;

    input[type="radio"] {
      width: 18px;
      height: 18px;
      accent-color: #4fc3f7;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button`
  background: var(--accent-color, #4fc3f7);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-hover, #2bb4f6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
