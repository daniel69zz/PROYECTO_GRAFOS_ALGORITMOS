import React from "react";
import styled from "styled-components";

export function HelpPage() {
  return (
    <Container>
      <Card>
        <Header>
          <Title>📖 Guía de Usuario</Title>
          <Subtitle>
            Aprende a utilizar el <strong>Toolbar</strong> del graficador
            interactivo
          </Subtitle>
        </Header>

        <Section>
          <SectionTitle>⌨️ Cómo cambiar de opción</SectionTitle>
          <Text>Puedes cambiar entre las herramientas de dos maneras:</Text>

          <MethodGrid>
            <MethodCard>
              <MethodIcon>🖱️</MethodIcon>
              <MethodTitle>Clic</MethodTitle>
              <MethodText>Haz clic sobre la opción en el toolbar</MethodText>
            </MethodCard>

            <MethodCard>
              <MethodIcon>⌨️</MethodIcon>
              <MethodTitle>Teclas rápidas</MethodTitle>
              <MethodText>
                <KeyList>
                  <KeyItem>
                    <Key>1</Key> Opción 1
                  </KeyItem>
                  <KeyItem>
                    <Key>2</Key> Opción 2
                  </KeyItem>
                  <KeyItem>
                    <Key>3</Key> Opción 3
                  </KeyItem>
                  <KeyItem>
                    <Key>4</Key> Opción 4
                  </KeyItem>
                </KeyList>
              </MethodText>
            </MethodCard>
          </MethodGrid>
        </Section>

        <Divider />

        <ToolSection>
          <ToolHeader>
            <ToolNumber>1</ToolNumber>
            <ToolTitle>Crear / Mover + Desplazamiento</ToolTitle>
          </ToolHeader>
          <ToolDescription>
            Construye el grafo y acomoda el lienzo
          </ToolDescription>
          <FeatureList>
            <Feature>
              <FeatureIcon>➕</FeatureIcon>
              <FeatureContent>
                <FeatureName>Crear nodos</FeatureName>
                <FeatureDesc>Doble clic en un espacio vacío</FeatureDesc>
              </FeatureContent>
            </Feature>
            <Feature>
              <FeatureIcon>🔗</FeatureIcon>
              <FeatureContent>
                <FeatureName>Crear aristas</FeatureName>
                <FeatureDesc>
                  Clic en nodo origen → nodo destino → peso (default: 1)
                </FeatureDesc>
              </FeatureContent>
            </Feature>
            <Feature>
              <FeatureIcon>↔️</FeatureIcon>
              <FeatureContent>
                <FeatureName>Mover nodos</FeatureName>
                <FeatureDesc>Arrastra un nodo para reubicarlo</FeatureDesc>
              </FeatureContent>
            </Feature>
            <Feature>
              <FeatureIcon>🖐️</FeatureIcon>
              <FeatureContent>
                <FeatureName>Desplazar lienzo (pan)</FeatureName>
                <FeatureDesc>Clic y arrastra en espacio vacío</FeatureDesc>
              </FeatureContent>
            </Feature>
          </FeatureList>
        </ToolSection>

        <Divider />

        <ToolSection>
          <ToolHeader>
            <ToolNumber>2</ToolNumber>
            <ToolTitle>Editar</ToolTitle>
          </ToolHeader>
          <ToolDescription>
            Modifica elementos existentes con un clic
          </ToolDescription>
          <FeatureList>
            <Feature>
              <FeatureIcon>🎨</FeatureIcon>
              <FeatureContent>
                <FeatureName>Editar nodo</FeatureName>
                <FeatureDesc>Cambia nombre y color</FeatureDesc>
              </FeatureContent>
            </Feature>
            <Feature>
              <FeatureIcon>⚖️</FeatureIcon>
              <FeatureContent>
                <FeatureName>Editar arista</FeatureName>
                <FeatureDesc>Modifica el peso</FeatureDesc>
              </FeatureContent>
            </Feature>
          </FeatureList>
        </ToolSection>

        <Divider />

        <ToolSection>
          <ToolHeader>
            <ToolNumber>3</ToolNumber>
            <ToolTitle>Eliminar</ToolTitle>
          </ToolHeader>
          <ToolDescription>
            Elimina elementos específicos del grafo
          </ToolDescription>
          <FeatureList>
            <Feature>
              <FeatureIcon>🗑️</FeatureIcon>
              <FeatureContent>
                <FeatureName>Eliminar</FeatureName>
                <FeatureDesc>
                  Clic sobre nodo o arista para eliminarlo
                </FeatureDesc>
              </FeatureContent>
            </Feature>
          </FeatureList>
        </ToolSection>

        <Divider />

        <ToolSection>
          <ToolHeader>
            <ToolNumber>4</ToolNumber>
            <ToolTitle>Matriz Ponderada Dirigida</ToolTitle>
          </ToolHeader>
          <ToolDescription>
            Genera la representación matricial del grafo
          </ToolDescription>
          <FeatureList>
            <Feature>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureContent>
                <FeatureName>Matriz de adyacencia</FeatureName>
                <FeatureDesc>
                  Considera dirección y peso de las aristas
                </FeatureDesc>
              </FeatureContent>
            </Feature>
          </FeatureList>
        </ToolSection>

        <TipBox>
          <TipIcon>💡</TipIcon>
          <TipText>
            <strong>Consejo:</strong> Si una acción no funciona como esperas,
            verifica la opción seleccionada (presiona 1–4 para cambiar
            rápidamente)
          </TipText>
        </TipBox>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  min-height: calc(100vh - 56px);
  padding: 40px 24px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 40px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 28px 20px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: clamp(14px, 3vw, 18px);
  color: #64748b;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MethodCard = styled.div`
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #5470eb;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(84, 112, 235, 0.15);
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const MethodIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: 12px;
  }
`;

const MethodTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const MethodText = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const KeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const KeyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Key = styled.kbd`
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-weight: 700;
  font-size: 14px;
  color: #5470eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 30px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 3px 8px;
    font-size: 13px;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 32px 0;

  @media (max-width: 768px) {
    margin: 24px 0;
  }
`;

const ToolSection = styled.section`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ToolNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #5470eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const ToolTitle = styled.h3`
  font-size: clamp(18px, 3vw, 24px);
  font-weight: 700;
  color: #0f172a;
`;

const ToolDescription = styled.p`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 20px;
  padding-left: 64px;

  @media (max-width: 480px) {
    padding-left: 0;
    font-size: 15px;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Feature = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 28px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const FeatureDesc = styled.div`
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const TipBox = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding: 16px;
  }
`;

const TipIcon = styled.div`
  font-size: 32px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const TipText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #0f172a;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;
