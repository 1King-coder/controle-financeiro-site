import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { Categoria, SaldoCategoriaPorBanco } from "../../types/Categoria";
import { Card, CardTitle, Container, FullLineCard, FullLineCardTitle, OptionBtn, ScrollableDiv } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";


class GetCategoriasDataFuncions {

  static async getSaldosCategoriasPorBanco(id_categoria: number): Promise<SaldoCategoriaPorBanco[]>{
    const response = await axios.get("/categorias/saldo-por-banco/" + id_categoria);
    
    return response.data;
  }
  

  static async getCategorias(): Promise<Categoria[]>{
    const response = await axios.get("/categorias");
    
    return response.data;
  }
}


export default function Categorias(): JSX.Element {
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([{id: 1, nome: "", saldo: 0, updated_at: ""}]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);
  const [dadosSaldoCategoriaPorBanco, setDadosSaldoCategoriaPorBanco] = React.useState([["Banco", "saldo"]]);
  const [NomeCategoriaSelected, setNomeCategoriaSelected] = React.useState("");

  React.useEffect(() => {
    GetCategoriasDataFuncions.getCategorias().then((data: Categoria[]) => {
      setCategorias(data);
      GetCategoriasDataFuncions.getSaldosCategoriasPorBanco(optionSelectedId).then((data: SaldoCategoriaPorBanco[]) => {
        const dados = [["Categoria", "Saldo"]];
        setNomeCategoriaSelected(data[0].nome_categoria);
        data.forEach((saldoCategoriaPorBanco: SaldoCategoriaPorBanco) => {
          // @ts-ignore
          dados.push([saldoCategoriaPorBanco.nome_banco, Math.abs(saldoCategoriaPorBanco.saldo)]);
        })
        setDadosSaldoCategoriaPorBanco(dados);
      })
    })
    
  }, [optionSelectedId]);

  



  

  const pieChartOptions = {
    title: `Saldo por Banco ${NomeCategoriaSelected}`,
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
      <Title>Visão Geral de Categorias</Title>
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
            categorias.map((categoria: Categoria) => {
              return (
                  <OptionBtn id={categoria.id} key={categoria.id} selected={categoria.id === optionSelectedId} onClick={() => setOptionSelectedId(categoria.id)}>
                  {categoria.nome}
                  </OptionBtn>
              )
            })
          }
        </ScrollableDiv>
        <Card>
          <CardTitle>{"Saldo Total da Categoria " + NomeCategoriaSelected}</CardTitle>
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
          >{`R$ ${categorias.reduce((acc, categoria) => {
            if (categoria.id === optionSelectedId) {
              return acc + Math.abs(categoria.saldo)
              
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
        data={dadosSaldoCategoriaPorBanco}
        options={pieChartOptions}
        />
        <Chart
        chartType="Table"
        width="100%"
        height="100%"
        data={dadosSaldoCategoriaPorBanco}
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
        >{`R$ ${categorias.reduce((acc, categoria) => {
          return acc + Math.abs(categoria.saldo)
        }, 0)
          
          }`}</p>
      </FullLineCard>
      

      



      
      
      
    </div>
  );
}