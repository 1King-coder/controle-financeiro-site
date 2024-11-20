import React from "react";
import { DataGridBox, GeneralBox, InputBox } from "./styled";
import { SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { Toast } from "react-toastify/dist/components";
import { toast } from "react-toastify";

export default function AddBancos() {
  const [bancos, setBancos]: [Banco[], any] = React.useState([]);

  React.useEffect(() => {
    async function getBancos() {

      axios.get("/bancos").then((response) => {
        
        setBancos(response.data);
      });
      
    }
    getBancos();
  }, [])

  function handleAdicionaBanco () {
    const inputNomeBanco = document.getElementById("nome-banco");
    const nomeBanco = inputNomeBanco?.textContent;

    nomeBanco === "" ? toast.warn("Preencha o nome do banco") : axios.post("/bancos", {
      nome_banco: nomeBanco
    }).then((response) => {
      if (response.status === 200) {
        toast.success("Banco adicionado com sucesso");
      }
    }).catch((error) => {
      toast.error(error);
    });
  }

  return (
    <GeneralBox>
      <Title>Adicionar Bancos</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>

        <form>
          <InputBox>
            <Label htmlFor="nome-banco" value="Nome do banco"/>
            <TextInput id="nome-banco" placeholder="Nome do banco"/>
          </InputBox>
          <InputBox>
            <Button><span>Adicionar</span></Button>
          </InputBox>
        </form>
        <DataGridBox>
          <SubTitle2>Bancos cadastrados</SubTitle2>
          <DataGrid
            rows={bancos}
            columns={[
              { field: "id", headerName: "ID", width: 70, headerClassName: "datagrid-headers" },
              { field: "nome", headerName: "Nome", width: 130, headerClassName: "datagrid-headers" },
            ]}
            slots={{footer: () => <div />}}
            sx={
              {
                boxShadow: 4,
                border: 2,
                borderColor: colors.primaryColor,
                height: "30rem",
                width: '12rem',
                backgroundColor: colors.tertiaryColor,
                fontSize: 16,
              }
            }
          />
        </DataGridBox>
      </div>
      

      
    </GeneralBox>
  );
}