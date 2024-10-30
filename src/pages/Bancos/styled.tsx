import styled from "styled-components";
import * as colors from "../../config/colors";

export const Title = styled.h1`
  color: ${colors.secondaryColor};
`

export const BancosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 5px 10px ${colors.primaryColor};
  border-radius: 4px;
  
`

export const BancosTr = styled.tr`
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  text-align: center;
  border-radius: 4px;

`

export const BancosTd = styled.td`
  padding: 12px 15px;
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  text-align: center;

`

export const BancosTh = styled.th`
  padding: 12px 15px;
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  text-align: center;
  font-weight: bold;
`