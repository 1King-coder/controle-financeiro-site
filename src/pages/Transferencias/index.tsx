import React from "react";
import { Title } from "./styled";
import axios from "../../services/axios";

class getTransferencias {

  static async getTransferencias() {
    const res = await axios.get("/transferencias_entre_bancos");
    return res.data;
  }
}

export default function Transferencias() {
  const [transferencias, setTransferencias] = React.useState([]);

  React.useEffect(() => {
    getTransferencias.getTransferencias().then((data) => {
      console.log(data);
      setTransferencias(data);
    });
  }, []);


  return (
    <div className="transferencias-body-div">
      <Title>Transferencias</Title>
    </div>
  );
}