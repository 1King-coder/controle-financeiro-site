import styled from "styled-components";
import * as colors from "../../config/colors";


export const GeneralBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  form {
    margin: 1rem auto;
    background-color: ${colors.tertiaryColor};
    padding: 2rem;
    border-radius: 1rem;
    border: 3px solid ${colors.primaryColor};

  }
`

export const InputBox = styled.div`
  margin: 1rem auto;
  text-align: center;

  Label {
    font-size: 1.5rem;
    font-weight: bold;
  }

  #nome-banco {
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
    color: ${colors.secondaryColor};
    font-size: 1rem;
    font-weight: bold;
    width: 100%;
    :hover {
      opacity: 0.7;
    }
  }


`