import styled from "styled-components";
import { AiOutlineLeft } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import logo from "/escudo_ucb.png";

import links_sidebar from "../utils/data_aux";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const links = links_sidebar();

  return (
    <Container $isOpen={sidebarOpen}>
      <button onClick={ModSidebaropen} className="SidebarButton">
        <AiOutlineLeft />
      </button>

      <div className="LogoContent">
        <div className="imgContent">
          <img src={logo} alt="logo coffix" />
        </div>
        <h2>GRAPHX</h2>
      </div>

      {links.map(({ Icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
          >
            <div className="Linkicon">
              <Icon />
            </div>
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        </div>
      ))}

      <Divider />
    </Container>
  );
}

//#region STYLED COMPONENTS
const Container = styled.div`
  border-right: 1px solid var(--glass-border);
  color: var(--text-primary);
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  position: sticky;
  font-weight: 600;

  top: 0;
  height: calc(100vh - 64px);
  min-width: 0;

  width: ${({ $isOpen }) => ($isOpen ? "240px" : "80px")};
  transition: width var(--transition-bounce), background-color var(--transition-fast);
  z-index: 90;

  .SidebarButton {
    position: absolute;
    top: 80px;
    right: -16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-bounce);
    transform: ${({ $isOpen }) => ($isOpen ? `initial` : `rotate(180deg)`)};
    color: var(--text-primary);
    padding: 0;
    z-index: 10;

    &:hover {
      background: var(--accent-color);
      color: #fff;
      transform: ${({ $isOpen }) => ($isOpen ? `scale(1.1)` : `rotate(180deg) scale(1.1)`)};
    }

    svg {
      font-size: 16px;
    }
  }

  .LogoContent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 24px;
    padding-top: 24px;
    gap: 16px;
    border-bottom: 1px solid var(--glass-border);
    margin-bottom: 16px;

    .imgContent {
      display: flex;
      img {
        height: 48px;
        width: auto;
        object-fit: contain;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }

      cursor: pointer;
      transition: transform var(--transition-bounce);
      transform: ${({ $isOpen }) => ($isOpen ? `scale(1.1)` : `scale(1.3)`)};
    }

    h2 {
      display: ${({ $isOpen }) => ($isOpen ? `block` : `none`)};
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.1em;
      background: linear-gradient(90deg, #fff 0%, #a5c8ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }
  }

  .LinkContainer {
    display: block;
    margin: 8px 12px;
    
    .Links {
      display: flex;
      align-items: center;
      justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
      text-decoration: none;
      padding: 10px;
      border-radius: 12px;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      gap: 12px;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        transform: translateX(4px);
      }

      .Linkicon {
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          font-size: 24px;
          transition: transform 0.2s;
        }
      }

      &.active {
        background: rgba(88, 166, 255, 0.15);
        color: var(--accent-hover);
        box-shadow: inset 2px 0 0 var(--accent-color);
        
        .Linkicon svg {
          color: var(--accent-color);
        }
      }

      span {
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: calc(100% - 24px);
  background: var(--glass-border);
  margin: 16px auto;
`;
//#endregion
