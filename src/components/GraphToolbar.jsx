import styled from "styled-components";
import { LuMousePointer2 } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineLeft } from "react-icons/ai";
import { TbMatrix } from "react-icons/tb";
import { BiExport, BiImport } from "react-icons/bi"; // ⬅️ Nuevos iconos

const toolbarLinks = [
  { label: "Mover", Icon: LuMousePointer2, op: 1 },
  { label: "Editar", Icon: FaEdit, op: 2 },
  { label: "Eliminar", Icon: MdDeleteForever, op: 3 },
];

const toolbarOptions = [{ label: "Matriz", Icon: TbMatrix, op: 4 }];

// ⬅️ Nueva sección para archivo
const fileOptions = [
  { label: "Exportar", Icon: BiExport, action: "exportar" },
  { label: "Importar", Icon: BiImport, action: "importar" },
];

export function GraphToolbar({
  isOpen,
  setIsOpen,
  onClear,
  disableClear,
  herramienta,
  setHerramienta,
  onExportar, // ⬅️ Nueva prop
  onImportar, // ⬅️ Nueva prop
}) {
  const handleFileAction = (action) => {
    if (action === "exportar") {
      onExportar?.();
    } else if (action === "importar") {
      onImportar?.();
    }
  };

  return (
    <Container $isOpen={isOpen} data-toolbar="true">
      <TopSection>
        <Logo $isOpen={isOpen}>
          <LogoMark>G</LogoMark>
          {isOpen && <LogoText>GRAPHX</LogoText>}
        </Logo>
      </TopSection>

      <ToolsSection>
        {toolbarLinks.map(({ label, Icon, op }, index) => (
          <ToolButton
            key={index}
            $isOpen={isOpen}
            $active={herramienta === op}
            onClick={() => setHerramienta(op)}
            title={label}
          >
            <Icon />
            {isOpen && <span>{label}</span>}
          </ToolButton>
        ))}
      </ToolsSection>

      <Divider />

      <ToolsSection>
        {toolbarOptions.map(({ label, Icon, op }, index) => (
          <ToolButton
            key={index}
            $isOpen={isOpen}
            $active={herramienta === op}
            onClick={() => setHerramienta(op)}
            title={label}
          >
            <Icon />
            {isOpen && <span>{label}</span>}
          </ToolButton>
        ))}
      </ToolsSection>

      {/* ⬅️ Nueva sección de Archivo */}
      <Divider />

      <ToolsSection>
        {fileOptions.map(({ label, Icon, action }, index) => (
          <FileButton
            key={index}
            $isOpen={isOpen}
            onClick={() => handleFileAction(action)}
            title={label}
            $color={action === "exportar" ? "#4caf50" : "#2196f3"}
          >
            <Icon />
            {isOpen && <span>{label}</span>}
          </FileButton>
        ))}
      </ToolsSection>

      <Spacer />

      <ActionSection>
        {isOpen ? (
          <ClearButton onClick={onClear} disabled={disableClear}>
            Limpiar
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

        <ToggleButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
          <AiOutlineLeft />
        </ToggleButton>
      </ActionSection>
    </Container>
  );
}

// ── Styled Components Existentes ──

const Container = styled.aside`
  position: relative;
  flex-shrink: 0;
  width: ${({ $isOpen }) => ($isOpen ? "180px" : "68px")};
  height: 100%;
  background-color: #5470eb;
  border: 2px solid #000;
  border-radius: 12px;
  margin: 4px 8px 4px 4px;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  gap: 4px;
  transition: width 0.3s ease;
  z-index: 100;

  @media (max-width: 768px) {
    position: absolute;
    left: 8px;
    top: 8px;
    width: ${({ $isOpen }) => ($isOpen ? "200px" : "56px")};
    margin: 0;
    padding: 10px 6px;
    border-radius: 10px;
    background-color: rgba(84, 112, 235, 0.98);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    width: ${({ $isOpen }) => ($isOpen ? "170px" : "50px")};
    padding: 8px 4px;
  }
`;

const TopSection = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding-bottom: 8px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 8px;
`;

const LogoMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
`;

const LogoText = styled.span`
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: white;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ToolsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 8px;
  padding: 10px 8px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? "#5ee090" : "rgba(255, 255, 255, 0.15)"};
  color: ${({ $active }) => ($active ? "#000" : "#fff")};
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 26px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 22px;
    }
  }

  span {
    white-space: nowrap;
    overflow: hidden;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  &:hover {
    background: ${({ $active }) =>
      $active ? "#3ec970" : "rgba(255, 255, 255, 0.25)"};
  }

  @media (max-width: 768px) {
    padding: 8px 6px;
  }
`;

// ⬅️ Nuevo botón para archivo (similar a ToolButton pero con color personalizado)
const FileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 8px;
  padding: 10px 8px;
  border: none;
  border-radius: 8px;
  background: ${({ $color }) => $color || "rgba(255, 255, 255, 0.15)"};
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.9;

  svg {
    font-size: 26px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 22px;
    }
  }

  span {
    white-space: nowrap;
    overflow: hidden;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 6px;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 90%;
  background: rgba(0, 0, 0, 0.2);
  margin: 8px auto;

  @media (max-width: 768px) {
    margin: 6px auto;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding-top: 6px;
  }
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #c62828;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const ClearButtonIcon = styled.button`
  width: 100%;
  padding: 8px;
  background: rgba(244, 67, 54, 0.9);
  border: none;
  font-size: 20px;
  cursor: pointer;
  border-radius: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: all 0.2s;

  &:hover {
    background: #f44336;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    padding: 6px;
  }
`;

const ToggleButton = styled.button`
  width: 100%;
  height: 36px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  svg {
    font-size: 18px;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(0deg)" : "rotate(180deg)"};
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    height: 32px;

    svg {
      font-size: 16px;
    }
  }
`;
