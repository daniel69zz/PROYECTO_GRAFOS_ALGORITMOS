import styled from "styled-components";
import logo from "/logo_ucb.png";

export function HomePage() {
  return (
    <Container>
      <Card>
        <ImageSection>
          <LogoImage src={logo} alt="Logo UCB" />
        </ImageSection>

        <ContentSection>
          <Title>ANÁLISIS DE ALGORITMOS</Title>
          <Subtitle>Proyecto Final - GraphX</Subtitle>

          <InfoGrid>
            <InfoItem>
              <Label>Estudiante</Label>
              <Value>Luis Daniel Rojas Caceres</Value>
            </InfoItem>
            <InfoItem>
              <Label>CI</Label>
              <Value>6991789</Value>
            </InfoItem>
          </InfoGrid>

          <Description>
            Herramienta interactiva para la visualización y análisis de grafos
            dirigidos ponderados. Explora algoritmos, crea grafos y aprende de
            forma visual.
          </Description>
        </ContentSection>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  min-height: calc(100vh - 56px);
  padding: 40px 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  border: 2px solid #e2e8f0;

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const ImageSection = styled.div`
  padding: 60px 40px;
  background: linear-gradient(135deg, #5470eb 0%, #7b93f7 100%);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

const LogoImage = styled.img`
  height: 180px;
  width: auto;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 768px) {
    height: 140px;
  }

  @media (max-width: 480px) {
    height: 110px;
  }
`;

const ContentSection = styled.div`
  padding: 40px;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const Title = styled.h1`
  font-size: clamp(24px, 5vw, 40px);
  font-weight: 900;
  color: #0f172a;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: clamp(14px, 3vw, 18px);
  color: #64748b;
  text-align: center;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const InfoItem = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 6px;
`;

const Value = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
  text-align: center;
  padding: 20px;
  background: #5470eb10;
  border-radius: 12px;
  border-left: 4px solid #5470eb;

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 14px;
  }
`;
