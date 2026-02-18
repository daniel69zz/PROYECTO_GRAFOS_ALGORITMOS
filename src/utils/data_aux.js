import { GrGraphQl } from "react-icons/gr";
import { FaHome, FaReadme } from "react-icons/fa";

const linksArray = [
  {
    label: "Home",
    Icon: FaHome,
    to: "/",
  },
  {
    label: "Algorithms",
    Icon: FaReadme,
    to: "/algorithm",
  },
  {
    label: "Graph",
    Icon: GrGraphQl,
    to: "/graph",
  },
];

export default function links_sidebar() {
  return linksArray;
}
