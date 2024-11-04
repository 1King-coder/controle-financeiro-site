import React from "react";
import { Title, TimeIntervalOptionsDiv, SubTitle1, WeekDayGastosDiv, SubTitle2 } from "./styled";
import axios from "../../services/axios";
import { GastoGeral } from "../../types/GastoGeral";
import Chart from "react-google-charts";
import { OptionBtn } from "../../styles/GlobalStyles";
import { dayOfTheWeek, months } from "../../config/dates";
import { Button, Popover } from "flowbite-react";
import * as colors from "../../config/colors";

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

  static async getGastosGeraisFilterByLastWeek(): Promise<GastoGeral[]> {
    const dateStart = new Date();
    const dateEnd = new Date();
    dateStart.setDate(dateStart.getDate() - 7);
    return await GetGastosGeraisDataFuncions.getGastosGeraisFilterByDateInterval(dateStart, dateEnd);
  }
}


export function GastosGerais(): JSX.Element {
  const [gastosGerais, setGastosGerais] = React.useState<GastoGeral[]>([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);
  const [gastosByWeekDay, setGastosByWeekDay] = React.useState(Array<GastoGeral[]>([]));

  React.useEffect(() => {
    GetGastosGeraisDataFuncions.getGastosGeraisFilterByDateInterval(new Date(2024, 6, 5), new Date(2024, 6, 11)).then((data: GastoGeral[]) => {
      setGastosGerais(data);
      const listGastosByWeekDay: Array<GastoGeral[]> = [[], [], [], [], [], [], []];
      data.forEach((gastoGeral: GastoGeral) => {
        const dateSplited = gastoGeral.created_at.split("/");
        const dataGasto = new Date(Number(dateSplited[2]), Number(dateSplited[1]) + 1,  Number(dateSplited[0]));
        
        listGastosByWeekDay[dataGasto.getDay()].push(gastoGeral);
      })

      setGastosByWeekDay(listGastosByWeekDay);
    });
  }, []);


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
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
            <div>

              <SubTitle1>Hoje é {dayOfTheWeek.withFeira[new Date().getDay()]} - {new Date().toLocaleDateString()}</SubTitle1>
              <div style={{display:"flex", width: "100%", height: "100%"}}>
                <WeekDayGastosDiv>
                <SubTitle2>Segunda-feira</SubTitle2>
                  {
                    gastosByWeekDay[0].map((gastoGeral: GastoGeral) => {
                      const splitedDate = gastoGeral.created_at.split("/");
                      const gastoDate = new Date (Number(splitedDate[2]), Number(splitedDate[1]) + 1,  Number(splitedDate[0]));
                      
                      return (
                        <>
                          <Popover content={
                            <div style={{
                              width: "100%", 
                              padding: "10px", 
                              height: "100%", 
                              backgroundColor: colors.tertiaryColor, 
                              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                              borderRadius: "20px"
                              }}>
                              <div style={{
                                width: "100%",
                                height: "100%", 
                                display: "flex", 
                                justifyContent: "center", 
                                backgroundColor: colors.primaryColor, 
                                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                                borderRadius: "20px"
                                }}>
                                <h3 style={{
                                  color: colors.secondaryColor,
                                  textAlign: "center", 
                                  fontSize: "14px", 
                                  padding: "10px",
                                  fontWeight: "bold"
                                  }}>Dados do Gasto </h3>
                              </div>
                              <div style={{width: "100%", padding: "10px", height: "100%", backgroundColor: colors.tertiaryColor}}>
                                <p style={{textAlign: "center"}}>{gastoGeral.id_banco}</p>
                                <p style={{textAlign: "center"}}>{gastoGeral.id_direcionamento}</p>
                                <p style={{textAlign: "center"}}>{gastoGeral.tipo_gasto}</p>
                                <p style={{textAlign: "center"}}>{gastoGeral.descricao}</p>
                                <p style={{textAlign: "center"}}>{gastoGeral.created_at}</p>
                                <p style={{textAlign: "center"}}>{gastoGeral.valor}</p>
                              </div>
                            </div>
                          } placement="right" trigger="hover">
                            <Button style={{width: "100%"}}>{gastoGeral.descricao}</Button>
                          </Popover>
                        </>
                      )
                      
                    })
                    
                  }
                </WeekDayGastosDiv>
              </div>
            </div>
          ) : optionSelectedId === 2 ? (
            <div>

              <SubTitle1>Estamos no mês de {months[new Date().getMonth()]} de {new Date().getFullYear()}</SubTitle1>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={[
                  ["Data", "Gastos Gerais"],
                  ...gastosGerais.map((gastoGeral: GastoGeral) => [gastoGeral.created_at, gastoGeral.valor])
                ]}
              />
            </div>
          ) : null
        }
        
      </div>

    </div>
  );
}