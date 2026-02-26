import React from "react";
import styled from "styled-components";

export function HelpPage() {
  return (
    <Page>
      <Header>
        <Title>Guía de Usuario — Toolbar</Title>
        <Intro>
          En el graficador interactivo encontrarás un <strong>Toolbar</strong>{" "}
          ubicado <strong>al lado izquierdo del lienzo</strong>. Este toolbar
          controla el <strong>modo de interacción</strong>: según la opción
          seleccionada, cambia lo que ocurre al hacer clic en el lienzo, en un
          nodo o en una arista.
        </Intro>
      </Header>

      <Section aria-labelledby="toolbar-switch">
        <H2 id="toolbar-switch">Cómo cambiar de opción</H2>
        <Paragraph>Puedes cambiar entre las opciones de dos maneras:</Paragraph>
        <ol>
          <li>
            <strong>Haciendo clic</strong> sobre la opción en el toolbar.
          </li>
          <li>
            Usando <strong>teclas rápidas</strong> del teclado:
            <ul>
              <li>
                <strong>Tecla 1</strong> → Opción 1
              </li>
              <li>
                <strong>Tecla 2</strong> → Opción 2
              </li>
              <li>
                <strong>Tecla 3</strong> → Opción 3
              </li>
              <li>
                <strong>Tecla 4</strong> → Opción 4
              </li>
            </ul>
          </li>
        </ol>
      </Section>

      <Divider />

      <Section aria-labelledby="option-1">
        <H2 id="option-1">
          Opción 1 (Tecla 1) — Crear / mover + desplazamiento
        </H2>
        <Paragraph>
          Con esta opción puedes <strong>construir el grafo</strong> y{" "}
          <strong>acomodar el lienzo</strong>.
        </Paragraph>
        <ul>
          <li>
            <strong>Crear nodos:</strong> doble clic en un espacio vacío del
            lienzo.
          </li>
          <li>
            <strong>Crear aristas dirigidas:</strong> clic en nodo origen → clic
            en nodo destino → ingresar peso (si no se ingresa, el peso por
            defecto es <strong>1</strong>).
          </li>
          <li>
            <strong>Mover nodos:</strong> arrastra un nodo para reubicarlo
            libremente.
          </li>
          <li>
            <strong>Desplazarte por el lienzo (pan):</strong> clic en un espacio
            vacío y arrastrar para moverte por el lienzo.
          </li>
        </ul>
      </Section>

      <Divider />

      <Section aria-labelledby="option-2">
        <H2 id="option-2">Opción 2 (Tecla 2) — Editar</H2>
        <Paragraph>
          Permite <strong>editar</strong> elementos existentes con un clic.
        </Paragraph>
        <ul>
          <li>
            <strong>Editar nodo:</strong> cambiar <strong>nombre</strong> y{" "}
            <strong>color</strong>.
          </li>
          <li>
            <strong>Editar arista:</strong> cambiar <strong>nombre</strong> (si
            aplica), <strong>color</strong> y <strong>peso</strong>.
          </li>
        </ul>
      </Section>

      <Divider />

      <Section aria-labelledby="option-3">
        <H2 id="option-3">Opción 3 (Tecla 3) — Eliminar</H2>
        <Paragraph>
          Permite <strong>eliminar</strong> elementos específicos del grafo.
        </Paragraph>
        <ul>
          <li>
            Clic sobre un <strong>nodo</strong> para eliminarlo.
          </li>
          <li>
            Clic sobre una <strong>arista</strong> para eliminarla.
          </li>
        </ul>
      </Section>

      <Divider />

      <Section aria-labelledby="option-4">
        <H2 id="option-4">Opción 4 (Tecla 4) — Matriz ponderada dirigida</H2>
        <Paragraph>
          Genera la <strong>matriz ponderada dirigida</strong> del grafo actual,
          considerando:
        </Paragraph>
        <ul>
          <li>
            <strong>Dirección</strong> de las aristas (origen → destino)
          </li>
          <li>
            <strong>Peso</strong> de cada arista
          </li>
        </ul>
      </Section>

      <Footer>
        Consejo: si una acción no funciona como esperas, revisa que tengas
        seleccionada la opción correcta del toolbar (o presiona 1–4 para cambiar
        rápidamente).
      </Footer>
    </Page>
  );
}

const Page = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const Intro = styled.p`
  margin-top: 0.5rem;
  color: #555;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-top: 1.25rem;
`;

const H2 = styled.h2`
  margin: 0 0 0.5rem 0;
`;

const Paragraph = styled.p`
  margin: 0.5rem 0;
  line-height: 1.6;
`;

const Divider = styled.hr`
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
`;

const Footer = styled.footer`
  margin-top: 2rem;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
`;
