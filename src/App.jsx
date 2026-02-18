import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routers/routes";

import "./index.css";

import styled from "styled-components";

function App() {
  return (
    <BrowserRouter>
      <MyRoutes />
    </BrowserRouter>
  );
}

export default App;

// const App_Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100vh;
// `;

// const Shape = styled.div`
//   display: flex;
//   box-sizing: border-box;

//   flex: 1;
//   padding: 30px;
// `;
