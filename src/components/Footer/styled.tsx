import styled from "styled-components";
import { primaryColor, secondaryColor } from "../../config/colors";
import { Link } from "react-router-dom";

export const FooterContainer = styled.footer`
  background-color: ${primaryColor};
  color: ${secondaryColor};
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const Copyright = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${secondaryColor};

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const FooterLink = styled(Link)`
  color: ${secondaryColor};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 5px 10px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 4px 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 3px 6px;
  }
`;

export const Separator = styled.span`
  color: ${secondaryColor};
  opacity: 0.5;

  @media (max-width: 768px) {
    display: none;
  }
`;
