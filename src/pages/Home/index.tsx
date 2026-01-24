import React from "react";
import { Box, Title, Grid, ScrollableDivBtns, Btn } from "./styled";
import {
  Container,
  OptionBtn,
  ScrollableDiv,
  ScrollableDivY,
  StyledButton,
  StyledButtonGroup,
} from "../../styles/GlobalStyles";
import { useAuth } from "../../services/useAuth";
import { primaryColor, secondaryColor } from "../../config/colors";
import { Link } from "react-router-dom";
import axios from "../../services/axios";
import { SubTitle1 } from "../GastosGerais/styled";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import history from "../../services/history";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { BiTransfer } from "react-icons/bi";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import { GastoGeral } from "../../types/GastoGeral";

class GetGastosGeraisDataFuncions {
  static async getGastosGerais(id_user: Number): Promise<GastoGeral[]> {
    const response = await axios.get("/gastos/usuario/" + id_user);

    return await response.data;
  }

  static async getGastosGeraisFilterByMonthInterval(
    date: Date,
    id_user: Number,
  ): Promise<GastoGeral[]> {
    const filteredData = GetGastosGeraisDataFuncions.getGastosGerais(
      id_user,
    ).then((data: GastoGeral[]) => {
      const filteredData = data.filter((gastoGeral: GastoGeral) => {
        // @ts-ignore
        const dateSplited = new Date(gastoGeral.data_de_competencia)
          .toLocaleDateString("pt-br", { timeZone: "America/Sao_Paulo" })
          .split("/");
        const dataGasto = new Date(
          Number(dateSplited[2]),
          Number(dateSplited[1]) - 1,
          Number(dateSplited[0]),
        );

        if (
          new Date(gastoGeral.data_de_competencia).getMonth() ===
          date.getMonth()
        ) {
          return gastoGeral;
        }

        return null;
      });

      return filteredData;
    });

    return filteredData;
  }
}

