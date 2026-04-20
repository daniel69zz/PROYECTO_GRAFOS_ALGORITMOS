import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { BiExport } from "react-icons/bi";

export function ExportModal({ onConfirm, onCancel, defaultName }) {
  const [filename, setFilename] = useState(defaultName || "");
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") onConfirm(filename);
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filename, onConfirm, onCancel]);

  useEffect(() => {

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <Overlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <ModalHeader>
          <IconWrapper>
            <BiExport />
          </IconWrapper>
          <Title>Exportar Grafo</Title>
        </ModalHeader>
        <ModalBody>
          <Label>Nombre del archivo</Label>
          <Input
            ref={inputRef}
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Ej: mi_primer_grafo"
          />
          <HelpText>El archivo se guardará con extensión .json</HelpText>
        </ModalBody>
        <ModalFooter>
          <BtnCancelar onClick={onCancel}>Cancelar</BtnCancelar>
          <BtnConfirmar onClick={() => onConfirm(filename)}>
            Exportar
          </BtnConfirmar>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: #161b22;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #58a6ff;
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(88, 166, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #58a6ff;
  font-size: 28px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #f0f6fc;
  letter-spacing: -0.02em;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 14px 18px;
  color: #f0f6fc;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #58a6ff;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(88, 166, 255, 0.2);
  }

  &::placeholder {
    color: #484f58;
  }
`;

const HelpText = styled.p`
  font-size: 0.8rem;
  color: #8b949e;
  font-style: italic;
  opacity: 0.8;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const BtnCancelar = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #8b949e;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f0f6fc;
    border-color: #8b949e;
  }
`;

const BtnConfirmar = styled(Button)`
  background: #58a6ff;
  border: 1px solid #58a6ff;
  color: #ffffff;

  &:hover {
    background: #79c0ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(88, 166, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
