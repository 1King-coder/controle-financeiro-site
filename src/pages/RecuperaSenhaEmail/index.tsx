import React, { useEffect } from "react";
import { GeneralBox, InputBox } from "./styled";
import {  Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";

import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import history from "../../services/history";
import { Link } from "react-router-dom";

export default function RecuperaSenhaEmail() {
  const { user, setUser } = useAuth()

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && user.isAuthenticated) {
      history.replace("/home");
    }
  }, [user]);

  function handleSendEmail() {
    const inputEmail = document.getElementById("email") as HTMLInputElement;

    const email = inputEmail?.value;
    // Validation
    if (!email) {
      toast.warn("Preencha todos os campos");
      return;
    }

    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.warning("E-mail inválido!")
      return;
    }

    axios.post(`/usuarios/password-recovery-email`, 
      { email }
    ).then((response) => {
      
      if (response.status === 200) {
        toast.success("Instruções para recuperação de senha enviadas para o e-mail informado.");
      }
    }).catch((error) => {
      if (error.response && error.response.status === 404) {
        toast.error("E-mail não cadastrado.");
      } else {
        toast.error("Erro ao enviar e-mail de recuperação de senha. Tente novamente mais tarde.");
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
            <Label htmlFor="email" value="E-mail"/>
            <TextInput id="email" placeholder="E-mail"/>
          </InputBox>
         
          <InputBox>
            <Button onClick={handleSendEmail}><span>Enviar</span></Button>
          </InputBox>
          <span>Insira o e-mail para receber as instruções de recuperação de senha.</span>

          
        </form>
        
      </div>
    </GeneralBox>
  );
} 