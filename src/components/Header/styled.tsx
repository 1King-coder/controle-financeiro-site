import styled from "styled-components";
import { primaryColor, successColor, secondaryColor} from "../../config/colors";

export const Nav = styled.nav`
  background: ${primaryColor};
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  :hover {
    cursor: pointer;
    background: ${successColor};
    opacity: 0.5;
    transition: ease-out 500ms;
    border-radius: 5px;
  }
`

export const BoxSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 10px;
`

export const BoxSideRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 10px;
`

export const UsernameP = styled.p`
  color: white;
  padding:8px;
  margin: 0 0 0 10px;
  background:${secondaryColor};
  border-radius:20px;
  font-family: monospace;
  font-weight: bold;
`

export const HoverEffect = styled.div`
  justify-content: center;
  align-items: center;
  padding: 0px;
  margin:0px;
  :hover {
    cursor: pointer;
    background: ${successColor};
    opacity: 0.5;
    transition: ease-out 500ms;
    border-radius: 5px;
  }
`