import styled from "styled-components";
import { AiOutlineLeft, AiOutlineClose } from "react-icons/ai";

export function SidebarNodo({ nodo, aristas, nodos, onClose }) {
  const aristas_input = aristas.filter((ar) => ar.to === nodo.id);
  const aristas_output = aristas.filter((ar) => ar.from === nodo.id);

  return (
    <Container>
      <header>
        <h2>{nodo.label}</h2>
        <button onClick={onClose} className="SidebarButton">
          <AiOutlineClose />
        </button>
      </header>

      <section>
        <h3 className="SectionTitle">Information:</h3>
        <div className="SpanInfo">
          <span>ID:</span>
          <span>{nodo.id}</span>
        </div>
      </section>
      <section>
        <h3 className="SectionTitle">
          Outgoing edges: {aristas_output.length}
        </h3>
        {aristas_output.length === 0 ? (
          <span className="SpanEmpty">Not outgoing edges</span>
        ) : (
          aristas_output.map((ar, index) => {
            const destiny = nodos.find((nodo) => nodo.id === ar.to);
            return (
              <div className="AristaInfo" key={index}>
                <span>→ {destiny?.label}</span>
                <span className="SpanBadge">{ar.weight}</span>
              </div>
            );
          })
        )}
      </section>

      <section>
        <h3 className="SectionTitle">Incoming edges: {aristas_input.length}</h3>
        {aristas_input.length === 0 ? (
          <span className="SpanEmpty">Not incoming edges</span>
        ) : (
          aristas_input.map((ar, index) => {
            const origin = nodos.find((nodo) => nodo.id === ar.from);
            return (
              <div className="AristaInfo" key={index}>
                <span>← {origin?.label}</span>
                <span className="SpanBadge">{ar.weight}</span>
              </div>
            );
          })
        )}
      </section>
    </Container>
  );
}

const Container = styled.div`
  width: 280px;
  height: 100%;
  background-color: white;
  border-left: 2px solid #333;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .SidebarButton {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 4px;

      &:hover {
        background-color: white;
        color: #333;
      }
    }
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .SectionTitle {
      margin: 0;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #eee;
      padding-bottom: 6px;
    }

    .SpanInfo {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #333;

      span:first-child {
        color: #666;
      }
    }

    .SpanEmpty {
      font-size: 13px;
      color: #999;
      font-style: italic;
    }

    .AristaInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      background-color: white;
      border-radius: 6px;
      font-size: 14px;
    }

    .SpanBadge {
      background-color: #2196f3;
      color: white;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
  }
`;
