import styled from "styled-components";
import * as colors from "../../config/colors";

export const UserPageContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormField = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;

  label {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: ${colors.primaryColor};
  }

  input {
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

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
    background-color: ${colors.selectedBGColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(+2px);
  }

  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
    color: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &:hover {
      background-color: #ccc;
      color: #666;
      transform: none;
    }
  }

  &.secondary {
    background-color: transparent;
    color: ${colors.primaryColor};

    &:hover {
      background-color: ${colors.primaryColor};
      color: ${colors.secondaryColor};
    }
  }

  &.danger {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${colors.primaryColor};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${colors.primaryColor};
`;

export const InfoText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

export const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  border: 1px solid #e0e0e0;
`;
