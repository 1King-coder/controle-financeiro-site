import styled from "styled-components";
import { primaryColor, secondaryColor, selectedBGColor, selectedFontColor } from "../../config/colors";
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
  display:flow-root;
  flex-basis: 250px;
` 

export const Grid = styled.div`
  justify-content: center;
  display:flex;
  flex-wrap: wrap;
`

export const ScrollableDivBtns = styled.div`
  overflow-x: scroll;
  display: flex;
  height:110px;
  width: 100%;
  padding: 10px;
  justify-content: center;
`


export const Btn = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid ${primaryColor};
  background-color: ${primaryColor};
  transition: all 0.5s;
  box-shadow: 0 5px 10px ${primaryColor};

  width: 250px;
  height: 70px;
  margin: 0 10px 0 10px;
  display:flex;
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
    transition: 0.5s;
  }


  :hover span:after {
    opacity: 1;
    right: 0;
  }

  :active {
    transform: translateY(4px);
  }
` 