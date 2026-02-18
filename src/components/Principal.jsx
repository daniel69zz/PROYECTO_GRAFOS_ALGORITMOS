import logo_ucb from "/logo_ucb.png";
import styled from "styled-components";

export function Principal() {
  return (
    <Container>
      <div className="img_container">
        <img src={logo_ucb} />
      </div>

      <div className="text_container">
        <h2>ANALISIS DE ALGORITMOS</h2>
      </div>
    </Container>
  );
}

const Container = styled.div`
  border-radius: 20px;
  background-color: white;
  padding: 15px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  flex: 1;
  text-align: center;
  font-weight: bold;

  .text_container {
    font-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img_container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
