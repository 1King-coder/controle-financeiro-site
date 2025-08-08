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
import { Categoria } from "../../types/Categoria";
import * as colors from "../../config/colors";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../../services/useAuth";

class getTransferencias {

  static async getTransferencias(tipoTransferenciaUrlPath: string): Promise<Transferencia[]> {
    const res = await axios.get(tipoTransferenciaUrlPath);
    const data = await res.data;

    const transferencias = data.map((transf: any) => {
      if (tipoTransferenciaUrlPath.includes("transferencias/entre-bancos")) {
        return {
          id: transf.id,
          created_at: transf.created_at,
          origem: transf.bancoOrigem,
          destino: transf.bancoDestino,
          intermediario: transf.categoria,
          data_de_competencia: transf.data_de_competencia,
          valor: transf.valor,
          descricao: transf.descricao
        }
      }

      return {
        id: transf.id,
        created_at: transf.created_at,
        origem: transf.categoriaOrigem,
        destino: transf.categoriaDestino,
        intermediario: transf.banco,
        data_de_competencia: transf.data_de_competencia,
        valor: transf.valor,
        descricao: transf.descricao
      }
    })

    return transferencias;
  }

  static async getTransferenciasByMonth(tipoTransferenciaUrlPath: string, date: Date): Promise<Transferencia[]> {

    const filteredData =  getTransferencias.getTransferencias(tipoTransferenciaUrlPath).then((data: any) => {
      


      const filteredData = data.filter( (transferencia: Transferencia) => {

        const dateSplited = new Date(transferencia.data_de_competencia).toLocaleDateString("pt-br").split("/");
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
  const [transferenciasByMonth, setTransferenciasByMonth]: [Transferencia[], any] = React.useState([]);
  const [selectedMonthDate, setSelectedMonthDate]: [Dayjs, any] = React.useState(dayjs());
  const [bancos, setBancos]: [{ [key: number]: string }, any] = React.useState({id:1, nome:""});
  const [categorias, setCategorias]: [{ [key: number]: string }, any] = React.useState({id:1, nome:""});
  const { user } = useAuth();
  const [transferenciasUrlPath, setTransferenciasUrlPath]: [string, any] = React.useState("/transferencias/entre-bancos/" + user!.id);


  React.useEffect(() => {
    async function getBancos() {

      const bancosNameById: { [key: number]: string }  = {};

      axios.get(`/bancos/usuario/${user!.id}`).then((response) => {
        const data: Banco[] = response.data;

        data.forEach((banco: Banco) => {
          bancosNameById[banco.id] = banco.nome;
        });
        setBancos(bancosNameById);
      });
      
    }
    getBancos();
  }, [])

  React.useEffect(() => {
    async function getCategorias() {
      const categoriasNameById: { [key: number]: string }  = {};
      axios.get(`/categorias/usuario/${user!.id}`).then((response) => {
        const data: Categoria[] = response.data

        data.forEach((categoria: Categoria) => {
          categoriasNameById[categoria.id] = categoria.nome;
        });
        setCategorias(categoriasNameById);
      });
      
    }
    getCategorias();
  }, [])

  React.useEffect(() => {
    getTransferencias.getTransferencias(transferenciasUrlPath).then((data) => {

      setTransferencias(data);

    });
  }, [transferenciasUrlPath]);

  React.useEffect(() => {
    if (optionSelectedId === 1) {
      setTransferenciasUrlPath("/transferencias/entre-bancos/" + user!.id);
    } else {
      setTransferenciasUrlPath("/transferencias/entre-categorias/" + user!.id);
    }
  }, [optionSelectedId]);

  React.useEffect(() => {
    getTransferencias.getTransferenciasByMonth(transferenciasUrlPath, selectedMonthDate.toDate()).then((data) => {
      
      const namedTransferencias = data.map((transferencia: Transferencia) => {
        return {
          id: transferencia.id,
          created_at: new Date(transferencia.data_de_competencia).toLocaleDateString("pt-br"),
          origem: transferenciasUrlPath === "/transferencias/entre-bancos/" + user!.id ? bancos[transferencia.origem.id] : categorias[transferencia.origem.id],
          destino: transferenciasUrlPath === "/transferencias/entre-bancos/" + user!.id ? bancos[transferencia.destino.id] : categorias[transferencia.destino.id],
          intermediario: transferenciasUrlPath === "/transferencias/entre-categorias/" + user!.id ? bancos[transferencia.intermediario.id] : categorias[transferencia.intermediario.id],
          valor: transferencia.valor,
          opcoes: (
            <div style={{ display: "flex", gap:"1rem" }}>
              <Link to={`transferencias/edit/${transferencia.id}`}><FaEdit size={24} color={colors.secondaryColor}/></Link>
              <Link to={`transferencias/delete/${transferencia.id}`}><MdDelete size={24} color={colors.dangerColor}/></Link>
            </div>
          )
        }
      })
      
      setTransferenciasByMonth(namedTransferencias);
    })
  }, [selectedMonthDate, transferenciasUrlPath, bancos, categorias]);


  return (
    <div className="transferencias-body-div">
      <Title>Transferencias</Title>
      <StyledButtonGroup className="transferencias-button-group">
        <StyledButton id={1} selected={optionSelectedId === 1} onClick={() => setOptionSelectedId(1)}>Entre Bancos</StyledButton>
        <StyledButton id={2} selected={optionSelectedId === 2} onClick={() => setOptionSelectedId(2)}>Entre Categorias</StyledButton>
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
                  { field: "opcoes", headerName: "Opções", width: 130, headerClassName: "datagrid-headers", headerAlign: 'center', renderCell: (params) => params.value },
                ]}
                sx= {
                  {
                    boxShadow: 4,
                    border: 2,
                    borderColor: colors.primaryColor,
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                    width: "53rem",
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