import React from "react";
import { Title } from "./styled";
import { Container } from "../../styles/GlobalStyles";
import axios from "../../services/axios";

export default function Home(): JSX.Element {
  React.useEffect(() => {
    async function getBancos() {
      const response = await axios.get('/bancos');
      console.log(response)
    }

  })

  return (
    <Container>
    
      <Title>Home</Title>
    </Container>
  );
}