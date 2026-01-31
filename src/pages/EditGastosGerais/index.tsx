import React from "react";
import { Title } from "../../styles/GlobalStyles";
import { Button, Label, Select, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import {
  EditContainer,
  FormContainer,
  FormRow,
  FormField,
  ButtonContainer,
  StyledButton,
} from "./styled";
import { fixDate } from "../../config/dates";
import { CurrencyInput } from "../../components/CurrencyInput";

type Params = { id: string };

export default function EditGastosGerais(): JSX.Element {
  const { id } = useParams<Params>();
  const history = useHistory();
  const { user } = useAuth();

  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  const [idBanco, setIdBanco] = React.useState<number | "">("");
  const [idCategoria, setIdCategoria] = React.useState<number | "">("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [valor, setValor] = React.useState<string>("");
  const [dataCompetencia, setDataCompetencia] = React.useState<string>("");

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchMeta() {
      try {
        const [bRes, cRes] = await Promise.all([
          axios.get(`/bancos/usuario/${user!.id}`),
          axios.get(`/categorias/usuario/${user!.id}`),
        ]);
        setBancos(bRes.data);
        setCategorias(cRes.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.detail || "Erro ao carregar bancos/categorias",
        );
      }
    }

    async function fetchItem() {
      try {
        const res = await axios.get(`/gastos/${id}?id_user=${user!.id}`);
        const g = res.data;
        setIdBanco(g.banco?.id || g.id_banco);
        setIdCategoria(g.categoria?.id || g.id_categoria);
        setDescricao(g.descricao || "");
        setValor(String(g.valor ?? ""));

        setDataCompetencia(g.data_de_competencia.split("T")[0]);
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Erro ao carregar gasto");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeta();
    fetchItem();
  }, [id, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        id_banco: idBanco,
        id_categoria: idCategoria,
        descricao,
        valor: Number(valor),
        data_de_competencia: dataCompetencia,
      };
      const res = await axios.put(`/gastos/${id}?id_user=${user!.id}`, payload);
      if (res.status === 200) {
        toast.success("Gasto atualizado");
        history.push("/gastos-gerais");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao atualizar gasto");
    }
  }

  if (isLoading) return <div>Carregando...</div>;

  return (
    <EditContainer>
      <Title>Editar Gasto</Title>
      <FormContainer onSubmit={handleSubmit}>
        <FormRow>
          <FormField>
            <Label htmlFor="banco" value="Banco" />
            <Select
              id="banco"
              value={idBanco}
              onChange={(e) => setIdBanco(Number(e.target.value))}
            >
              <option value="">Selecione...</option>
              {bancos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label htmlFor="categoria" value="Categoria" />
            <Select
              id="categoria"
              value={idCategoria}
              onChange={(e) => setIdCategoria(Number(e.target.value))}
            >
              <option value="">Selecione...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </FormField>
        </FormRow>
        <FormRow>
          <FormField style={{ flex: 2 }}>
            <Label htmlFor="descricao" value="Descrição" />
            <TextInput
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="valor" value="Valor (R$)" />
            <CurrencyInput
              id="valor"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="data" value="Data de competência" />
            <TextInput
              id="data"
              type="date"
              value={dataCompetencia}
              onChange={(e) => setDataCompetencia(e.target.value)}
            />
          </FormField>
        </FormRow>
        <ButtonContainer>
          <StyledButton type="submit">Salvar</StyledButton>
          <StyledButton
            type="button"
            className="secondary"
            onClick={() => history.goBack()}
          >
            Cancelar
          </StyledButton>
        </ButtonContainer>
      </FormContainer>
    </EditContainer>
  );
}
