import styled from "styled-components";
import { AccordionItem } from "../components/AccordionItem";

export function AlgorithmsPage() {
  return (
    <Container>
      <h1>ALGORITMOS</h1>
      <section>
        <h2>¿Qué es un algoritmo?</h2>
        <iframe
          src="https://www.youtube.com/embed/U3CGMyjzlvM"
          title="¿Que es un algoritmo?"
          height="315"
          frameborder="0"
          allowFullScreen
        ></iframe>
        <p>
          Un algoritmo es un
          <b> conjunto finito y ordenado de pasos o instrucciones</b> que se
          siguen para resolver un problema o realizar una tarea.
        </p>
        <p>En otras palabras: </p>
        <em>"Es una receta paso a paso para llegar a un resultado."</em>
      </section>

      <section>
        <h2>¿De dónde viene la palabra "algoritmo"?</h2>
        <p>
          Esta palabra viene del nombre del matemático{" "}
          <em>Muhammad ibn Musa al-Khwarizmi</em> que vivió en el siglo IX y
          escribió libros fundamentales sobre matemáticas especialmente sobre
          métodos sistemáticos para resolver ecuaciones.
        </p>
        <p>
          Su nombre fue latinizado como <em>Algoritmi</em> y de ahí nació el
          término <b>algoritmo.</b>
        </p>
      </section>

      <section>
        <h2>Partes de un algoritmo</h2>
        <p>
          Tiene <b>3 partes de un algoritmo</b>. Son:
        </p>
        <ol>
          <li>
            <b>Input (entrada):</b> Información que damos al algoritmo con la
            que va a trabajar para ofrecer la solución esperada.
          </li>

          <li>
            <b>Proceso:</b> Conjunto de pasos para que a partir de los datos de
            entrada, llegue a la solución de la situación
          </li>

          <li>
            <b>Output (salida):</b> Resultados, a partir de la transformación de
            los valores de entrada durante el proceso.
          </li>
        </ol>
      </section>

      <section>
        <h2>Características de un algoritmo</h2>
        <p>
          Los algoritmos presentan una serie de <b>características comunes.</b>{" "}
          Son:
        </p>
        <ul>
          <li>
            <b>Precisos:</b> objetivos sin ambigüedad.
          </li>
          <li>
            <b>Ordenados:</b> Presentan una secuencia clara y precisa para poder
            llegar a la solución.
          </li>
          <li>
            <b>Finitos:</b> Contienen un número determinado de pasos.
          </li>
          <li>
            <b>Concretos:</b> Ofrece una solución determinada para la situación
            o problema planteados.
          </li>
          <li>
            <b>Definidos:</b> El mismo algoritmo debe dar el mismo resultado al
            recibir la misma entrada.
          </li>
        </ul>
      </section>

      <section>
        <h2>Tipos de algoritmos</h2>
        <ol>
          <AccordionItem title="Algoritmos de Búsqueda">
            <p>
              Los algoritmos de búsqueda localizan uno o varios elementos que
              presenten una serie de propiedades dentro de una estructura de
              datos.
            </p>
            <ul>
              <li>
                <h4>Busqueda Binaria</h4>
                <iframe
                  src="https://www.youtube.com/embed/wAmu0Ly5ook"
                  title="Busqueda binaria"
                  frameborder="0"
                  height="315"
                  width="900"
                  allowFullScreen
                />
              </li>

              <li>
                <h4>Depth-First Search (DFS)</h4>
                <iframe
                  src="https://www.youtube.com/embed/PMMc4VsIacU"
                  title="Depth-First Search"
                  frameborder="0"
                  height="315"
                  width="900"
                  allowFullScreen
                />
              </li>

              <li>
                <h4>Breadth-First Search (BFS)</h4>
                <iframe
                  src="https://www.youtube.com/embed/xlVX7dXLS64"
                  title="Breadth-First Search"
                  frameborder="0"
                  height="315"
                  width="900"
                  allowFullScreen
                />
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Algoritmos de ordenamiento">
            <p>
              Reorganizan los elementos de un listado según una relación de
              orden. Las más habituales son el orden numérico y el orden
              lexicográfico. Un orden eficiente optimiza el uso de algoritmos
              como los de búsqueda y facilitan la consecución de resultados
              legibles por personas y no solo máquinas.
            </p>
            <ul>
              <li>
                <h4>Quicksort</h4>
                <iframe
                  src="https://www.youtube.com/embed/UrPJLhKF1jY"
                  title="Quicksort"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>

              <li>
                <h4>MergeSort</h4>
                <iframe
                  src="https://www.youtube.com/embed/ACFZn_xQcz8"
                  title="MergeSort"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Algoritmos sobre grafos">
            <p>
              Son algoritmos diseñados para trabajar con estructuras llamadas
              grafos, que modelan relaciones entre entidades. Un grafo está
              compuesto por vértices (nodos) y aristas (conexiones entre nodos).
              Se usan cuando el problema puede representarse como una red.
            </p>
            <ul>
              <li>
                <h4>Algoritmo de Dijkstra</h4>
                <iframe
                  src="https://www.youtube.com/embed/LLx0QVMZVkk"
                  title="Dijstra"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>

              <li>
                <h4>Algoritmo de Floyd–Warshall</h4>
                <iframe
                  src="https://www.youtube.com/embed/h-nmexY9gtA"
                  title="Floyd-Warshall"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>

              <li>
                <h4>Algoritmo de Kruskal</h4>
                <iframe
                  src="https://www.youtube.com/embed/lTCDUJw_4GM"
                  title="Algoritmo de Kruskal"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Algoritmos de Programación Dinámica">
            <p>
              La programación dinámica es un método de resolución de problemas
              en el que dividimos un problema complejo en subproblemas y
              calculamos y almacenamos sus soluciones, para que no haga falta
              volver a calcularlas más adelante para llegar a la solución del
              problema. La programación dinámica reduce el tiempo de ejecución
              de un algoritmo al optimizar la recursión. Eso sí, para poder
              aplicarse a un problema, éste debe tener subestructuras óptimas y
              subproblemas superpuestos. Es decir, que en él se puedan usar
              soluciones óptimas de subproblemas para encontrar la solución
              óptima del problema en su conjunto y que el problema se pueda
              dividir en subproblemas que se reutilizan para ofrecer el
              resultado global.
            </p>
            <ul>
              <li>
                <h4>La Serie de Fibonacci</h4>
                <iframe
                  src="https://www.youtube.com/embed/EEqTaMeDVKo"
                  title="Fibonacci"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Algoritmos de aprendizaje automático">
            <p>
              Son algoritmos que permiten a una computadora aprender patrones a
              partir de datos y hacer predicciones o tomar decisiones sin estar
              programada explícitamente para cada caso. En lugar de decirle al
              programa todas las reglas, se le proporcionan ejemplos y el
              algoritmo ajusta un modelo matemático para aproximar una función.
            </p>
            <ul>
              <li>
                <h4>Regresión lineal</h4>
                <iframe
                  src="https://www.youtube.com/embed/hmVh2ddVCK4"
                  title="Regresion Lineal"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>
              <li>
                <h4>Support Vector Machines (SVM)</h4>
                <iframe
                  src="https://www.youtube.com/embed/pEvLf93kL6s"
                  title="Support Vector Machines"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>

              <li>
                <h4>Redes Neuronales</h4>
                <iframe
                  src="https://www.youtube.com/embed/jKCQsndqEGQ"
                  title="Support Vector Machines"
                  frameborder="0"
                  height="380"
                  width="900"
                />
              </li>
            </ul>
          </AccordionItem>
        </ol>
      </section>
    </Container>
  );
}

const Container = styled.div`
  height: 95vh;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  overflow: auto;

  p {
    font-size: 17px;
    line-height: 1.5;
  }

  h1 {
    justify-content: center;
    text-align: center;
    margin-bottom: 30px;

    font-size: 50px;
  }

  h2 {
    font-size: 30px;
  }

  iframe {
    margin: 25px 0;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 6px;

    ul {
      li {
        font-size: 17px;
        margin-bottom: 10px;
      }

      margin-top: 10px;
    }

    ol {
      li::marker {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
`;
