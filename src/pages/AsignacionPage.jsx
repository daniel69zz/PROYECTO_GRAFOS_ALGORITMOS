import { useState, useRef, useCallback, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { GraphToolbar } from "../components/GraphToolbar";
import { Nodo } from "../components/Nodo";
import { Arista } from "../components/Arista";
import { EditMenu } from "../components/EditMenu";
import { Notification } from "../components/Notification";
import { ExportModal } from "../components/ExportModal";
import { exportar_grafo, importar_grafo } from "../utils/exp_imp_grafo";
import { resolverAsignacion, padMatrizCuadrada } from "../utils/hungaro";
import {
  FiPlay, FiChevronDown, FiChevronUp, FiArrowRight, FiGrid
} from "react-icons/fi";
import { TbArrowBackUp } from "react-icons/tb";

const DIVIDER_X = 500; // Línea divisoria visual y lógica (izquierda=Origen, derecha=Destino)

const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

const calcularPosicionMenu = (nodoX, nodoY, offsetX, offsetY, tipo = "nodo") => {
  const menuWidth = 240;
  const menuHeight = tipo === "nodo" ? 320 : 220;
  const padding = 16;
  const nodoRadius = 40;

  const nodoViewportX = nodoX + offsetX;
  const nodoViewportY = nodoY + offsetY;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let menuX = nodoViewportX + nodoRadius + 10;
  let menuY = nodoViewportY - menuHeight / 2;

  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = nodoViewportX - nodoRadius - menuWidth - 10;
  }
  if (menuX < padding) {
    menuX = padding;
  }
  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = viewportWidth - menuWidth - padding;
  }

  if (menuY < padding) {
    menuY = padding;
  }
  if (menuY + menuHeight + padding > viewportHeight) {
    menuY = viewportHeight - menuHeight - padding;
  }

  return { x: menuX, y: menuY };
};

const calcularPosicionMenuArista = (clickX, clickY, tipo = "arista") => {
  const menuWidth = 240;
  const menuHeight = 220;
  const padding = 16;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let menuX = clickX + 20;
  let menuY = clickY - menuHeight / 2;

  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = clickX - menuWidth - 20;
  }
  if (menuX < padding) {
    menuX = padding;
  }
  if (menuY < padding) {
    menuY = padding;
  }
  if (menuY + menuHeight + padding > viewportHeight) {
    menuY = viewportHeight - menuHeight - padding;
  }

  return { x: menuX, y: menuY };
};

