import { Routes, Route } from "react-router-dom";
import { Mainlayout } from "../layouts/Mainlayout";
import { GraphPage } from "../pages/GraphPage";
import { HomePage } from "../pages/HomePage";
import { AlgorithmsPage } from "../pages/AlgorithmsPage";
import { HelpPage } from "../pages/HelpPage";
import { CpmPage } from "../pages/CpmPage";
import { AsignacionPage } from "../pages/AsignacionPage";
import { ContactPage } from "../pages/ContactPage";

export function MyRoutes() {
  return (
    <Routes>
      <Route element={<Mainlayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/algorithm" element={<AlgorithmsPage />} />
        <Route path="/ayuda" element={<HelpPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/cpm" element={<CpmPage />} />
        <Route path="/asignacion" element={<AsignacionPage />} />
      </Route>
    </Routes>
  );
}
