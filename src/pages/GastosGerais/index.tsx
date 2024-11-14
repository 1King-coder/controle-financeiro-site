import React from "react";
import { Title, TimeIntervalOptionsDiv, SubTitle1, DataGridBox, SubTitle2} from "./styled";
import axios from "../../services/axios";
import { GastoGeral } from "../../types/GastoGeral";
import Chart from "react-google-charts";
import { Card, CardTitle, OptionBtn } from "../../styles/GlobalStyles";
import { dayOfTheWeek, months } from "../../config/dates";
import * as colors from "../../config/colors";
import { Banco } from "../../types/Banco";
import { Direcionamento } from "../../types/Direcionamento";
import {  LocalizationProvider, MonthCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import WeekPicker from "../../components/WeekPicker";
import { WeekDayPopoverCard } from "../../components/WeekDayPopoverCard";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { FaToolbox } from "react-icons/fa";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";

class GetGastosGeraisDataFuncions {
  static async getGastosGerais(): Promise<GastoGeral[]> {
    const response = await axios.get("/gastos_gerais");

    return await response.data;
  }

  static async getGastosGeraisFilterByDateInterval (dateStart: Date, dateEnd: Date): Promise<GastoGeral[]> {
    const filteredData =  GetGastosGeraisDataFuncions.getGastosGerais().then((data: GastoGeral[]) => {
      
      const filteredData = data.filter( (gastoGeral: GastoGeral) => {

        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1,  Number(dateSplited[0]));
  
        if (dataGasto >= dateStart && dataGasto <= dateEnd) {
          return gastoGeral;
        } 
        return null;
      });
      
      return filteredData;
      
    });
    
    return filteredData;
  }

  static async getGastosGeraisFilterByMonthInterval (date: Date): Promise<GastoGeral[]> {
    const filteredData =  GetGastosGeraisDataFuncions.getGastosGerais().then((data: GastoGeral[]) => {
      
      const filteredData = data.filter( (gastoGeral: GastoGeral) => {

        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1,  Number(dateSplited[0]));
  
        if (dataGasto.getMonth() === date.getMonth()) {
          return gastoGeral;
        }

        return null;
      });
      
      return filteredData;
      
    });
    
    return filteredData;
  }

  static async getGastosGeraisFilterByLastWeek(): Promise<GastoGeral[]> {
    const dateStart = new Date();
    const dateEnd = new Date();
    dateStart.setDate(dateStart.getDate() - 7);
    return await GetGastosGeraisDataFuncions.getGastosGeraisFilterByDateInterval(dateStart, dateEnd);
  }
}

function getSemanaAtual (today: Date): Date[] {
  const dateStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const dateEnd = new Date(today.getFullYear(), today.getMonth(), dateStart.getDate() + 6);
  return [dateStart, dateEnd];
}


