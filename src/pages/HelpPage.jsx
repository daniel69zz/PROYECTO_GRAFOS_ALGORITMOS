import { useMemo, useState } from "react";
import styled from "styled-components";

const HELP_SECTIONS = [
  {
    number: 1,
    category: "Editor de grafos",
    title: "Crear / Mover + Desplazamiento",
    description: "Construye el grafo y acomoda el lienzo de trabajo.",
    features: [
      {
        name: "Crear nodos",
        description: "Haz doble clic sobre un espacio vacio para crear un nodo.",
      },
      {
        name: "Crear aristas",
        description:
          "Haz clic en nodo origen, luego nodo destino y define el peso de la conexion.",
      },
      {
        name: "Mover nodos",
        description: "Arrastra cualquier nodo para reubicarlo visualmente.",
      },
      {
        name: "Desplazar lienzo",
        description: "Haz clic y arrastra sobre el fondo para mover la vista.",
      },
    ],
  },
  {
    number: 2,
    category: "Editor de grafos",
    title: "Editar",
    description: "Modifica elementos existentes del grafo con un clic.",
    features: [
      {
        name: "Editar nodo",
        description: "Cambia nombre y color del nodo seleccionado.",
      },
      {
        name: "Editar arista",
        description: "Modifica el peso de una arista existente.",
      },
    ],
  },
  {
    number: 3,
    category: "Editor de grafos",
    title: "Eliminar",
    description: "Elimina nodos o aristas puntuales del grafo.",
    features: [
      {
        name: "Eliminar elementos",
        description: "Haz clic sobre un nodo o una arista para borrarlo.",
      },
    ],
  },
  {
    number: 4,
    category: "Editor de grafos",
    title: "Matriz Ponderada Dirigida",
    description: "Genera la representacion matricial del grafo dirigido.",
    features: [
      {
        name: "Matriz de adyacencia",
        description:
          "Considera la direccion y el peso de las aristas para construir la matriz.",
      },
    ],
  },
  {
    number: 5,
    category: "Johnson",
    title: "Algoritmo de Johnson",
    description:
      "Calcula ruta critica o ruta minima paso a paso sobre el grafo.",
    features: [
      {
        name: "Configuracion",
        description:
          "Selecciona nodo origen, nodo destino y el objetivo: maximizar o minimizar.",
      },
      {
        name: "Ejecucion paso a paso",
        description:
          "Usa los controles para avanzar entre los calculos Forward y Backward.",
      },
      {
        name: "Resultado final",
        description:
          "Al finalizar puedes ver la duracion total y el camino resaltado.",
      },
    ],
  },
  {
    number: 6,
    category: "Asignacion",
    title: "Algoritmo de Asignacion",
    description:
      "Encuentra la asignacion optima entre origenes y destinos.",
    features: [
      {
        name: "Division visual",
        description:
          "Los nodos de la izquierda son origenes y los de la derecha son destinos.",
      },
      {
        name: "Conectar costos",
        description:
          "Relaciona origenes con destinos y asigna pesos para formar la matriz de costos.",
      },
      {
        name: "Balanceo",
        description:
          "El sistema ajusta automaticamente el problema si faltan filas o columnas equivalentes.",
      },
    ],
  },
  {
    number: 7,
    category: "Northwest",
    title: "Metodo Northwest Corner",
    description:
      "Calcula una asignacion inicial para problemas de transporte.",
    features: [
      {
        name: "Matriz dinamica",
        description:
          "Agrega o elimina origenes y destinos, y completa costos, oferta y demanda.",
      },
      {
        name: "Balanceo automatico",
        description:
          "Si falta oferta o demanda, el sistema agrega elementos ficticios al resolver.",
      },
      {
        name: "Pasos detallados",
        description:
          "Puedes revisar el proceso de resolucion y la solucion resaltada.",
      },
    ],
  },
  {
    number: 8,
    category: "Sorts",
    title: "Algoritmos de Ordenamiento",
    description:
      "Visualiza como funcionan los algoritmos clasicos de ordenamiento.",
    features: [
      {
        name: "Generador de arreglos",
        description:
          "Crea arreglos aleatorios, escribe tus propios valores o importa un JSON.",
      },
      {
        name: "Configuracion",
        description:
          "Elige algoritmo, orden ascendente o descendente y controla la ejecucion.",
      },
      {
        name: "Animacion",
        description:
          "Usa play, pausa y reinicio para seguir el proceso paso a paso.",
      },
    ],
  },
  {
    number: 9,
    category: "Arboles Binarios",
    title: "Arboles Binarios",
    description:
      "Construye un BST, reconstruye arboles y anima los recorridos.",
    features: [
      {
        name: "Construir arbol",
        description:
          "Inserta numeros con Enter o con el boton, y evita duplicados automaticamente.",
      },
      {
        name: "Reconstruir",
        description:
          "Usa In-Order + Pre-Order o In-Order + Post-Order con validacion completa.",
      },
      {
        name: "Recorridos y utilidades",
        description:
          "Anima In-Order, Pre-Order y Post-Order, exporta/importa JSON y genera datos aleatorios.",
      },
    ],
  },
];

