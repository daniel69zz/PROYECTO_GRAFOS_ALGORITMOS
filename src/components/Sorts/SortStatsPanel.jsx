import styled from "styled-components";

const formatArray = (array) => (array.length ? array.join(", ") : "-");

export function SortStatsPanel({
  elapsedMs,
  originalArray,
  currentArray,
  algorithmLabel,
  orderLabel,
  stepsCount,
  stepLog,
  isFinished,
}) {
  return (
    <Panel>
      <PanelHeader>
        <span>Seguimiento</span>
        <Status $isFinished={isFinished}>{isFinished ? "Finalizado" : "En proceso"}</Status>
      </PanelHeader>

      <MetricGrid>
        <Metric>
          <label>Tiempo</label>
          <strong>{(elapsedMs / 1000).toFixed(1)}s</strong>
        </Metric>
        <Metric>
          <label>Pasos</label>
          <strong>{stepsCount}</strong>
        </Metric>
      </MetricGrid>

      <InfoBlock>
        <label>Algoritmo</label>
        <p>{algorithmLabel}</p>
      </InfoBlock>

      <InfoBlock>
        <label>Orden</label>
        <p>{orderLabel}</p>
      </InfoBlock>

      <InfoBlock>
        <label>Arreglo original</label>
        <CodeLine>{formatArray(originalArray)}</CodeLine>
      </InfoBlock>

      <InfoBlock>
        <label>Arreglo actual</label>
        <CodeLine>{formatArray(currentArray)}</CodeLine>
      </InfoBlock>

      <Log>
        <label>Registro de pasos</label>
        <LogList>
          {stepLog.length === 0 ? (
            <li>Aun no hay pasos registrados.</li>
          ) : (
            stepLog.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)
          )}
        </LogList>
      </Log>
    </Panel>
  );
}

const Panel = styled.aside`
  width: 330px;
  min-width: 300px;
  max-height: 100%;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-md);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 100%;
    min-width: 0;
    max-height: 420px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-primary);
  font-weight: 800;
  font-size: 1rem;
`;

const Status = styled.span`
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 999px;
  color: ${(props) => (props.$isFinished ? "#86efac" : "var(--accent-hover)")};
  background: ${(props) =>
    props.$isFinished ? "rgba(35, 134, 54, 0.18)" : "rgba(88, 166, 255, 0.14)"};
  border: 1px solid
    ${(props) => (props.$isFinished ? "rgba(46, 160, 67, 0.35)" : "rgba(88, 166, 255, 0.28)")};
  font-size: 0.76rem;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const Metric = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);

  label {
    display: block;
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 3px;
    color: var(--text-primary);
    font-size: 1.35rem;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  p {
    color: var(--text-primary);
    font-weight: 700;
    margin: 0;
  }
`;

const CodeLine = styled.p`
  max-height: 72px;
  overflow: auto;
  padding: 9px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  font-size: 0.82rem;
`;

const Log = styled.div`
  min-height: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;

  label {
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const LogList = styled.ol`
  min-height: 0;
  flex: 1;
  overflow: auto;
  padding: 10px 10px 10px 28px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  font-size: 0.85rem;

  li + li {
    margin-top: 7px;
  }
`;
