import styled from "styled-components";
import * as colors from "../../config/colors";

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Title = styled.h1`
  color: ${colors.secondaryColor};
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 15px;
  border-radius: 8px;
  width: 100%;
`;

export const SummarySection = styled.section`
  width: 100%;

  h2 {
    color: ${colors.secondaryColor};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    background-color: ${colors.primaryColor};
    padding: 10px;
    border-radius: 6px;
  }

  details {
    margin-bottom: 12px;
  }

  details > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  details > summary::-webkit-details-marker {
    display: none;
  }

  details > summary::after {
    content: "▾";
    color: ${colors.secondaryColor};
    font-size: 1.55rem;
    transition: transform 0.2s, color 0.2s;
  }

  details[open] > summary::after {
    transform: rotate(180deg);
  }

  details > summary:hover::after {
    color: ${colors.selectedBGColor};
  }

  details > summary h3 {
    margin: 0;
    padding: 0;
    border-bottom: none;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  width: 100%;
`;

export const SummaryCard = styled.div`
  background-color: ${colors.primaryColor};
  border: 2px solid ${colors.secondaryColor};
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const SummaryLabel = styled.p`
  color: ${colors.secondaryColor};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
`;

export const SummaryValue = styled.p`
  color: ${colors.secondaryColor};
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

export const FormSection = styled.section`
  width: 100%;
  background-color: ${colors.primaryColor};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    color: ${colors.secondaryColor};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 2px solid ${colors.secondaryColor};
    padding-bottom: 10px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  width: 100%;
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  input,
  select {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid ${colors.secondaryColor};
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: ${colors.selectedBGColor};
      box-shadow: 0 0 0 2px rgba(0, 100, 200, 0.1);
    }
  }

  label {
    color: ${colors.secondaryColor};
    font-weight: 600;
    font-size: 14px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;

export const SimulationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(184, 182, 182, 0.548);

  thead {
    background-color: ${colors.primaryColor};
  }

  tbody tr {
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9f9f9;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  font-size: 14px;
  color: #333;
  font-weight: 500;

  &:first-child {
    border-left: 4px solid ${colors.lightPrimartyColor};
  }
`;
export const TableHeader = styled.tr`
  background-color: ${colors.primaryColor};
  color: ${colors.secondaryColor};
  border-bottom: 2px solid ${colors.secondaryColor};

  ${TableCell} {
    color: #fff;
    font-size: 1.1rem;
  }
`;

export const BalanceSection = styled.section`
  width: 100%;

  h2 {
    color: ${colors.secondaryColor};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    background-color: ${colors.primaryColor};
    padding: 10px;
    border-radius: 6px;
  }
`;

export const BalanceCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  details {
    margin-bottom: 12px;
  }

  details > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  details > summary::-webkit-details-marker {
    display: none;
  }

  details > summary::after {
    content: "▾";
    color: ${colors.secondaryColor};
    font-size: 1.55rem;
    transition: transform 0.2s, color 0.2s;
  }

  details[open] > summary::after {
    transform: rotate(180deg);
  }

  details > summary:hover::after {
    color: ${colors.selectedBGColor};
  }

  details > summary h3 {
    margin: 0;
    padding: 0;
    border-bottom: none;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 4px;
  width: fit-content;
`;

interface TabButtonProps {
  isActive: boolean;
  isGasto?: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${(props) =>
    props.isActive
      ? props.isGasto
        ? colors.dangerColor
        : colors.greenColor
      : "transparent"};
  color: ${(props) =>
    props.isActive ? colors.secondaryColor : colors.primaryColor};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.isActive
        ? props.isGasto
          ? colors.dangerColor
          : colors.greenColor
        : "#e0e0e0"};
  }
`;

export const DetailedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

export const DetailedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  border-left: 4px solid ${colors.primaryColor};
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

export const ItemName = styled.span`
  color: ${colors.secondaryColor};
  font-weight: 600;
  font-size: 14px;
`;

export const ItemValue = styled.span<{ isPositive?: boolean }>`
  color: ${(props) =>
    props.isPositive === undefined
      ? colors.secondaryColor
      : props.isPositive
      ? colors.successColor
      : colors.dangerColor};
  font-weight: bold;
  font-size: 14px;
`;

export const TotalItemRow = styled(DetailedItem)`
  background-color: ${colors.primaryColor};
  border-left: 4px solid ${colors.secondaryColor};

  ${ItemName} {
    color: ${colors.secondaryColor};
    font-weight: bold;
    font-size: 15px;
  }

  ${ItemValue} {
    color: ${colors.secondaryColor};
    font-size: 16px;
  }
`;

export const SubsectionTitle = styled.h3`
  color: ${colors.secondaryColor};
  font-size: 1.25rem;
  font-weight: 700;
  margin: 20px 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid ${colors.primaryColor};
`;
