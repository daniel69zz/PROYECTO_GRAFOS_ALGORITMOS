import styled from "styled-components";
import { AccordionItem } from "../components/AccordionItem";

import { MdInput, MdOutput } from "react-icons/md";
import { VscServerProcess } from "react-icons/vsc";

function ResponsiveVideo({ src, title }) {
  return (
    <VideoWrapper>
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoWrapper>
  );
}

export function AlgorithmsPage() {
  return (
    <Container>
      {/* ── Hero Section ── */}
      <Hero>
        <HeroContent>
          <h1>Algoritmos</h1>
          <HeroSubtitle>
            Descubre los fundamentos, tipos y aplicaciones de los algoritmos en
            la ciencia de la computación.
          </HeroSubtitle>
        </HeroContent>
      </Hero>

      <Content>
        {/* ── ¿Qué es un algoritmo? ── */}
        <Card>
          <SectionLabel>Introducción</SectionLabel>
          <h2>¿Qué es un algoritmo?</h2>
          <ResponsiveVideo
            src="https://www.youtube.com/embed/U3CGMyjzlvM"
            title="¿Qué es un algoritmo?"
          />
          <p>
            Un algoritmo es un{" "}
            <b>conjunto finito y ordenado de pasos o instrucciones</b> que se
            siguen para resolver un problema o realizar una tarea.
          </p>
          <p>En otras palabras:</p>
          <Blockquote>
            "Es una receta paso a paso para llegar a un resultado."
          </Blockquote>
        </Card>

        {/* ── Origen ── */}
        <Card>
          <SectionLabel>Historia</SectionLabel>
          <h2>¿De dónde viene la palabra "algoritmo"?</h2>
          <p>
            Esta palabra viene del nombre del matemático{" "}
            <em>Muhammad ibn Musa al-Khwarizmi</em>, que vivió en el siglo IX y
            escribió libros fundamentales sobre matemáticas, especialmente sobre
            métodos sistemáticos para resolver ecuaciones.
          </p>
          <p>
            Su nombre fue latinizado como <em>Algoritmi</em> y de ahí nació el
            término <b>algoritmo.</b>
          </p>
        </Card>

        {/* ── Partes ── */}
        <Card>
          <SectionLabel>Estructura</SectionLabel>
          <h2>Partes de un algoritmo</h2>
          <p>
            Tiene <b>3 partes fundamentales</b>:
          </p>
          <FeatureGrid>
            <FeatureCard $accent="#4f46e5">
              <FeatureIcon>
                <MdInput />
              </FeatureIcon>
              <h3>Input (entrada)</h3>
              <p>
                Información que damos al algoritmo con la que va a trabajar para
                ofrecer la solución esperada.
              </p>
            </FeatureCard>
            <FeatureCard $accent="#0891b2">
              <FeatureIcon>
                <VscServerProcess />
              </FeatureIcon>
              <h3>Proceso</h3>
              <p>
                Conjunto de pasos para que, a partir de los datos de entrada,
                llegue a la solución de la situación.
              </p>
            </FeatureCard>
            <FeatureCard $accent="#059669">
              <FeatureIcon>
                <MdOutput />
              </FeatureIcon>
              <h3>Output (salida)</h3>
              <p>
                Resultados a partir de la transformación de los valores de
                entrada durante el proceso.
              </p>
            </FeatureCard>
          </FeatureGrid>
        </Card>

        {/* ── Características ── */}
        <Card>
          <SectionLabel>Propiedades</SectionLabel>
          <h2>Características de un algoritmo</h2>
          <p>
            Los algoritmos presentan una serie de{" "}
            <b>características comunes:</b>
          </p>
          <CharacteristicsList>
            <li>
              <Badge>Precisos</Badge> Objetivos, sin ambigüedad.
            </li>
            <li>
              <Badge>Ordenados</Badge> Presentan una secuencia clara y precisa.
            </li>
            <li>
              <Badge>Finitos</Badge> Contienen un número determinado de pasos.
            </li>
            <li>
              <Badge>Concretos</Badge> Ofrecen una solución determinada.
            </li>
            <li>
              <Badge>Definidos</Badge> El mismo algoritmo da el mismo resultado
              con la misma entrada.
            </li>
          </CharacteristicsList>
        </Card>

        {/* ── Tipos ── */}
        <Card>
          <SectionLabel>Clasificación</SectionLabel>
          <h2>Tipos de algoritmos</h2>

          <AccordionList>
            <AccordionItem title="🔍 Algoritmos de Búsqueda">
              <p>
                Localizan uno o varios elementos que presenten una serie de
                propiedades dentro de una estructura de datos.
              </p>
              <VideoList>
                <li>
                  <h4>Búsqueda Binaria</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/wAmu0Ly5ook"
                    title="Búsqueda binaria"
                  />
                </li>
                <li>
                  <h4>Depth-First Search (DFS)</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/PMMc4VsIacU"
                    title="Depth-First Search"
                  />
                </li>
                <li>
                  <h4>Breadth-First Search (BFS)</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/xlVX7dXLS64"
                    title="Breadth-First Search"
                  />
                </li>
              </VideoList>
            </AccordionItem>

            <AccordionItem title="📊 Algoritmos de Ordenamiento">
              <p>
                Reorganizan los elementos de un listado según una relación de
                orden. Las más habituales son el orden numérico y el orden
                lexicográfico.
              </p>
              <VideoList>
                <li>
                  <h4>Quicksort</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/UrPJLhKF1jY"
                    title="Quicksort"
                  />
                </li>
                <li>
                  <h4>MergeSort</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/ACFZn_xQcz8"
                    title="MergeSort"
                  />
                </li>
              </VideoList>
            </AccordionItem>

            <AccordionItem title="🌐 Algoritmos sobre Grafos">
              <p>
                Diseñados para trabajar con estructuras llamadas grafos, que
                modelan relaciones entre entidades.
              </p>
              <VideoList>
                <li>
                  <h4>Algoritmo de Dijkstra</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/LLx0QVMZVkk"
                    title="Dijkstra"
                  />
                </li>
                <li>
                  <h4>Algoritmo de Floyd–Warshall</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/h-nmexY9gtA"
                    title="Floyd-Warshall"
                  />
                </li>
                <li>
                  <h4>Algoritmo de Kruskal</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/lTCDUJw_4GM"
                    title="Kruskal"
                  />
                </li>
              </VideoList>
            </AccordionItem>

            <AccordionItem title="🧩 Programación Dinámica">
              <p>
                Método que divide un problema complejo en subproblemas,
                almacenando sus soluciones para no recalcularlas.
              </p>
              <VideoList>
                <li>
                  <h4>La Serie de Fibonacci</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/EEqTaMeDVKo"
                    title="Fibonacci"
                  />
                </li>
              </VideoList>
            </AccordionItem>

            <AccordionItem title="🤖 Aprendizaje Automático">
              <p>
                Permiten a una computadora aprender patrones a partir de datos y
                hacer predicciones sin programación explícita.
              </p>
              <VideoList>
                <li>
                  <h4>Regresión Lineal</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/hmVh2ddVCK4"
                    title="Regresión Lineal"
                  />
                </li>
                <li>
                  <h4>Support Vector Machines (SVM)</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/pEvLf93kL6s"
                    title="Support Vector Machines"
                  />
                </li>
                <li>
                  <h4>Redes Neuronales</h4>
                  <ResponsiveVideo
                    src="https://www.youtube.com/embed/jKCQsndqEGQ"
                    title="Redes Neuronales"
                  />
                </li>
              </VideoList>
            </AccordionItem>
          </AccordionList>
        </Card>
      </Content>
    </Container>
  );
}

