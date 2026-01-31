import React from "react";
import {
  Container,
  Title,
  SummarySection,
  SummaryGrid,
  SummaryCard,
  SummaryLabel,
  SummaryValue,
  FormSection,
  FormRow,
  FormColumn,
  ButtonGroup,
  SimulationTable,
  TableHeader,
  TableRow,
  TableCell,
  BalanceSection,
  BalanceCard,
  TabContainer,
  TabButton,
  DetailedList,
  DetailedItem,
  ItemName,
  ItemValue,
  TotalItemRow,
  SubsectionTitle,
} from "./styled";
import { Button, Label, Select, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import { CurrencyInput } from "../../components/CurrencyInput";
import { MdDelete } from "react-icons/md";

export default function CalcPlanejamento(): JSX.Element {
  const [bancos, setBancos] = React.useState<Banco[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Form fields
  const [simulationType, setSimulationType] = React.useState<
    "deposito" | "gasto"
  >("deposito");
  const [idBanco, setIdBanco] = React.useState<number | "">("");
  const [idCategoria, setIdCategoria] = React.useState<number | "">("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [valor, setValor] = React.useState<string>("");

  const { user } = useAuth();

  type SimulatedItem = {
    id: number;
    tipo: "deposito" | "gasto";
    banco: string;
    categoria: string;
    descricao: string;
    valor: number;
  };

  const [simulatedItems, setSimulatedItems] = React.useState<SimulatedItem[]>(
    [],
  );
  const [nextId, setNextId] = React.useState(1);

  // Calculate totals
  const totalBancosBalance = React.useMemo(
    () => bancos.reduce((sum, b) => sum + b.saldo, 0),
    [bancos],
  );

  const totalCategoriasBalance = React.useMemo(
    () => categorias.reduce((sum, c) => sum + c.saldo, 0),
    [categorias],
  );

  const totalDepositos = React.useMemo(
    () =>
      simulatedItems
        .filter((item) => item.tipo === "deposito")
        .reduce((sum, item) => sum + item.valor, 0),
    [simulatedItems],
  );

  const totalgastos = React.useMemo(
    () =>
      simulatedItems
        .filter((item) => item.tipo === "gasto")
        .reduce((sum, item) => sum + item.valor, 0),
    [simulatedItems],
  );

  const finalBalance = React.useMemo(
    () => totalBancosBalance + totalDepositos - totalgastos,
    [totalBancosBalance, totalDepositos, totalgastos],
  );

  // Load bancos and categorias on mount
  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  function resetForm() {
    setIdBanco("");
    setIdCategoria("");
    setDescricao("");
    setValor("");
  }

  function handleAddToSimulation(e: React.FormEvent) {
    e.preventDefault();

    if (!idBanco) return toast.warn("Selecione um banco");
    if (!idCategoria) return toast.warn("Selecione uma categoria");
    if (!descricao) return toast.warn("Preencha a descrição");

    const valorNumber = Number(valor);
    if (!valor || isNaN(valorNumber) || valorNumber <= 0)
      return toast.warn("Informe um valor válido");

    const bancoObj = bancos.find((b) => b.id === idBanco);
    const categoriaObj = categorias.find((c) => c.id === idCategoria);

    if (!bancoObj || !categoriaObj) {
      return toast.error("Banco ou categoria inválido");
    }

    const newItem: SimulatedItem = {
      id: nextId,
      tipo: simulationType,
      banco: bancoObj.nome,
      categoria: categoriaObj.nome,
      descricao,
      valor: valorNumber,
    };

    setSimulatedItems((prev) => [...prev, newItem]);
    setNextId((id) => id + 1);
    toast.success("Item adicionado à simulação");
    resetForm();
  }

  function handleRemoveItem(id: number) {
    setSimulatedItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removido da simulação");
  }

  function handleClearSimulation() {
    setSimulatedItems([]);
    toast.info("Simulação limpa");
  }

  function handleExportCSV() {
    if (simulatedItems.length === 0) {
      toast.warn("Nenhuma simulação para exportar");
      return;
    }

    try {
      // Create CSV header
      const headers = ["Banco", "Categoria", "Descrição", "Valor"];
      const rows = simulatedItems.map((item) => [
        item.banco,
        item.categoria,
        item.descricao,
        `${item.tipo === "deposito" ? "" : "-"}${item.valor
          .toFixed(2)
          .replace(".", ",")}`,
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(";"),
        ...rows.map((row) => row.join(";")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 10);

      link.setAttribute("href", url);
      link.setAttribute("download", `simulacao-${timestamp}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Simulação exportada com sucesso");
    } catch (error) {
      toast.error("Erro ao exportar simulação");
    }
  }

  if (loading) {
    return <Container>Carregando...</Container>;
  }

  return (
    <Container>
      <Title>Calculadora de Planejamento</Title>

      {/* Summary Section */}
      <SummarySection>
        <h2 style={{ fontSize: "1.45rem", textAlign: "center" }}>
          Resumo Atual - Saldos por Banco e Categoria
        </h2>

        <details>
          <summary>
            <SubsectionTitle>Bancos</SubsectionTitle>
          </summary>
          <DetailedList>
            {bancos.map((banco) => (
              <DetailedItem key={banco.id}>
                <ItemName>{banco.nome}</ItemName>
                <ItemValue isPositive={banco.saldo >= 0}>
                  R$ {banco.saldo.toFixed(2).replace(".", ",")}
                </ItemValue>
              </DetailedItem>
            ))}
          </DetailedList>
        </details>

        <details>
          <summary>
            <SubsectionTitle>Categorias</SubsectionTitle>
          </summary>
          <DetailedList>
            {categorias.map((categoria) => (
              <DetailedItem key={categoria.id}>
                <ItemName>{categoria.nome}</ItemName>
                <ItemValue isPositive={categoria.saldo >= 0}>
                  R$ {categoria.saldo.toFixed(2).replace(".", ",")}
                </ItemValue>
              </DetailedItem>
            ))}
          </DetailedList>
        </details>
        <TotalItemRow>
          <ItemName>SALDO TOTAL</ItemName>
          <ItemValue isPositive={totalBancosBalance >= 0}>
            R$ {totalBancosBalance.toFixed(2).replace(".", ",")}
          </ItemValue>
        </TotalItemRow>
      </SummarySection>

      {/* Form Section */}
      <FormSection>
        <h2>Simular Movimentação</h2>
        <form onSubmit={handleAddToSimulation}>
          <FormRow>
            <FormColumn>
              <Label htmlFor="simulationType" value="Tipo de Movimentação" />
              <TabContainer>
                <TabButton
                  type="button"
                  isActive={simulationType === "deposito"}
                  onClick={() => setSimulationType("deposito")}
                >
                  Depósito
                </TabButton>
                <TabButton
                  type="button"
                  isGasto={true}
                  isActive={simulationType === "gasto"}
                  onClick={() => setSimulationType("gasto")}
                >
                  Gasto
                </TabButton>
              </TabContainer>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn>
              <Label htmlFor="banco" value="Banco" />
              <Select
                id="banco"
                value={idBanco}
                onChange={(e) => setIdBanco(Number(e.target.value) || "")}
              >
                <option value="">Selecione um banco</option>
                {bancos.map((banco) => (
                  <option key={banco.id} value={banco.id}>
                    {banco.nome} (R$ {banco.saldo.toFixed(2).replace(".", ",")})
                  </option>
                ))}
              </Select>
            </FormColumn>
            <FormColumn>
              <Label htmlFor="categoria" value="Categoria" />
              <Select
                id="categoria"
                value={idCategoria}
                onChange={(e) => setIdCategoria(Number(e.target.value) || "")}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome} (R${" "}
                    {categoria.saldo.toFixed(2).replace(".", ",")})
                  </option>
                ))}
              </Select>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn>
              <Label htmlFor="descricao" value="Descrição" />
              <TextInput
                id="descricao"
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </FormColumn>
            <FormColumn>
              <Label htmlFor="valor" value="Valor (R$)" />
              <CurrencyInput
                placeholder="R$ 0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </FormColumn>
          </FormRow>

          <ButtonGroup>
            <Button type="submit" color="success">
              Adicionar à Simulação
            </Button>
            <Button type="button" color="light" onClick={resetForm}>
              Limpar Formulário
            </Button>
          </ButtonGroup>
        </form>
      </FormSection>

      {/* Simulation Results */}
      {simulatedItems.length > 0 && (
        <FormSection>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Movimentações Planejadas ({simulatedItems.length})</h2>
            <ButtonGroup>
              <Button color="info" onClick={handleExportCSV}>
                Exportar para CSV
              </Button>
            </ButtonGroup>
          </div>
          <SimulationTable>
            <thead>
              <TableHeader>
                <TableCell as="th">Tipo</TableCell>
                <TableCell as="th">Banco</TableCell>
                <TableCell as="th">Categoria</TableCell>
                <TableCell as="th">Descrição</TableCell>
                <TableCell as="th">Valor</TableCell>
                <TableCell as="th">Ação</TableCell>
              </TableHeader>
            </thead>
            <tbody>
              {simulatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <strong
                      style={{
                        color:
                          item.tipo === "deposito"
                            ? colors.successColor
                            : colors.dangerColor,
                      }}
                    >
                      {item.tipo === "deposito" ? "+" : "-"}
                      {item.tipo === "deposito" ? "deposito" : "gasto"}
                    </strong>
                  </TableCell>
                  <TableCell>{item.banco}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell
                    style={{
                      color:
                        item.tipo === "deposito"
                          ? colors.successColor
                          : colors.dangerColor,
                    }}
                  >
                    <strong>
                      {item.tipo === "deposito" ? "+" : "-"}R${" "}
                      {item.valor.toFixed(2).replace(".", ",")}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: colors.dangerColor,
                        fontSize: "1.2rem",
                      }}
                    >
                      <MdDelete />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </SimulationTable>
        </FormSection>
      )}

      {/* Balance Summary */}
      {simulatedItems.length > 0 && (
        <BalanceSection>
          <h2>Previsão de Saldo Final</h2>
          <BalanceCard>
            <details>
              <summary>
                <SubsectionTitle>Saldo por Banco</SubsectionTitle>
              </summary>
              <DetailedList>
                {bancos
                  .filter((banco) =>
                    simulatedItems.some((item) => item.banco === banco.nome),
                  )
                  .map((banco) => {
                    const bancoDepositos = simulatedItems
                      .filter(
                        (item) =>
                          item.tipo === "deposito" && item.banco === banco.nome,
                      )
                      .reduce((sum, item) => sum + item.valor, 0);
                    const bancogastos = simulatedItems
                      .filter(
                        (item) =>
                          item.tipo === "gasto" && item.banco === banco.nome,
                      )
                      .reduce((sum, item) => sum + item.valor, 0);
                    const finalBancoBalance =
                      banco.saldo + bancoDepositos - bancogastos;

                    return (
                      <DetailedItem key={banco.id}>
                        <div>
                          <ItemName>{banco.nome}</ItemName>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "4px",
                            }}
                          >
                            Inicial: R${" "}
                            {banco.saldo.toFixed(2).replace(".", ",")} + Dep: R${" "}
                            {bancoDepositos.toFixed(2).replace(".", ",")} -
                            gasto: R$ {bancogastos.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                        <ItemValue isPositive={finalBancoBalance >= 0}>
                          R$ {finalBancoBalance.toFixed(2).replace(".", ",")}
                        </ItemValue>
                      </DetailedItem>
                    );
                  })}
              </DetailedList>
            </details>

            <details>
              <summary>
                <SubsectionTitle>Saldo por Categoria</SubsectionTitle>
              </summary>

              <DetailedList>
                {categorias
                  .filter((categoria) =>
                    simulatedItems.some(
                      (item) => item.categoria === categoria.nome,
                    ),
                  )
                  .map((categoria) => {
                    const categoriaDepositos = simulatedItems
                      .filter(
                        (item) =>
                          item.tipo === "deposito" &&
                          item.categoria === categoria.nome,
                      )
                      .reduce((sum, item) => sum + item.valor, 0);
                    const categoriagastos = simulatedItems
                      .filter(
                        (item) =>
                          item.tipo === "gasto" &&
                          item.categoria === categoria.nome,
                      )
                      .reduce((sum, item) => sum + item.valor, 0);
                    const finalCategoriaBalance =
                      categoria.saldo + categoriaDepositos - categoriagastos;

                    return (
                      <DetailedItem key={categoria.id}>
                        <div>
                          <ItemName>{categoria.nome}</ItemName>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "4px",
                            }}
                          >
                            Inicial: R${" "}
                            {categoria.saldo.toFixed(2).replace(".", ",")} +
                            Dep: R${" "}
                            {categoriaDepositos.toFixed(2).replace(".", ",")} -
                            gasto: R${" "}
                            {categoriagastos.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                        <ItemValue isPositive={finalCategoriaBalance >= 0}>
                          R${" "}
                          {finalCategoriaBalance.toFixed(2).replace(".", ",")}
                        </ItemValue>
                      </DetailedItem>
                    );
                  })}
              </DetailedList>
            </details>

            <TotalItemRow>
              <ItemName>Saldo total</ItemName>
              <ItemValue
                isPositive={
                  totalBancosBalance + totalDepositos - totalgastos >= 0
                }
              >
                R${" "}
                {(totalBancosBalance + totalDepositos - totalgastos)
                  .toFixed(2)
                  .replace(".", ",")}
              </ItemValue>
            </TotalItemRow>

            <SummaryGrid style={{ marginTop: "30px" }}>
              <SummaryCard>
                <SummaryLabel>Total Depósitos</SummaryLabel>
                <SummaryValue style={{ color: colors.vividGreenColor }}>
                  +R$ {totalDepositos.toFixed(2).replace(".", ",")}
                </SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Total gastos</SummaryLabel>
                <SummaryValue style={{ color: colors.dangerColor }}>
                  -R$ {totalgastos.toFixed(2).replace(".", ",")}
                </SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Resultado Final</SummaryLabel>
                <SummaryValue
                  style={{
                    color:
                      totalDepositos - totalgastos >= 0
                        ? totalDepositos - totalgastos === 0
                          ? colors.secondaryColor
                          : colors.vividGreenColor
                        : colors.dangerColor,
                  }}
                >
                  {totalDepositos - totalgastos >= 0
                    ? totalDepositos - totalgastos === 0
                      ? ""
                      : "+"
                    : "-"}
                  R${" "}
                  {Math.abs(totalDepositos - totalgastos)
                    .toFixed(2)
                    .replace(".", ",")}
                </SummaryValue>
              </SummaryCard>
              <SummaryCard
                style={{
                  gridColumn: "1 / -1",
                  backgroundColor:
                    finalBalance >= 0
                      ? finalBalance > totalBancosBalance
                        ? colors.greenColor
                        : colors.successColor
                      : colors.dangerColor,
                }}
              >
                <SummaryLabel style={{ color: "white" }}>
                  Saldo Final Previsto
                </SummaryLabel>
                <SummaryValue style={{ color: "white", fontSize: "2rem" }}>
                  R$ {finalBalance.toFixed(2).replace(".", ",")}
                </SummaryValue>
              </SummaryCard>
            </SummaryGrid>
          </BalanceCard>

          <ButtonGroup>
            <Button color="failure" onClick={handleClearSimulation}>
              Limpar Simulação
            </Button>
          </ButtonGroup>
        </BalanceSection>
      )}
    </Container>
  );
}
