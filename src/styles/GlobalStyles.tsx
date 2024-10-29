import styled, { createGlobalStyle } from "styled-components";
import { backgroundColor, successColor, warningColor, dangerColor } from "../config/colors";
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
`

export const Container = styled.section`
  width: 360px;
  background-color: #fff;
  margin: 30px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`