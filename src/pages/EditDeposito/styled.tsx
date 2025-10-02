import styled from "styled-components";
import * as colors from "../../config/colors";

export const EditContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  border: 3px solid ${colors.primaryColor};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const FormField = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: column;

  label {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: ${colors.primaryColor};
  }

  select, input {
    font-size: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid ${colors.primaryColor};
    background-color: #fff;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${colors.secondaryColor};
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 2px solid ${colors.primaryColor};
  background-color: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${colors.secondaryColor};
    color: ${colors.primaryColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &.secondary {
    background-color: transparent;
    color: ${colors.primaryColor};

    &:hover {
      background-color: ${colors.primaryColor};
      color: ${colors.secondaryColor};
    }
  }
`;
