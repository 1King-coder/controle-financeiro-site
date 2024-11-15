import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { Button, ButtonGroup } from "flowbite-react";
import { StyledButton, StyledButtonGroup } from "../../styles/GlobalStyles";

class getTransferencias {

  static async getTransferenciasEntreBancos() {
    const res = await axios.get("/transferencias_entre_bancos");
    return res.data;
  }

  static async getTransferenciasEntreDirecionamentos() {
    const res = await axios.get("/transferencias_entre_direcionamentos");
    return res.data;
  }
}

export default function Transferencias() {
  const [transferencias, setTransferencias] = React.useState([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);



  React.useEffect(() => {
    getTransferencias.getTransferenciasEntreBancos().then((data) => {
      console.log(data);
      setTransferencias(data);
    });
  }, []);


  return (
    <div className="transferencias-body-div">
      <Title>Transferencias</Title>

      <StyledButtonGroup className="transferencias-button-group">
        <StyledButton id={1} selected={optionSelectedId === 1} onClick={() => setOptionSelectedId(1)}>Entre Bancos</StyledButton>
        <StyledButton id={2} selected={optionSelectedId === 2} onClick={() => setOptionSelectedId(2)}>Entre Direcionamentos</StyledButton>
      </StyledButtonGroup>
    </div>
  );
}