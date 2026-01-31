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
  TipoSelector,
  ButtonContainer,
  StyledButton,
} from "./styled";
import { CurrencyInput } from "../../components/CurrencyInput";

type Params = { id: string };

type TipoTransferencia = "entre-bancos" | "entre-categorias";

type Props = {
  tipoTransferencia: "entre-bancos" | "entre-categorias";
};

export default function EditTransferencia(props: Props): JSX.Element {
  const { id } = useParams<Params>();
  const history = useHistory();
  const { user } = useAuth();

  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  const [tipo, setTipo] = React.useState<TipoTransferencia>("entre-bancos");
  const [origemId, setOrigemId] = React.useState<number | "">("");
  const [destinoId, setDestinoId] = React.useState<number | "">("");
  const [intermediarioId, setIntermediarioId] = React.useState<number | "">("");
  const [valor, setValor] = React.useState<string>("");
  const [dataCompetencia, setDataCompetencia] = React.useState<string>("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const editUrl = `/transferencias/${props.tipoTransferencia}/${id}?id_user=${
    user!.id
  }`;

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
        const res = await axios.get(
          `transferencias/${props.tipoTransferencia}/get/${id}?id_user=${
            user!.id
          }`,
        );
        const t = res.data || {};

        // Detect tipo by shape
        setTipo(props.tipoTransferencia);

        const origem =
          tipo === "entre-bancos" ? t.bancoOrigem?.id : t.categoriaOrigem.id;
        const destino =
          tipo === "entre-bancos" ? t.bancoDestino?.id : t.categoriaDestino.id;
        const intermediario =
          tipo === "entre-bancos" ? t.categoria?.id : t.banco.id;
        setOrigemId(origem || "");
        setDestinoId(destino || "");
        setIntermediarioId(intermediario || "");
        setDescricao(t.descricao || "");
        setValor(String(t.valor ?? ""));
        setDataCompetencia(t.data_de_competencia.split("T")[0]);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.detail || "Erro ao carregar transferência",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeta();
    fetchItem();
  }, [id, user, editUrl, tipo, props.tipoTransferencia]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const base = {
        novoValor: Number(valor),
        novaDescricao: descricao,
        novaData_de_competencia: dataCompetencia,
      } as any;

      const payload =
        tipo === "entre-bancos"
          ? {
              ...base,
              novoId_banco_origem: origemId,
              novoId_banco_destino: destinoId,
              novoId_categoria: intermediarioId,
            }
          : {
              ...base,
              novoId_categoria_origem: origemId,
              novoId_categoria_destino: destinoId,
              novoId_banco: intermediarioId,
            };

      const res = await axios.put(editUrl, payload);
      if (res.status === 200) {
        toast.success("Transferência atualizada");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Erro ao atualizar transferência",
      );
    }
  }

  if (isLoading) return <div>Carregando...</div>;

  return (
    <EditContainer>
      <Title>Editar Transferência</Title>
      <TipoSelector>
        <Label htmlFor="tipo" value="Tipo" />
        <Select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as any)}
        >
          <option value="entre-bancos">Entre Bancos</option>
          <option value="entre-categorias">Entre Categorias</option>
        </Select>
      </TipoSelector>
      <FormContainer onSubmit={handleSubmit}>
        <FormRow>
          <FormField>
            <Label htmlFor="origem" value="Origem" />
            <Select
              id="origem"
              value={origemId}
              onChange={(e) => setOrigemId(Number(e.target.value))}
            >
              <option value="">Selecione...</option>
              {(tipo === "entre-bancos" ? bancos : categorias).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label htmlFor="destino" value="Destino" />
            <Select
              id="destino"
              value={destinoId}
              onChange={(e) => setDestinoId(Number(e.target.value))}
            >
              <option value="">Selecione...</option>
              {(tipo === "entre-bancos" ? bancos : categorias).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label
              htmlFor="inter"
              value={
                tipo === "entre-bancos"
                  ? "Categoria (intermediário)"
                  : "Banco (intermediário)"
              }
            />
            <Select
              id="inter"
              value={intermediarioId}
              onChange={(e) => setIntermediarioId(Number(e.target.value))}
            >
              <option value="">Selecione...</option>
              {(tipo === "entre-bancos" ? categorias : bancos).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                </option>
              ))}
            </Select>
          </FormField>
        </FormRow>
        <FormRow>
          <FormField>
            <Label htmlFor="valor" value="Valor (R$)" />
            <CurrencyInput
              id="valor"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />{" "}
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
        <FormField>
          <Label htmlFor="descricao" value="Descrição" />
          <TextInput
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </FormField>
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