export function GastosGerais(): JSX.Element {
  const [gastosGerais, setGastosGerais] = React.useState<GastoGeral[]>([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(2);
  const [gastosByActualWeekDay, setgastosByActualWeekDay] = React.useState(Array<GastoGeral[]>([]));
  const [gastosByWeekDay, setgastosByWeekDay] = React.useState(Array<GastoGeral[]>([]));
  const [bancos, setBancos]: [{ [key: number]: string }, any] = React.useState({id:1, nome:""});
  const [direcionamentos, setDirecionamentos]: [{ [key: number]: string }, any] = React.useState({id:1, nome:""});
  const [startWeekDayDate, setStartWeekDayDate]: [Dayjs, any] = React.useState(dayjs());
  const [selectedMonthDate, setSelectedMonthDate]: [Dayjs, any] = React.useState(dayjs());
  const [gastosByMonth, setGastosByMonth]: [GastoGeral[], any] = React.useState([]);

  React.useEffect(() => { 
    GetGastosGeraisDataFuncions.getGastosGeraisFilterByMonthInterval(selectedMonthDate.toDate()).then((data: GastoGeral[]) => {
      setGastosByMonth(data);

    })
  }, [selectedMonthDate])

  React.useEffect(() => { 
    const semanaSelecionada = getSemanaAtual(startWeekDayDate.toDate());

    

    GetGastosGeraisDataFuncions.getGastosGeraisFilterByDateInterval(semanaSelecionada[0], semanaSelecionada[1]).then((data: GastoGeral[]) => {
      setGastosGerais(data);
      const listgastosByWeekDay: Array<GastoGeral[]> = [[], [], [], [], [], [], []];
      data.forEach((gastoGeral: GastoGeral) => {
        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1,  Number(dateSplited[0]));
        
        listgastosByWeekDay[dataGasto.getDay()].push(gastoGeral);
      })
      setgastosByWeekDay(listgastosByWeekDay);

    })
  }, [startWeekDayDate])

  React.useEffect(() => {
    
    const semanaAtual = getSemanaAtual(new Date());

    GetGastosGeraisDataFuncions.getGastosGeraisFilterByDateInterval(semanaAtual[0], semanaAtual[1]).then((data: GastoGeral[]) => {
      setGastosGerais(data);
      const listgastosByActualWeekDay: Array<GastoGeral[]> = [[], [], [], [], [], [], []];
      data.forEach((gastoGeral: GastoGeral) => {
        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) - 1,  Number(dateSplited[0]));
        
        listgastosByActualWeekDay[dataGasto.getDay()].push(gastoGeral);
      })
      setgastosByActualWeekDay(listgastosByActualWeekDay);

    async function getBancos() {
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

    });
  }, []);



  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "fit-content",
      height: "fit-content",
      justifyContent: "center",
      margin: "0 auto",
      backgroundColor: "white",
    }}>
      
      <Title>Gastos Gerais</Title>
      <TimeIntervalOptionsDiv>
        <OptionBtn id={1} key={1} selected={1 === optionSelectedId} onClick={() => setOptionSelectedId(1)}>
          Semanal
        </OptionBtn>
        <OptionBtn id={2} key={2} selected={2 === optionSelectedId} onClick={() => setOptionSelectedId(2)}>
          Mensal
        </OptionBtn>
        <OptionBtn id={3} key={3} selected={3 === optionSelectedId} onClick={() => setOptionSelectedId(3)}>
          Anual
        </OptionBtn>
      </TimeIntervalOptionsDiv>

      <div>
        {
          optionSelectedId === 1 ? (
            <div style={{marginTop: "2rem"}}>

              <SubTitle1>Semana Atual: {getSemanaAtual(new Date())[0].toLocaleDateString()} - {getSemanaAtual(new Date())[1].toLocaleDateString()} </SubTitle1>
              <div style={{display:"flow", width: "100%", height: "100%", justifyContent: "center"}}>
                {
                  gastosByActualWeekDay.map((gastosInWeekDay: GastoGeral[], index: number) => {
                    return (
                      <WeekDayPopoverCard itemUrlPath="gastos-gerais" key={index} bancos={bancos} direcionamentos={direcionamentos} itemInWeekDay={gastosInWeekDay} index={index} />
                    )
                  })
                }
              </div>
              <SubTitle1>Semana Selecionada: {getSemanaAtual(startWeekDayDate.toDate())[0].toLocaleDateString()} - {getSemanaAtual(startWeekDayDate.toDate())[1].toLocaleDateString()} </SubTitle1>
              <div style={{display:"flex", width: "100%", height: "100%", justifyContent: "center"}}>
                <div style={{marginRight: "2rem"}}>
                  <WeekPicker value={startWeekDayDate} onChange={(newValue:any) => setStartWeekDayDate(newValue)}/>
                </div>

              </div>
              <div style={{display:"flow", width: "100%", height: "100%", justifyContent: "center"}}>
              
                {
                  gastosByWeekDay.map((gastosInWeekDay: GastoGeral[], index: number) => {
                    return (
                      <WeekDayPopoverCard itemUrlPath="gastos-gerais" key={index} bancos={bancos} direcionamentos={direcionamentos} itemInWeekDay={gastosInWeekDay} index={index} />
                    )
                  })
                }
              </div>
            </div>
          ) : optionSelectedId === 2 ? (
            <div style={{display:"flex", flexDirection: "row", flexWrap: "wrap", height: "100%", justifyContent: "center"}}>
              <SubTitle1>Você selecionou o mês de {months[selectedMonthDate.toDate().getMonth()]} de {new Date().getFullYear()}</SubTitle1>
              <div style={{ margin: "auto"}}>
                <SubTitle2>Selecione o mês</SubTitle2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MonthCalendar value={selectedMonthDate} onChange={(newValue) => setSelectedMonthDate(newValue)}/>
                </LocalizationProvider>
              </div>
                  {
                    (() => {
                      const rows = gastosByMonth.map((gasto: GastoGeral) => {
                          return {
                              id: gasto.id,
                              id_banco: bancos[gasto.id_banco],
                              id_direcionamento: direcionamentos[gasto.id_direcionamento],
                              descricao: gasto.descricao,
                              valor: gasto.valor,
                              created_at: gasto.created_at
                          }
                      })

                      const columns: GridColDef[] = [
                        { field: 'id', headerName: 'ID', width: 70, headerClassName: 'datagrid-headers', headerAlign: 'center' },
                        { field: 'id_banco', headerName: 'Banco', width: 150, headerClassName: 'datagrid-headers', headerAlign: 'center' },
                        { field: 'id_direcionamento', headerName: 'Direcionamento', width: 150, headerClassName: 'datagrid-headers', headerAlign: 'center' },
                        { field: 'descricao', headerName: 'Descrição', width: 150, headerClassName: 'datagrid-headers', headerAlign: 'center' },
                        { field: 'valor', headerName: 'Valor', width: 150, headerClassName: 'datagrid-headers', headerAlign: 'center', type: 'number', valueFormatter: (value: number) => `R$ ${value.toFixed(2)}` },
                        { field: 'created_at', headerName: 'Data', width: 150, headerClassName: 'datagrid-headers', headerAlign: 'center' },
                      ]
                      type PieChartData = {
                        id:number;
                        value: number;
                        label: string;
                      }

                      const groupedByDirecionamentoGastos: { [key: number]: number } = gastosByMonth.reduce(
                        (groupedByDirecionamentoGastos: { [key: string]: number }, item: any) => {
                          if (!groupedByDirecionamentoGastos.hasOwnProperty(item.id_direcionamento)) {
                            groupedByDirecionamentoGastos[item.id_direcionamento] = 0;
                          }

                          groupedByDirecionamentoGastos[item.id_direcionamento] += item.valor;
                          return groupedByDirecionamentoGastos;
                        }, {}
                      )

                      const groupedByBancoGastos: { [key: number]: number } = gastosByMonth.reduce(
                        (groupedByBancoGastos: { [key: string]: number }, item: any) => {
                          if (!groupedByBancoGastos.hasOwnProperty(item.id_banco)) {
                            groupedByBancoGastos[item.id_banco] = 0;
                          }

                          groupedByBancoGastos[item.id_banco] += item.valor;
                          return groupedByBancoGastos;
                        }, {}
                      )

                      const pieChartGroupedByDirecionamentoData: PieChartData[] = Object.keys(groupedByDirecionamentoGastos).map((direcionamento:string) => ({
                        id: Number(direcionamento),
                        value: groupedByDirecionamentoGastos[Number(direcionamento)],
                        label: direcionamentos[Number(direcionamento)],
                      }))

                      const pieChartGroupedByBancoData: PieChartData[] = Object.keys(groupedByBancoGastos).map((Bancos:string) => ({
                        id: Number(Bancos),
                        value: groupedByBancoGastos[Number(Bancos)],
                        label: bancos[Number(Bancos)],
                      }))

                      const totalGastos = gastosByMonth.reduce((total, item) => total + item.valor, 0);

                      return (
                        <>
                          <DataGridBox>
                            <DataGrid
                            rows={rows}
                            columns={columns}
                            sx= {
                              {
                                boxShadow: 4,
                                border: 2,
                                borderColor: colors.primaryColor,
                                '& .MuiDataGrid-cell:hover': {
                                  color: 'primary.main',
                                },
                                width: "100%",
                                height: "20rem",
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
                          <Card>
                            <CardTitle>Total de gastos do mês de {months[selectedMonthDate.toDate().getMonth()]}</CardTitle>
                            <p
                              style= {
                                {
                                  color: "black",
                                  fontSize: "3rem",
                                  fontWeight: "bold",
                                  marginTop: "10px auto",
                                  textAlign: "center"
                                }
                              }
                            >R$ {totalGastos.toFixed(2)}</p>
                          </Card>
                          <div style={{display: "flex", justifyContent: "center", margin: "10px auto"}}>
                            <PieChart 
                              
                              title="Gastos por direcionamento"
                              series={
                                [
                                  {
                                    arcLabel: (item) => `R$ ${item.value.toFixed(2)}`,
                                    arcLabelMinAngle: 30,
                                    data: pieChartGroupedByDirecionamentoData,
                                    innerRadius: 90,
                                    color: "#fff",
                                    highlightScope: { fade: "global", highlight: "item"}

                                  }
                                ]
                              }
                              width={800}
                              height={500}
                              sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                   
                                   fontSize: "16px",
                                   fontWeight: "bold",
                                   color: "#fff"
                                }
                              }}
                              />

                            <PieChart 
                              title="Gastos por banco"
                              series={
                                  [
                                    {
                                      arcLabel: (item) => `R$ ${item.value.toFixed(2)}`, 
                                      data: pieChartGroupedByBancoData,
                                      innerRadius: 90,
                                      color: "#fff",
                                      highlightScope: { fade: "global", highlight: "item"},
                                      arcLabelMinAngle: 30
                                    }
                                  ]
                                }
                                width={800}
                                height={500}
                                sx={{
                                  [`& .${pieArcLabelClasses.root}`]: {
                                     
                                     fontSize: "16px",
                                     fontWeight: "bold",
                                     color: "#fff"
                                  }
                                }}
                              />
                          </div>
                          
                          

                        </>
                        
                      )
                    })()
                  }
              


            </div>
          ) : null
        }
        
      </div>

    </div>
  );
}