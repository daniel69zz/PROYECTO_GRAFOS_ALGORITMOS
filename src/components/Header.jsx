import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaHome, FaReadme } from "react-icons/fa";
import { GrGraphQl } from "react-icons/gr";

import logo_ucb from "/logo_ucb.png";

const navItems = [
  { to: "/", label: "Inicio", Icon: FaHome, end: true },
  { to: "/algorithm", label: "Algoritmos", Icon: FaReadme },
  { to: "/graph", label: "Grapho", Icon: GrGraphQl },
];

function Header() {
  return (
    <Container>
      <div className="Logo">
        <img src={logo_ucb} alt="GRAPHX" />
      </div>
      <Nav>
        {navItems.map(({ to, label, Icon, end }) => (
          <StyledNavLink key={to} to={to} end={end}>
            <Icon />
            <span>{label}</span>
          </StyledNavLink>
        ))}
      </Nav>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  background-color: #5470eb;
  border-bottom: 2px solid #000;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;

  .Logo {
    img {
      height: 50px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  margin-left: auto;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 15px;
  transition: background-color 0.2s;

  svg {
    font-size: 20px;
  }

  &:hover {
    background-color: #5ee090;
  }

  &.active {
    background-color: #5ee090;
    color: #000;
  }
`;
