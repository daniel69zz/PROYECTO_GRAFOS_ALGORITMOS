import { Routes, Route } from "react-router-dom";
import { Mainlayout } from "../layouts/Mainlayout";
import { GraphPage } from "../pages/GraphPage";
import { HomePage } from "../pages/HomePage";
import { AlgorithmsPage } from "../pages/AlgorithmsPage";
import { HelpPage } from "../pages/HelpPage";
import { CpmPage } from "../pages/CpmPage";
import { AsignacionPage } from "../pages/AsignacionPage";
import { NorthwestPage } from "../pages/NorthwestPage";
import { ContactPage } from "../pages/ContactPage";
import { SortsPage } from "../pages/SortsPage";
import { BinaryTreePage } from "../pages/BinaryTreePage";
import { DijkstraPage } from "../pages/DijkstraPage";
import { KruskalPage } from "../pages/KruskalPage";

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
        <Route path="/northwest" element={<NorthwestPage />} />
        <Route path="/sorts" element={<SortsPage />} />
        <Route path="/binary-tree" element={<BinaryTreePage />} />
        <Route path="/dijkstra" element={<DijkstraPage />} />
        <Route path="/kruskal" element={<KruskalPage />} />
      </Route>
    </Routes>
  );
}
