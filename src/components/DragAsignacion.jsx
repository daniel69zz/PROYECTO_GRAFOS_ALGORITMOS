import { useState, useRef, useCallback, useMemo } from "react";
import styled, { css, keyframes } from "styled-components";
import { grafoAMatrizAsignacion } from "../utils/grafoAMatrizAsignacion";
import { resolverAsignacion } from "../utils/hungaro";
import {
  FiPlay,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiAlertTriangle,
} from "react-icons/fi";

export function DragAsignacion({ nodos, aristas, onClose }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragging = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [modo, setModo] = useState("minimizar");
  const [resultado, setResultado] = useState(null);
  const [mostrarPasos, setMostrarPasos] = useState(false);

  // Convertir grafo → matriz
  const conversion = useMemo(
    () => grafoAMatrizAsignacion(nodos, aristas),
    [nodos, aristas]
  );

  // --- Drag handlers ---
  const onMouseUp = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("mousemove", onMouseMoveHandler);
    window.removeEventListener("mouseup", onMouseUp);
  }, []);

  const onMouseMoveHandler = useCallback((e) => {
    if (!dragging.current) return;
    setPos({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  }, []);

  const onMouseDown = useCallback(
    (e) => {
      dragging.current = true;
      offsetRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      window.addEventListener("mousemove", onMouseMoveHandler);
      window.addEventListener("mouseup", onMouseUp);
    },
    [pos, onMouseMoveHandler, onMouseUp]
  );

  const handleResolver = () => {
    if (!conversion.valida) return;
    try {
      const res = resolverAsignacion(conversion.matriz, modo);
      setResultado(res);
    } catch (err) {
      console.error("Error al resolver asignación:", err);
    }
  };

  const esCeldaAsignada = (i, j) => {
    if (!resultado) return false;
    return resultado.asignaciones.some((a) => a.fila === i && a.columna === j);
  };

  return (
    <WindowWrapper $top={pos.y} $left={pos.x}>
      <TitleBar onMouseDown={onMouseDown}>
        <TitleInfo>
          <TitleIcon>📋</TitleIcon>
          <TitleText>Algoritmo de Asignación</TitleText>
        </TitleInfo>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </TitleBar>

      <WindowBody>
        {/* ===== ERROR DE VALIDACIÓN ===== */}
        {!conversion.valida && (
          <ErrorPanel>
            <ErrorHeader>
              <FiAlertTriangle />
              <span>Grafo no válido para asignación</span>
            </ErrorHeader>
            <ErrorMessage>{conversion.error}</ErrorMessage>
            {conversion.aristasFaltantes &&
              conversion.aristasFaltantes.length > 0 && (
                <ErrorHint>
                  Agrega las aristas faltantes en el editor y vuelve a abrir
                  este panel.
                </ErrorHint>
              )}
          </ErrorPanel>
        )}

        {/* ===== CONTENIDO VÁLIDO ===== */}
        {conversion.valida && (
          <>
            {/* Selector de modo */}
            <ModoSection>
              <ModoLabel>Objetivo:</ModoLabel>
              <ModoGroup>
                <ModoBtn
                  $active={modo === "minimizar"}
                  onClick={() => {
                    setModo("minimizar");
                    setResultado(null);
                  }}
                >
                  ⚡ Minimizar
                </ModoBtn>
                <ModoBtn
                  $active={modo === "maximizar"}
                  onClick={() => {
                    setModo("maximizar");
                    setResultado(null);
                  }}
                >
                  🏆 Maximizar
                </ModoBtn>
              </ModoGroup>
            </ModoSection>

            {/* Matriz del grafo */}
            <MatrizSection>
              <SectionTitle>
                Matriz de Costos ({conversion.nombresNodos.length}×
                {conversion.nombresNodos.length})
              </SectionTitle>
              <MatrizScroll>
                <MatrizTable>
                  <thead>
                    <tr>
                      <MatrizCorner />
                      {conversion.nombresNodos.map((nombre, j) => (
                        <MatrizColHeader key={j}>{nombre}</MatrizColHeader>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {conversion.matriz.map((fila, i) => (
                      <tr key={i}>
                        <MatrizRowHeader>
                          {conversion.nombresNodos[i]}
                        </MatrizRowHeader>
                        {fila.map((val, j) => (
                          <MatrizCelda
                            key={j}
                            $asignada={esCeldaAsignada(i, j)}
                            $diagonal={i === j}
                          >
                            {val}
                          </MatrizCelda>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </MatrizTable>
              </MatrizScroll>
            </MatrizSection>

            {/* Botón resolver */}
            <ResolverBtn onClick={handleResolver}>
              <FiPlay /> Resolver{" "}
              {modo === "minimizar" ? "(Mínimo)" : "(Máximo)"}
            </ResolverBtn>

            {/* Resultados */}
            {resultado && (
              <ResultSection>
                <CostoBox>
                  <CostoLabel>Costo Total Óptimo</CostoLabel>
                  <CostoValor>{resultado.costoTotal}</CostoValor>
                </CostoBox>

                <AsignList>
                  {resultado.asignaciones.map((a, idx) => (
                    <AsignItem
                      key={idx}
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <Badge>
                        {conversion.nombresNodos[a.fila]}
                      </Badge>
                      <FiArrowRight
                        style={{ color: "#4f46e5", flexShrink: 0 }}
                      />
                      <Badge $dest>
                        {conversion.nombresNodos[a.columna]}
                      </Badge>
                      <CostTag>Costo: {a.costo}</CostTag>
                    </AsignItem>
                  ))}
                </AsignList>

                {/* Pasos educativos */}
                {resultado.pasos.length > 0 && (
                  <PasosWrap>
                    <PasosToggle
                      onClick={() => setMostrarPasos(!mostrarPasos)}
                    >
                      {mostrarPasos ? <FiChevronUp /> : <FiChevronDown />}
                      {mostrarPasos
                        ? "Ocultar pasos"
                        : "Ver pasos del algoritmo"}
                    </PasosToggle>
                    {mostrarPasos && (
                      <PasosList>
                        {resultado.pasos.map((paso, idx) => (
                          <PasoItem key={idx}>
                            <PasoNum>{idx + 1}</PasoNum>
                            <PasoBody>
                              <PasoTitle>{paso.titulo}</PasoTitle>
                              <PasoDesc>{paso.descripcion}</PasoDesc>
                              {paso.matriz && (
                                <MiniMatrizScroll>
                                  <MiniMatriz>
                                    <tbody>
                                      {paso.matriz.map((fila, i) => (
                                        <tr key={i}>
                                          {fila.map((val, j) => (
                                            <MiniCelda
                                              key={j}
                                              $zero={val === 0}
                                            >
                                              {val}
                                            </MiniCelda>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </MiniMatriz>
                                </MiniMatrizScroll>
                              )}
                            </PasoBody>
                          </PasoItem>
                        ))}
                      </PasosList>
                    )}
                  </PasosWrap>
                )}
              </ResultSection>
            )}
          </>
        )}
      </WindowBody>
    </WindowWrapper>
  );
}

/* =============== ANIMATIONS =============== */
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* =============== STYLED COMPONENTS =============== */

const WindowWrapper = styled.div`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  max-width: calc(100vw - 32px);
  width: 520px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  z-index: 100;
  overflow: hidden;
  user-select: none;
  background: #fff;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 100px);
    width: 95vw;
    display: flex;
    flex-direction: column;
  }
`;

const TitleBar = styled.div`
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  padding: 10px 14px;
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
`;

const TitleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleIcon = styled.span`
  font-size: 18px;
  opacity: 0.9;
`;

const TitleText = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 6px 9px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const WindowBody = styled.div`
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    max-height: none;
    flex: 1;
    overflow-y: auto;
  }
`;

/* --- Error Panel --- */

const ErrorPanel = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
  color: #b91c1c;

  svg {
    font-size: 20px;
    flex-shrink: 0;
  }
`;

const ErrorMessage = styled.pre`
  font-size: 13px;
  color: #7f1d1d;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: inherit;
`;

const ErrorHint = styled.p`
  font-size: 13px;
  color: #9ca3af;
  font-style: italic;
  margin: 0;
`;

/* --- Modo Section --- */

const ModoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ModoLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
`;

const ModoGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const ModoBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? "#4f46e5" : "#e2e8f0")};
  background: ${(p) => (p.$active ? "#eef2ff" : "#fff")};
  color: ${(p) => (p.$active ? "#4f46e5" : "#64748b")};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4f46e5;
    background: #eef2ff;
  }
`;

/* --- Matriz Section --- */

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin: 0 0 6px 0;
`;

const MatrizSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const MatrizScroll = styled.div`
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const MatrizTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: max-content;
`;

const MatrizCorner = styled.th`
  padding: 8px;
  background: #f1f5f9;
  border-bottom: 2px solid #e2e8f0;
  border-right: 2px solid #e2e8f0;
  min-width: 80px;
`;

const MatrizColHeader = styled.th`
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #4f46e5;
  background: #f1f5f9;
  border-bottom: 2px solid #e2e8f0;
  text-align: center;
  white-space: nowrap;
`;

const MatrizRowHeader = styled.td`
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #4f46e5;
  background: #f1f5f9;
  border-right: 2px solid #e2e8f0;
  white-space: nowrap;
`;

const MatrizCelda = styled.td`
  padding: 8px 12px;
  text-align: center;
  font-size: 14px;
  font-weight: ${(p) => (p.$asignada ? "800" : "500")};
  color: ${(p) => (p.$asignada ? "#166534" : p.$diagonal ? "#94a3b8" : "#1e293b")};
  background: ${(p) =>
    p.$asignada
      ? "#dcfce7"
      : p.$diagonal
        ? "#f1f5f9"
        : "#fff"};
  border: 1px solid ${(p) => (p.$asignada ? "#86efac" : "#e2e8f0")};
  transition: all 0.3s;

  ${(p) =>
    p.$asignada &&
    css`
      box-shadow: inset 0 0 0 2px #22c55e;
    `}
`;

/* --- Resolver Button --- */

const ResolverBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
  }

  svg {
    font-size: 16px;
  }
`;

/* --- Result Section --- */

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${slideIn} 0.3s ease;
`;

const CostoBox = styled.div`
  text-align: center;
  padding: 14px;
  background: linear-gradient(135deg, #f0fdf4, #eef2ff);
  border-radius: 10px;
  border: 1px solid #bbf7d0;
`;

const CostoLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  margin-bottom: 4px;
`;

const CostoValor = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #166534;
`;

const AsignList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AsignItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  animation: ${slideIn} 0.3s ease both;
  flex-wrap: wrap;

  &:hover {
    background: #eef2ff;
    border-color: #c7d2fe;
  }
`;

const Badge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  ${(p) =>
    p.$dest
      ? css`
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        `
      : css`
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid #c7d2fe;
        `}
`;

const CostTag = styled.span`
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
`;

/* --- Pasos --- */

const PasosWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PasosToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4f46e5;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;

  svg {
    font-size: 16px;
  }

  &:hover {
    background: #eef2ff;
    border-color: #c7d2fe;
  }
`;

const PasosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PasoItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const PasoNum = styled.div`
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
`;

const PasoBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PasoTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const PasoDesc = styled.p`
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
`;

const MiniMatrizScroll = styled.div`
  overflow-x: auto;
  margin-top: 4px;
`;

const MiniMatriz = styled.table`
  border-collapse: collapse;
`;

const MiniCelda = styled.td`
  padding: 4px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  background: ${(p) => (p.$zero ? "#dcfce7" : "#fff")};
  color: ${(p) => (p.$zero ? "#166534" : "#64748b")};
  min-width: 32px;
`;
