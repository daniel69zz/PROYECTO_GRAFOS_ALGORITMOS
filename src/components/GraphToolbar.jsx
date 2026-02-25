import styled from "styled-components";
import { LuMousePointer2 } from "react-icons/lu";

import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineLeft } from "react-icons/ai";
import { TbMatrix } from "react-icons/tb";

import { DragMatrix } from "./DragMatrix";

const toolbarLinks = [
  { label: "Mover", Icon: LuMousePointer2, end: true, op: 1 },
  { label: "Editar", Icon: FaEdit, op: 2 },
  { label: "Eliminar", Icon: MdDeleteForever, op: 3 },
];

const toolbarOptions = [{ label: "Matriz de Ad", Icon: TbMatrix, op: 4 }];

export function GraphToolbar({
  isOpen,
  setIsOpen,
  onClear,
  disableClear,
  herramienta,
  setHerramienta,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "1") {
      setHerramienta(1);
    }
    if (e.key === "2") {
      setHerramienta(2);
    }
    if (e.key === "3") {
      setHerramienta(3);
    }
    if (e.key === "4") {
      setHerramienta(4);
    }
  };
  return (
    <Container $isOpen={isOpen} data-toolbar="true">
      <TopSection>
        <Logo>
          <span>G</span>
          {isOpen && <h2>GRAPHX</h2>}
        </Logo>
      </TopSection>

      {toolbarLinks.map(({ label, Icon, end, op }, index) => (
        <LinkWrapper key={index}>
          <OpcionButton
            $isOpen={isOpen}
            onClick={() => setHerramienta(op)}
            onKeyDown={handleKeyDown}
            className={herramienta === op ? "active" : ""}
          >
            <Icon />
            {isOpen && <span>{label}</span>}
          </OpcionButton>
        </LinkWrapper>
      ))}

      <Divider />

      {isOpen ? (
        <ClearButton onClick={onClear} disabled={disableClear}>
          Limpiar Todo
        </ClearButton>
      ) : (
        <ClearButtonIcon
          onClick={onClear}
          disabled={disableClear}
          title="Limpiar Todo"
        >
          🗑
        </ClearButtonIcon>
      )}

      <Divider />

      {toolbarOptions.map(({ label, Icon, op }, index) => (
        <LinkWrapper key={index}>
          <OpcionButton
            $isOpen={isOpen}
            onClick={() => setHerramienta(op)}
            onKeyDown={handleKeyDown}
            className={herramienta === op ? "active" : ""}
          >
            <Icon />
            {isOpen && <span>{label}</span>}
          </OpcionButton>
        </LinkWrapper>
      ))}

      <Divider />

      <ToggleBtn onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <AiOutlineLeft />
      </ToggleBtn>
    </Container>
  );
}

const Container = styled.aside`
  margin: 4px 8px;
  margin-right: 0px;
  position: relative;
  flex-shrink: 0;
  width: ${({ $isOpen }) => ($isOpen ? "180px" : "68px")};
  transition: width 0.3s ease;
  background-color: #5470eb;
  border: 2px solid #000;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  gap: 4px;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 12px;
  gap: 4px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: bold;
  flex: 1;
  overflow: hidden;

  span {
    font-size: 24px;
    font-weight: 900;
    flex-shrink: 0;
  }

  h2 {
    font-size: 16px;
    margin: 0;
    white-space: nowrap;
  }
`;

const ToggleBtn = styled.button`
  margin-top: 10px;
  flex-shrink: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 6px #000;
  transition: transform 0.3s;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(0deg)" : "rotate(180deg)")};
  padding: 0;
`;

const LinkWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  &:hover {
    background-color: #5ee090;
  }
`;

const OpcionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 10px;
  padding: 8px 12px;
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 14px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;

  background: none;
  border: none;
  cursor: pointer;

  svg {
    font-size: 30px;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
  }

  &.active {
    background-color: #5ee090;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 90%;
  background: black;
  margin: 8px 0;
`;

const ClearButton = styled.button`
  width: 90%;
  padding: 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: #c62828;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ClearButtonIcon = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background-color: #5ee090;
  }
`;
