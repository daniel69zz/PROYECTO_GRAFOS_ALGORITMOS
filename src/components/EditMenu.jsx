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
  width: 210px;
  background: rgba(2, 14, 26, 0.97);
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-top: 2px solid #4fc3f7;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  font-family: "Syne", sans-serif;
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
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(79, 195, 247, 0.15);

  span {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #4fc3f7;
    text-transform: uppercase;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #4fc3f7;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  line-height: 1;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;

const MenuBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(79, 195, 247, 0.6);
    font-family: "Space Mono", monospace;
  }

  input[type="text"],
  input[type="number"] {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(79, 195, 247, 0.2);
    border-radius: 4px;
    color: #e8f4ff;
    font-family: "Syne", sans-serif;
    font-size: 0.85rem;
    padding: 7px 10px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      border-color: #4fc3f7;
    }
  }
`;

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input[type="color"] {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    background: none;
  }
`;

const ColorPreview = styled.div`
  flex: 1;
  height: 28px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
`;

const MenuFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid rgba(79, 195, 247, 0.15);
`;

const BtnBase = styled.button`
  flex: 1;
  padding: 7px;
  border: none;
  border-radius: 4px;
  font-family: "Syne", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.15s;
  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const BtnGuardar = styled(BtnBase)`
  background: #4fc3f7;
  color: #020a12;
`;

const BtnCancelar = styled(BtnBase)`
  background: rgba(255, 255, 255, 0.07);
  color: #e8f4ff;
  border: 1px solid rgba(79, 195, 247, 0.2);
`;
