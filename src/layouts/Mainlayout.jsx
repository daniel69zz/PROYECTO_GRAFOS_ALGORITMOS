import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export function Mainlayout() {
  return (
    <AppShell>
      <Header />
      <Content>
        <Outlet />
      </Content>
    </AppShell>
  );
}

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-color: #f0f2f5;
  box-sizing: border-box;
`;
