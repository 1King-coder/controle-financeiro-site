import React from "react";
import { DataGridBox, SubTitle1, SubTitle2, Title } from "./styled";
import axios from "../../services/axios";
import { StyledButton, StyledButtonGroup } from "../../styles/GlobalStyles";
import { Transferencia, TransferenciaWithNames } from "../../types/Transferencia";
import { LocalizationProvider, MonthCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Banco } from "../../types/Banco";
import { Direcionamento } from "../../types/Direcionamento";
import * as colors from "../../config/colors";

class getTransferencias {

  static async getTransferencias(tipoTransferenciaUrlPath: string): Promise<Transferencia[]> {
    const res = await axios.get(tipoTransferenciaUrlPath);
    const data = await res.data;

    const transferencias = data.map((transf: any) => {
      if (tipoTransferenciaUrlPath === "/transferencias_entre_bancos") {
        return {
          id: transf.id,
          id_origem: transf.id_banco_origem,
          id_destino: transf.id_banco_destino,
          id_intermediario: transf.id_direcionamento,
          valor: transf.valor,
          descricao: transf.descricao,
          created_at: transf.created_at,
        }
      }

      return {
        id: transf.id,
        id_origem: transf.id_direcionamento_origem,
        id_destino: transf.id_direcionamento_destino,
        id_intermediario: transf.id_banco,
        valor: transf.valor,
        descricao: transf.descricao,
        created_at: transf.created_at,
      }
    })

    return transferencias;
  }

  static async getTransferenciasByMonth(tipoTransferenciaUrlPath: string, date: Date): Promise<Transferencia[]> {
    const res = await axios.get(tipoTransferenciaUrlPath);

    const filteredData =  getTransferencias.getTransferencias(tipoTransferenciaUrlPath).then((data: any) => {
      


      const filteredData = data.filter( (transferencia: Transferencia) => {

        const dateSplited = transferencia.created_at.split("/");
        const dataTransferencia = new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1,  Number(dateSplited[0]));
  
        if (dataTransferencia.getMonth() === date.getMonth()) {
          return transferencia;
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
  const [bancos, setBancos]: [{ [key: number]: string }, any] = React.useState({id:1, nome:""});
  const [direcionamentos, setDirecionamentos]: [{ [key: number]: string }, any] = React.useState({id:1, nome:""});


  React.useEffect(() => {
    getTransferencias.getTransferencias(transferenciasUrlPath).then((data) => {

      setTransferencias(data);

    });
    function getBancos() {
      const bancosNameById: { [key: number]: string }  = {};

      axios.get("/bancos").then((response) => {
        const data: Banco[] = response.data;

        data.forEach((banco: Banco) => {
          bancosNameById[banco.id] = banco.nome;
        });
        setBancos(bancosNameById);
      });
      
    }
    getBancos();

    function getDirecionamentos() {
      const direcionamentosNameById: { [key: number]: string }  = {};

      axios.get("/direcionamentos").then((response) => {
        const data: Direcionamento[] = response.data

        data.forEach((direcionamento: Direcionamento) => {
          direcionamentosNameById[direcionamento.id] = direcionamento.nome;
        });

        setDirecionamentos(direcionamentosNameById);

      });
    }
    getDirecionamentos();

    

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
      
      const namedTransferencias = data.map((transferencia: Transferencia) => {
        return {
          id: transferencia.id,
          created_at: transferencia.created_at,
          origem: transferenciasUrlPath === "/transferencias_entre_bancos" ? bancos[transferencia.id_origem] : direcionamentos[transferencia.id_origem],
          destino: transferenciasUrlPath === "/transferencias_entre_bancos" ? bancos[transferencia.id_destino] : direcionamentos[transferencia.id_destino],
          intermediario: transferenciasUrlPath === "/transferencias_entre_direcionamentos" ? bancos[transferencia.id_intermediario] : direcionamentos[transferencia.id_intermediario],
          valor: transferencia.valor
        }
      })
      
      setTransferenciasByMonth(namedTransferencias);
    })
  }, [selectedMonthDate, transferenciasUrlPath, bancos, direcionamentos]);


  return (
    <div className="transferencias-body-div">
      <Title>Transferencias</Title>
      <StyledButtonGroup className="transferencias-button-group">
        <StyledButton id={1} selected={optionSelectedId === 1} onClick={() => setOptionSelectedId(1)}>Entre Bancos</StyledButton>
        <StyledButton id={2} selected={optionSelectedId === 2} onClick={() => setOptionSelectedId(2)}>Entre Direcionamentos</StyledButton>
      </StyledButtonGroup>
      <div style={
        {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          margin: "10px auto"
        }
      }>
        <div style={{margin: "2rem", border:`1px solid ${colors.primaryColor}`, boxShadow: "1px rgba(0, 0, 0, 0.5)"}}>
          <SubTitle2>Selecione o mês:</SubTitle2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>  
            <MonthCalendar value={selectedMonthDate} onChange={setSelectedMonthDate} className="transferencias-calendar"/>
          </LocalizationProvider>

        </div>
          {
            (
            <DataGridBox>

              <DataGrid
                rows={transferenciasByMonth}
                columns={[
                  { field: "id", headerName: "ID", width: 70, headerClassName: "datagrid-headers", headerAlign: 'center' },
                  { field: "created_at", headerName: "Data", width: 130, headerClassName: "datagrid-headers", headerAlign: 'center' },
                  { field: "origem", headerName: "Origem", width: 130, headerClassName: "datagrid-headers", headerAlign: 'center' },
                  { field: "destino", headerName: "Destino", width: 130, headerClassName: "datagrid-headers", headerAlign: 'center' },
                  { field: "intermediario", headerName: "Intermediario", width: 130, headerClassName: "datagrid-headers", headerAlign: 'center' },
                  { field: "valor", headerName: "Valor", width: 130, valueFormatter: (value: number) => `R$ ${value.toFixed(2)}`, headerClassName: "datagrid-headers", headerAlign: 'center'},
                ]}
                sx= {
                  {
                    boxShadow: 4,
                    border: 2,
                    borderColor: colors.primaryColor,
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                    width: "45rem",
                    height: "50rem",
                    position: "relative",
                    margin: "10px auto",
                    backgroundColor: colors.tertiaryColor,
                    fontSize: 16,
                  }
                }
                slots={{
                  toolbar: GridToolbar,
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                />

            </DataGridBox>

              )
          }
      </div>

    </div>
  );
}