import styled from "styled-components";
import { IoIosHome } from "react-icons/io";
import { GrGraphQl } from "react-icons/gr";
import { FaReadme } from "react-icons/fa";

function Header() {
  return (
    <Container>
      <ul>
        <li>
          <IoIosHome />
        </li>
        <li>
          <FaReadme />
        </li>
        <li>
          <GrGraphQl />
        </li>
      </ul>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  background-color: gray;

  ul {
    padding: 8px 20px;
    list-style: none;
    display: flex;

    font-size: 25px;
    font-weight: bold;
    gap: 15px;

    justify-content: flex-end;
  }
`;
