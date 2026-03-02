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
  border-radius: 12px;
  background: #f5f7fa;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    margin-bottom: 12px;
    border-radius: 10px;
  }
`;

const Header = styled.div`
  padding: 18px 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  background: ${({ $isOpen }) => ($isOpen ? "#e3e8ef" : "transparent")};

  &:hover {
    background: #e3e8ef;
  }

  &:active {
    background: #d4dae3;
  }

  @media (max-width: 768px) {
    padding: 16px 18px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

const TitleText = styled.span`
  font-size: clamp(15px, 3vw, 17px);
  color: #0f172a;
  flex: 1;
  line-height: 1.4;
`;

const ToggleIcon = styled.span`
  font-size: 24px;
  font-weight: 300;
  color: #5470eb;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: ${({ $isOpen }) => ($isOpen ? "#5470eb15" : "transparent")};
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 22px;
    width: 26px;
    height: 26px;
  }
`;

const Content = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
  animation: slideDown 0.2s ease;

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
    font-size: clamp(14px, 2.5vw, 16px);
    line-height: 1.7;
    color: #475569;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    padding: 18px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;
