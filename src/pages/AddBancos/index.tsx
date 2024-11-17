import React from "react";
import { GeneralBox, InputBox } from "./styled";
import { Title } from "../../styles/GlobalStyles";
import { Button, Label, TextInput } from "flowbite-react";

export default function AddBancos() {
  return (
    <GeneralBox>
      <Title>Adicionar Bancos</Title>
      <form>
        <InputBox>
          <Label htmlFor="nome-banco" value="Nome do banco"/>
          <TextInput id="nome-banco" placeholder="Nome do banco"/>
        </InputBox>
        <InputBox>
          <Button><span>Adicionar</span></Button>
        </InputBox>
      </form>
    </GeneralBox>
  );
}