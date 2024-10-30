import styled from "styled-components";
import { primaryColor, successColor} from "../../config/colors";

export const Nav = styled.nav`
  background: ${primaryColor};
  display: flex;
  padding:20px;
  align-items: center;
  justify-content: center;
`

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px 0 10px;
  :hover {
    cursor: pointer;
    background: ${successColor};
    opacity: 0.5;
    transition:  ease-out 500ms;
    border-radius: 5px;
    
  }
`