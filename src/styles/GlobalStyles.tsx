import styled, { createGlobalStyle } from "styled-components";
import { backgroundColor, successColor, warningColor, dangerColor, primaryColor, secondaryColor, tertiaryColor, selectedBGColor, selectedFontColor, CardTitleColor } from "../config/colors";
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background: ${backgroundColor};
    
  }

  html, body, #root {
    height: 100%;
    
  }

  .AppWrapper {
    display: flex;
    flex-direction:ltr;
    height: 100%;
  }

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }

  body .Toastify .Toastify__toast-container .Toastify__toast--success {
    background: ${successColor};
    color: #fff;
  } 

  body .Toastify .Toastify__toast-container .Toastify__toast--error {
    background: ${dangerColor};
    color: #fff;
  } 

  body .Toastify .Toastify__toast-container .Toastify__toast--warning {
    background: ${warningColor};
    color: #fff;
  }

  .saldo-por-direcionamento-table-header .gradient {
    background: ${selectedBGColor} !important;
    color: ${secondaryColor};
    font-size: 2rem;
    font-weight: bold;
    padding: 10px;
  }

  .saldo-por-direcionamento-table-row {
    background: ${tertiaryColor};
    font-size: 2rem;
    padding: 10px;
  }

  .gastos-gerais-popover-content {
    width: 100%; 
    padding: 10px; 
    height: 100%; 
    background-color: ${tertiaryColor}; 
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 20px;
  }

  .gastos-gerais-popover-title-div {
    width: 100%;
    height: 100%; 
    display: flex; 
    justify-content: center; 
    background-color: ${primaryColor}; 
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 20px;
  }

  .gastos-gerais-popover-title {
    color: ${secondaryColor};
    text-align: center; 
    font-size: 14px; 
    padding: 10px;
    font-weight: bold;
  }
`

export const Container = styled.section`
  width: 90%;
  height: 100%;
  background-color: #fff;
  margin: 10px auto;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`

export const ScrollableDiv = styled.div`
  overflow-x: scroll;
  display: flex;
  height: 50%;
  width: 50%;
  padding: 10px
`

export const OptionBtn = styled.button<{id: number, selected?: boolean, key: number}>`
  width: 150px;
  height: 50px;
  background: ${props => props.selected ? selectedBGColor : primaryColor};
  color: ${props => props.selected ? selectedFontColor : "#fff"};
  font-size: 16px;
  font-weight: ${props => props.selected ? "bold" : "normal"};
  border: none;
  border-radius: 4px;
  margin: 0 5px 0 5px;
  padding: 10px;
`

export const Card = styled.div`
  width: 45%;
  height: 100%;
  background-color: ${tertiaryColor};
  margin: 10px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
`

export const FullLineCard = styled.div`
  width: 98%;
  height: 90%;
  background-color: ${tertiaryColor};
  margin: 10px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
`

export const CardTitle = styled.h1`
  color: ${secondaryColor};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  background-color: ${CardTitleColor};
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  filter: brightness(110%);

  
`

export const FullLineCardTitle = styled.h1`
  color: ${secondaryColor};
  font-size: 45px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  background-color: ${CardTitleColor};
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  filter: brightness(110%);

  
`