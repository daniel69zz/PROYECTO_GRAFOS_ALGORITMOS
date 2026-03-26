import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import logo from "/logo_ucb.png";

export function HomePage() {
  const [titleText, setTitleText] = useState("");
  const fullTitle = "ANÁLISIS DE ALGORITMOS";

  useEffect(() => {
    let i = 0;
    setTitleText("");
    const timer = setInterval(() => {
      setTitleText(fullTitle.slice(0, i));
      i++;
      if (i > fullTitle.length) {
        clearInterval(timer);
      }
    }, 70); // Typing speed
    return () => clearInterval(timer);
  }, []);

  return (
    <Container>
      <BackgroundGlow />
      <HeroContent>
        <LogoWrapper>
          <LogoImage src={logo} alt="Logo UCB" />
        </LogoWrapper>

        <TitleWrapper>
          <Title>
            {titleText}
            <Cursor />
          </Title>
          <Subtitle>Proyecto Final - GraphX</Subtitle>
        </TitleWrapper>

        <BottomSection>
          <InfoCard>
            <InfoItem>
              <Label>EstudianteS</Label>
              <Value>Luis Daniel Rojas Caceres</Value>
              <Value>Oziel Rodman Ramos Torrez</Value>
              <Value>Jorge Manuel Calizaya Tito</Value>
              <Value>Frederick Aguirre </Value>
              <Value>Diana Tatiana Pattzy Gomez </Value>
              <Value>Daniel Boris Rueda</Value>
            </InfoItem>
            {/* <InfoItem>
              <Label>CI</Label>
              <Value>6991789</Value>
            </InfoItem> */}
          </InfoCard>

          <Description>
            Herramienta interactiva para la visualización y análisis de grafos
            dirigidos ponderados. Explora algoritmos, crea grafos y aprende de
            forma visual.
          </Description>
        </BottomSection>
      </HeroContent>
    </Container>
  );
}

// --- ANIMATIONS ---
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

// --- STYLED COMPONENTS ---
const Container = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 60px 20px;
  background: radial-gradient(circle at 50% 0%, #0d1117 0%, #050810 100%);
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 80vw;
  max-width: 800px;
  max-height: 800px;
  background: radial-gradient(
    circle,
    rgba(88, 166, 255, 0.1) 0%,
    transparent 60%
  );
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 48px;
`;

const LogoWrapper = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 40px rgba(88, 166, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(88, 166, 255, 0.3));
  animation: ${float} 4s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 100px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
  background: linear-gradient(to right, #ffffff 0%, #c2dcfc 50%, #58a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  min-height: clamp(36px, 7vw, 72px); /* Prevents layout jump while typing */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cursor = styled.span`
  display: inline-block;
  width: clamp(4px, 1vw, 8px);
  height: clamp(32px, 6vw, 64px);
  background-color: #58a6ff;
  margin-left: 8px;
  border-radius: 4px;
  animation: ${blink} 1s step-end infinite;
`;

const Subtitle = styled.p`
  font-size: clamp(16px, 2.5vw, 22px);
  color: var(--accent-color);
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(88, 166, 255, 0.3);
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 800px;
`;

const InfoCard = styled.div`
  display: flex;
  gap: 48px;
  background: rgba(255, 255, 255, 0.03);
  padding: 24px 56px;
  border-radius: 100px;
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-blur);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 24px;
    border-radius: 24px;
    padding: 32px;
    width: 100%;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
`;

const Value = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
`;

const Description = styled.p`
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.8;
  color: var(--text-secondary);
  text-align: center;
  padding: 32px;
  background: linear-gradient(
    180deg,
    rgba(88, 166, 255, 0.05) 0%,
    transparent 100%
  );
  border-radius: 24px;
  border-top: 1px solid rgba(88, 166, 255, 0.15);
  box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.02);
  margin: 0;
  max-width: 640px;
`;
