import { useState } from "react";
import styled from "styled-components";

export function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <Item>
      <Header onClick={() => setOpen(!open)}>
        {title}
        <span>{open ? "−" : "+"}</span>
      </Header>

      {open && <Content>{children}</Content>}
    </Item>
  );
}

const Item = styled.li`
  list-style: none;
  margin-bottom: 15px;
  border-radius: 10px;
  background: #f5f7fa;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: background 0.2s ease;

  &:hover {
    background: #e3e8ef;
  }
`;

const Content = styled.div`
  padding: 15px;
  background: white;
`;
