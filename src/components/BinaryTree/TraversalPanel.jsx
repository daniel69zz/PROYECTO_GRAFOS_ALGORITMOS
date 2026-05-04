import styled from "styled-components";
import { FaPlay } from "react-icons/fa";

const traversalItems = [
  { key: "inOrder", label: "In-Order" },
  { key: "preOrder", label: "Pre-Order" },
  { key: "postOrder", label: "Post-Order" },
];

export function TraversalPanel({
  traversals,
  traversalState,
  onPlayTraversal,
  disabled,
}) {
  return (
    <Panel>
      <Header>
        <h2>Recorridos</h2>
        {traversalState.running && (
          <Status>
            {traversalState.label} • paso {traversalState.step}/
            {traversalState.sequence.length}
          </Status>
        )}
      </Header>

      <List>
        {traversalItems.map(({ key, label }) => {
          const values = traversals[key] ?? [];
          const isActive = traversalState.running && traversalState.key === key;

          return (
            <Item key={key}>
              <Row>
                <ItemLabel>{label}</ItemLabel>
                <PlayButton
                  type="button"
                  onClick={() => onPlayTraversal(key)}
                  disabled={disabled}
                  $active={isActive}
                >
                  <FaPlay />
                  {isActive ? "Animando" : "Animar"}
                </PlayButton>
              </Row>
              <Sequence $empty={values.length === 0}>
                {values.length ? values.join(", ") : "Sin datos"}
              </Sequence>
            </Item>
          );
        })}
      </List>
    </Panel>
  );
}

const Panel = styled.section`
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  background: rgba(8, 14, 26, 0.76);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary);
  }
`;

const Status = styled.span`
  color: #fbbf24;
  font-size: 0.82rem;
  font-weight: 800;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.article`
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const ItemLabel = styled.span`
  font-weight: 800;
  color: var(--text-primary);
`;

const PlayButton = styled.button`
  min-height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid
    ${(props) =>
      props.$active ? "rgba(249, 115, 22, 0.4)" : "rgba(255, 255, 255, 0.08)"};
  background: ${(props) =>
    props.$active
      ? "rgba(249, 115, 22, 0.16)"
      : "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => (props.$active ? "#fdba74" : "var(--text-primary)")};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.3);
  }
`;

const Sequence = styled.p`
  margin: 0;
  color: ${(props) =>
    props.$empty ? "var(--text-secondary)" : "var(--text-primary)"};
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
`;
