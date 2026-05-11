import styled from "styled-components";

export function DijkstraControls({
  origen,
  destino,
  mode,
  result,
  pickTarget,
  onClear,
  onCalculate,
  onShowResult,
  disabledCalculate = false,
}) {
  const hasResult = !!result;
  const modeLabel = mode === "minimizar" ? "Ruta Mínima" : "Ruta Máxima";

  return (
    <Wrap data-toolbar="true">
      <InputsPanel>
        <PanelTitle>DIJKSTRA</PanelTitle>

        <Row>
          <Label>Objetivo</Label>
          <ValueBox>{modeLabel}</ValueBox>
        </Row>

        <Row>
          <Label>Nodo origen</Label>
          <ValueBox>{origen || "—"}</ValueBox>
        </Row>

        <Row>
          <Label>Nodo final</Label>
          <ValueBox>{destino || "—"}</ValueBox>
        </Row>

        {hasResult ? (
          <ResultSummary>
            <SummaryRow>
              <SummaryLabel>Distancia</SummaryLabel>
              <SummaryValue>{result.distance}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Saltos</SummaryLabel>
              <SummaryValue>{result.steps?.length ?? 0}</SummaryValue>
            </SummaryRow>
            <MiniBtn onClick={onShowResult}>Ver Detalle</MiniBtn>
          </ResultSummary>
        ) : (
          <Hint>
            Selecciona:{" "}
            {pickTarget === "origen" ? (
              <strong>Origen</strong>
            ) : (
              <strong>Final</strong>
            )}
          </Hint>
        )}

        <MiniBtn onClick={onClear}>Limpiar</MiniBtn>
      </InputsPanel>

      <ButtonsPanel>
        <BtnCalculate
          onClick={onCalculate}
          disabled={disabledCalculate}
          title={`Calcular ${modeLabel}`}
        >
          {hasResult ? "Recalcular" : "Calcular Ruta"}
        </BtnCalculate>
      </ButtonsPanel>
    </Wrap>
  );
}

const ValueBox = styled.div`
  height: 30px;
  border-radius: 10px;
  padding: 0 10px;
  display: flex;
  align-items: center;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: #0b1220;
  font-weight: 900;
  font-size: 13px;
`;

const MiniBtn = styled.button`
  margin-top: 8px;
  width: 100%;
  height: 30px;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Wrap = styled.div`
  position: absolute;
  right: 25px;
  bottom: 25px;
  z-index: 50;
  width: 220px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 10px;
  border-radius: 14px;

  background-color: var(--glass-bg);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  @media (max-width: 480px) {
    right: 10px;
    bottom: 10px;
    width: 200px;
    padding: 8px;
  }
`;

const InputsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 10px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
`;

const PanelTitle = styled.div`
  font-weight: 900;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.08em;
  font-size: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 8px;
  align-items: center;
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 12px;
`;

const Hint = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: rgba(200, 200, 255, 0.95);
`;

const ResultSummary = styled.div`
  margin-top: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.14);
  border: 1px solid rgba(139, 92, 246, 0.4);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const SummaryLabel = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
`;

const SummaryValue = styled.span`
  color: #fff;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
`;

const ButtonsPanel = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const BtnCalculate = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 12px;

  background: rgba(139, 92, 246, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: #fff;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    transform 0.12s ease,
    background 0.12s ease,
    opacity 0.12s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(139, 92, 246, 1);
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;
