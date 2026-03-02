import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export function EditMenu({ tipo, datos, posicion, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState(datos.label || datos.weight || "");
  const [color, setColor] = useState(datos.color || "#4fc3f7");
  const [peso, setPeso] = useState(datos.weight || 1);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onCerrar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCerrar]);

  const handleGuardar = () => {
    if (tipo === "nodo") {
      onGuardar({ ...datos, label: nombre, color });
    } else {
      onGuardar({ ...datos, weight: parseFloat(peso) || 1 });
    }
    onCerrar();
  };

  return (
    <MenuContainer
      ref={menuRef}
      $x={posicion.x}
      $y={posicion.y}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <MenuHeader>
        <span>{tipo === "nodo" ? "✎ Editar Nodo" : "✎ Editar Arista"}</span>
        <CloseBtn onClick={onCerrar}>✕</CloseBtn>
      </MenuHeader>

      <MenuBody>
        {tipo === "nodo" && (
          <>
            <Field>
              <label>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuardar()}
                autoFocus
              />
            </Field>
            <Field>
              <label>Color</label>
              <ColorRow>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <ColorPreview $color={color} />
              </ColorRow>
            </Field>
          </>
        )}

        {tipo === "arista" && (
          <>
            <Field>
              <label>Peso</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuardar()}
                autoFocus
              />
            </Field>
          </>
        )}
      </MenuBody>

      <MenuFooter>
        <BtnCancelar onClick={onCerrar}>Cancelar</BtnCancelar>
        <BtnGuardar onClick={handleGuardar}>Guardar</BtnGuardar>
      </MenuFooter>
    </MenuContainer>
  );
}

const MenuContainer = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  z-index: 100;
  width: 240px;
  background: rgba(2, 14, 26, 0.98);
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-top: 2px solid #4fc3f7;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  color: #e8f4ff;
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 320px;
  }

  @media (max-width: 480px) {
    width: 85%;
    max-width: 280px;
  }
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(79, 195, 247, 0.15);

  span {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #4fc3f7;
    text-transform: uppercase;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;

    span {
      font-size: 0.8rem;
    }
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #4fc3f7;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 4px;
  }
`;

const MenuBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 480px) {
    padding: 14px;
    gap: 12px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(79, 195, 247, 0.7);
  }

  input[type="text"],
  input[type="number"] {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(79, 195, 247, 0.25);
    border-radius: 6px;
    color: #e8f4ff;
    font-size: 0.9rem;
    padding: 8px 12px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      border-color: #4fc3f7;
    }

    @media (max-width: 480px) {
      font-size: 0.85rem;
      padding: 10px 12px;
    }
  }
`;

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  input[type="color"] {
    width: 44px;
    height: 44px;
    border: 2px solid rgba(79, 195, 247, 0.3);
    border-radius: 6px;
    cursor: pointer;
    padding: 0;
    background: none;
    transition: border-color 0.2s;

    &:hover {
      border-color: #4fc3f7;
    }

    @media (max-width: 480px) {
      width: 48px;
      height: 48px;
    }
  }
`;

const ColorPreview = styled.div`
  flex: 1;
  height: 32px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: background 0.2s;

  @media (max-width: 480px) {
    height: 36px;
  }
`;

const MenuFooter = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid rgba(79, 195, 247, 0.15);

  @media (max-width: 480px) {
    padding: 10px 14px;
  }
`;

const BtnBase = styled.button`
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 11px;
    font-size: 0.9rem;
  }
`;

const BtnGuardar = styled(BtnBase)`
  background: #4fc3f7;
  color: #020a12;
`;

const BtnCancelar = styled(BtnBase)`
  background: rgba(255, 255, 255, 0.1);
  color: #e8f4ff;
  border: 1px solid rgba(79, 195, 247, 0.3);
`;