export default function Home(): JSX.Element {
  const [bancos, setBancos]: [any, any] = React.useState([]);
  const [categorias, setCategorias]: [any, any] = React.useState([]);
  const [bancosByNameId, setBancosByNameId]: [any, any] = React.useState([]);
  const [categoriasByNameId, setCategoriasByNameId]: [any, any] =
    React.useState([]);
  const [gastosByMonth, setGastosByMonth]: [GastoGeral[], any] = React.useState(
    [],
  );
  const [monthlyCheckoutUrl, setMonthlyCheckoutUrl] =
    React.useState<string>("");
  const [annualCheckoutUrl, setAnnualCheckoutUrl] = React.useState<string>("");

  const { user } = useAuth();

  React.useEffect(() => {
    if (user?.isAuthenticated) {
      GetGastosGeraisDataFuncions.getGastosGeraisFilterByMonthInterval(
        new Date(),
        user!.id,
      ).then((data: GastoGeral[]) => {
        setGastosByMonth(data);
      });
    }
  }, [user]);

  React.useEffect(() => {
    async function getBancos() {
      const bancosNameById: { [key: number]: string } = {};

      axios.get(`/bancos/usuario/${user!.id}`).then((response) => {
        const data: Banco[] = response.data;
        setBancos(data);

        data.forEach((banco: Banco) => {
          bancosNameById[banco.id] = banco.nome;
        });
        setBancosByNameId(bancosNameById);
      });
    }

    async function getCategorias() {
      const categoriasNameById: { [key: number]: string } = {};
      axios.get(`/categorias/usuario/${user!.id}`).then((response) => {
        const data: Categoria[] = response.data;
        setCategorias(data);

        data.forEach((categoria: Categoria) => {
          categoriasNameById[categoria.id] = categoria.nome;
        });
        setCategoriasByNameId(categoriasNameById);
      });
    }
    async function fetchMonthlyCheckoutSession() {
      try {
        const res = await axios.post(
          `/usuarios/generate-monthly-checkout-session`,
          {
            userId: user?.id,
            email: user?.email,
          },
        );
        const { url } = res.data;
        setMonthlyCheckoutUrl(url);
      } catch (error: any) {
        console.log("Erro ao criar sessão de checkout:", error);
      }
    }

    async function fetchAnnualCheckoutSession() {
      try {
        const res = await axios.post(
          `/usuarios/generate-annual-checkout-session`,
          {
            userId: user?.id,
            email: user?.email,
          },
        );
        const { url } = res.data;
        setAnnualCheckoutUrl(url);
      } catch (error: any) {
        console.log("Erro ao criar sessão de checkout:", error);
      }
    }

    if (user?.isAuthenticated) {
      Promise.all([getBancos(), getCategorias()]).then((res) => {});
    }

    if (user?.isAuthenticated && !user?.hasSubscription) {
      fetchMonthlyCheckoutSession();
      fetchAnnualCheckoutSession();
    }
  }, [user]);

  return (
    <Container>
      <Title>Home</Title>
      <Grid>
        {!user?.isAuthenticated ? (
          <>
            <Link to="/login">
              <StyledButton>
                <span style={{ color: secondaryColor }}>Entrar</span>
              </StyledButton>
            </Link>
            <Link to="/cadastro">
              <StyledButton>
                <span style={{ color: secondaryColor }}>Cadastrar-se</span>
              </StyledButton>
            </Link>
          </>
        ) : (
          <>
            <ScrollableDivBtns>
              <Btn onClick={() => history.push("/gastos-gerais/add")}>
                <span>Adicionar Gasto</span>
                <FaMoneyBillTransfer
                  size={18}
                  color={secondaryColor}
                  style={{ margin: "0 0 0 10px" }}
                />
              </Btn>
              <Btn onClick={() => history.push("/depositos/add")}>
                <span>Adicionar Depósito</span>
                <GiMoneyStack
                  size={18}
                  color={secondaryColor}
                  style={{ margin: "0 0 0 10px" }}
                />
              </Btn>
              <Btn onClick={() => history.push("/transferencias/add")}>
                <span>Adicionar Transferência</span>
                <BiTransfer
                  size={18}
                  color={secondaryColor}
                  style={{ margin: "0 0 0 10px" }}
                />
              </Btn>
            </ScrollableDivBtns>
            {!user!.hasSubscription ? (
              <Box>
                <SubTitle1>Escolha um Plano</SubTitle1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <StyledButton onClick={() => window.open(monthlyCheckoutUrl)}>
                    <span>Plano Mensal</span>
                  </StyledButton>
                  <StyledButton onClick={() => window.open(annualCheckoutUrl)}>
                    <span>Plano Anual</span>
                  </StyledButton>
                </div>
              </Box>
            ) : null}
            <Box>
              <Link to={`/bancos`}>
                <SubTitle1 style={{ marginBottom: 10, marginTop: 0 }}>
                  Bancos
                </SubTitle1>
              </Link>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  height: "60%",
                  border: "2px solid black",
                }}
              >
                {bancos.length > 0 ? (
                  bancos
                    .sort((a: Banco, b: Banco) => (a.saldo < b.saldo ? 1 : -1))
                    .map((banco: Banco) => {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: 250,
                              margin: 8,
                              border: "1px solid black",
                              padding: 10,
                            }}
                          >
                            <span>{banco.nome}:</span>
                            <span>{`R$${banco.saldo.toFixed(2)}`}</span>
                          </div>
                        </>
                      );
                    })
                ) : (
                  <></>
                )}
              </div>
              <StyledButton
                style={{ fontSize: 20 }}
                onClick={() => history.push("/bancos/add")}
              >
                Adicionar novo Banco
              </StyledButton>
            </Box>
            <Box>
              <Link to="/categorias">
                <SubTitle1 style={{ marginBottom: 10, marginTop: 0 }}>
                  Categorias
                </SubTitle1>
              </Link>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  height: "60%",
                  border: "2px solid black",
                }}
              >
                {categorias.length > 0 ? (
                  categorias
                    .sort((a: Categoria, b: Categoria) =>
                      a.saldo < b.saldo ? 1 : -1,
                    )
                    .map((categoria: Categoria) => {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: 250,
                              margin: 8,
                              border: "1px solid black",
                              padding: 10,
                            }}
                          >
                            <span>{categoria.nome}:</span>
                            <span
                              style={{
                                position: "-webkit-sticky",
                                left: "50%",
                              }}
                            >{`R$${categoria.saldo.toFixed(2)}`}</span>
                          </div>
                        </>
                      );
                    })
                ) : (
                  <></>
                )}
              </div>
              <StyledButton
                style={{ fontSize: 20, height: "75px" }}
                onClick={() => history.push("/categorias/add")}
              >
                Adicionar nova Categoria
              </StyledButton>
            </Box>
            <Box>
              <SubTitle1>Gastos por categoria no mês</SubTitle1>
              {gastosByMonth.length > 0 &&
              bancos.length > 0 &&
              categorias.length > 0 ? (
                (() => {
                  type PieChartData = {
                    id: number;
                    value: number;
                    label: string;
                  };

                  const groupedByCategoriaGastos: { [key: number]: number } =
                    gastosByMonth.reduce(
                      (
                        groupedByCategoriaGastos: { [key: string]: number },
                        item: any,
                      ) => {
                        if (
                          !groupedByCategoriaGastos.hasOwnProperty(
                            item.categoria.id,
                          )
                        ) {
                          groupedByCategoriaGastos[item.categoria.id] = 0;
                        }

                        groupedByCategoriaGastos[item.categoria.id] +=
                          item.valor;
                        return groupedByCategoriaGastos;
                      },
                      {},
                    );

                  const pieChartGroupedByCategoriaData: PieChartData[] =
                    Object.keys(groupedByCategoriaGastos).map(
                      (categoria: string) => ({
                        id: Number(categoria),
                        value: groupedByCategoriaGastos[Number(categoria)],
                        label: categoriasByNameId[Number(categoria)],
                      }),
                    );

                  return (
                    <>
                      <PieChart
                        title="Gastos por categoria"
                        series={[
                          {
                            arcLabel: (item) => `R$ ${item.value.toFixed(2)}`,
                            arcLabelMinAngle: 30,
                            data: pieChartGroupedByCategoriaData,
                            innerRadius: 40,
                            color: "#fff",
                            highlightScope: {
                              fade: "global",
                              highlight: "item",
                            },
                          },
                        ]}
                        width={500}
                        height={250}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#fff",
                          },
                        }}
                      />
                    </>
                  );
                })()
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <h3>Não houve gastos neste mês</h3>
                  </div>
                </>
              )}
            </Box>
          </>
        )}
      </Grid>
    </Container>
  );
}
