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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fixDate } from "../../config/dates";
import { CurrencyInput } from "../../components/CurrencyInput";

export default function AddGastosGerais(): JSX.Element {
  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  // Common fields
  const [idBanco, setIdBanco] = React.useState<number | "">("");
  const [idCategoria, setIdCategoria] = React.useState<number | "">("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [valor, setValor] = React.useState<string>("");

  // Normal
  const [dataCompetencia, setDataCompetencia] = React.useState<string>("");

  // Periódico

  const { user } = useAuth();

  type RecentGasto = {
    id: number;
    data: string;
    banco: string;
    categoria: string;
    descricao: string;
    valor: number;
  };
  const [recentItems, setRecentItems] = React.useState<RecentGasto[]>([]);

  type PendingGasto = {
    id: number; // temp id for DataGrid
    id_banco: number | "";
    id_categoria: number | "";
    descricao: string;
    valor: number | "";
    data_de_competencia?: string; // YYYY-MM-DD
  };

  const [pendingItems, setPendingItems] = React.useState<PendingGasto[]>([]);
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
          error?.response?.data?.detail || "Erro ao carregar bancos/categorias",
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
      const res = await axios.get(`/gastos/usuario/${user!.id}`);
      const data = res.data as any[];
      const lastTwoDays = data.filter(
        (g: any) => new Date(g.created_at) >= sinceDate,
      );

      const mapped: RecentGasto[] = lastTwoDays.map((g: any) => {
        const bancoNome =
          g.banco?.nome ??
          bancos.find((b) => b.id === (g.banco?.id || g.id_banco || g.banco_id))
            ?.nome ??
          "";
        const categoriaNome =
          g.categoria?.nome ??
          categorias.find(
            (c) =>
              c.id === (g.categoria?.id || g.id_categoria || g.categoria_id),
          )?.nome ??
          "";
        return {
          id: g.id,
          data: g.data_de_competencia,
          banco: bancoNome,
          categoria: categoriaNome,
          descricao: g.descricao || "",
          valor: Number(g.valor) || 0,
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

  // Add current form entry to the editable list
  function handleAddToList(e: React.FormEvent) {
    e.preventDefault();

    if (!idBanco) return toast.warn("Selecione um banco");
    if (!idCategoria) return toast.warn("Selecione uma categoria");
    if (!descricao) return toast.warn("Preencha a descrição");
    const valorNumber = Number(valor);
    if (!valor || isNaN(valorNumber) || valorNumber <= 0)
      return toast.warn("Informe um valor válido");

    if (!dataCompetencia) return toast.warn("Informe a data de competência");

    const newItem: PendingGasto = {
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

  // Save all items in the list to the backend
  async function handleSaveAll() {
    if (pendingItems.length === 0)
      return toast.info("Adicione itens à lista antes de salvar");
    try {
      const payload = pendingItems.map((gasto: PendingGasto) => {
        return {
          id_usuario: user!.id,
          id_banco: gasto.id_banco,
          id_categoria: gasto.id_categoria,
          valor: gasto.valor,
          descricao: gasto.descricao,
          data_de_competencia: gasto.data_de_competencia,
        };
      });
      const res = await axios.post(
        "/gastos/novo/lista?id_user=" + user!.id,
        payload,
      );

      if (res.status === 201) {
        resetForm();
        setPendingItems([]);
        toast.success("Lista de gastos enviada");
        fetchRecent();
      }
    } catch (err) {
      toast.error("Erro ao enviar lista de gastos");
    }
  }

  return (
    <GeneralBox>
      <Title>Adicionar Gastos Gerais</Title>
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
            </FormRow>

            <FormRow>
              <InputBox>
                <Label htmlFor="descricao" value="Descrição" />
                <TextInput
                  id="descricao"
                  placeholder="Ex: cafezinho"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </InputBox>
              <InputBox>
                <Label htmlFor="valor" value="Valor (R$)" />
                <CurrencyInput
                  id="valor"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </InputBox>
              {
                <InputBox>
                  <Label
                    htmlFor="data-competencia"
                    value="Data de competência"
                  />
                  <TextInput
                    id="data-competencia"
                    type="date"
                    value={dataCompetencia}
                    onChange={(e) => setDataCompetencia(e.target.value)}
                  />
                </InputBox>
              }
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
                    // send only current input as one gasto
                    if (!idBanco) return toast.warn("Selecione um banco");
                    if (!idCategoria)
                      return toast.warn("Selecione uma categoria");
                    if (!descricao) return toast.warn("Preencha a descrição");
                    const valorNumber = Number(valor);
                    if (!valor || isNaN(valorNumber) || valorNumber <= 0)
                      return toast.warn("Informe um valor válido");
                    try {
                      if (!dataCompetencia)
                        return toast.warn("Informe a data de competência");
                      const payload = {
                        id_usuario: user!.id,
                        id_banco: idBanco,
                        id_categoria: idCategoria,
                        descricao,
                        valor: valorNumber,
                        data_de_competencia: dataCompetencia,
                      };
                      const res = await axios.post(
                        "/gastos/novo?id_user=" + user!.id,
                        payload,
                      );
                      if (res.status === 201 || res.status === 200) {
                        toast.success("Gasto enviado");
                        fetchRecent();
                      }
                    } catch (error: any) {
                      toast.error(
                        error?.response?.data.message || "Erro ao enviar gasto",
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

        {/* Right side simple list */}
        <ListColumn>
          <h3 style={{ color: colors.secondaryColor, marginBottom: 10 }}>
            Gastos na lista
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
            <p style={{ color: "#333" }}>Nenhum gasto recente</p>
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
                    <td style={{ padding: 8 }}>
                      {fixDate(item.data).toLocaleDateString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                      })}
                    </td>
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
