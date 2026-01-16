import styled from "styled-components";
import * as colors from "../../config/colors";


export const GeneralBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  form {
    margin: 1rem 1rem auto;
    background-color: ${colors.tertiaryColor};
    padding: 2rem;
    border-radius: 1rem;
    border: 3px solid ${colors.primaryColor};

  }
`
export const DataGridBox = styled.div`
  height: 100%;
  .datagrid-headers {
    background-color: ${colors.primaryColor};
    color: ${colors.secondaryColor};
    font-weight: bold;
    font-size: 16px;
  }
`
export const InputBox = styled.div`
  margin: 1rem auto;
  text-align: center;

  Label {
    font-size: 1.5rem;
    font-weight: bold;
  }

  #nome-categoria {
    font-size: 1rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid ${colors.primaryColor};
  }

  Button {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 2px solid ${colors.primaryColor};
    background-color: ${colors.primaryColor};
    transition: all 0.5s;
    box-shadow: 0 5px 10px ${colors.primaryColor};

    width: 100%;

    span {
      cursor: pointer;
      display: inline-block;
      position: relative;
      color: ${colors.secondaryColor};
      font-size: 1rem;
      font-weight: bold;
      transition: 0.5s;
    }

    span:after {
      content: '>>';
      position: absolute;
      opacity: 0;
      top: 0;
      right: -20px;
      transition: 0.5s;
    }

    :hover span {
      padding-right: 25px;
    }

    :hover span:after {
      opacity: 1;
      right: 0;
    }

    :active {
      transform: translateY(4px);
    }

    
  }


`