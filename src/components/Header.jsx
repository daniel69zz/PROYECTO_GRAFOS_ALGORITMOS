import { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaHome, FaReadme } from "react-icons/fa";
import { GrGraphQl } from "react-icons/gr";
import { IoMdHelpCircle } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import logo_ucb from "/logo_ucb.png";

const navItems = [
  { to: "/", label: "Inicio", Icon: FaHome, end: true },
  { to: "/algorithm", label: "Algoritmos", Icon: FaReadme },
  { to: "/graph", label: "Grafo", Icon: GrGraphQl },
  { to: "/ayuda", label: "Ayuda", Icon: IoMdHelpCircle },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Container>
        <LogoSection>
          <img src={logo_ucb} alt="GRAPHX" />
          <Brand>GRAPHX</Brand>
        </LogoSection>

        <DesktopNav>
          {navItems.map(({ to, label, Icon, end }) => (
            <StyledNavLink key={to} to={to} end={end}>
              <Icon />
              <span>{label}</span>
            </StyledNavLink>
          ))}
        </DesktopNav>

        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoClose /> : <HiMenuAlt3 />}
        </MenuButton>
      </Container>

      <MobileMenu $isOpen={menuOpen}>
        {navItems.map(({ to, label, Icon, end }) => (
          <MobileNavLink key={to} to={to} end={end} onClick={closeMenu}>
            <Icon />
            <span>{label}</span>
          </MobileNavLink>
        ))}
      </MobileMenu>

      {menuOpen && <Overlay onClick={closeMenu} />}
    </>
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
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 56px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    height: 42px;
    width: auto;

    @media (max-width: 768px) {
      height: 36px;
    }
  }
`;

const Brand = styled.span`
  font-weight: 900;
  font-size: 16px;
  letter-spacing: 0.05em;
  color: white;

  @media (max-width: 480px) {
    display: none;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
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

const MenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 28px;
  padding: 6px;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 56px;
  right: 0;
  width: 280px;
  max-width: 85vw;
  height: calc(100vh - 56px);
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  flex-direction: column;
  gap: 12px;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
  font-size: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  svg {
    font-size: 22px;
  }

  &:hover {
    background: #5470eb15;
    border-color: #5470eb;
  }

  &.active {
    background: #5ee090;
    color: #000;
    border-color: #5ee090;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;

  @media (max-width: 768px) {
    display: block;
  }
`;
