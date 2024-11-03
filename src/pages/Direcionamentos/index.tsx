import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { Direcionamento, SaldoDirecionamentoPorBanco } from "../../types/Direcionamento";
import { Card, CardTitle, Container, FullLineCard, FullLineCardTitle, OptionBtn, ScrollableDiv } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";


class GetDirecionamentosDataFuncions {

  static async getSaldosDirecionamentosPorBanco(id_direcionamento: number): Promise<SaldoDirecionamentoPorBanco[]>{
    const response = await axios.get("/direcionamentos/saldo-por-banco/" + id_direcionamento);
    
    return response.data;
  }
  

  static async getDirecionamentos(): Promise<Direcionamento[]>{
    const response = await axios.get("/direcionamentos");
    
    return response.data;
  }
}


export default function Direcionamentos(): JSX.Element {
  const [direcionamentos, setDirecionamentos]: [Direcionamento[], any] = React.useState([{id: 1, nome: "", saldo: 0, updated_at: ""}]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);
  const [dadosSaldoDirecionamentoPorBanco, setDadosSaldoDirecionamentoPorBanco] = React.useState([["Banco", "saldo"]]);
  const [NomeDirecionamentoSelected, setNomeDirecionamentoSelected] = React.useState("");

  React.useEffect(() => {
    GetDirecionamentosDataFuncions.getDirecionamentos().then((data: Direcionamento[]) => {
      setDirecionamentos(data);
      GetDirecionamentosDataFuncions.getSaldosDirecionamentosPorBanco(optionSelectedId).then((data: SaldoDirecionamentoPorBanco[]) => {
        const dados = [["Direcionamento", "Saldo"]];
        setNomeDirecionamentoSelected(data[0].nome_direcionamento);
        data.forEach((saldoDirecionamentoPorBanco: SaldoDirecionamentoPorBanco) => {
          // @ts-ignore
          dados.push([saldoDirecionamentoPorBanco.nome_banco, Math.abs(saldoDirecionamentoPorBanco.saldo)]);
        })
        setDadosSaldoDirecionamentoPorBanco(dados);
      })
    })
    
  }, [optionSelectedId]);

  



  

  const pieChartOptions = {
    title: `Saldo por Banco ${NomeDirecionamentoSelected}`,
    titleTextStyle: {
      color: "black",
      position: "center",
      fontSize: 20,
    },
    pieHole: 0.4,
    is3D: true,

  }

  const tableChartFormatters = [
    {
      type: "NumberFormat" as const,
      column: 1,
      options: {
        prefix: "R$ ",
      }
    },
    
  ]

  const tableChartOptions = {
    cssClassNames: {
      headerRow: "saldo-por-direcionamento-table-header",
      tableRow: "saldo-por-direcionamento-table-row",
      oddTableRow: "saldo-por-direcionamento-table-row",
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "white",
    }}>
      <Title>Visão Geral de Direcionamentos</Title>
      <div style={
        {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center", 
          marginBottom: "10px"
        }
      }>

        <ScrollableDiv>
          {
            direcionamentos.map((direcionamento: Direcionamento) => {
              return (
                  <OptionBtn id={direcionamento.id} key={direcionamento.id} selected={direcionamento.id === optionSelectedId} onClick={() => setOptionSelectedId(direcionamento.id)}>
                  {direcionamento.nome}
                  </OptionBtn>
              )
            })
          }
        </ScrollableDiv>
        <Card>
          <CardTitle>{"Saldo Total do Direcionamento " + NomeDirecionamentoSelected}</CardTitle>
          <p
            style= {
              {
                color: "black",
                fontSize: "25px",
                fontWeight: "bold",
                marginTop: "10px",
                textAlign: "center"
              }
            }
          >{`R$ ${direcionamentos.reduce((acc, direcionamento) => {
            if (direcionamento.id === optionSelectedId) {
              return acc + Math.abs(direcionamento.saldo)
              
            }
            return acc;
          }, 0)
            
            }`}</p>
        </Card>

      </div>
        <div style={
          {
            display: "flex", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginTop: "0.5rem",
            marginLeft: "6rem",
            marginRight: "1rem" 
          }
        }>
        <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={dadosSaldoDirecionamentoPorBanco}
        options={pieChartOptions}
        />
        <Chart
        chartType="Table"
        width="100%"
        height="100%"
        data={dadosSaldoDirecionamentoPorBanco}
        options={tableChartOptions}
        formatters={tableChartFormatters}
        />
      </div>

      <FullLineCard>
        <FullLineCardTitle>Saldo Total</FullLineCardTitle>
        <p
          style= {
            {
              color: "black",
              fontSize: "40px",
              fontWeight: "bold",
              marginTop: "40px",
              textAlign: "center"
            }
          }
        >{`R$ ${direcionamentos.reduce((acc, direcionamento) => {
          return acc + Math.abs(direcionamento.saldo)
        }, 0)
          
          }`}</p>
      </FullLineCard>
      

      



      
      
      
    </div>
  );
}