export function AsignacionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados del Grafo (independientes de la página principal)
  const [nodos, setNodos] = useState(() => location.state?.nodos || []);
  const [aristas, setAristas] = useState(() => location.state?.aristas || []);
  const [nodo_seleccionado, setNodo_seleccionado] = useState(null);

  // Snapshot original para volver
  const originalNodos = (location.state?.nodos ?? []).map(
    ({ cpm, ...rest }) => rest,
  );
  const originalAristas = location.state?.aristas ?? [];
  
  // Toolbar states
  const [herramienta, setHerramienta] = useState(1); // 1: Mover, 2: Editar, 3: Eliminar
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const nextId = useRef(Math.max(0, ...nodos.map(n => n.id)) + 1);

  // Conexión (Pesos)
  const [weight_input, setWeight_input] = useState(null);
  const [weight_value, setWeight_value] = useState("1");
  const inputRef = useRef(null);

  // Panning
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  // UI
  const [editMenu, setEditMenu] = useState(null);
  const [notification, setNotification] = useState(null);

  // Resolución
  const [modo, setModo] = useState("minimizar");
  const [resultado, setResultado] = useState(null);
  const [mostrarPasos, setMostrarPasos] = useState(false);
  const [infoPadding, setInfoPadding] = useState(null);

  // Navegación de herramientas (4,5,6)
  const tieneAristasNoDirigidas = aristas.some((ar) => ar.tipo === "no_dirigida");
  
  useEffect(() => {
    // Si desde el toolbar seleccionan otra herramienta especial, regresamos a graph
    if (herramienta === 4 || herramienta === 5) {
      if (herramienta === 4 && tieneAristasNoDirigidas) {
        showNotification("No se puede mostrar la matriz para grafos con aristas no dirigidas.", "warning");
        setHerramienta(1);
        return;
      }
      navigate("/graph", { state: { nodos, aristas } });
    }
  }, [herramienta, navigate, nodos, aristas, tieneAristasNoDirigidas]);

  const showNotification = (message, type = "info") => setNotification({ message, type });

  // ---- EXPORT / IMPORT ----
  const [exportModal, setExportModal] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const fileInputRef = useRef(null);

  const handleExportar = () => {
    const nombreSugerido = `asignacion_${new Date().toLocaleDateString().replace(/\//g, "-")}`;
    setSuggestedName(nombreSugerido);
    setExportModal(true);
  };

  const confirmExport = (nombreArchivo) => {
    try {
      const nombreFinal = nombreArchivo.trim() || suggestedName;
      exportar_grafo(nodos, aristas, nextId.current, nombreFinal);
      showNotification("Grafo exportado correctamente", "success");
      setExportModal(false);
    } catch (e) {
      console.error("Error al exportar:", e);
      showNotification(`Error al exportar el grafo:\n${e.message}`, "error");
    }
  };

  const handleImportar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const grafo_data = await importar_grafo(file);
      setNodos(grafo_data.nodos);
      setAristas(grafo_data.aristas);
      nextId.current = grafo_data.nextId;
      setNodo_seleccionado(null);
      setWeight_input(null);
      setWeight_value("1");
      setEditMenu(null);
      setOffset({ x: 0, y: 0 });
      setResultado(null);

      showNotification("Grafo importado correctamente", "success");
    } catch (e) {
      console.error("Error al importar:", e);
      showNotification(`Grafo NO IMPORTADO\n${e.message}`, "error");
    }
    event.target.value = "";
  };

  // ---- CREACIÓN Y MANEJO DE NODOS ----
  const handleDoubleClick = (e) => {
    if (weight_input || editMenu) return;
    if (herramienta !== 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    const id = nextId.current++;
    const isOrigen = x < DIVIDER_X;
    
    setNodos((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        label: isOrigen ? `Origen ${id}` : `Destino ${id}`,
        color: isOrigen ? "#4fc3f7" : "#4ade80",
      },
    ]);
    setResultado(null);
  };

  const handleNodeClick = (id, e) => {
    if (weight_input) return;

    if (herramienta === 2) {
      const nodo = nodos.find((n) => n.id === id);
      const posicionSegura = calcularPosicionMenu(nodo.x, nodo.y, offset.x, offset.y, "nodo");
      setEditMenu({ tipo: "nodo", datos: nodo, posicion: posicionSegura });
      return;
    }

    if (herramienta === 3) {
      setNodos((prev) => prev.filter((n) => n.id !== id));
      setAristas((prev) => prev.filter((ar) => ar.from !== id && ar.to !== id));
      setResultado(null);
      return;
    }

    if (nodo_seleccionado === null) {
      setNodo_seleccionado(id);
    } else {
      const yaExiste = aristas.some((ar) => ar.from === nodo_seleccionado && ar.to === id);
      if (yaExiste) {
        setNodo_seleccionado(null);
        return;
      }

      const nodoA = nodos.find((n) => n.id === nodo_seleccionado);
      const nodoB = nodos.find((n) => n.id === id);

      // Prevenir conexión en la misma columna (O->O o D->D)
      if ((nodoA.x < DIVIDER_X && nodoB.x < DIVIDER_X) || (nodoA.x >= DIVIDER_X && nodoB.x >= DIVIDER_X)) {
        showNotification("Solo puedes conectar Orígenes (izquierda) con Destinos (derecha).", "warning");
        setNodo_seleccionado(null);
        return;
      }

      const midX = (nodoA.x + nodoB.x) / 2;
      const midY = (nodoA.y + nodoB.y) / 2;

      setWeight_input({ from: nodo_seleccionado, to: id, x: midX, y: midY });
      setWeight_value("1");
      setNodo_seleccionado(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleAristaClick = (arista, posicion) => {
    if (herramienta === 3) {
      setAristas((prev) => prev.filter((ar) => !(ar.from === arista.from && ar.to === arista.to)));
      setResultado(null);
      return;
    }
    if (herramienta === 2) {
      const posicionSegura = calcularPosicionMenuArista(posicion.x, posicion.y, "arista");
      setEditMenu({ tipo: "arista", datos: arista, posicion: posicionSegura });
    }
  };

  const handleGuardarEdit = (datoActualizado) => {
    if (editMenu.tipo === "nodo") {
      setNodos((prev) => prev.map((n) => (n.id === datoActualizado.id ? datoActualizado : n)));
    } else {
      setAristas((prev) =>
        prev.map((ar) =>
          ar.from === datoActualizado.from && ar.to === datoActualizado.to ? datoActualizado : ar
        )
      );
      setResultado(null);
    }
    setEditMenu(null);
  };

  const handleClear = () => {
    setNodos([]);
    setAristas([]);
    setNodo_seleccionado(null);
    setResultado(null);
  };

  const confirmarPeso = () => {
    const peso = parseFloat(weight_value);
    const pesoFinal = isNaN(peso) || peso < 0 ? 1 : peso;

    if (weight_value.trim() !== "") {
      setAristas((prev) => [...prev, { from: weight_input.from, to: weight_input.to, weight: pesoFinal, tipo: "dirigida" }]);
    }
    setWeight_input(null);
    setWeight_value("1");
    setResultado(null);
  };
  
  const cancelarPeso = () => {
    setWeight_input(null);
    setWeight_value("1");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") confirmarPeso();
    if (e.key === "Escape") cancelarPeso();
  };

  const handleNodeDrag = (id, newX, newY) => {
    setNodos((prev) => prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n)));
  };

  const handleMouseDown = (e) => {
    if (weight_input || editMenu) return;
    if (e.target.closest("[data-nodo]")) return;
    if (herramienta !== 1) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handleMouseMove = (e) => {
    if (!isPanning || herramienta !== 1) return;
    setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  // ---- ALGORITMO ----
  const handleResolver = () => {
    if (herramienta !== 1) setHerramienta(1);
    
    // Identificar orígenes y destinos según su posición en la pantalla (X)
    const origenes = nodos.filter(n => n.x < DIVIDER_X).sort((a,b) => a.y - b.y);
    const destinos = nodos.filter(n => n.x >= DIVIDER_X).sort((a,b) => a.y - b.y);

    if (origenes.length === 0 || destinos.length === 0) {
      showNotification("Debe haber al menos un Origen (izq) y un Destino (der).", "error");
      return;
    }

    const m = origenes.length;
    const n = destinos.length;

    // Crear matriz llenando con INF si falta la arista (para que Minimizar no la elija) 
    // y -INF para Maximizar (para que no la elija). Si es ficticia, se usará 0 por defecto.
    const matriz = Array.from({ length: m }, () => Array(n).fill(modo === "minimizar" ? 999999 : -999999));
    
    let aristaExistente = false;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Check si O[i] -> D[j] o D[j] -> O[i]
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

      // Verificar si alguna asignación cayó en un 999999 (arista faltante)
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

  // ---- DIBUJO DE ARISTAS CON COLOR DE RESULTADO ----
  const aristasParaDibujar = aristas.map(ar => {
      let isOptimal = false;
      if (resultado) {
          const fromIdx = resultado.origenes.findIndex(o => o.id === ar.from || o.id === ar.to);
          const toIdx = resultado.destinos.findIndex(d => d.id === ar.to || d.id === ar.from);
          if (fromIdx !== -1 && toIdx !== -1) {
             isOptimal = resultado.asignacionesReales.some(a => a.fila === fromIdx && a.columna === toIdx);
          }
      }
      return { ...ar, isOptimal };
  });

  // ---- MATRIZ EN TIEMPO REAL ----
  const liveOrigenes = nodos.filter(n => n.x < DIVIDER_X).sort((a,b) => a.y - b.y);
  const liveDestinos = nodos.filter(n => n.x >= DIVIDER_X).sort((a,b) => a.y - b.y);

  return (
    <PageWrapper>
      <Header>
        <BackButton
          onClick={() =>
            navigate("/graph", {
              state: { nodos: originalNodos, aristas: originalAristas },
            })
          }
        >
          <TbArrowBackUp /> Volver al Grafo
        </BackButton>
        <Title>Algoritmo de Asignación</Title>
      </Header>

      <Container>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleImportar}
      />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      
      {exportModal && (
        <ExportModal
          defaultName={suggestedName}
          onConfirm={confirmExport}
          onCancel={() => setExportModal(false)}
        />
      )}

      <GraphToolbar
        isOpen={isToolbarOpen}
        setIsOpen={setIsToolbarOpen}
        herramienta={herramienta}
        setHerramienta={setHerramienta}
        onClear={handleClear}
        tieneAristasNoDirigidas={tieneAristasNoDirigidas}
        onExportar={handleExportar}
        onImportar={() => fileInputRef.current?.click()}
      />
      
      <ContentWrapper>
        {/* PIZARRA */}
        <CanvasArea
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          $isPanning={isPanning}
        >
          <Canvas $offsetX={offset.x} $offsetY={offset.y}>
            <SvgCanvas>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3, 0 6" fill="black" />
                </marker>
                <marker id="arrowhead-optimal" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
                </marker>
              </defs>
              
              {/* Divider Line */}
              <line x1={DIVIDER_X} y1={-5000} x2={DIVIDER_X} y2={5000} stroke="#94a3b8" strokeWidth="4" strokeDasharray="10,10" opacity="0.4" />
              <text x={DIVIDER_X - 20} y={offset.y > 0 ? -offset.y + 40 : 40} fill="#64748b" fontSize="18" fontWeight="bold" textAnchor="end" letterSpacing="2" opacity="0.6">ORÍGENES</text>
              <text x={DIVIDER_X + 20} y={offset.y > 0 ? -offset.y + 40 : 40} fill="#64748b" fontSize="18" fontWeight="bold" textAnchor="start" letterSpacing="2" opacity="0.6">DESTINOS</text>

              {aristasParaDibujar.map((ar, index) => (
                <Arista
                  key={index}
                  ar={ar}
                  nodos={nodos}
                  existeContraria={existeAristaContraria(aristas, ar.from, ar.to)}
                  herramienta={herramienta}
                  onAristaClick={handleAristaClick}
                  customStroke={ar.isOptimal ? "#22c55e" : null}
                  customStrokeWidth={ar.isOptimal ? 4 : null}
                />
              ))}
            </SvgCanvas>

            {nodos.map((node) => (
              <Nodo
                key={node.id}
                nodo={node}
                onClick={(e) => handleNodeClick(node.id, e)}
                seleccionado={node.id === nodo_seleccionado}
                onDrag={handleNodeDrag}
                herramienta={herramienta}
              />
            ))}

            {weight_input && (
              <PesoContainer x={weight_input.x} y={weight_input.y}>
                <PesoLabel>Peso</PesoLabel>
                <PesoInput
                  ref={inputRef}
                  type="number"
                  value={weight_value}
                  onChange={(e) => setWeight_value(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                />
                <PesoButtons>
                  <BtnConfirmar onClick={confirmarPeso}>✓</BtnConfirmar>
                  <BtnCancelar onClick={cancelarPeso}>✕</BtnCancelar>
                </PesoButtons>
              </PesoContainer>
            )}

            {editMenu && (
              <EditMenu
                tipo={editMenu.tipo}
                datos={editMenu.datos}
                posicion={editMenu.posicion}
                onGuardar={handleGuardarEdit}
                onCerrar={() => setEditMenu(null)}
              />
            )}
          </Canvas>

          {nodos.length === 0 && !weight_input && (
            <HintBox>
              <strong>Doble clic</strong> para crear nodos.<br/>
              Izquierda = Origen, Derecha = Destino.<br/>
              Conecta nodos seleccionando uno y luego el otro.
            </HintBox>
          )}
        </CanvasArea>

        {/* PANEL LATERAL */}
        <SidePanel>
          <PanelSection>
            <PanelTitle>Configuración</PanelTitle>
            <ModoRow>
              <ModoBtn $active={modo === "minimizar"} onClick={() => { setModo("minimizar"); setResultado(null); }}>
                ⚡ Minimizar
              </ModoBtn>
              <ModoBtn $active={modo === "maximizar"} onClick={() => { setModo("maximizar"); setResultado(null); }}>
                🏆 Maximizar
              </ModoBtn>
            </ModoRow>
            <SolveBtn onClick={handleResolver}>
              <FiPlay /> Resolver {modo === "minimizar" ? "(Min)" : "(Max)"}
            </SolveBtn>
          </PanelSection>

          <PanelDivider />
          
          <PanelSection>
            <PanelTitle><FiGrid style={{ marginRight: 6 }} /> Matriz Actual ({liveOrigenes.length}×{liveDestinos.length})</PanelTitle>
            {liveOrigenes.length > 0 && liveDestinos.length > 0 ? (
              <MatrizScroll>
                <MiniTable>
                  <thead>
                    <tr>
                      <MiniCorner />
                      {liveDestinos.map(d => <MiniTh key={d.id}>{d.label}</MiniTh>)}
                    </tr>
                  </thead>
                  <tbody>
                    {liveOrigenes.map((o) => (
                      <tr key={o.id}>
                        <MiniThRow>{o.label}</MiniThRow>
                        {liveDestinos.map((d) => {
                          const ar = aristas.find(a => (a.from === o.id && a.to === d.id) || (a.to === o.id && a.from === d.id));
                          let isCellOptimal = false;
                          if (resultado) {
                            const fromIdx = liveOrigenes.findIndex(node => node.id === o.id);
                            const toIdx = liveDestinos.findIndex(node => node.id === d.id);
                            if (fromIdx !== -1 && toIdx !== -1) {
                              isCellOptimal = resultado.asignacionesReales.some(a => a.fila === fromIdx && a.columna === toIdx);
                            }
                          }
                          return (
                            <MiniTd key={d.id} $zero={!ar} $isOptimal={isCellOptimal}>
                              {ar ? ar.weight : "-"}
                            </MiniTd>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </MiniTable>
              </MatrizScroll>
            ) : (
              <InfoBox>Añade Orígenes (izq) y Destinos (der) para ver la matriz.</InfoBox>
            )}
          </PanelSection>

          {resultado && (
            <>
              <PanelDivider />
              <PanelSection>
                <PanelTitle>Resultado</PanelTitle>

                {infoPadding && (
                  <InfoBox>
                    ℹ️ Matriz {infoPadding.tamanoOriginal.filas}×{infoPadding.tamanoOriginal.columnas} completada a {infoPadding.tamanoFinal}×{infoPadding.tamanoFinal} (variables artificiales).
                  </InfoBox>
                )}

                <CostoBox>
                  <CostoLabel>Costo Óptimo</CostoLabel>
                  <CostoValor>{resultado.costoReal}</CostoValor>
                </CostoBox>

                <AsignList>
                  {resultado.asignacionesReales.map((a, idx) => (
                    <AsignItem key={idx}>
                      <Badge $type="origen">{resultado.origenes[a.fila]?.label}</Badge>
                      <FiArrowRight style={{ flexShrink: 0, color: "#22c55e" }} />
                      <Badge $type="destino">{resultado.destinos[a.columna]?.label}</Badge>
                      <CostTag>{resultado.matrizOriginal[a.fila][a.columna]}</CostTag>
                    </AsignItem>
                  ))}
                </AsignList>

                {resultado.asignacionesFicticias.length > 0 && (
                  <FictBox>
                    <small>Se usaron {resultado.asignacionesFicticias.length} asignaciones ficticias con costo 0.</small>
                  </FictBox>
                )}

                {resultado.pasos.length > 0 && (
                  <PasosToggle onClick={() => setMostrarPasos(!mostrarPasos)}>
                    {mostrarPasos ? <FiChevronUp /> : <FiChevronDown />}
                    {mostrarPasos ? "Ocultar pasos" : "Ver pasos de resolución"}
                  </PasosToggle>
                )}

                {mostrarPasos && (
                  <PasosList>
                    {resultado.pasos.map((paso, idx) => (
                      <PasoItem key={idx}>
                        <PasoNum>{idx + 1}</PasoNum>
                        <PasoBody>
                          <PasoTitle>{paso.titulo}</PasoTitle>
                          <PasoDesc>{paso.descripcion}</PasoDesc>
                          {paso.matriz && (
                            <PasoMatrizScroll>
                              <MiniTable>
                                <tbody>
                                  {paso.matriz.map((fila, i) => (
                                    <tr key={i}>
                                      {fila.map((val, j) => (
                                        <MiniTd key={j} $zero={val === 0}>
                                          {val === 999999 || val === -999999 ? "∞" : val}
                                        </MiniTd>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </MiniTable>
                            </PasoMatrizScroll>
                          )}
                        </PasoBody>
                      </PasoItem>
                    ))}
                  </PasosList>
                )}
              </PanelSection>
            </>
          )}
        </SidePanel>
      </ContentWrapper>
    </Container>
    </PageWrapper>
  );
}

/* ================================================
   STYLED COMPONENTS
   ================================================ */
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
  z-index: 100;
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

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 110px); /* Ajustado para el nuevo Header */
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) { padding: 8px; gap: 8px; }
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  border: 2px solid #334155;
  border-radius: 12px;
  background-color: #f8fafc;
  background-image:
    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
  background-size: 40px 40px;
  overflow: hidden;
  cursor: ${(p) => (p.$isPanning ? "grabbing" : "default")};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transform: translate(${(p) => p.$offsetX}px, ${(p) => p.$offsetY}px);
  transform-origin: 0 0;
`;

const SvgCanvas = styled.svg`
  width: 100%; height: 100%;
  position: absolute;
  top: 0; left: 0;
  overflow: visible;
  pointer-events: none;
`;

const HintBox = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.85);
  color: #fff;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  pointer-events: none;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);

  strong { color: #38bdf8; }
`;

const PesoContainer = styled.div`
  position: absolute;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #334155;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 50;
`;
const PesoLabel = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: #334155;
`;
const PesoInput = styled.input`
  width: 60px;
  padding: 5px 8px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  outline: none;
  font-weight: 600;
  &:focus { border-color: #3b82f6; }
`;
const PesoButtons = styled.div` display: flex; gap: 4px; `;
const BtnConfirmar = styled.button`
  background: #22c55e;
  color: white; border: none; border-radius: 6px;
  width: 30px; height: 30px;
  font-size: 16px; cursor: pointer;
  &:hover { background: #16a34a; }
`;
const BtnCancelar = styled.button`
  background: #ef4444;
  color: white; border: none; border-radius: 6px;
  width: 30px; height: 30px;
  font-size: 16px; cursor: pointer;
  &:hover { background: #dc2626; }
`;

/* ---- SIDE PANEL ---- */
const SidePanel = styled.aside`
  width: 320px;
  min-width: 300px;
  background: rgba(13, 17, 23, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }

  @media (max-width: 768px) { width: 280px; min-width: 260px; }
`;

const PanelSection = styled.div` display: flex; flex-direction: column; gap: 12px; `;

const PanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;

const PanelDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
`;

const ModoRow = styled.div` display: flex; gap: 8px; `;

const ModoBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? "#3b82f6" : "rgba(255,255,255,0.1)")};
  background: ${(p) => (p.$active ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)")};
  color: ${(p) => (p.$active ? "#93c5fd" : "var(--text-secondary)")};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.4); }
`;

const SolveBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px; border-radius: 8px; border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff; font-size: 15px; font-weight: 800;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5); }
  svg { font-size: 18px; }
`;

const InfoBox = styled.div`
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px; padding: 10px;
  font-size: 12px; color: #7dd3fc; line-height: 1.5;
`;

const CostoBox = styled.div`
  text-align: center; padding: 16px;
  background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.1));
  border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.3);
`;
const CostoLabel = styled.div`
  font-size: 12px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.7); margin-bottom: 6px;
`;
const CostoValor = styled.div`
  font-size: 42px; font-weight: 900;
  background: linear-gradient(135deg, #4ade80, #60a5fa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
`;

const fadeIn = keyframes` from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } `;

const AsignList = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const AsignItem = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; background: rgba(0, 0, 0, 0.3);
  border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.3s ease both;
`;

const Badge = styled.span`
  padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; white-space: nowrap;
  ${(p) => p.$type === "destino" ? css` background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); ` : css` background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); `}
`;

const CostTag = styled.span`
  margin-left: auto; font-size: 14px; font-weight: 800; color: #e2e8f0;
`;

const FictBox = styled.div`
  padding: 8px 12px; background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px;
  color: #fbbf24; font-size: 13px; text-align: center;
`;

const PasosToggle = styled.button`
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px; color: #fff; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const PasosList = styled.div` display: flex; flex-direction: column; gap: 10px; `;

const PasoItem = styled.div`
  display: flex; gap: 10px; padding: 12px;
  background: rgba(0, 0, 0, 0.3); border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const PasoNum = styled.div`
  width: 24px; height: 24px; min-width: 24px; border-radius: 6px;
  background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 12px;
`;

const PasoBody = styled.div` flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; `;

const PasoTitle = styled.h4` font-size: 13px; font-weight: 800; color: #fff; margin: 0; `;
const PasoDesc = styled.p` font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0; `;

const PasoMatrizScroll = styled.div` overflow-x: auto; margin-top: 6px; `;

const MiniTable = styled.table` border-collapse: collapse; min-width: max-content; `;

const MatrizScroll = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);

  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
`;

const MiniCorner = styled.th`
  padding: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-width: 60px;
`;

const MiniTh = styled.th`
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  color: #4ade80;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
`;

const MiniThRow = styled.td`
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  color: #60a5fa;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
`;

const MiniTd = styled.td`
  padding: 6px 10px; text-align: center; font-size: 13px;
  font-weight: ${(p) => (p.$isOptimal ? "800" : p.$zero ? "800" : "600")};
  color: ${(p) => (p.$isOptimal ? "#4ade80" : p.$zero ? "rgba(255, 255, 255, 0.3)" : "#cbd5e1")};
  background: ${(p) => p.$isOptimal ? "rgba(34, 197, 94, 0.2)" : p.$zero ? "transparent" : "rgba(59, 130, 246, 0.1)"};
  border: 1px solid ${(p) => p.$isOptimal ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 255, 255, 0.1)"};
`;
