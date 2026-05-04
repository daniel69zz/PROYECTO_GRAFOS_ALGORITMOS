import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaDice } from "react-icons/fa";

const DEFAULT_FORM = {
  count: "7",
  min: "1",
  max: "99",
};

export function RandomTreeModal({ onClose, onGenerate }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(DEFAULT_FORM);
    setError("");
  }, []);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const count = Number(form.count);
    const min = Number(form.min);
    const max = Number(form.max);

    if (!Number.isInteger(count) || count <= 0) {
      setError("La cantidad de nodos debe ser un entero mayor a 0.");
      return;
    }

    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      setError("El valor minimo y maximo debe ser enteros.");
      return;
    }

    if (min > max) {
      setError("El valor minimo no puede ser mayor al maximo.");
      return;
    }

    if (max - min + 1 < count) {
      setError(
        "El rango elegido no alcanza para generar valores unicos sin repetir.",
      );
      return;
    }

    onGenerate({ count, min, max });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Header>
          <IconBox>
            <FaDice />
          </IconBox>
          <div>
            <Title>Generar arbol aleatorio</Title>
            <Subtitle>
              Crea un BST con valores unicos dentro de un rango definido.
            </Subtitle>
          </div>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FieldRow>
            <Field>
              <label>Numero de nodos</label>
              <input
                type="number"
                min="1"
                value={form.count}
                onChange={(event) => handleChange("count", event.target.value)}
              />
            </Field>

            <Field>
              <label>Valor minimo</label>
              <input
                type="number"
                value={form.min}
                onChange={(event) => handleChange("min", event.target.value)}
              />
            </Field>

            <Field>
              <label>Valor maximo</label>
              <input
                type="number"
                value={form.max}
                onChange={(event) => handleChange("max", event.target.value)}
              />
            </Field>
          </FieldRow>

          <Hint>
            Se generaran valores enteros sin repetir. Si ya existe un arbol, se
            reemplazara por completo.
          </Hint>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Actions>
            <GhostButton type="button" onClick={onClose}>
              Cancelar
            </GhostButton>
            <PrimaryButton type="submit">Generar</PrimaryButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(10px);
`;

const Modal = styled.div`
  width: min(640px, 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 36%),
    rgba(11, 18, 32, 0.96);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  padding: 28px;
  color: var(--text-primary);
  animation: modalUp 0.28s ease-out;

  @keyframes modalUp {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 640px) {
    padding: 22px 18px;
    border-radius: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
`;

const IconBox = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(14, 165, 233, 0.14);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  margin: 6px 0 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  label {
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
  }

  input {
    height: 44px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    padding: 0 14px;
    font-weight: 700;
    outline: none;
    transition: border-color var(--transition-fast);
  }

  input:focus {
    border-color: rgba(56, 189, 248, 0.55);
  }
`;

const Hint = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ErrorBox = styled.div`
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  font-weight: 700;
  line-height: 1.45;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const BaseButton = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-1px);
  }
`;

const GhostButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
`;

const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #fff;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
`;
