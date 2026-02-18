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
  border-right: 2px solid #000000;
  color: #000000;
  background-color: #5470eb;
  position: sticky;
  font-weight: bold;

  top: 0;
  height: 100dvh;
  min-width: 0;

  width: ${({ $isOpen }) => ($isOpen ? "200px" : "80px")};
  transition: width 0.3s ease;

  .SidebarButton {
    position: absolute;
    top: 100px;
    right: -18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: black;
    box-shadow:
      0 0 4px #000000,
      0 0 7px #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ $isOpen }) => ($isOpen ? `initial` : `rotate(180deg)`)};
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    padding: 0;
    font-family: inherit;
    outline: none;

    svg {
      background-color: #000000;
      color: white;
    }
  }

  .LogoContent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 24px;
    padding-top: 20px;
    gap: 20px;
    background-color: inherit;

    .imgContent {
      display: flex;
      background-color: inherit;
      img {
        height: 60px;
        width: 45px;
        object-fit: cover;
        background-color: inherit;
      }

      cursor: pointer;
      transition: all 0.3s;
      transform: ${({ $isOpen }) => ($isOpen ? `scale(1.4)` : `scale(1.5)`)};
    }

    h2 {
      display: ${({ $isOpen }) => ($isOpen ? `block` : `none`)};
      background-color: inherit;
    }
  }

  .LinkContainer {
    display: block;
    background-color: inherit;
    align-items: center;
    border-radius: 10px;
    margin: 8px 3px;
    padding: 0 15%;
    &:hover {
      background-color: #5ee090;
    }
    .Links {
      display: flex;
      align-items: center;
      background-color: inherit;
      justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};

      text-decoration: none;
      padding: calc(8px - 2px) 0;
      color: black;

      .Linkicon {
        background-color: inherit;
        padding: 8px 16px;
        display: flex;
        svg {
          background-color: inherit;
          font-size: 25px;
        }
      }
      &.active {
        .Linkicon {
          svg {
            color: #000000;
          }
        }
        color: #000000;
      }

      span {
        background-color: inherit;
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: black;
  margin: 24px 0;
`;
//#endregion
