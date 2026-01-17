import React from "react";
import {
  GeneralBox,
  DataGridBox,
  InputBox,
  FormRow,
  TwoColumns,
  FormColumn,
  ListColumn,
} from "./styled";
import { Title } from "../../styles/GlobalStyles";
import { Button, Label, Select, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import { fixDate } from "../../config/dates";

export default function AddDeposito(): JSX.Element {
  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  // Fields
  const [idBanco, setIdBanco] = React.useState<number | "">("");
  const [idCategoria, setIdCategoria] = React.useState<number | "">("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [valor, setValor] = React.useState<string>("");
  const [dataCompetencia, setDataCompetencia] = React.useState<string>("");

  const { user } = useAuth();

  type RecentDeposito = {
    id: number;
    data: string;
    banco: string;
    categoria: string;
    descricao: string;
    valor: number;
  };
  const [recentItems, setRecentItems] = React.useState<RecentDeposito[]>([]);

  type PendingDeposito = {
    id: number; // temp id for list
    id_banco: number | "";
    id_categoria: number | "";
    descricao: string;
    valor: number | "";
    data_de_competencia: string; // YYYY-MM-DD
  };

  const [pendingItems, setPendingItems] = React.useState<PendingDeposito[]>([]);
  const [nextRowId, setNextRowId] = React.useState<number>(1);

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
          error?.response?.data?.message ||
            "Erro ao carregar bancos/categorias",
        );
      }
    }
    fetchData();
    fetchRecent();
  }, []);

  async function fetchRecent() {
    try {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 2);

      const res = await axios.get(`/depositos/usuario/${user!.id}`);
      const data = res.data as any[];
      const recent = data.filter(
        (d: any) => new Date(d.created_at) >= sinceDate,
      );

      const mapped: RecentDeposito[] = recent.map((d: any) => {
        const bancoNome =
          d.banco?.nome ??
          bancos.find((b) => b.id === (d.banco?.id || d.id_banco || d.banco_id))
            ?.nome ??
          "";
        const categoriaNome =
          d.categoria?.nome ??
          categorias.find(
            (c) =>
              c.id === (d.categoria?.id || d.id_categoria || d.categoria_id),
          )?.nome ??
          "";
        return {
          id: d.id,
          data: fixDate(
            new Date(d.data_de_competencia).toLocaleDateString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            }),
          ).toLocaleDateString("pt-BR"),
          banco: bancoNome,
          categoria: categoriaNome,
          descricao: d.descricao || "",
          valor: Number(d.valor) || 0,
        };
      });

      setRecentItems(mapped);
    } catch (error) {
      // silent
    }
  }

  function resetForm() {
    setIdBanco("");
    setIdCategoria("");
    setDescricao("");
    setValor("");
    setDataCompetencia("");
  }

  function handleAddToList(e: React.FormEvent) {
    e.preventDefault();

    if (!idBanco) return toast.warn("Selecione um banco");
    if (!idCategoria) return toast.warn("Selecione uma categoria");
    if (!descricao) return toast.warn("Preencha a descrição");
    const valorNumber = Number(valor);
    if (!valor || isNaN(valorNumber) || valorNumber <= 0)
      return toast.warn("Informe um valor válido");
    if (!dataCompetencia) return toast.warn("Informe a data de competência");

    const newItem: PendingDeposito = {
      id: nextRowId,
      id_banco: idBanco,
      id_categoria: idCategoria,
      descricao,
      valor: valorNumber,
      data_de_competencia: dataCompetencia,
    };

    setPendingItems((prev) => [...prev, newItem]);
    setNextRowId((id) => id + 1);
  }

  async function handleSaveAll() {
    if (pendingItems.length === 0)
      return toast.info("Adicione itens à lista antes de salvar");
    try {
      const payload = pendingItems.map((item) => ({
        id_usuario: user!.id,
        id_banco: item.id_banco,
        id_categoria: item.id_categoria,
        valor: item.valor,
        descricao: item.descricao,
        data_de_competencia: item.data_de_competencia,
      }));
      const res = await axios.post("/depositos/novo/lista", payload);
      if (res.status === 201) {
        resetForm();
        setPendingItems([]);
        toast.success("Lista de depósitos enviada");
        fetchRecent();
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Erro inesperado ao salvar a lista",
      );
    }
  }

  return (
    <GeneralBox>
      <Title>Adicionar Depósitos</Title>
      <TwoColumns>
        <FormColumn>
          <form onSubmit={handleAddToList}>
            <FormRow>
              <InputBox>
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
              </InputBox>
              <InputBox>
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
              </InputBox>
              <InputBox>
                <Label htmlFor="descricao" value="Descrição" />
                <TextInput
                  id="descricao"
                  placeholder="Ex: salário"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </InputBox>
            </FormRow>

            <FormRow>
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

            <FormRow>
              <InputBox>
                <Button type="submit">
                  <span>Adicionar à lista</span>
                </Button>
              </InputBox>
              <InputBox>
                <Button
                  color="success"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    handleSaveAll();
                  }}
                >
                  <span>Enviar lista</span>
                </Button>
              </InputBox>
              <InputBox>
                <Button
                  color="purple"
                  onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    if (!idBanco) return toast.warn("Selecione um banco");
                    if (!idCategoria)
                      return toast.warn("Selecione uma categoria");
                    if (!descricao) return toast.warn("Preencha a descrição");
                    const valorNumber = Number(valor);
                    if (!valor || isNaN(valorNumber) || valorNumber <= 0)
                      return toast.warn("Informe um valor válido");
                    if (!dataCompetencia)
                      return toast.warn("Informe a data de competência");

                    try {
                      const payload = {
                        id_usuario: user!.id,
                        id_banco: idBanco,
                        id_categoria: idCategoria,
                        descricao,
                        valor: valorNumber,
                        data_de_competencia: dataCompetencia,
                      };
                      const res = await axios.post("/depositos/novo", payload);
                      if (res.status === 201 || res.status === 200) {
                        toast.success("Depósito enviado");
                        fetchRecent();
                      }
                    } catch (error: any) {
                      toast.error(
                        error?.response?.data?.detail ||
                          "Erro ao enviar depósito",
                      );
                    }
                  }}
                >
                  <span>Enviar somente este</span>
                </Button>
              </InputBox>
            </FormRow>
          </form>
        </FormColumn>

        <ListColumn>
          <h3 style={{ color: colors.secondaryColor, marginBottom: 10 }}>
            Depósitos na lista
          </h3>
          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            {pendingItems.length === 0 ? (
              <p style={{ color: "#333" }}>Nenhum item na lista</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: colors.primaryColor,
                      color: colors.secondaryColor,
                    }}
                  >
                    <th style={{ textAlign: "left", padding: 8 }}>Banco</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Categoria</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Descrição</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Valor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item) => {
                    const bancoNome =
                      bancos.find((b) => b.id === item.id_banco)?.nome || "";
                    const categoriaNome =
                      categorias.find((c) => c.id === item.id_categoria)
                        ?.nome || "";
                    return (
                      <tr key={item.id} style={{ background: "#fff" }}>
                        <td style={{ padding: 8 }}>{bancoNome}</td>
                        <td style={{ padding: 8 }}>{categoriaNome}</td>
                        <td style={{ padding: 8 }}>{item.descricao}</td>
                        <td style={{ padding: 8, textAlign: "right" }}>
                          R$ {Number(item.valor || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: 8 }}>
                          <Button
                            color="failure"
                            size="xs"
                            onClick={() =>
                              setPendingItems((prev) =>
                                prev.filter((r) => r.id !== item.id),
                              )
                            }
                          >
                            <span>Remover</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: "#fff" }}>
                    <td style={{ padding: 8 }}></td>
                    <td style={{ padding: 8 }}></td>
                    <td style={{ padding: 8 }}>Total:</td>

                    <td style={{ padding: 8, textAlign: "right" }}>
                      R${" "}
                      {pendingItems
                        .map((item) => Number(item.valor))
                        .reduce(
                          (acc: number, currentVal: number) => acc + currentVal,
                          0,
                        )
                        .toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </ListColumn>
      </TwoColumns>
      <div style={{ margin: "2rem 1rem" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: 10 }}>
          Histórico (últimos 2 dias)
        </h3>
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {recentItems.length === 0 ? (
            <p style={{ color: "#333" }}>Nenhum depósito recente</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8 }}>Data</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Banco</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Categoria</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Descrição</th>
                  <th style={{ textAlign: "right", padding: 8 }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item) => (
                  <tr key={item.id} style={{ background: "#fff" }}>
                    <td style={{ padding: 8 }}>{item.data}</td>
                    <td style={{ padding: 8 }}>{item.banco}</td>
                    <td style={{ padding: 8 }}>{item.categoria}</td>
                    <td style={{ padding: 8 }}>{item.descricao}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      R$ {item.valor.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Total:</td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    R${" "}
                    {recentItems
                      .map((item) => item.valor)
                      .reduce((acc, currentVal) => acc + currentVal, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </GeneralBox>
  );
}
