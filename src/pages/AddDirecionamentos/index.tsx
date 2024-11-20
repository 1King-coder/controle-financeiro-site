import React from "react";
import { DataGridBox, GeneralBox, InputBox } from "./styled";
import { SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";

export default function AddDirecionamentos() {
  const [direcionamentos, setDirecionamentos]: [Banco[], any] = React.useState([]);

  React.useEffect(() => {
    async function getDirecionamentos() {

      axios.get("/direcionamentos").then((response) => {
        
        setDirecionamentos(response.data);
      });
      
    }
    getDirecionamentos();
  }, [])

  function handleAdicionaDirecionamento () {
    const inputNomeDirecionamento = document.getElementById("nome-direcionamento");
    //@ts-ignore
    const nomeDirecionamento = inputNomeDirecionamento?.value;

    nomeDirecionamento === "" ? toast.warn("Preencha o nome do direcionamento") : axios.post("/direcionamentos", {
      nome_direcionamento: nomeDirecionamento
    }).then(async (response) => {
      console.log(response);
      if (response.status === 201) {
        toast.success("Direcionamento adicionado com sucesso");
      } 
    }).catch((error) => {
      toast.error(error.response.data.detail);
    });
  }

  return (
    <GeneralBox>
      <Title>Adicionar Direcionamentos</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>

        <form>
          <InputBox>
            <Label htmlFor="nome-direcionamento" value="Nome do direcionamento"/>
            <TextInput id="nome-direcionamento" placeholder="Nome do direcionamento"/>
          </InputBox>
          <InputBox>
            <Button onClick={handleAdicionaDirecionamento}><span>Adicionar</span></Button>
          </InputBox>
        </form>
        <DataGridBox>
          <SubTitle2>Bancos cadastrados</SubTitle2>
          <DataGrid
            rows={direcionamentos}
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