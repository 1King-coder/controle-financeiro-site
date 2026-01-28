import styled from "styled-components";
import * as colors from "../../config/colors";

export const SubscriptionPageContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

export const InfoSection = styled.section`
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 1rem;
  border-left: 4px solid ${colors.primaryColor};

  h2 {
    color: ${colors.primaryColor};
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  p {
    color: #555;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }
`;

export const BenefitsSection = styled.section`
  margin-bottom: 3rem;

  h3 {
    color: ${colors.primaryColor};
    font-size: 1.6rem;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

export const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const BenefitCard = styled.div`
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border-color: ${colors.primaryColor};
    box-shadow: 0 4px 16px rgba(19, 7, 121, 0.15);
    transform: translateY(-4px);
  }
`;

export const BenefitIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BenefitTitle = styled.h4`
  color: ${colors.primaryColor};
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
`;

export const BenefitDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
`;
