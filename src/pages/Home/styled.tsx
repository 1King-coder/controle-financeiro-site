import styled from "styled-components";
import {
  primaryColor,
  secondaryColor,
  selectedBGColor,
  selectedFontColor,
  tertiaryColor,
} from "../../config/colors";
import { PieChart } from "@mui/x-charts";
export const Title = styled.h1`
  color: ${secondaryColor};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  background-color: ${primaryColor};
  padding: 10px;
  width: 100%;
`;
export const Box = styled.div`
  border: 1px solid black;
  padding: 0.2rem;
  margin: 0.3rem;
  display: flow-root;
  align-items: center;
  justify-content: center;
  flex-basis: 300px;
  height: 26rem;

  Button {
    position: relative;
    margin-top: 10px;
  }
`;

export const Grid = styled.div`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  flex-shrink: wrap;
  gap: 20px;
`;

export const ScrollableDivBtns = styled.div`
  overflow-x: scroll;
  display: flex;
  height: fit-content;
  width: 100%;
  padding: 10px;
  justify-content: center;
`;

export const Btn = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid ${primaryColor};
  background-color: ${primaryColor};
  transition: all 0.5s;
  box-shadow: 0 5px 10px ${primaryColor};
  transition: all ease-out 250ms;

  width: 270px;
  height: 80px;
  margin: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-grow: 1;

  span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    color: ${secondaryColor};
    font-size: 1rem;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px ${primaryColor};
  }

  &:hover span:after {
    opacity: 1;
    right: 0;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 2px 5px ${primaryColor};
  }
`;

export const Container = styled.section`
  width: 90%;
  height: fit-content;
  background-color: #fff;
  margin: 10px auto;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;
export const Card = styled.div`
  width: 45%;
  height: fit-content;
  background-color: ${tertiaryColor};
  margin: 10px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  align-items: center;
  position: relative;

  button {
    margin-top: auto;
  }
`;

export const HeroSection = styled.div`
  background: ${primaryColor};
  color: ${secondaryColor};
  padding: 60px 30px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

export const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 15px 0;
  color: ${secondaryColor};

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin: 0 0 30px 0;
  color: ${secondaryColor};
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  box-sizing: border-box;
`;

export const FeatureCard = styled.div`
  background-color: #f8f9fa;
  border: 2px solid ${primaryColor};
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: ${secondaryColor};
  }

  svg {
    color: ${primaryColor};
    margin-bottom: 15px;
  }

  h3 {
    color: ${primaryColor};
    font-size: 1.2rem;
    margin: 15px 0 10px 0;
  }

  p {
    color: #666;
    font-size: 0.95rem;
    margin: 0;
  }
`;

export const CTAButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 40px;

  a {
    text-decoration: none;
  }
`;

export const PrimaryButton = styled.button`
  background-color: ${primaryColor};
  color: ${secondaryColor};
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${primaryColor}99;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px ${primaryColor}bb;
    background-color: ${secondaryColor};
    color: ${primaryColor};
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 12px 30px;
    font-size: 1rem;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: transparent;
  border: 2px solid ${primaryColor};
  color: ${primaryColor};
  box-shadow: none;

  &:hover {
    background-color: ${primaryColor};
    color: ${secondaryColor};
  }
`;

export const UnauthorizedGrid = styled(Grid)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

export const DataSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin: 15px auto;
  }
`;

export const DataCard = styled.div`
  background: #f8f9fa;
  border: 2px solid ${primaryColor};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    color: ${primaryColor};
    font-size: 1.2rem;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const CardTitle = styled.h3`
  color: ${primaryColor};
  font-size: 1.2rem;
  margin: 0 0 15px 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${primaryColor};
    border-radius: 10px;

    &:hover {
      background: ${secondaryColor};
    }
  }
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    border-color: ${primaryColor};
  }

  span:first-child {
    font-weight: 500;
    color: #333;
    flex: 1;
  }

  span:last-child {
    color: ${primaryColor};
    font-weight: bold;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.9rem;
  }
`;

export const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  color: #999;
  text-align: center;
  font-style: italic;
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: ${primaryColor};
  color: ${secondaryColor};
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;

  &:hover {
    background-color: ${secondaryColor};
    color: ${primaryColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${primaryColor}66;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.85rem;
  }
`;

export const ChartContainer = styled.div`
  background: #f8f9fa;
  border: 2px solid ${primaryColor};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 15px auto;
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;

  h3 {
    color: ${primaryColor};
    font-size: 1.2rem;
    margin: 0;
    flex: 1;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const ToggleButton = styled.button`
  background: ${primaryColor};
  color: ${secondaryColor};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background-color: ${secondaryColor};
    color: ${primaryColor};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    min-width: 40px;
    min-height: 40px;
  }
`;

export const ChartContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  overflow-x: auto;
  padding: 10px 0;

  @media (max-width: 768px) {
    overflow-x: scroll;

    svg {
      min-width: 100%;
    }
  }
`;

export const TotalDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid ${primaryColor};

  strong {
    color: ${primaryColor};
    font-size: 1.2rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  a {
    flex: 1;
    min-width: 250px;

    @media (max-width: 768px) {
      min-width: 100%;
    }
  }
`;

export const AuthenticatedGrid = styled(Grid)`
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;
