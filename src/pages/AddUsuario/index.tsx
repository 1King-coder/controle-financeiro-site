import React from "react";
import { DataGridBox, GeneralBox, InputBox } from "./styled";
import { SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Usuario } from "../../types/Usuario";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import history from "../../services/history";
import { Link } from "react-router-dom";

export default function AddUsuario() {

  const { user, setUser } = useAuth();

  function handleRegister() {
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
      if (response.status === 403) {
        toast.warning(response.data.message)
      }
      if (response.status === 201) {
        toast.success("Usuário adicionado com sucesso");
        // Clear form
        inputNome.value = "";
        inputSobrenome.value = "";
        inputUsername.value = "";
        inputSenha.value = "";
        inputEmail.value = "";

      } 
      return response.data;
    }).catch((error) => {
      console.log(error)
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Erro ao adicionar usuário");
      }
    }).then((resUser) => {
      
      const loggedUser = {
        id: resUser.id,
        username: resUser.username,
        email: resUser.email,
        isAuthenticated: true
      }
      setUser(
        loggedUser
      )
      console.log(loggedUser)
      history.replace("/")
    });
  }
  
  if (user) {
    toast.success("Você já está logado!")
    history.goBack();
    return <></>;
  }

  return (
    <GeneralBox>
      <Title>Cadastro</Title>
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
            <Label htmlFor="email" value="Email"/>
            <TextInput id="email" type="email" placeholder="Email"/>
          </InputBox>
          <InputBox>
            <Label htmlFor="senha" value="Senha"/>
            <TextInput id="senha" type="password" placeholder="Senha (mín. 8 caracteres)"/>
          </InputBox>
          <InputBox>
            <Button onClick={handleRegister}><span>Registrar</span></Button>
          </InputBox>
          <span>Já possui uma conta? Entre </span>
          <Link to='/login' style={{color: "blue", textDecoration: "underline"}}>
          aqui
          </Link>
        </form>
        
      </div>
    </GeneralBox>
  );
} 