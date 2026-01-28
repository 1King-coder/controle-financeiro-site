import styled from "styled-components";
import * as colors from "../../config/colors";

export const CollapseBtn = styled.button`
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  border: none;
  width: 100%;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:active {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    height: 45px;
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    height: 40px;
    font-size: 1rem;
  }
`;
