import React from "react";
import styled, { keyframes } from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const teamMembers = [
  { name: "Luis Daniel Rojas Caceres", email: "luis.rojas.c1@ucb.edu.bo" },
  { name: "Oziel Rodman Ramos Torrez", email: "oziel.ramos@ucb.edu.bo" },
  { name: "Frederick Aguirre", email: "frederick.aguirre@ucb.edu.bo" },
  { name: "Diana Tatiana Pattzy Gomez", email: "diana.pattzy@ucb.edu.bo" },
  { name: "Daniel Boris Rueda", email: "daniel.rueda@ucb.edu.bo" },
];

export function ContactPage() {
  return (
    <Container>
      <HeaderSection>
        <Title>Nuestro Equipo</Title>
        <Subtitle>Los desarrolladores detrás de GraphX</Subtitle>
      </HeaderSection>
      <Grid>
        {teamMembers.map((member, index) => (
          <Card key={index} $delay={index * 0.1}>
            <AvatarWrapper>
              <FaUserCircle />
            </AvatarWrapper>
            <MemberName>{member.name}</MemberName>
            <Role>Desarrollador</Role>
            <Email>{member.email}</Email>
            <Divider />
            <Institution>Universidad Católica Boliviana</Institution>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: calc(100vh - 64px);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle at 50% 0%, #0d1117 0%, #050810 100%);
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 900;
  background: linear-gradient(to right, #ffffff, #58a6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out backwards;
  animation-delay: ${(props) => props.$delay}s;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent-color);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(88, 166, 255, 0.1);
  }
`;

const AvatarWrapper = styled.div`
  font-size: 80px;
  color: rgba(88, 166, 255, 0.2);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(88, 166, 255, 0.05);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(88, 166, 255, 0.1);
  transition: all 0.3s ease;

  ${Card}:hover & {
    color: var(--accent-color);
    background: rgba(88, 166, 255, 0.1);
    border-color: var(--accent-color);
  }
`;

const MemberName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const Role = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Email = styled.a.attrs(props => ({
  href: `mailto:${props.children}`
}))`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 8px;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 20px 0;
`;

const Institution = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;