const CATEGORY_OPTIONS = [
  "Todas",
  ...new Set(HELP_SECTIONS.map((section) => section.category)),
];

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredSections = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return HELP_SECTIONS.filter((section) => {
      const categoryMatch =
        selectedCategory === "Todas" || section.category === selectedCategory;

      if (!categoryMatch) return false;

      if (!query) return true;

      const haystack = [
        section.category,
        section.title,
        section.description,
        ...section.features.flatMap((feature) => [
          feature.name,
          feature.description,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Container>
      <Card>
        <Hero>
          <Title>Guia de Usuario</Title>
          <Subtitle>
            Consulta las funciones del proyecto y filtra la ayuda por categoria.
          </Subtitle>
        </Hero>

        <IntroSection>
          <SectionTitle>Como cambiar de opcion</SectionTitle>
          <Text>
            Puedes cambiar entre herramientas y algoritmos usando el toolbar,
            el header del grafo y las rutas principales del proyecto.
          </Text>

          <MethodGrid>
            <MethodCard>
              <MethodTitle>Click directo</MethodTitle>
              <MethodText>
                Haz clic sobre la opcion o algoritmo que quieras abrir.
              </MethodText>
            </MethodCard>

            <MethodCard>
              <MethodTitle>Teclas rapidas</MethodTitle>
              <KeyList>
                <KeyItem>
                  <Key>1</Key> Mover / crear
                </KeyItem>
                <KeyItem>
                  <Key>2</Key> Editar
                </KeyItem>
                <KeyItem>
                  <Key>3</Key> Eliminar
                </KeyItem>
                <KeyItem>
                  <Key>4</Key> Matriz
                </KeyItem>
              </KeyList>
            </MethodCard>
          </MethodGrid>
        </IntroSection>

        <Divider />

        <FilterPanel>
          <FilterHeader>
            <div>
              <SectionLabel>Buscador</SectionLabel>
              <SectionTitle>Filtrar por categoria</SectionTitle>
            </div>
            <ResultCount>
              {filteredSections.length} resultado
              {filteredSections.length === 1 ? "" : "s"}
            </ResultCount>
          </FilterHeader>

          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar algoritmo, categoria o funcion"
          />

          <CategoryRow>
            {CATEGORY_OPTIONS.map((category) => (
              <CategoryButton
                key={category}
                type="button"
                $active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryRow>
        </FilterPanel>

        <SectionsColumn>
          {filteredSections.length === 0 ? (
            <EmptyState>
              <h3>Sin resultados</h3>
              <p>
                Prueba otra categoria o ajusta el texto del buscador para
                encontrar la seccion que necesitas.
              </p>
            </EmptyState>
          ) : (
            filteredSections.map((section) => (
              <SectionCard key={section.number}>
                <ToolHeader>
                  <ToolNumber>{section.number}</ToolNumber>
                  <ToolHeading>
                    <CategoryBadge>{section.category}</CategoryBadge>
                    <ToolTitle>{section.title}</ToolTitle>
                    <ToolDescription>{section.description}</ToolDescription>
                  </ToolHeading>
                </ToolHeader>

                <FeatureList>
                  {section.features.map((feature) => (
                    <Feature key={`${section.number}-${feature.name}`}>
                      <FeatureContent>
                        <FeatureName>{feature.name}</FeatureName>
                        <FeatureDesc>{feature.description}</FeatureDesc>
                      </FeatureContent>
                    </Feature>
                  ))}
                </FeatureList>
              </SectionCard>
            ))
          )}
        </SectionsColumn>

        <TipBox>
          <strong>Consejo:</strong> Si una accion no funciona como esperas,
          revisa la categoria correspondiente en esta pagina y verifica que
          estes en la vista correcta del proyecto.
        </TipBox>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  min-height: calc(100vh - 64px);
  padding: 64px 24px 80px;
  background:
    radial-gradient(circle at 82% 18%, rgba(88, 166, 255, 0.08), transparent 38%),
    radial-gradient(circle at 16% 84%, rgba(16, 185, 129, 0.08), transparent 34%),
    #050810;

  @media (max-width: 768px) {
    padding: 36px 16px 54px;
  }
`;

const Card = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 48px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 28px 20px;
    border-radius: 18px;
  }
`;

const Hero = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 34px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(180deg, #ffffff 0%, #a5c8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.7;
`;

const IntroSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SectionLabel = styled.span`
  display: inline-block;
  color: #7dd3fc;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(1.25rem, 3vw, 1.8rem);
`;

const Text = styled.p`
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const MethodCard = styled.article`
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.24);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MethodTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: 1.05rem;
`;

const MethodText = styled.p`
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const KeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const KeyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
`;

const Key = styled.kbd`
  min-width: 34px;
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #bae6fd;
  font-weight: 800;
  text-align: center;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: var(--glass-border);
  margin: 34px 0 28px;
`;

const FilterPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const ResultCount = styled.span`
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 700;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  padding: 0 14px;
  outline: none;

  &:focus {
    border-color: rgba(56, 189, 248, 0.45);
  }
`;

const CategoryRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${(props) =>
      props.$active ? "rgba(56, 189, 248, 0.38)" : "rgba(255, 255, 255, 0.08)"};
  background: ${(props) =>
    props.$active ? "rgba(56, 189, 248, 0.14)" : "rgba(255, 255, 255, 0.04)"};
  color: ${(props) => (props.$active ? "#bae6fd" : "var(--text-secondary)")};
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
`;

const SectionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 26px;
`;

const EmptyState = styled.div`
  border-radius: 18px;
  padding: 30px 22px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  text-align: center;

  h3 {
    margin: 0 0 8px;
    color: var(--text-primary);
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

const SectionCard = styled.section`
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
`;

const ToolHeader = styled.div`
  display: flex;
  gap: 18px;
  align-items: flex-start;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const ToolNumber = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  font-weight: 900;
  flex-shrink: 0;
`;

const ToolHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryBadge = styled.span`
  width: fit-content;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.24);
  color: #a7f3d0;
  font-size: 0.8rem;
  font-weight: 800;
`;

const ToolTitle = styled.h3`
  margin: 0;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  color: var(--text-primary);
`;

const ToolDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
`;

const Feature = styled.article`
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.03);
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FeatureName = styled.strong`
  color: var(--text-primary);
  font-size: 0.98rem;
`;

const FeatureDesc = styled.p`
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.94rem;
`;

const TipBox = styled.div`
  margin-top: 28px;
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(245, 158, 11, 0.25);
  background: rgba(245, 158, 11, 0.1);
  color: #fde68a;
  line-height: 1.7;
`;
