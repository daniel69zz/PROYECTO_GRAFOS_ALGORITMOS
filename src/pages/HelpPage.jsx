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
  min-height: calc(100vh - 64px);
  padding: 80px 24px;
  background-color: #050810;
  background-image: 
    radial-gradient(circle at 80% 20%, rgba(88, 166, 255, 0.08), transparent 40%),
    radial-gradient(circle at 20% 80%, rgba(88, 166, 255, 0.12), transparent 40%);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 12px;
  }
`;

const Card = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 56px 48px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform var(--transition-bounce), box-shadow var(--transition-normal);

  &:hover {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const Title = styled.h1`
  font-size: clamp(36px, 6vw, 48px);
  font-weight: 900;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  background: linear-gradient(180deg, #ffffff 0%, #a5c8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(88, 166, 255, 0.2);
`;

const Subtitle = styled.p`
  font-size: clamp(16px, 3vw, 20px);
  color: var(--text-secondary);
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 24px;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MethodCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  transition: all var(--transition-bounce);
  box-shadow: inset 0 2px 0 rgba(88, 166, 255, 0.5);

  &:hover {
    border-color: rgba(88, 166, 255, 0.4);
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 3px 0 #58a6ff;
  }

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const MethodIcon = styled.div`
  font-size: 56px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));

  @media (max-width: 480px) {
    font-size: 48px;
    margin-bottom: 16px;
  }
`;

const MethodTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const MethodText = styled.div`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const KeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`;

const KeyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Key = styled.kbd`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 700;
  font-size: 14px;
  color: var(--accent-hover);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 36px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 13px;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: var(--glass-border);
  margin: 40px 0;

  @media (max-width: 768px) {
    margin: 32px 0;
  }
`;

const ToolSection = styled.section`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const ToolNumber = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--accent-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  flex-shrink: 0;
  box-shadow: 0 0 20px var(--accent-glow);

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
`;

const ToolTitle = styled.h3`
  font-size: clamp(20px, 3.5vw, 26px);
  font-weight: 700;
  color: var(--text-primary);
`;

const ToolDescription = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  padding-left: 76px;

  @media (max-width: 480px) {
    padding-left: 0;
    font-size: 15px;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Feature = styled.div`
  display: flex;
  gap: 20px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all var(--transition-bounce);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateX(8px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    padding: 20px;
    gap: 16px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const FeatureDesc = styled.div`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TipBox = styled.div`
  display: flex;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.02) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-left: 4px solid #fbbf24;
  border-radius: 20px;
  margin-top: 56px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding: 24px;
  }
`;

const TipIcon = styled.div`
  font-size: 36px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.4));

  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const TipText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);

  strong {
    color: #fbbf24;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;
