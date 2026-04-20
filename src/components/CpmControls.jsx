import styled from "styled-components";

export function CpmControls({
  origen,
  destino,
  pickTarget,
  onClear,
  onPrev,
  onNext,
  onFinish,
  disabledPrev = false,
  disabledNext = false,
  disabledFinish = false,
}) {
  return (
    <Wrap data-toolbar="true">
      <InputsPanel>
        <PanelTitle>CPM</PanelTitle>

        <Row>
          <Label>Nodo origen</Label>
          <ValueBox>{origen ?? "—"}</ValueBox>
        </Row>

        <Row>
          <Label>Nodo final</Label>
          <ValueBox>{destino ?? "—"}</ValueBox>
        </Row>

        <Hint>
          Selecciona:{" "}
          {pickTarget === "origen" ? (
            <strong>Origen</strong>
          ) : (
            <strong>Final</strong>
          )}
        </Hint>

        <MiniBtn onClick={onClear}>Limpiar</MiniBtn>
      </InputsPanel>

      <ButtonsPanel>
        <Btn onClick={onPrev} disabled={disabledPrev} title="Paso anterior">
          ⟵
        </Btn>

        <Btn onClick={onNext} disabled={disabledNext} title="Paso siguiente">
          ⟶
        </Btn>

        <BtnFinish
          onClick={onFinish}
          disabled={disabledFinish}
          title="Terminar algoritmo"
        >
          ✓
        </BtnFinish>
      </ButtonsPanel>
    </Wrap>
  );
}

const ValueBox = styled.div`
  height: 30px;
  border-radius: 10px;
  padding: 0 10px;
  display: flex;
  align-items: center;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: #0b1220;
  font-weight: 900;
  font-size: 13px;
`;

const MiniBtn = styled.button`
  margin-top: 8px;
  width: 100%;
  height: 30px;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Wrap = styled.div`
  position: absolute;
  right: 25px;
  bottom: 25px;
  z-index: 50;
  width: 220px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 10px;
  border-radius: 14px;

  background-color: var(--glass-bg);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  @media (max-width: 480px) {
    right: 10px;
    bottom: 10px;
    width: 200px;
    padding: 8px;
  }
`;

const InputsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 10px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
`;

const PanelTitle = styled.div`
  font-weight: 900;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.08em;
  font-size: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 8px;
  align-items: center;
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 12px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 10px;
  padding: 0 10px;

  background: rgba(255, 255, 255, 0.92);
  border: 2px solid ${({ $invalid }) => ($invalid ? "#ff4d4d" : "transparent")};
  outline: none;

  font-weight: 800;
  font-size: 13px;
  color: #0b1220;

  &:focus {
    border-color: ${({ $invalid }) => ($invalid ? "#ff4d4d" : "#5ee090")};
  }
`;

const Hint = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 200, 200, 0.95);
`;

const ButtonsPanel = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;

const Btn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);

  color: #fff;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    transform 0.12s ease,
    background 0.12s ease,
    opacity 0.12s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const BtnFinish = styled(Btn)`
  background: rgba(94, 224, 144, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: #000;

  &:hover:not(:disabled) {
    background: rgba(94, 224, 144, 1);
  }
`;
