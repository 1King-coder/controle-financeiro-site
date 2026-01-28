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
