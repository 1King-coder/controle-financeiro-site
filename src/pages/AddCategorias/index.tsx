import React from "react";
import { DataGridBox, GeneralBox, InputBox } from "./styled";
import { SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Categoria } from "../../types/Categoria";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";

export default function AddCategorias() {
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  React.useEffect(() => {
    async function getCategorias() {

      axios.get("/categorias").then((response) => {
        
        setCategorias(response.data);
      });
      
    }
    getCategorias();
  }, [])

  function handleAdicionaCategoria () {
    const inputNomeCategoria = document.getElementById("nome-categoria");
    //@ts-ignore
    const nomeCategoria = inputNomeCategoria?.value;

    nomeCategoria === "" ? toast.warn("Preencha o nome da categoria") : axios.post("/categorias/novo", {
      nome_categoria: nomeCategoria
    }).then(async (response) => {
      console.log(response);
      if (response.status === 201) {
        toast.success("Categoria adicionada com sucesso");
      } 
    }).catch((error) => {
      toast.error(error.response.data.detail);
    });
  }

  return (
    <GeneralBox>
      <Title>Adicionar Categorias</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>

        <form>
          <InputBox>
            <Label htmlFor="nome-categoria" value="Nome da categoria"/>
            <TextInput id="nome-categoria" placeholder="Nome da categoria"/>
          </InputBox>
          <InputBox>
            <Button onClick={handleAdicionaCategoria}><span>Adicionar</span></Button>
          </InputBox>
        </form>
        <DataGridBox>
          <SubTitle2>Categorias cadastradas</SubTitle2>
          <DataGrid
            rows={categorias}
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