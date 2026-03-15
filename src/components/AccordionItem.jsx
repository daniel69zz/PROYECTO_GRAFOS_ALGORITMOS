import { useState } from "react";
import styled from "styled-components";

export function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <Item>
      <Header onClick={() => setOpen(!open)} $isOpen={open}>
        <TitleText>{title}</TitleText>
        <ToggleIcon $isOpen={open}>{open ? "−" : "+"}</ToggleIcon>
      </Header>

      {open && <Content>{children}</Content>}
    </Item>
  );
}

const Item = styled.li`
  list-style: none;
  margin-bottom: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  border: 1px solid var(--glass-border);
  transition: all var(--transition-fast);

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    margin-bottom: 12px;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  padding: 20px 24px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  transition: all var(--transition-fast);
  background: ${({ $isOpen }) => ($isOpen ? "rgba(255, 255, 255, 0.06)" : "transparent")};

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
  }
`;

const TitleText = styled.span`
  font-size: clamp(16px, 3vw, 18px);
  color: var(--text-primary);
  flex: 1;
  line-height: 1.4;
`;

const ToggleIcon = styled.span`
  font-size: 24px;
  font-weight: 300;
  color: ${({ $isOpen }) => ($isOpen ? "var(--text-primary)" : "var(--accent-color)")};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${({ $isOpen }) => ($isOpen ? "var(--accent-color)" : "rgba(88, 166, 255, 0.1)")};
  transition: all var(--transition-fast);
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 22px;
    width: 28px;
    height: 28px;
  }
`;

const Content = styled.div`
  padding: 24px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid var(--glass-border);
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  p {
    font-size: clamp(15px, 2.5vw, 16px);
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;
