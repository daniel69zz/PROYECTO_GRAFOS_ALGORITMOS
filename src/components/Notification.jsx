import styled, { keyframes } from "styled-components";
import { useEffect } from "react";

export function Notification({
  message,
  type = "warning",
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "error":
        return "❌";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  const getColor = () => {
    switch (type) {
      case "error":
        return "#f44336";
      case "success":
        return "#4caf50";
      case "warning":
        return "#ff9800";
      case "info":
        return "#2196f3";
      default:
        return "#2196f3";
    }
  };

  return (
    <Container $color={getColor()}>
      <Icon>{getIcon()}</Icon>
      <Content>
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <ProgressBar $duration={duration} $color={getColor()} />
    </Container>
  );
}

// ── Animations ──

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const progressAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// ── Styled Components ──

const Container = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 320px;
  max-width: 450px;
  background: rgba(2, 14, 26, 0.98);
  border: 1px solid ${({ $color }) => $color}66;
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  animation: ${slideIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
  overflow: hidden;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
  }
`;

const Icon = styled.div`
  font-size: 24px;
  line-height: 1;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #e8f4ff;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #e8f4ff;
  white-space: pre-line;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(232, 244, 255, 0.7);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.2s;

  &:hover {
    color: rgba(232, 244, 255, 1);
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${({ $color }) => $color};
  animation: ${progressAnimation} ${({ $duration }) => $duration}ms linear;
  border-radius: 0 0 0 12px;
`;
