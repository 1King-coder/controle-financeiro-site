import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { StyledButton, StyledButtonGroup } from "../../styles/GlobalStyles";
import { Transferencia } from "../../types/Transferencia";
import { LocalizationProvider, MonthCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

class getTransferencias {

  static async getTransferencias(tipoTransferenciaUrlPath: string): Promise<Transferencia[]> {
    const res = await axios.get(tipoTransferenciaUrlPath);
    return res.data;
  }

  static async getTransferenciasByMonth(tipoTransferenciaUrlPath: string, date: Date): Promise<Transferencia[]> {
    const res = await axios.get(tipoTransferenciaUrlPath);

    const filteredData =  getTransferencias.getTransferencias(tipoTransferenciaUrlPath).then((data: Transferencia[]) => {
      
      const filteredData = data.filter( (deposito: Transferencia) => {

        const dateSplited = deposito.created_at.split("/");
        const dataTransferencia = new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1,  Number(dateSplited[0]));
  
        if (dataTransferencia.getMonth() === date.getMonth()) {
          return deposito;
        }

        return null;
      });
      
      return filteredData;
      
    });
    
    return filteredData;
  }

}

export default function Transferencias() {
  const [transferencias, setTransferencias]: [Transferencia[], any] = React.useState([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);
  const [transferenciasUrlPath, setTransferenciasUrlPath]: [string, any] = React.useState("/transferencias_entre_bancos");
  const [transferenciasByMonth, setTransferenciasByMonth]: [Transferencia[], any] = React.useState([]);
  const [selectedMonthDate, setSelectedMonthDate]: [Dayjs, any] = React.useState(dayjs());


  React.useEffect(() => {
    getTransferencias.getTransferencias(transferenciasUrlPath).then((data) => {
      console.log(data);
      setTransferencias(data);
    });
  }, [transferenciasUrlPath]);

  React.useEffect(() => {
    if (optionSelectedId === 1) {
      setTransferenciasUrlPath("/transferencias_entre_bancos");
    } else {
      setTransferenciasUrlPath("/transferencias_entre_direcionamentos");
    }
  }, [optionSelectedId]);

  React.useEffect(() => {
    getTransferencias.getTransferenciasByMonth(transferenciasUrlPath, selectedMonthDate.toDate()).then((data) => {
      setTransferenciasByMonth(data);
    })
  }, [selectedMonthDate, transferenciasUrlPath]);


  return (
    <div className="transferencias-body-div">
      <Title>Transferencias</Title>
      <StyledButtonGroup className="transferencias-button-group">
        <StyledButton id={1} selected={optionSelectedId === 1} onClick={() => setOptionSelectedId(1)}>Entre Bancos</StyledButton>
        <StyledButton id={2} selected={optionSelectedId === 2} onClick={() => setOptionSelectedId(2)}>Entre Direcionamentos</StyledButton>
      </StyledButtonGroup>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}> 
          <MonthCalendar value={selectedMonthDate} onChange={setSelectedMonthDate}/>
        </LocalizationProvider>
      </div>

    </div>
  );
}