/* ════════════════════════════════════════════
   STYLED COMPONENTS
   ════════════════════════════════════════════ */

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  overflow: auto;
`;

/* ── Hero ── */
const Hero = styled.header`
  background-color: #227390;
  padding: 60px 30px;
  text-align: center;
  color: white;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const HeroContent = styled.div`
  max-width: 700px;
  margin: 0 auto;

  h1 {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  opacity: 0.9;
  line-height: 1.6;
`;

const Content = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 24px 16px 60px;
    gap: 24px;
  }
`;

/* ── Card ── */
const Card = styled.section`
  background: white;
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
  border: 3px solid #08264c;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: clamp(1.4rem, 3vw, 1.85rem);
    font-weight: 700;
    color: #141b26;
    line-height: 1.3;
  }

  p {
    font-size: 1.05rem;
    line-height: 1.75;
    color: black;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const SectionLabel = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1e108b;
`;

const Blockquote = styled.blockquote`
  border-left: 4px solid #117a20;
  padding: 16px 20px;
  margin: 8px 0;
  background: #f5f3ff;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  font-size: 1.1rem;
  color: #06300d;
  line-height: 1.6;
`;

/* ── Feature grid (Input / Proceso / Output) ── */
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 8px;
`;

const FeatureCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-top: 4px solid ${(props) => props.$accent};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.6;
  }
`;

const FeatureIcon = styled.span`
  font-size: 2rem;
  display: block;
  margin-bottom: 12px;
`;

/* ── Características ── */
const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    font-size: 1.05rem;
    color: #475569;
    line-height: 1.6;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  background: #ede9fe;
  color: #6d28d9;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
`;

/* ── Accordion ── */
const AccordionList = styled.ol`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* ── Video responsive ── */
const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const VideoList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #334155;
    padding-bottom: 4px;
    border-bottom: 2px solid #e2e8f0;
    display: inline-block;
  }
`;
