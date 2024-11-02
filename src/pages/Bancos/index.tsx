import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Container } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";

function BancosDonutChart(): JSX.Element {
  const [bancos, setBancos] = React.useState([]);

  React.useEffect(() => {
    async function getBancos() {
      const response = await axios.get("/bancos/saldo-por-direcionamento");
      
      setBancos(response.data);
    }
    
    getBancos();
  }, []);
  // const dados = [["Banco", "Saldo"]];
  
  // bancos.forEach((banco: Banco) => {
  //   // @ts-ignore
  //   dados.push([banco.nome, banco.saldo]);
  // })

  

  const options = {
    title: "Bancos",
    pieHole: 0.4,
    is3D: false,
  }

  return (
    <div>
    
    </div>
    // <Chart
    // chartType="PieChart"
    // width="100%"
    // height="50%"
    // data={dados}
    // options={options}
    // />
  )
}

export default function Bancos(): JSX.Element {
  




  return (
    <Container>
      <Title>Bancos</Title>
      <BancosDonutChart/>
      
    </Container>
  );
}