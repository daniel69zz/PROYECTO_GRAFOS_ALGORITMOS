import styled from "styled-components";

export function Nodo({ nodo, seleccionado, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Container
      data-nodo="true"
      $nodo={nodo}
      $seleccionado={seleccionado}
      onClick={handleClick}
    >
      {nodo.label}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  left: ${(props) => props.$nodo.x - 40}px;
  top: ${(props) => props.$nodo.y - 40}px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$seleccionado ? "#ff9800" : props.$nodo.color};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  border-color: black;
  border-width: 3px;
  border-style: solid;
  cursor: pointer;
  user-select: none;
`;
