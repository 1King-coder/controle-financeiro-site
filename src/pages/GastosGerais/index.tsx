import React from "react";
import { Title, TimeIntervalOptionsDiv, SubTitle1, WeekDayGastosDiv, SubTitle2 } from "./styled";
import axios from "../../services/axios";
import { GastoGeral } from "../../types/GastoGeral";
import Chart from "react-google-charts";
import { OptionBtn } from "../../styles/GlobalStyles";
import { dayOfTheWeek, months } from "../../config/dates";
import { Button, Popover } from "flowbite-react";
import * as colors from "../../config/colors";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { Banco } from "../../types/Banco";
import { Direcionamento } from "../../types/Direcionamento";
import {  LocalizationProvider, MonthCalendar } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import WeekPicker from "../../components/WeekPicker";
class GetGastosGeraisDataFuncions {
  static async getGastosGerais(): Promise<GastoGeral[]> {
    const response = await axios.get("/gastos_gerais");

    return await response.data;
  }

  static async getGastosGeraisFilterByDateInterval (dateStart: Date, dateEnd: Date): Promise<GastoGeral[]> {
    const filteredData =  GetGastosGeraisDataFuncions.getGastosGerais().then((data: GastoGeral[]) => {
      
      const filteredData = data.filter( (gastoGeral: GastoGeral) => {

        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) + 1,  Number(dateSplited[0]));
  
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
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) + 1,  Number(dateSplited[0]));
  
        if (dataGasto.getMonth() === date.getMonth() && dataGasto.getFullYear() === date.getFullYear()) {
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
  const [gastosByMonth, setGastosByMonth]: [{ [key: string]: GastoGeral[] }, any] = React.useState({});

  React.useEffect(() => { 
    GetGastosGeraisDataFuncions.getGastosGeraisFilterByMonthInterval(selectedMonthDate.toDate()).then((data: GastoGeral[]) => {
      const listgastosByDayOfTheMonth: { [key: string]: GastoGeral[] } = {};


      data.forEach((gastoGeral: GastoGeral) => {
        if (listgastosByDayOfTheMonth.hasOwnProperty(gastoGeral.created_at)) {
          listgastosByDayOfTheMonth[gastoGeral.created_at] = [];
          listgastosByDayOfTheMonth[gastoGeral.created_at].push(gastoGeral)
        } else {
          listgastosByDayOfTheMonth[gastoGeral.created_at].push(gastoGeral);
        }
        
      })
      setGastosByMonth(listgastosByDayOfTheMonth);

    })
  }, [selectedMonthDate])

  React.useEffect(() => { 
    const semanaSelecionada = getSemanaAtual(startWeekDayDate.toDate());

    

    GetGastosGeraisDataFuncions.getGastosGeraisFilterByDateInterval(semanaSelecionada[0], semanaSelecionada[1]).then((data: GastoGeral[]) => {
      setGastosGerais(data);
      const listgastosByWeekDay: Array<GastoGeral[]> = [[], [], [], [], [], [], []];
      data.forEach((gastoGeral: GastoGeral) => {
        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) + 1,  Number(dateSplited[0]));
        
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
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) + 1,  Number(dateSplited[0]));
        
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
      width: "100%",
      height: "fit-content",
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
                      <WeekDayGastosDiv key={index}>
                        <SubTitle2>{dayOfTheWeek.withFeira[index]}</SubTitle2>
                        {
                          gastosInWeekDay.map((gastoGeral: GastoGeral) => {
                            const splitedDate = gastoGeral.created_at.split("/");
                            const gastoDate = new Date (Number(splitedDate[2]), Number(splitedDate[1]) + 1,  Number(splitedDate[0]));
                            return (
                              <>          
                                <Popover content={
                                  <div className="gastos-gerais-popover-content">
                                    <div className="gastos-gerais-popover-title-div">
                                      <h3 className="gastos-gerais-popover-title">Dados do Gasto</h3>
                                    </div>
                                    <table className="gastos-gerais-popover-table">
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Banco:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{bancos[gastoGeral.id_banco]}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Direcionamento:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{direcionamentos[gastoGeral.id_direcionamento]}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Descrição:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{gastoGeral.descricao}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Valor:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{`R$ ${gastoGeral.valor}`}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Data:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{gastoDate.toLocaleDateString()}</td>
                                      </tr>
                                    </table>
                                    <div className="gastos-gerais-popover-edit-delete-btns-div">
                                      <Link to={`/gastos-gerais/${gastoGeral.id}`} style={{justifyContent: "center", alignItems: "center", display: "flex", marginRight: "10px"}}>
                                        <FaEdit size={20} color={colors.secondaryColor}/>
                                      </Link>
                                      <Link to={`/gastos-gerais/${gastoGeral.id}`} style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
                                        <MdDelete size={20} color={colors.dangerColor}/>
                                      </Link>
                                    </div>
                                  </div>
                                } placement="right" trigger="hover" >
                                  <Button className="gastos-gerais-popover-btn">{gastoGeral.descricao}</Button>
                                </Popover>
                              </>
                            )
                          })
                        }
                        
                      </WeekDayGastosDiv>
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
                      <WeekDayGastosDiv key={index}>
                        <SubTitle2>{dayOfTheWeek.withFeira[index]}</SubTitle2>
                        {
                          gastosInWeekDay.map((gastoGeral: GastoGeral) => {
                            const splitedDate = gastoGeral.created_at.split("/");
                            const gastoDate = new Date (Number(splitedDate[2]), Number(splitedDate[1]) + 1,  Number(splitedDate[0]));
                            return (
                              <>          
                                <Popover content={
                                  <div className="gastos-gerais-popover-content">
                                    <div className="gastos-gerais-popover-title-div">
                                      <h3 className="gastos-gerais-popover-title">Dados do Gasto</h3>
                                    </div>
                                    <table className="gastos-gerais-popover-table">
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Banco:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{bancos[gastoGeral.id_banco]}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Direcionamento:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{direcionamentos[gastoGeral.id_direcionamento]}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Descrição:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{gastoGeral.descricao}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Valor:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{`R$ ${gastoGeral.valor}`}</td>
                                      </tr>
                                      <tr>
                                        <td className="gastos-gerais-popover-table-label-cell">Data:</td>
                                        <td className="gastos-gerais-popover-table-data-cell">{gastoDate.toLocaleDateString()}</td>
                                      </tr>
                                    </table>
                                    <div className="gastos-gerais-popover-edit-delete-btns-div">
                                      <Link to={`/gastos-gerais/${gastoGeral.id}`} style={{justifyContent: "center", alignItems: "center", display: "flex", marginRight: "10px"}}>
                                        <FaEdit size={20} color={colors.secondaryColor}/>
                                      </Link>
                                      <Link to={`/gastos-gerais/${gastoGeral.id}`} style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
                                        <MdDelete size={20} color={colors.dangerColor}/>
                                      </Link>
                                    </div>
                                  </div>
                                } placement="right" trigger="hover" >
                                  <Button className="gastos-gerais-popover-btn">{gastoGeral.descricao}</Button>
                                </Popover>
                              </>
                            )
                          })
                        }
                        
                      </WeekDayGastosDiv>
                    )
                  })
                }

              </div>
            </div>
          ) : optionSelectedId === 2 ? (
            <div style={{display:"flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center"}}>
              <SubTitle1>Você selecionou o mês de {months[selectedMonthDate.toDate().getMonth()]} de {new Date().getFullYear()}</SubTitle1>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MonthCalendar value={selectedMonthDate} onChange={(newValue) => setSelectedMonthDate(newValue)}/>
              </LocalizationProvider>
              <div>
                
                    
              </div>

            </div>
          ) : null
        }
        
      </div>

    </div>
  );
}