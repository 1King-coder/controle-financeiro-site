import styled from "styled-components";
import * as colors from "../../config/colors";

export const SubscriptionContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

interface PlanCardProps {
  isPopular?: boolean;
}

export const PlanCard = styled.div<PlanCardProps>`
  position: relative;
  background: white;
  border: 2px solid
    ${(props) => (props.isPopular ? colors.secondaryColor : "#e0e0e0")};
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.isPopular
      ? `0 8px 20px rgba(${parseInt(
          colors.secondaryColor.slice(1, 3),
          16,
        )}, ${parseInt(colors.secondaryColor.slice(3, 5), 16)}, ${parseInt(
          colors.secondaryColor.slice(5, 7),
          16,
        )}, 0.2)`
      : "0 2px 10px rgba(0, 0, 0, 0.1)"};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) =>
      props.isPopular
        ? `0 12px 28px rgba(${parseInt(
            colors.secondaryColor.slice(1, 3),
            16,
          )}, ${parseInt(colors.secondaryColor.slice(3, 5), 16)}, ${parseInt(
            colors.secondaryColor.slice(5, 7),
            16,
          )}, 0.3)`
        : "0 4px 15px rgba(0, 0, 0, 0.2)"};
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

interface PlanHeaderProps {
  isPopular?: boolean;
}

export const PlanHeader = styled.div<PlanHeaderProps>`
  position: relative;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid
    ${(props) => (props.isPopular ? colors.secondaryColor : "#f0f0f0")};
  padding-bottom: 1rem;
`;

export const PlanTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primaryColor};
  margin: 0;
`;

export const PlanPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 1.5rem 0;

  span:first-child {
    color: ${colors.primaryColor};
  }

  span:last-child {
    color: #999;
  }
`;

export const PlanDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

export const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  flex-grow: 1;

  li {
    padding: 0.75rem 0;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95rem;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #333;
  font-size: 0.95rem;

  &::before {
    content: "";
  }
`;

interface SelectButtonProps {
  isPrimary?: boolean;
}

export const SelectButton = styled.button<SelectButtonProps>`
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;

  ${(props) =>
    props.isPrimary
      ? `
    background-color: ${colors.primaryColor};
    color: ${colors.secondaryColor};
    box-shadow: 0 4px 12px rgba(19, 7, 121, 0.3);

    &:hover:not(:disabled) {
      background-color: ${colors.selectedBGColor};
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(19, 7, 121, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
      : `
    background-color: white;
    color: ${colors.primaryColor};
    border: 2px solid ${colors.primaryColor};
    box-shadow: 0 2px 8px rgba(19, 7, 121, 0.15);

    &:hover:not(:disabled) {
      background-color: #f9f9f9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(19, 7, 121, 0.25);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${colors.primaryColor};
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${colors.dangerColor};
  background-color: rgba(250, 55, 55, 0.1);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
`;
