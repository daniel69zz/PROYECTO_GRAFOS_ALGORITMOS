import styled, { css, keyframes } from "styled-components";
import {
  FiPlay, FiChevronDown, FiChevronUp, FiArrowRight, FiGrid
} from "react-icons/fi";

export function ResultadosPanel({
  modo,
  setModo,
  setResultado,
  handleResolver,
  liveOrigenes,
  liveDestinos,
  aristas,
  resultado,
  infoPadding,
  mostrarPasos,
  setMostrarPasos
}) {
  return (
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
                {liveOrigenes.map((o, oIdx) => (
                  <tr key={o.id}>
                    <MiniThRow>{o.label}</MiniThRow>
                    {liveDestinos.map((d, dIdx) => {
                      const ar = aristas.find(a => (a.from === o.id && a.to === d.id) || (a.to === o.id && a.from === d.id));
                      const isOpt = resultado?.asignacionesReales.some(a => a.fila === oIdx && a.columna === dIdx);
                      return (
                        <MiniTd key={d.id} $zero={!ar} $isOptimal={isOpt}>
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
                  <FiArrowRight style={{ flexShrink: 0, color: "#ef4444" }} />
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
                                  {fila.map((val, j) => {
                                    const isOpt = resultado?.asignaciones.some(a => a.fila === i && a.columna === j);
                                    return (
                                      <MiniTd key={j} $zero={val === 0} $isOptimal={isOpt}>
                                        {val === 999999 || val === -999999 ? "∞" : val}
                                      </MiniTd>
                                    );
                                  })}
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
  );
}

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
  padding: 6px 10px; text-align: center; font-size: 13px; font-weight: ${(p) => (p.$zero || p.$isOptimal ? "800" : "600")};
  color: ${(p) => (p.$zero ? "rgba(255, 255, 255, 0.3)" : "#cbd5e1")};
  background: ${(p) => p.$isOptimal ? "rgba(239, 68, 68, 0.2)" : (p.$zero ? "transparent" : "rgba(59, 130, 246, 0.1)")};
  border: 1px solid ${(p) => p.$isOptimal ? "#ef4444" : "rgba(255, 255, 255, 0.1)"};
  box-shadow: ${(p) => p.$isOptimal ? "inset 0 0 8px rgba(239, 68, 68, 0.2)" : "none"};
  transition: all 0.3s ease;
`;
