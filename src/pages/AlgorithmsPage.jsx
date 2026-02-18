import styled from "styled-components";

export function AlgorithmsPage() {
  return (
    <Container>
      <h1>ALGORITMOS</h1>
      <section>
        <h4>¿Qué es un algoritmo?</h4>
        <p>
          Un algoritmo es un
          <b> conjunto finito y ordenado de pasos o instrucciones</b> que se
          siguen para resolver un problema o realizar una tarea.
        </p>
        <p>En otras palabras: </p>
        <em>"Es una receta paso a paso para llegar a un resultado."</em>
      </section>

      <section>
        <h4>¿De dónde viene la palabra "algoritmo"?</h4>
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
        <h4>Partes de un algoritmo</h4>
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
        <h4>Características de un algoritmo</h4>
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
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h1 {
    justify-content: center;
    text-align: center;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 6px;
  }
`;
