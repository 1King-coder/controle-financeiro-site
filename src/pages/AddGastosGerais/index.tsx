import React from "react";
import { GeneralBox, DataGridBox, InputBox, FormRow, TwoColumns, FormColumn, ListColumn } from "./styled";
import { Title } from "../../styles/GlobalStyles";
import { Button, Label, Select, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function AddGastosGerais(): JSX.Element {
  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);

  const [tipoGasto, setTipoGasto] = React.useState<"normal" | "periodico">("normal");

  // Common fields
  const [idBanco, setIdBanco] = React.useState<number | "">("");
  const [idCategoria, setIdCategoria] = React.useState<number | "">("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [valor, setValor] = React.useState<string>("");

  // Normal
  const [dataCompetencia, setDataCompetencia] = React.useState<string>("");

  // Periódico
  const [dataInicio, setDataInicio] = React.useState<string>("");
  const [dataFim, setDataFim] = React.useState<string>("");
  const [frequencia, setFrequencia] = React.useState<"diario" | "semanal" | "mensal" | "anual">("mensal");

  const { user } = useAuth();

  type RecentGasto = {
    id: number;
    data: string;
    banco: string;
    categoria: string;
    descricao: string;
    valor: number;
    tipo: string;
  };
  const [recentItems, setRecentItems] = React.useState<RecentGasto[]>([]);

  type PendingGasto = {
    id: number; // temp id for DataGrid
    tipo: "normal" | "periodico";
    id_banco: number | "";
    id_categoria: number | "";
    descricao: string;
    valor: number | "";
    data_de_competencia?: string; // YYYY-MM-DD
    data_ultimo_pagamento?: string; // YYYY-MM-DD (periódico)
    data_fim?: string | null; // optional
    frequencia?: "diario" | "semanal" | "mensal" | "anual";
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
        toast.error(error?.response?.data?.detail || "Erro ao carregar bancos/categorias");
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
      const lastTwoDays = data.filter((g: any) => new Date(g.created_at) >= sinceDate);

      const mapped: RecentGasto[] = lastTwoDays.map((g: any) => {
        const bancoNome = g.banco?.nome ?? bancos.find((b) => b.id === (g.banco?.id || g.id_banco || g.banco_id))?.nome ?? "";
        const categoriaNome = g.categoria?.nome ?? categorias.find((c) => c.id === (g.categoria?.id || g.id_categoria || g.categoria_id))?.nome ?? "";
        return {
          id: g.id,
          data: new Date(g.data_de_competencia ?? g.created_at).toLocaleDateString("pt-BR", {timeZone: "GMT-3"}),
          banco: bancoNome,
          categoria: categoriaNome,
          descricao: g.descricao || "",
          valor: Number(g.valor) || 0,
          tipo: g.tipo || g.tipo_gasto || "",
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
    setDataInicio("");
    setDataFim("");
    setTipoGasto("normal");
  }

  // Add current form entry to the editable list
  function handleAddToList(e: React.FormEvent) {
    e.preventDefault();

    if (!idBanco) return toast.warn("Selecione um banco");
    if (!idCategoria) return toast.warn("Selecione uma categoria");
    if (!descricao) return toast.warn("Preencha a descrição");
    const valorNumber = Number(valor);
    if (!valor || isNaN(valorNumber) || valorNumber <= 0) return toast.warn("Informe um valor válido");

    if (tipoGasto === "normal" && !dataCompetencia) return toast.warn("Informe a data de competência");
    if (tipoGasto === "periodico" && !dataInicio) return toast.warn("Informe a data de início");

    const newItem: PendingGasto = {
      id: nextRowId,
      tipo: tipoGasto,
      id_banco: idBanco,
      id_categoria: idCategoria,
      descricao,
      valor: valorNumber,
      data_de_competencia: tipoGasto === "normal" ? dataCompetencia : undefined,
      data_ultimo_pagamento: tipoGasto === "periodico" ? dataInicio : undefined,
      data_fim: tipoGasto === "periodico" ? (dataFim || null) : undefined,
      frequencia: tipoGasto === "periodico" ? frequencia : undefined,
    };

    setPendingItems((prev) => [...prev, newItem]);
    setNextRowId((id) => id + 1);
  }

  // Save all items in the list to the backend
  async function handleSaveAll() {
    if (pendingItems.length === 0) return toast.info("Adicione itens à lista antes de salvar");
    try {
      const payload = pendingItems.map(
        (gasto: PendingGasto) => {
          return {
            id_usuario: user!.id,
            id_banco: gasto.id_banco,
            id_categoria: gasto.id_categoria,
            valor: gasto.valor,
            descricao: gasto.descricao,
            data_de_competencia: gasto.data_de_competencia,
            tipo: gasto.tipo
          }
        }
      )
      const res = await axios.post("/gastos/novo/lista", payload);

      if (res.status === 201) {
        resetForm();
        setPendingItems([])
        fetchRecent();
      }
    } catch (err) {
      toast.error("Erro inesperado ao salvar a lista");
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
                <Label htmlFor="tipo-gasto" value="Tipo de gasto" />
                <Select id="tipo-gasto" value={tipoGasto} onChange={(e) => setTipoGasto(e.target.value as any)}>
                  <option value="normal">Normal</option>
                  <option value="periodico">Periódico</option>
                </Select>
              </InputBox>
              <InputBox>
                <Label htmlFor="banco" value="Banco" />
                <Select id="banco" value={idBanco} onChange={(e) => setIdBanco(Number(e.target.value))}>
                  <option value="">Selecione...</option>
                  {bancos.map((b) => (
                    <option key={b.id} value={b.id}>{b.nome}</option>
                  ))}
                </Select>
              </InputBox>
              <InputBox>
                <Label htmlFor="categoria" value="Categoria" />
                <Select id="categoria" value={idCategoria} onChange={(e) => setIdCategoria(Number(e.target.value))}>
                  <option value="">Selecione...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </Select>
              </InputBox>
            </FormRow>

            <FormRow>
              <InputBox>
                <Label htmlFor="descricao" value="Descrição" />
                <TextInput id="descricao" placeholder="Ex: cafezinho" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </InputBox>
              <InputBox>
                <Label htmlFor="valor" value="Valor (R$)" />
                <TextInput id="valor" type="number" step="0.01" min="0" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
              </InputBox>
              {tipoGasto === "normal" && (
                <InputBox>
                  <Label htmlFor="data-competencia" value="Data de competência" />
                  <TextInput id="data-competencia" type="date" value={dataCompetencia} onChange={(e) => setDataCompetencia(e.target.value)} />
                </InputBox>
              )}
            </FormRow>

            {tipoGasto === "periodico" && (
              <FormRow>
                <InputBox>
                  <Label htmlFor="data-inicio" value="Início" />
                  <TextInput id="data-inicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                </InputBox>
                <InputBox>
                  <Label htmlFor="data-fim" value="Fim (opcional)" />
                  <TextInput id="data-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                </InputBox>
                <InputBox>
                  <Label htmlFor="frequencia" value="Frequência" />
                  <Select id="frequencia" value={frequencia} onChange={(e) => setFrequencia(e.target.value as any)}>
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </Select>
                </InputBox>
              </FormRow>
            )}

            <FormRow>
              <InputBox>
                <Button type="submit"><span>Adicionar à lista</span></Button>
              </InputBox>
              <InputBox>
                <Button color="success" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); handleSaveAll(); }}><span>Enviar lista</span></Button>
              </InputBox>
              <InputBox>
                <Button color="purple" onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  // send only current input as one gasto
                  if (!idBanco) return toast.warn("Selecione um banco");
                  if (!idCategoria) return toast.warn("Selecione uma categoria");
                  if (!descricao) return toast.warn("Preencha a descrição");
                  const valorNumber = Number(valor);
                  if (!valor || isNaN(valorNumber) || valorNumber <= 0) return toast.warn("Informe um valor válido");
                  try {
                    if (tipoGasto === "normal") {
                      if (!dataCompetencia) return toast.warn("Informe a data de competência");
                      const payload = {
                        id_usuario: user!.id,
                        id_banco: idBanco,
                        id_categoria: idCategoria,
                        descricao,
                        valor: valorNumber,
                        data_de_competencia: dataCompetencia,
                        tipo: "normal",
                      };
                      const res = await axios.post("/gastos/novo", payload);
                      if (res.status === 201 || res.status === 200) {
                        toast.success("Gasto enviado");
                        fetchRecent();
                      }
                    } else {
                      if (!dataInicio) return toast.warn("Informe a data de início");
                      const payload = {
                        id_usuario: user!.id,
                        id_banco: idBanco,
                        id_categoria: idCategoria,
                        descricao,
                        valor: valorNumber,
                        data_ultimo_pagamento: dataInicio,
                        tipo: "periodico",
                      };
                      const res = await axios.post("/gastos/novo", payload);
                      if (res.status === 201 || res.status === 200) {
                        toast.success("Gasto periódico enviado");
                        fetchRecent();
                      }
                    }
                  } catch (error: any) {
                    toast.error(error?.response?.data?.detail || "Erro ao enviar gasto");
                  }
                }}><span>Enviar somente este</span></Button>
              </InputBox>
            </FormRow>
          </form>
        </FormColumn>

        {/* Right side simple list */}
        <ListColumn>
          <h3 style={{ color: colors.secondaryColor, marginBottom: 10 }}>Gastos na lista</h3>
          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            {pendingItems.length === 0 ? (
              <p style={{ color: "#333" }}>Nenhum item na lista</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: colors.primaryColor, color: colors.secondaryColor }}>
                    <th style={{ textAlign: "left", padding: 8 }}>Banco</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Categoria</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Descrição</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Valor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item) => {
                    const bancoNome = bancos.find((b) => b.id === item.id_banco)?.nome || "";
                    const categoriaNome = categorias.find((c) => c.id === item.id_categoria)?.nome || "";
                    return (
                      <tr key={item.id} style={{ background: "#fff" }}>
                        <td style={{ padding: 8 }}>{bancoNome}</td>
                        <td style={{ padding: 8 }}>{categoriaNome}</td>
                        <td style={{ padding: 8 }}>{item.descricao}</td>
                        <td style={{ padding: 8, textAlign: "right" }}>R$ {Number(item.valor || 0).toFixed(2)}</td>
                        <td style={{ padding: 8 }}>
                          <Button color="failure" size="xs" onClick={() => setPendingItems((prev) => prev.filter((r) => r.id !== item.id))}><span>Remover</span></Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </ListColumn>
      </TwoColumns>
      <div style={{ margin: "2rem 1rem" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: 10 }}>Histórico (últimos 2 dias)</h3>
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {recentItems.length === 0 ? (
            <p style={{ color: "#333" }}>Nenhum gasto recente</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8 }}>Data</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Tipo</th>
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
                    <td style={{ padding: 8 }}>{item.tipo}</td>
                    <td style={{ padding: 8 }}>{item.banco}</td>
                    <td style={{ padding: 8 }}>{item.categoria}</td>
                    <td style={{ padding: 8 }}>{item.descricao}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>R$ {item.valor.toFixed(2)}</td>
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
