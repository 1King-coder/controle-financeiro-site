import styled from "styled-components";
import {
  primaryColor,
  successColor,
  secondaryColor,
} from "../../config/colors";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
  background: ${primaryColor};
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  align-items: center;
  justify-content: center;
  position: relative;
  height: fit-content;
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  flex-direction: column;
  position: relative;

  div:hover {
    cursor: pointer;
    transition: ease-out 100ms;
    background-color: ${successColor};
    border-radius: 15px;
    transform: scale(1.5);
    margin: 0 12px;
    padding: 2px;
  }

  :active {
    transform: scale(1);
  }
`;

export const Tooltip = styled.span`
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${secondaryColor};
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  font-weight: bold;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 200ms ease-in-out;
  pointer-events: none;
  z-index: 1000;

  ${Box}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid ${secondaryColor};
  }
`;

export const BoxSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 10px;
`;

export const BoxSideRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 10px;
`;

export const UsernameP = styled.p`
  color: white;
  padding: 8px;
  margin: 0 0 0 10px;
  background: ${secondaryColor};
  border-radius: 20px;
  font-family: monospace;
  font-weight: bold;
`;

export const HoverEffect = styled.div`
  justify-content: center;
  align-items: center;
  padding: 0px;
  margin: 0px;

  :hover {
    cursor: pointer;
    opacity: 0.5;
    transition: ease-out 500ms;
    border-radius: 5px;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${primaryColor};
  border: 2px solid ${successColor};
  border-radius: 8px;
  padding: 8px 0;
  margin-top: 10px;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 200ms ease-in-out, visibility 200ms;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  ${DropdownContainer}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${successColor};
  }
`;

export const DropdownItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 10px;
  :hover {
    transform: translateX(-2px);
    background-color: ${successColor};
    transition: transform 160ms ease-out, background-color 160ms ease-out;
  }
  :active {
    transform: translateX(2px);
  }
`;

export const DropdownItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  color: ${secondaryColor};
  text-decoration: none;
  font-family: monospace;
  font-weight: bold;
  border-radius: 14px;
  background: ${primaryColor};
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
  transition: transform 160ms ease-out, box-shadow 160ms ease-out,
    background-color 160ms ease-out, color 160ms ease-out;

  :active {
    transform: translateY(0px) scale(0.99);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);
  }

  svg {
    flex-shrink: 0;
    transition: transform 160ms ease-out;
  }

  :hover svg {
    transform: scale(1.1);
  }
`;
