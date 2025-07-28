import React from "react";
import { DataGridBox, GeneralBox, InputBox } from "./styled";
import { SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Usuario } from "../../types/Usuario";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";

export default function AddUsuario() {
  const [usuarios, setUsuarios]: [Usuario[], any] = React.useState([]);

  React.useEffect(() => {
    async function getUsuarios() {
      axios.get("/usuarios").then((response) => {
        setUsuarios(response.data);
      });
    }
    getUsuarios();
  }, [])

  function handleAdicionaUsuario() {
    const inputNome = document.getElementById("nome") as HTMLInputElement;
    const inputSobrenome = document.getElementById("sobrenome") as HTMLInputElement;
    const inputUsername = document.getElementById("username") as HTMLInputElement;
    const inputSenha = document.getElementById("senha") as HTMLInputElement;
    const inputEmail = document.getElementById("email") as HTMLInputElement;

    const nome = inputNome?.value;
    const sobrenome = inputSobrenome?.value;
    const username = inputUsername?.value;
    const senha = inputSenha?.value;
    const email = inputEmail?.value;

    // Validation
    if (!nome || !sobrenome || !username || !senha || !email) {
      toast.warn("Preencha todos os campos");
      return;
    }

    if (username.length < 5) {
      toast.warn("Username deve ter pelo menos 5 caracteres");
      return;
    }

    if (senha.length < 8) {
      toast.warn("Senha deve ter pelo menos 8 caracteres");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn("Email inválido");
      return;
    }

    axios.post("/usuarios/novo", {
      nome,
      sobrenome,
      username,
      senha,
      email
    }).then(async (response) => {
      console.log(response);
      if (response.status === 201) {
        toast.success("Usuário adicionado com sucesso");
        // Clear form
        inputNome.value = "";
        inputSobrenome.value = "";
        inputUsername.value = "";
        inputSenha.value = "";
        inputEmail.value = "";
        // Refresh usuarios list
        const updatedResponse = await axios.get("/usuarios");
        setUsuarios(updatedResponse.data);
      } 
    }).catch((error) => {
      console.log(error)
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Erro ao adicionar usuário");
      }
    });
  }

  return (
    <GeneralBox>
      <Title>Adicionar Usuários</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>

        <form>
          <InputBox>
            <Label htmlFor="nome" value="Nome"/>
            <TextInput id="nome" placeholder="Nome"/>
          </InputBox>
          <InputBox>
            <Label htmlFor="sobrenome" value="Sobrenome"/>
            <TextInput id="sobrenome" placeholder="Sobrenome"/>
          </InputBox>
          <InputBox>
            <Label htmlFor="username" value="Username"/>
            <TextInput id="username" placeholder="Username (mín. 5 caracteres)"/>
          </InputBox>
          <InputBox>
            <Label htmlFor="senha" value="Senha"/>
            <TextInput id="senha" type="password" placeholder="Senha (mín. 8 caracteres)"/>
          </InputBox>
          <InputBox>
            <Label htmlFor="email" value="Email"/>
            <TextInput id="email" type="email" placeholder="Email"/>
          </InputBox>
          <InputBox>
            <Button onClick={handleAdicionaUsuario}><span>Adicionar</span></Button>
          </InputBox>
        </form>
        <DataGridBox>
          <SubTitle2>Usuários cadastrados</SubTitle2>
          <DataGrid
            rows={usuarios}
            columns={[
              { field: "id", headerName: "ID", width: 70, headerClassName: "datagrid-headers" },
              { field: "nome", headerName: "Nome", width: 130, headerClassName: "datagrid-headers" },
              { field: "sobrenome", headerName: "Sobrenome", width: 130, headerClassName: "datagrid-headers" },
              { field: "username", headerName: "Username", width: 130, headerClassName: "datagrid-headers" },
              { field: "email", headerName: "Email", width: 200, headerClassName: "datagrid-headers" },
            ]}
            slots={{footer: () => <div />}}
            sx={
              {
                boxShadow: 4,
                border: 2,
                borderColor: colors.primaryColor,
                height: "30rem",
                width: '20rem',
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