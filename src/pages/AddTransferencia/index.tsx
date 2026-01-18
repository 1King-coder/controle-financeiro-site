import React from "react";
import { GeneralBox, InputBox, FormRow } from "./styled";
import { Title } from "../../styles/GlobalStyles";
import { Button, Label, Select, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import { fixDate } from "../../config/dates";

export default function AddTransferencia(): JSX.Element {
  const { user } = useAuth();

  const [tipo, setTipo] = React.useState<"entre-bancos" | "entre-categorias">(
    "entre-bancos",
  );
  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  // Common fields
  const [descricao, setDescricao] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [dataCompetencia, setDataCompetencia] = React.useState("");

  // For between banks
  const [idBancoOrigem, setIdBancoOrigem] = React.useState<number | "">("");
  const [idBancoDestino, setIdBancoDestino] = React.useState<number | "">("");
  const [idCategoriaIntermediaria, setIdCategoriaIntermediaria] =
    React.useState<number | "">("");

  // For between categories
  const [idCategoriaOrigem, setIdCategoriaOrigem] = React.useState<number | "">(
    "",
  );
  const [idCategoriaDestino, setIdCategoriaDestino] = React.useState<
    number | ""
  >("");
  const [idBancoIntermediario, setIdBancoIntermediario] = React.useState<
    number | ""
  >("");

  type RecentItem = {
    id: number;
    data: string;
    origem: string;
    destino: string;
    intermediario: string;
    valor: number;
    descricao: string;
  };
  const [recentItems, setRecentItems] = React.useState<RecentItem[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [bancosRes, categoriasRes] = await Promise.all([
          axios.get(`/bancos/usuario/${user!.id}`),
          axios.get(`/categorias/usuario/${user!.id}`),
        ]);
        setBancos(bancosRes.data);
        setCategorias(categoriasRes.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.detail || "Erro ao carregar bancos/categorias",
        );
      }
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    fetchRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  async function fetchRecent() {
    try {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 2);

      const url =
        tipo === "entre-bancos"
          ? `/transferencias/entre-bancos/${user!.id}`
          : `/transferencias/entre-categorias/${user!.id}`;

      const res = await axios.get(url);
      const data = res.data as any[];

      const filtered = data.filter((t: any) => {
        const d = new Date(t.created_at);
        return d >= sinceDate;
      });

      const mapped: RecentItem[] = filtered.map((t: any) => {
        if (tipo === "entre-bancos") {
          const origem =
            t.bancoOrigem?.nome ??
            bancos.find(
              (b) => b.id === (t.id_banco_origem || t.banco_origem_id),
            )?.nome ??
            "";
          const destino =
            t.bancoDestino?.nome ??
            bancos.find(
              (b) => b.id === (t.id_banco_destino || t.banco_destino_id),
            )?.nome ??
            "";
          const intermediario =
            t.categoria?.nome ??
            categorias.find((c) => c.id === (t.id_categoria || t.categoria_id))
              ?.nome ??
            "";
          return {
            id: t.id,
            data: t.data_de_competencia,
            origem,
            destino,
            intermediario,
            valor: Number(t.valor),
            descricao: t.descricao || "",
          };
        } else {
          const origem =
            t.categoriaOrigem?.nome ??
            categorias.find(
              (c) => c.id === (t.id_categoria_origem || t.categoria_origem_id),
            )?.nome ??
            "";
          const destino =
            t.categoriaDestino?.nome ??
            categorias.find(
              (c) =>
                c.id === (t.id_categoria_destino || t.categoria_destino_id),
            )?.nome ??
            "";
          const intermediario =
            t.banco?.nome ??
            bancos.find((b) => b.id === (t.id_banco || t.banco_id))?.nome ??
            "";
          return {
            id: t.id,
            data: new Date(t.data_de_competencia).toLocaleDateString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            }),
            origem,
            destino,
            intermediario,
            valor: Number(t.valor),
            descricao: t.descricao || "",
          };
        }
      });

      setRecentItems(mapped);
    } catch (error: any) {
      // silent fail for history
    }
  }

  function resetForm() {
    setDescricao("");
    setValor("");
    setDataCompetencia("");
    setIdBancoOrigem("");
    setIdBancoDestino("");
    setIdCategoriaIntermediaria("");
    setIdCategoriaOrigem("");
    setIdCategoriaDestino("");
    setIdBancoIntermediario("");
  }

  async function handleSubmitOne(e: React.FormEvent) {
    e.preventDefault();

    const valorNumber = Number(valor);
    if (!descricao) return toast.warn("Preencha a descrição");
    if (!valor || isNaN(valorNumber) || valorNumber <= 0)
      return toast.warn("Informe um valor válido");
    if (!dataCompetencia) return toast.warn("Informe a data de competência");

    try {
      if (tipo === "entre-bancos") {
        if (!idBancoOrigem) return toast.warn("Selecione o banco de origem");
        if (!idBancoDestino) return toast.warn("Selecione o banco de destino");
        if (!idCategoriaIntermediaria)
          return toast.warn("Selecione a categoria intermediária");

        const payload = {
          id_usuario: user!.id,
          id_banco_origem: idBancoOrigem,
          id_banco_destino: idBancoDestino,
          id_categoria: idCategoriaIntermediaria,
          descricao,
          valor: valorNumber,
          data_de_competencia: dataCompetencia,
        };
        const res = await axios.post(
          "/transferencias/entre-bancos/novo",
          payload,
        );
        if (res.status === 201 || res.status === 200) {
          toast.success("Transferência entre bancos enviada");
          resetForm();
          fetchRecent();
        }
      } else {
        if (!idCategoriaOrigem)
          return toast.warn("Selecione a categoria de origem");
        if (!idCategoriaDestino)
          return toast.warn("Selecione a categoria de destino");
        if (!idBancoIntermediario)
          return toast.warn("Selecione o banco intermediário");

        const payload = {
          id_usuario: user!.id,
          id_categoria_origem: idCategoriaOrigem,
          id_categoria_destino: idCategoriaDestino,
          id_banco: idBancoIntermediario,
          descricao,
          valor: valorNumber,
          data_de_competencia: dataCompetencia,
        };
        const res = await axios.post(
          "/transferencias/entre-categorias/novo",
          payload,
        );
        if (res.status === 201 || res.status === 200) {
          toast.success("Transferência entre categorias enviada");
          resetForm();
          fetchRecent();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Erro ao enviar transferência",
      );
    }
  }

  return (
    <GeneralBox>
      <Title>Adicionar Transferência</Title>
      <form onSubmit={handleSubmitOne}>
        <FormRow>
          <InputBox>
            <Label htmlFor="tipo" value="Tipo de transferência" />
            <Select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
            >
              <option value="entre-bancos">Entre Bancos</option>
              <option value="entre-categorias">Entre Categorias</option>
            </Select>
          </InputBox>
          <InputBox>
            <Label htmlFor="descricao" value="Descrição" />
            <TextInput
              id="descricao"
              placeholder="Ex: ajuste"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </InputBox>
          <InputBox>
            <Label htmlFor="valor" value="Valor (R$)" />
            <TextInput
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </InputBox>
          <InputBox>
            <Label htmlFor="data-competencia" value="Data de competência" />
            <TextInput
              id="data-competencia"
              type="date"
              value={dataCompetencia}
              onChange={(e) => setDataCompetencia(e.target.value)}
            />
          </InputBox>
        </FormRow>

        {tipo === "entre-bancos" ? (
          <FormRow>
            <InputBox>
              <Label htmlFor="banco-origem" value="Banco de origem" />
              <Select
                id="banco-origem"
                value={idBancoOrigem}
                onChange={(e) => setIdBancoOrigem(Number(e.target.value))}
              >
                <option value="">Selecione...</option>
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </Select>
            </InputBox>
            <InputBox>
              <Label htmlFor="banco-destino" value="Banco de destino" />
              <Select
                id="banco-destino"
                value={idBancoDestino}
                onChange={(e) => setIdBancoDestino(Number(e.target.value))}
              >
                <option value="">Selecione...</option>
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </Select>
            </InputBox>
            <InputBox>
              <Label
                htmlFor="categoria-intermediaria"
                value="Categoria intermediária"
              />
              <Select
                id="categoria-intermediaria"
                value={idCategoriaIntermediaria}
                onChange={(e) =>
                  setIdCategoriaIntermediaria(Number(e.target.value))
                }
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </InputBox>
          </FormRow>
        ) : (
          <FormRow>
            <InputBox>
              <Label htmlFor="categoria-origem" value="Categoria de origem" />
              <Select
                id="categoria-origem"
                value={idCategoriaOrigem}
                onChange={(e) => setIdCategoriaOrigem(Number(e.target.value))}
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </InputBox>
            <InputBox>
              <Label htmlFor="categoria-destino" value="Categoria de destino" />
              <Select
                id="categoria-destino"
                value={idCategoriaDestino}
                onChange={(e) => setIdCategoriaDestino(Number(e.target.value))}
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </InputBox>
            <InputBox>
              <Label
                htmlFor="banco-intermediario"
                value="Banco intermediário"
              />
              <Select
                id="banco-intermediario"
                value={idBancoIntermediario}
                onChange={(e) =>
                  setIdBancoIntermediario(Number(e.target.value))
                }
              >
                <option value="">Selecione...</option>
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </Select>
            </InputBox>
          </FormRow>
        )}

        <FormRow>
          <InputBox>
            <Button type="submit">
              <span>Enviar transferência</span>
            </Button>
          </InputBox>
        </FormRow>
      </form>
      <div style={{ margin: "2rem 1rem" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: 10 }}>
          Histórico (últimos 2 dias)
        </h3>
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {recentItems.length === 0 ? (
            <p style={{ color: "#333" }}>Nenhuma transferência recente</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8 }}>Data</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Origem</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Destino</th>
                  <th style={{ textAlign: "left", padding: 8 }}>
                    {tipo === "entre-bancos" ? "Categoria" : "Banco"}
                  </th>
                  <th style={{ textAlign: "right", padding: 8 }}>Valor</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item) => (
                  <tr key={item.id} style={{ background: "#fff" }}>
                    <td style={{ padding: 8 }}>
                      {fixDate(item.data).toLocaleDateString("pt-br", {
                        timeZone: "America/Sao_Paulo",
                      })}
                    </td>
                    <td style={{ padding: 8 }}>{item.origem}</td>
                    <td style={{ padding: 8 }}>{item.destino}</td>
                    <td style={{ padding: 8 }}>{item.intermediario}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      R$ {item.valor.toFixed(2)}
                    </td>
                    <td style={{ padding: 8 }}>{item.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </GeneralBox>
  );
}
