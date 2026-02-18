import { GrGraphQl } from "react-icons/gr";
import { FaHome, FaReadme } from "react-icons/fa";

const linksArray = [
  {
    label: "Inicio",
    Icon: FaHome,
    to: "/",
  },
  {
    label: "Algoritmos",
    Icon: FaReadme,
    to: "/algorithm",
  },
  {
    label: "Grapho",
    Icon: GrGraphQl,
    to: "/graph",
  },
];

export default function links_sidebar() {
  return linksArray;
}
