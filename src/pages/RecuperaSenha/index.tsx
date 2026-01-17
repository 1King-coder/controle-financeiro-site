import React, { useEffect, useState } from "react";
import { GeneralBox, InputBox } from "./styled";
import {  Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";

import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import history from "../../services/history";
import { Link, useParams } from "react-router-dom";

type Params = { id: string, token: string };

export default function RecuperaSenha() {
  const { user, setUser } = useAuth()
  const { id, token } = useParams<Params>();
  
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && user.isAuthenticated) {
      history.replace("/home");
    }
  }, [user]);

  function handleResetPassword() {
    // Validation
    if (!newPassword || !confirmPassword) {
      toast.warn("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 8) {
      toast.warning("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    // Here you would typically get a token from URL params
    // For now, this is a placeholder for the password reset logic
    axios.post(`/usuarios/${id}/password-recovery/${token}`, 
      { 
        newPassword,
        // token: tokenFromURL // You'd get this from URL params
      }
    ).then((response) => {
      if (response.status === 200) {
        toast.success("Senha alterada com sucesso! Faça login com a nova senha.");
        history.push("/login");
      }
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        toast.error("Link de recuperação inválido ou expirado.");
      } else {
        toast.error("Erro ao redefinir senha. Tente novamente mais tarde.");
      }
    });
    
  }

  return (
    <GeneralBox>
      <Title>Redefinir Senha</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>

        <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
          <InputBox>
            <Label htmlFor="newPassword" value="Nova Senha *"/>
            <TextInput 
              id="newPassword" 
              type="password"
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </InputBox>
         
          <InputBox>
            <Label htmlFor="confirmPassword" value="Confirmar Senha *"/>
            <TextInput 
              id="confirmPassword" 
              type="password"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </InputBox>
         
          <InputBox>
            <Button type="submit"><span>Redefinir Senha</span></Button>
          </InputBox>
          <span>Escolha uma nova senha com pelo menos 8 caracteres.</span>

          
        </form>
        
      </div>
    </GeneralBox>
  );
} 