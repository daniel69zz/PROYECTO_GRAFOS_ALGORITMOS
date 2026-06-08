import styled from "styled-components";

export function SortBoard({ array, activeIndices = [], isFinished = false }) {
  const maxValue = Math.max(...array, 100);

  if (array.length === 0) {
    return (
      <Board>
        <EmptyState>
          <strong>Sin arreglo cargado</strong>
          <span>Genera, escribe o importa datos para comenzar.</span>
        </EmptyState>
      </Board>
    );
  }

  return (
    <Board>
      <Bars $count={array.length}>
        {array.map((value, index) => {
          const isActive = activeIndices.includes(index);
          const height = Math.max(8, (value / maxValue) * 100);

          return (
            <BarSlot key={`${index}-${value}`}>
              <ValueLabel $isActive={isActive}>{value}</ValueLabel>
              <BarTrack>
                <Bar
                  $height={height}
                  $isActive={isActive}
                  $isFinished={isFinished}
                  title={`Indice ${index}: ${value}`}
                />
              </BarTrack>
            </BarSlot>
          );
        })}
      </Bars>
    </Board>
  );
}

const Board = styled.section`
  flex: 1;
  min-height: 240px;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
    #0d1117;
  box-shadow: var(--shadow-md);
  padding: 28px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
`;

const Bars = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(${(props) => props.$count}, minmax(8px, 1fr));
  grid-template-rows: 100%;
  align-items: stretch;
  gap: clamp(3px, 0.7vw, 10px);
`;

const BarSlot = styled.div`
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const ValueLabel = styled.span`
  width: 100%;
  min-height: 22px;
  flex-shrink: 0;
  color: ${(props) => (props.$isActive ? "#facc15" : "var(--text-primary)")};
  font-size: clamp(10px, 1.2vw, 13px);
  font-weight: 800;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarTrack = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Bar = styled.div`
  width: 100%;
  min-width: 6px;
  height: ${(props) => props.$height}%;
  min-height: 10px;
  border-radius: 8px 8px 4px 4px;
  background: ${(props) => {
    if (props.$isFinished) return "linear-gradient(180deg, #34d399 0%, #059669 100%)";
    if (props.$isActive) return "linear-gradient(180deg, #facc15 0%, #f97316 100%)";
    return "linear-gradient(180deg, var(--accent-hover) 0%, var(--accent-color) 100%)";
  }};
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: ${(props) =>
    props.$isActive
      ? "0 0 22px rgba(250, 204, 21, 0.38)"
      : "0 8px 22px rgba(0, 0, 0, 0.28)"};
  transition:
    height 220ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
  transform: ${(props) => (props.$isActive ? "translateY(-4px)" : "translateY(0)")};
`;

const EmptyState = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
    font-size: 1.2rem;
  }
`;
