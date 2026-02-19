import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import { useState } from "react";

export function Mainlayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Container>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #55db3a;
  overflow-y: auto;
  min-width: 0;
`;
