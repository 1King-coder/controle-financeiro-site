import React, { useEffect } from "react";
import { GeneralBox, InputBox } from "./styled";
import {  Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";

import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import history from "../../services/history";
import { Link } from "react-router-dom";

export default function Login() {
  const { user, setUser } = useAuth()

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && user.isAuthenticated) {
      history.replace("/home");
    }
  }, [user]);

  function handleLogin() {
    const inputUsernameOrEmail = document.getElementById("username-email") as HTMLInputElement;
    const inputSenha = document.getElementById("senha") as HTMLInputElement;

    const usernameOrEmail = inputUsernameOrEmail?.value;
    const senha = inputSenha?.value;

    // Validation
    if (!usernameOrEmail || !senha) {
      toast.warn("Preencha todos os campos");
      return;
    }

    if (usernameOrEmail.length < 5) {
      toast.warning("Username inválido!")
      return;
    }

    const userData: {username?: string, email?: string, senha?: string} = {}
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(usernameOrEmail)) {
      userData.email = usernameOrEmail
    } else {
      userData.username = usernameOrEmail
    }

    userData.senha = senha
    
    axios.post("/usuarios/auth", 
      userData
    ).then((response) => {
      if (response.status === 403) {
        toast.warning(response.data.message)
      }
      if (response.status === 200) {
        toast.success("Usuário logado com sucesso");
        const resUser = response.data

        const loggedUser = {
          id: resUser.id,
          username: resUser.username,
          email: resUser.email,
          isAuthenticated: resUser.isAuthenticated
        }

        setUser(
          loggedUser
        )

        history.replace("/")
      } 
    }).catch((error) => {
      
      if (error.status === 403) {
        toast.warning(error.response.data.message)
      } else {
        toast.error("Erro ao fazer login");
      }
    });
  }

  return (
    <GeneralBox>
      <Title>Login</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>

        <form>
          <InputBox>
            <Label htmlFor="username-email" value="Username"/>
            <TextInput id="username-email" placeholder="Username"/>
          </InputBox>
         
          <InputBox>
            <Label htmlFor="senha" value="Senha"/>
            <TextInput id="senha" type="password" placeholder="Senha"/>
          </InputBox>
          <InputBox>
            <Button onClick={handleLogin}><span>Entrar</span></Button>
          </InputBox>
          <span>Não possui conta? Cadastre-se </span>
          <Link to='/cadastro' style={{color: "blue", textDecoration: "underline"}}>
          aqui
          </Link>
        </form>
        
      </div>
    </GeneralBox>
  );
} 