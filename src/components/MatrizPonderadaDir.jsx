import styled from "styled-components";

export function MatrizPonderadaDir({ nodos, aristas }) {
  const n = nodos.length;

  const matriz = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const arista = aristas.find(
        (ar) => ar.from === nodos[i].id && ar.to === nodos[j].id,
      );
      matriz[i][j] = arista ? arista.weight : 0;
    }
  }

  const suma_filas = matriz.map((fila) =>
    fila.reduce((acc, val) => acc + val, 0),
  );
  const max_filas = Math.max(...suma_filas);

  const suma_cols = Array.from({ length: n }, (_, j) =>
    matriz.reduce((acc, fila) => acc + fila[j], 0),
  );
  const max_cols = Math.max(...suma_cols);

  const count_filas = matriz.map(
    (fila) => fila.filter((val) => val !== 0).length,
  );
  const max_count_filas = Math.max(...count_filas);

  const count_cols = Array.from(
    { length: n },
    (_, j) => matriz.filter((fila) => fila[j] !== 0).length,
  );
  const max_count_cols = Math.max(...count_cols);

  return (
    <Container>
      {/* ── Tabla ── */}
      <TableWrapper>
        <table>
          <thead>
            <tr>
              <CornerTh />
              {nodos.map((nodo) => (
                <HeaderTh key={nodo.id}>{nodo.label}</HeaderTh>
              ))}
              <SumTh>∑</SumTh>
              <CountTh>Count</CountTh>
            </tr>
          </thead>

          <tbody>
            {matriz.map((fila, i) => {
              const sum_fila = suma_filas[i];
              const isMaxFila = sum_fila === max_filas && max_filas !== 0;

              const count_fila = count_filas[i];
              const isMaxCountFila =
                count_fila === max_count_filas && max_count_filas !== 0;

              return (
                <BodyTr key={nodos[i].id}>
                  <RowTh>{nodos[i].label}</RowTh>
                  {fila.map((val, j) => (
                    <DataTd key={nodos[j].id} $active={val !== 0}>
                      {val !== 0 ? val : <ZeroSpan>0</ZeroSpan>}
                    </DataTd>
                  ))}
                  <SumTd $highlight={isMaxFila}>{sum_fila}</SumTd>
                  <CountTd $highlight={isMaxCountFila}>{count_fila}</CountTd>
                </BodyTr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <SumTh>∑</SumTh>
              {suma_cols.map((sum_col, j) => (
                <SumTd
                  key={j}
                  $highlight={sum_col === max_cols && max_cols !== 0}
                >
                  {sum_col}
                </SumTd>
              ))}
              <SumTd />
              <CountTd />
            </tr>
            <tr>
              <CountTh>Count</CountTh>
              {count_cols.map((count_col, j) => (
                <CountTd
                  key={j}
                  $highlight={
                    count_col === max_count_cols && max_count_cols !== 0
                  }
                >
                  {count_col}
                </CountTd>
              ))}
              <SumTd />
              <CountTd />
            </tr>
          </tfoot>
        </table>
      </TableWrapper>

      {/* ── Stats ── */}
      <StatsGrid>
        <StatCard $color="#4f46e5">
          <StatTop>
            <StatLabel>Max ∑ Fila</StatLabel>
            <StatIcon>→</StatIcon>
          </StatTop>
          <StatValue>{max_filas}</StatValue>
        </StatCard>

        <StatCard $color="#0ea5e9">
          <StatTop>
            <StatLabel>Max ∑ Col</StatLabel>
            <StatIcon>↓</StatIcon>
          </StatTop>
          <StatValue>{max_cols}</StatValue>
        </StatCard>

        <StatCard $color="#10b981">
          <StatTop>
            <StatLabel>Max Grado Salida</StatLabel>
            <StatIcon>↗</StatIcon>
          </StatTop>
          <StatValue>{max_count_filas}</StatValue>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatTop>
            <StatLabel>Max Grado Entrada</StatLabel>
            <StatIcon>↙</StatIcon>
          </StatTop>
          <StatValue>{max_count_cols}</StatValue>
        </StatCard>
      </StatsGrid>
    </Container>
  );
}

// ── Styled Components ─────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TableWrapper = styled.div`
  overflow: auto;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }
`;

const CornerTh = styled.th`
  background: #1e1b4b;
  border: 1px solid #2d2a6e;
  padding: 10px 14px;
  min-width: 32px;
`;
const CountTh = styled.th`
  background: #134e4a;
  color: #5eead4;
  padding: 10px 14px;
  border: 1px solid #0f3d39;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const CountTd = styled.td`
  padding: 8px 14px;
  border: 1px solid #ccfbf1;
  text-align: center;
  font-weight: 700;
  background: ${({ $highlight }) => ($highlight ? "#99f6e4" : "#f0fdfa")};
  color: ${({ $highlight }) => ($highlight ? "#0f766e" : "#64748b")};
  transition: background 0.15s;

  ${({ $highlight }) =>
    $highlight &&
    `
    position: relative;
    &::after {
      content: "★";
      position: absolute;
      top: 2px;
      right: 3px;
      font-size: 8px;
      color: #0d9488;
    }
  `}
`;

const HeaderTh = styled.th`
  background: linear-gradient(180deg, #6366f1, #4f46e5);
  color: white;
  padding: 10px 14px;
  border: 1px solid #4338ca;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

const SumTh = styled.th`
  background: #1e1b4b;
  color: #a5b4fc;
  padding: 10px 14px;
  border: 1px solid #2d2a6e;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const RowTh = styled.th`
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  color: white;
  padding: 10px 14px;
  border: 1px solid #4338ca;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
`;

const BodyTr = styled.tr`
  &:hover td,
  &:hover th {
    filter: brightness(0.95);
  }
`;

const DataTd = styled.td`
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  text-align: center;
  background: ${({ $active }) => ($active ? "#ede9fe" : "#fafafa")};
  color: ${({ $active }) => ($active ? "#4f46e5" : "#cbd5e1")};
  font-weight: ${({ $active }) => ($active ? "700" : "400")};
  transition: background 0.15s;
`;

const ZeroSpan = styled.span`
  color: #71767d;
  font-size: 11px;
  font-weight: bold;
`;

const SumTd = styled.td`
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-weight: 700;
  background: ${({ $highlight }) => ($highlight ? "#fef08a" : "#f1f5f9")};
  color: ${({ $highlight }) => ($highlight ? "#92400e" : "#64748b")};
  transition: background 0.15s;

  /* badge cuando es máximo */
  ${({ $highlight }) =>
    $highlight &&
    `
    position: relative;
    &::after {
      content: "★";
      position: absolute;
      top: 2px;
      right: 3px;
      font-size: 8px;
      color: #f59e0b;
    }
  `}
`;

// ── Stats ─────────────────────────────────────────────────────────────────────

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const StatCard = styled.div`
  background: ${({ $color }) => $color}12;
  border: 1px solid ${({ $color }) => $color}33;
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px ${({ $color }) => $color}33;
  }
`;

const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const StatIcon = styled.span`
  font-size: 14px;
  color: #94a3b8;
`;

const StatValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
`;
