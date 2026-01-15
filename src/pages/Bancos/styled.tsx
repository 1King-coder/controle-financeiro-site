import styled from "styled-components";
import * as colors from "../../config/colors";

export const Title = styled.h1`
  color: ${colors.secondaryColor};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
`

export const BancosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 5px 10px ${colors.primaryColor};
  border-radius: 4px;
  
`

export const BancosTr = styled.tr`
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  text-align: center;
  border-radius: 4px;

`

export const BancosTd = styled.td`
  padding: 12px 15px;
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  text-align: center;

`

export const BancosTh = styled.th`
  padding: 12px 15px;
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  text-align: center;
  font-weight: bold;
`

export const ActionButton = styled.button`

  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid red;
  background-color: red;
  transition: all 0.25s;
  box-shadow: 0 5px 10px red;
  height: 5rem;
  width: 10rem;

  span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    color: ${colors.secondaryColor};
    font-size: 1rem;
    font-weight: bold;
    transition: 0.25s;
  }

  :active {
    transform: translateY(4px);
  }

  :hover {
    transform: scale(1.1);
  }

  
`