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
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  padding: 0 24px;
  height: 64px;
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
    height: 60px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  img {
    height: 42px;
    width: auto;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));

    @media (max-width: 768px) {
      height: 36px;
    }
  }
`;

const Brand = styled.span`
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #fff 0%, #a5c8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 15px;
  transition: all var(--transition-fast);

  svg {
    font-size: 18px;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
    
    svg {
      transform: translateY(-2px);
      color: var(--accent-hover);
    }
  }

  &.active {
    background: var(--accent-color);
    color: #fff;
    box-shadow: 0 0 15px var(--accent-glow);
    
    svg {
      color: #fff;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 24px;
  padding: 6px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 60px;
  right: 0;
  width: 280px;
  max-width: 85vw;
  height: calc(100vh - 60px);
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border-left: 1px solid var(--glass-border);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.4);
  padding: 24px;
  flex-direction: column;
  gap: 12px;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  transition: all 0.2s;

  svg {
    font-size: 20px;
  }

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--glass-border);
  }

  &.active {
    background: rgba(88, 166, 255, 0.15);
    color: var(--accent-hover);
    border-color: rgba(88, 166, 255, 0.3);
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 998;
  animation: fadeIn 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
`;
