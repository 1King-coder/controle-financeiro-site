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

export const DropzoneBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InputBox = styled.div<{fileUploaded?: boolean}>`
  display: flex;
  height:${props => props.fileUploaded ? '20%' : '100%'};
  flex-direction: ${props => props.fileUploaded ? 'row' : 'column'};
  align-items: center;
  justify-content: center;
  width: 100%;

  gap: 1rem;

  Button:hover {
    transform: translateY(-4px);
  }

  Button span:after {
    position: absolute;
    opacity: 0;
    top: 0;
    transition: 0.5s;
  }


  Button:hover span:after {
    opacity: 1;
    right: 0;
  }

  Button:active {
      transform: translateY(4px);
  }

  Button {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 2px solid ${colors.primaryColor};
    background-color: ${colors.primaryColor};
    transition: all 0.5s;
    box-shadow: 0 5px 10px ${colors.primaryColor};
    height:100%;
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
    
  }


`
export const DzLabel = styled.label`
  display: flex;
  height: 16rem;
  width: 100%;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border-width: 2px;
  border-style: dashed;
  border-color: ${colors.primaryColor};
  background-color: ${colors.tertiaryColor};

  &:hover {
    background-color: ${colors.CardTitleColor};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${colors.lightPrimartyColor};
    background-color: ${colors.backgroundColor2};

    &:hover {
      border-color: ${colors.primaryColor};
      background-color: ${colors.selectedBGColor};
    }
  }
`;

export const DzImageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.5rem;
  padding-top: 1.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
`

export const DzSvg = styled.svg`
  margin-bottom: 1rem;
  height: 2rem;
  width: 2rem;
  color: ${colors.primaryColor};

  @media (prefers-color-scheme: dark) {
    color: ${colors.secondaryColor};
  }
`

export const FileNameSpan = styled.span`
  margin-top: 1rem;
  color: white;
  font-size: 1rem;
  font-weight: bold;
`