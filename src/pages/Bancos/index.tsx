import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { Banco, BancoPorCategoriaPieChartProps, SaldoBancoPorCategoria } from "../../types/Banco";
import { Card, CardTitle, Container, FullLineCard, FullLineCardTitle, OptionBtn, ScrollableDiv } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";
import { backgroundColor, secondaryColor, tertiaryColor } from "../../config/colors";
import { title } from "process";
import { table } from "console";

class GetBancosDataFuncions {

  static async getSaldosBancosPorCategoria(id_banco: number): Promise<SaldoBancoPorCategoria[]>{
    const response = await axios.get("/bancos/saldo-por-categoria/" + id_banco);
    
    return response.data;
  }
  

  static async getBancos(): Promise<Banco[]>{
    const response = await axios.get("/bancos");
    
    return response.data;
  }
}


export default function Bancos(): JSX.Element {
  const [bancos, setBancos]: [Banco[], any] = React.useState([{id: 1, nome: "", saldo: 0, updated_at: ""}]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);
  const [dadosSaldoBancoPorCategoria, setDadosSaldoBancoPorCategoria] = React.useState([["Categoria", "saldo"]]);
  const [nomeBancoSelected, setNomeBancoSelected] = React.useState("");

  React.useEffect(() => {
    GetBancosDataFuncions.getBancos().then((data: Banco[]) => {
      setBancos(data);
      GetBancosDataFuncions.getSaldosBancosPorCategoria(optionSelectedId).then((data: SaldoBancoPorCategoria[]) => {
        const dados = [["Categoria", "Saldo"]];
        setNomeBancoSelected(data[0].nome_banco);
        data.forEach((saldoBancoPorCategoria: SaldoBancoPorCategoria) => {
          // @ts-ignore
          dados.push([saldoBancoPorCategoria.nome_categoria, Math.abs(saldoBancoPorCategoria.saldo)]);
        })
        setDadosSaldoBancoPorCategoria(dados);
      })
    })
    
  }, [optionSelectedId]);

  



  

  const pieChartOptions = {
    title: `Saldo por categoria ${nomeBancoSelected}`,
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
      headerRow: "saldo-por-categoria-table-header",
      tableRow: "saldo-por-categoria-table-row",
      oddTableRow: "saldo-por-categoria-table-row",
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
      <Title>Visão Geral de Bancos</Title>
      <div style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "20px"}}>

        <ScrollableDiv>
          {
            bancos.map((banco: Banco) => {
              return (
                  <OptionBtn id={banco.id} key={banco.id} selected={banco.id === optionSelectedId} onClick={() => setOptionSelectedId(banco.id)}>
                  {banco.nome}
                  </OptionBtn>
              )
            })
          }
        </ScrollableDiv>
        <Card>
          <CardTitle>{"Saldo Total do Banco " + nomeBancoSelected}</CardTitle>
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
          >{`R$ ${bancos.reduce((acc, banco) => {
            if (banco.id === optionSelectedId) {
              return acc + Math.abs(banco.saldo)
              
            }
            return acc;
          }, 0)
            
            }`}</p>
        </Card>

      </div>
        <div style={{            
            display: "flex", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginTop: "0.5rem",
            marginLeft: "6rem",
            marginRight: "1rem" 
        }}>
        <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={dadosSaldoBancoPorCategoria}
        options={pieChartOptions}
        />
        <Chart
        chartType="Table"
        width="100%"
        height="100%"
        data={dadosSaldoBancoPorCategoria}
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
        >{`R$ ${bancos.reduce((acc, banco) => {
          return acc + Math.abs(banco.saldo)
        }, 0)
          
          }`}</p>
      </FullLineCard>
      

      



      
      
      
    </div>
  );
}