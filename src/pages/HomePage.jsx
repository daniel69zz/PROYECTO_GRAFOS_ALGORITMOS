import styled from "styled-components";
import logo from "/logo_ucb.png";

export function HomePage() {
  return (
    <Container>
      <div className="ImgContent">
        <img src={logo} alt="Logo Ucb" />
      </div>
      <div className="TitleContent">
        <h2>ANÁLISIS DE ALGORITMOS</h2>
      </div>

      <div className="InfoContent">
        <ul>
          <li>
            <b>Estudiante: </b>Luis Daniel Rojas Caceres
          </li>
          <li>
            <b>CI: </b>6991789
          </li>
        </ul>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 15px 0px;

  h2 {
    font-size: 40px;
    margin-top: 15px;
  }
  .ImgContent {
    height: 50%;
    display: flex;
    justify-content: center;
  }
  .InfoContent {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;

    ul {
      list-style: none;
      text-align: center;
      padding: 0;

      display: flex;
      flex-direction: column;
      gap: 7px;
    }
  }

  .TitleContent {
    text-align: center;
  }
`;
