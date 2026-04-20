import styled from "styled-components";
import { LuMousePointer2 } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineLeft } from "react-icons/ai";
import { TbMatrix, TbLayoutGrid } from "react-icons/tb";
import { BiExport, BiImport } from "react-icons/bi";
import { TbRouteSquare2 } from "react-icons/tb";

const toolbarLinks = [
  { label: "Mover", Icon: LuMousePointer2, op: 1 },
  { label: "Editar", Icon: FaEdit, op: 2 },
  { label: "Eliminar", Icon: MdDeleteForever, op: 3 },
];

const toolbarOptions = [{ label: "Matriz", Icon: TbMatrix, op: 4 }];

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
  onExportar,
  onImportar,
  tieneAristasNoDirigidas,
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
      {}

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
            title={
              tieneAristasNoDirigidas
                ? "No disponible para aristas no dirigidas"
                : label
            }
            $disabled={tieneAristasNoDirigidas}
          >
            <Icon />
            {isOpen && <span>{label}</span>}
            {tieneAristasNoDirigidas && <DisabledBadge>⚠</DisabledBadge>}
          </ToolButton>
        ))}
      </ToolsSection>

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



const Container = styled.aside`
  position: relative;
  flex-shrink: 0;
  width: ${({ $isOpen }) => ($isOpen ? "180px" : "72px")};
  height: calc(100vh - 64px - 16px);
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  margin: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 8px;
  transition:
    width var(--transition-bounce),
    background-color var(--transition-fast);
  z-index: 100;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    position: absolute;
    left: 8px;
    top: 8px;
    height: calc(100% - 16px);
    width: ${({ $isOpen }) => ($isOpen ? "200px" : "60px")};
    margin: 0;
    padding: 12px 6px;
    border-radius: 12px;
    background-color: rgba(13, 17, 23, 0.85);
    backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    width: ${({ $isOpen }) => ($isOpen ? "170px" : "56px")};
    padding: 8px 4px;
    height: calc(100% - 16px);
  }
`;

const TopSection = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid var(--glass-border);

  @media (max-width: 768px) {
    padding-bottom: 12px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 12px;
  padding: 0 4px;
`;

const LogoMark = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 20px;
  }
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.1em;
  background: linear-gradient(90deg, #fff 0%, #a5c8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ToolsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ToolButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 12px;
  padding: 12px 10px;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--accent-glow)" : "transparent")};
  border-radius: 10px;
  background: ${({ $active, $disabled }) =>
    $disabled
      ? "rgba(255, 255, 255, 0.02)"
      : $active
        ? "var(--accent-color)"
        : "transparent"};
  color: ${({ $active, $disabled }) =>
    $disabled
      ? "var(--text-secondary)"
      : $active
        ? "#fff"
        : "var(--text-secondary)"};
  font-weight: 600;
  font-size: 14px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-fast);
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 15px var(--accent-glow)" : "none"};

  svg {
    font-size: 24px;
    flex-shrink: 0;
    transition: transform 0.2s;

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }

  span {
    white-space: nowrap;
    overflow: hidden;

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }

  &:hover {
    background: ${({ $active, $disabled }) =>
      $disabled
        ? "rgba(255, 255, 255, 0.02)"
        : $active
          ? "var(--accent-hover)"
          : "rgba(255, 255, 255, 0.08)"};
    color: var(--text-primary);

    svg {
      transform: ${({ $disabled }) => ($disabled ? "none" : "scale(1.1)")};
    }
  }

  @media (max-width: 768px) {
    padding: 10px 8px;
  }
`;

const DisabledBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const FileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 12px;
  padding: 12px 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 24px;
    flex-shrink: 0;
    color: ${({ $color }) => $color || "var(--text-secondary)"};

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }

  span {
    white-space: nowrap;
    overflow: hidden;

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 8px;
  }
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  background: var(--glass-border);
  margin: 2px 0;
`;

const Spacer = styled.div`
  flex: 1;
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: rgba(244, 67, 54, 0.15);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: #f44336;
    color: #fff;
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ClearButtonIcon = styled.button`
  width: 100%;
  padding: 10px;
  background: rgba(244, 67, 54, 0.15);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #f44336;
  font-size: 22px;
  cursor: pointer;
  border-radius: 10px;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: all var(--transition-fast);

  &:hover {
    background: #f44336;
    color: #fff;
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }
`;

const ToggleButton = styled.button`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);

  svg {
    font-size: 20px;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(0deg)" : "rotate(180deg)"};
    transition: transform var(--transition-bounce);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
