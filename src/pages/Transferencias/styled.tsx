import styled from "styled-components";
import * as colors from "../../config/colors";
import { StaticDatePicker } from "@mui/x-date-pickers";

export const Title = styled.h1`
  color: ${colors.secondaryColor};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
`;

export const DataGridBox = styled.div`
  .datagrid-headers {
    background-color: ${colors.primaryColor};
    color: ${colors.secondaryColor};
    font-weight: bold;
    font-size: 16px;
  }
`;

export const SubTitle1 = styled.h2`
  color: ${colors.secondaryColor};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
  margin-top: 3rem;
`;

export const SubTitle2 = styled.h3`
  color: ${colors.secondaryColor};
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
  margin-top: 0.1rem;
`;
export const StyledStaticDatePicker = styled(StaticDatePicker)``;
