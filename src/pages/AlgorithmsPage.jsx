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

const Container = styled.div`
  min-height: calc(100vh - 64px);
  background-color: #050810;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(88, 166, 255, 0.08), transparent 40%),
    radial-gradient(circle at 85% 30%, rgba(88, 166, 255, 0.12), transparent 40%);
  overflow: auto;
  position: relative;
`;

const Hero = styled.header`
  background: linear-gradient(180deg, #0d1117 0%, transparent 100%);
  padding: 100px 30px 60px;
  text-align: center;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%; left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 100vw;
    pointer-events: none;
    background: radial-gradient(circle, rgba(88, 166, 255, 0.1) 0%, transparent 60%);
    filter: blur(60px);
  }

  @media (max-width: 768px) {
    padding: 80px 20px 40px;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  h1 {
    font-size: clamp(40px, 8vw, 72px);
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 24px;
    background: linear-gradient(180deg, #ffffff 0%, #a5c8ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 40px rgba(88, 166, 255, 0.2);
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(18px, 3vw, 22px);
  color: var(--text-secondary);
  line-height: 1.6;
  font-weight: 400;
`;

const Content = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 40px 16px 60px;
    gap: 32px;
  }

  @media (max-width: 480px) {
    padding: 32px 12px 40px;
    gap: 24px;
  }
`;

const Card = styled.section`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 56px 48px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: transform var(--transition-bounce), box-shadow var(--transition-normal);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(88, 166, 255, 0.2);
  }

  h2 {
    font-size: clamp(28px, 4vw, 36px);
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  p {
    font-size: clamp(16px, 2.5vw, 18px);
    line-height: 1.8;
    color: var(--text-secondary);
    font-weight: 400;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
`;

const SectionLabel = styled.span`
  font-size: clamp(13px, 2vw, 15px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #58a6ff;
  display: inline-block;
  margin-bottom: -12px;
  text-shadow: 0 0 15px rgba(88, 166, 255, 0.4);
`;

const Blockquote = styled.blockquote`
  border-left: 4px solid var(--accent-color);
  padding: 20px 24px;
  margin: 16px 0;
  background: rgba(88, 166, 255, 0.05);
  border-radius: 0 12px 12px 0;
  font-style: italic;
  font-size: clamp(16px, 2.5vw, 20px);
  color: var(--text-primary);
  line-height: 1.6;
  position: relative;

  @media (max-width: 480px) {
    padding: 16px 20px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 32px 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 2px 0 ${(props) => props.$accent};
  transition: all var(--transition-bounce);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 100px;
    background: radial-gradient(circle at top, ${(props) => props.$accent}33, transparent 70%);
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 3px 0 ${(props) => props.$accent};
    border-color: rgba(255, 255, 255, 0.1);

    &::before {
      opacity: 1;
    }
  }

  h3 {
    font-size: clamp(18px, 3vw, 20px);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  p {
    font-size: clamp(15px, 2.5vw, 16px);
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const FeatureIcon = styled.span`
  font-size: clamp(40px, 8vw, 56px);
  display: block;
  margin-bottom: 16px;
  color: var(--text-primary);
  opacity: 0.9;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  li {
    font-size: clamp(16px, 2.5vw, 18px);
    color: var(--text-secondary);
    line-height: 1.8;
    display: flex;
    align-items: baseline;
    gap: 16px;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, 0.2);
    padding: 16px 20px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    transition: transform var(--transition-fast);

    &:hover {
      transform: translateX(4px);
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Badge = styled.span`
  display: inline-block;
  background: rgba(88, 166, 255, 0.15);
  color: var(--accent-hover);
  font-weight: 700;
  font-size: clamp(13px, 2vw, 15px);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(88, 166, 255, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
  text-shadow: 0 0 10px rgba(88, 166, 255, 0.3);
`;

const AccordionList = styled.ol`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin: 20px 0;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--glass-border);

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
    margin: 16px 0;
  }
`;

const VideoList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;

  h4 {
    font-size: clamp(18px, 3vw, 20px);
    font-weight: 600;
    color: var(--text-primary);
    padding-bottom: 8px;
    border-bottom: 2px solid var(--accent-color);
    display: inline-block;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    gap: 24px;
  }
`;
