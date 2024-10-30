import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Container } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";

export default function Bancos(): JSX.Element {
  
  const [bancos, setBancos] = React.useState([]);

  React.useEffect(() => {
    async function getBancos() {
      const response = await axios.get("/bancos");
      
      setBancos(response.data);
    }
    
    getBancos();
  }, []);
  const dados = [["Banco", "Saldo", { role: "style" }]];

  bancos.forEach((banco: Banco) => {
    // @ts-ignore
    dados.push([banco.nome, banco.saldo, (function getRandomColor(): string { return '#'+Array(6).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''); })()]);
  })

  const options = {
    title: "Bancos",
    hAxis: {
      title: "Saldo",
      format: "currency",
    },
    vAxis: {
      title: "Bancos",
    },
    animation: { duration: 500, easing: "linear"},
    legend: { position: "bottom"},
  }



  return (
    <Container>
      <Title>Bancos</Title>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="100%"
        data={dados}
        options={options}
      />
      
    </Container>
  );
}