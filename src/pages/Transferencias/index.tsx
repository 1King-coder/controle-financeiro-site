import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";
import { StyledButton, StyledButtonGroup } from "../../styles/GlobalStyles";
import { Transferencia } from "../../types/Transferencia";

class getTransferencias {

  static async getTransferencias(tipoTransferenciaUrlPath: string): Promise<Transferencia[]> {
    const res = await axios.get(tipoTransferenciaUrlPath);
    return res.data;
  }

}

export default function Transferencias() {
  const [transferencias, setTransferencias]: [Transferencia[], any] = React.useState([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(1);
  const [transferenciasUrlPath, setTransferenciasUrlPath]: [string, any] = React.useState("/transferencias_entre_bancos");



  React.useEffect(() => {
    getTransferencias.getTransferencias(transferenciasUrlPath).then((data) => {
      console.log(data);
      setTransferencias(data);
    });
  }, [transferenciasUrlPath]);

  React.useEffect(() => {
    if (optionSelectedId === 1) {
      setTransferenciasUrlPath("/transferencias_entre_bancos");
    } else {
      setTransferenciasUrlPath("/transferencias_entre_direcionamentos");
    }
  }, [optionSelectedId]);


  return (
    <div className="transferencias-body-div">
      <Title>Transferencias</Title>
      <StyledButtonGroup className="transferencias-button-group">
        <StyledButton id={1} selected={optionSelectedId === 1} onClick={() => setOptionSelectedId(1)}>Entre Bancos</StyledButton>
        <StyledButton id={2} selected={optionSelectedId === 2} onClick={() => setOptionSelectedId(2)}>Entre Direcionamentos</StyledButton>
      </StyledButtonGroup>
      <div>

      </div>

    </div>
  );
}