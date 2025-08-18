import styled from "styled-components";
import { primaryColor, secondaryColor } from "../../config/colors";
export const Title = styled.h1`

  color: ${secondaryColor};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  background-color: ${primaryColor};
  padding: 10px;
  width: 100%;
  
`
export const Box = styled.div`
  border: 1px solid black;
  padding: 0.2rem;
  margin: 0.3rem;
  justify-content: center;
  align-items: center;
` 

export const Grid = styled.div`
  display: flex;
  justify-content: center;
  
`