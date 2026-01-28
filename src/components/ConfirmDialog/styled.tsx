import styled from "styled-components";
import {
  primaryColor,
  secondaryColor,
  dangerColor,
  tertiaryColor,
} from "../../config/colors";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const DialogContainer = styled.div`
  background-color: ${tertiaryColor};
  border-radius: 12px;
  padding: 24px;
  min-width: 320px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 90%;
    padding: 20px;
  }

  @media (max-width: 480px) {
    min-width: 260px;
    padding: 16px;
  }
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const DialogIcon = styled.div`
  color: ${dangerColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const DialogTitle = styled.h2`
  color: ${primaryColor};
  font-size: 20px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const DialogMessage = styled.p`
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

export const DialogActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 8px;
  }
`;

export const Button = styled.button<{ variant?: "primary" | "danger" }>`
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  ${(props) =>
    props.variant === "danger"
      ? `
    background-color: ${dangerColor};
    color: white;

    &:hover {
      background-color: #e02c2c;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(250, 55, 55, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  `
      : `
    background-color: ${tertiaryColor};
    color: ${primaryColor};
    border: 2px solid ${primaryColor};

    &:hover {
      background-color: ${primaryColor};
      color: ${secondaryColor};
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(19, 7, 121, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 9px 20px;
    font-size: 13px;
    min-width: 90px;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: auto;
    padding: 12px;
    font-size: 14px;
  }
`;
