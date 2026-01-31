import styled from "styled-components";
import * as colors from "../../config/colors";
import { DataGrid } from "@mui/x-data-grid";

export const Title = styled.h1`
  color: ${colors.secondaryColor};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
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

export const WeekDayGastosDiv = styled.div`
  display: inline-block;
  width: 10rem;
  height: 15rem;
  overflow-y: scroll;
  margin: 10px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: ${colors.primaryColor};
  padding: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const TimeIntervalOptionsDiv = styled.div`
  display: flex;
  height: 5%;
  width: 100%;
  padding: 10px;
  justify-content: center;
`;

export const DataGridBox = styled.div`
  margin: 10px auto;

  .datagrid-headers {
    background-color: ${colors.primaryColor};
    color: ${colors.secondaryColor};
    font-weight: bold;
    font-size: 16px;
  }
`;

export const ChartContainer = styled.div`
  background: #f8f9fa;
  border: 2px solid ${colors.primaryColor};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 95%;
  max-width: 1200px;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 15px auto;
    width: 98%;
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;

  h3 {
    color: ${colors.primaryColor};
    font-size: 1.2rem;
    margin: 0;
    flex: 1;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const ToggleButton = styled.button`
  background: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background-color: ${colors.secondaryColor};
    color: ${colors.primaryColor};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    min-width: 40px;
    min-height: 40px;
  }
`;

export const ChartContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  overflow-x: auto;
  padding: 10px 0;

  @media (max-width: 768px) {
    overflow-x: scroll;

    svg {
      min-width: 100%;
    }
  }
`;

export const ChartsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const TotalDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid ${colors.primaryColor};

  strong {
    color: ${colors.primaryColor};
    font-size: 1.2rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  justify-content: center;
  margin: 0 auto;
  background-color: white;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
`;
