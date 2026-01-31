import React from "react";
import {
  Box,
  Title,
  Grid,
  ScrollableDivBtns,
  Btn,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  FeaturesGrid,
  FeatureCard,
  CTAButtonsContainer,
  PrimaryButton,
  SecondaryButton,
  UnauthorizedGrid,
  DataSection,
  DataCard,
  CardHeader,
  CardTitle,
  ItemsList,
  ListItem,
  EmptyMessage,
  ActionButton,
  ChartContainer,
  ChartHeader,
  ToggleButton,
  ChartContent,
  TotalDisplay,
  ButtonsRow,
  AuthenticatedGrid,
} from "./styled";
import {
  OptionBtn,
  ScrollableDiv,
  ScrollableDivY,
  StyledButton,
  StyledButtonGroup,
} from "../../styles/GlobalStyles";

import { Container, Card } from "./styled";

import { useAuth } from "../../services/useAuth";
import { primaryColor, secondaryColor } from "../../config/colors";
import { Link } from "react-router-dom";
import axios from "../../services/axios";
import { SubTitle1 } from "../GastosGerais/styled";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import history from "../../services/history";
import { FaMoneyBillTransfer, FaCirclePlay, FaChartPie } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { BiTransfer, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import { GastoGeral } from "../../types/GastoGeral";
import { GrDirections } from "react-icons/gr";
import { BsBank2 } from "react-icons/bs";
import { GiPieChart } from "react-icons/gi";
import { IoIosCalculator } from "react-icons/io";

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
  const [chartOpen, setChartOpen]: [boolean, any] = React.useState(false);

  function handleMonthlyCheckout() {
    if (user && user.isAuthenticated && !user.hasSubscription) {
      axios
        .post("/usuarios/generate-monthly-checkout-session", {
          userId: user?.id,
          email: user?.email,
        })
        .then((res: { data: { url: string } }) => {
          window.open(res.data.url);
        });
    }
  }

  function handleAnnualCheckout() {
    if (user && user.isAuthenticated && !user.hasSubscription) {
      axios
        .post("/usuarios/generate-annual-checkout-session", {
          userId: user?.id,
          email: user?.email,
        })
        .then((res: { data: { url: string } }) => {
          window.open(res.data.url);
        });
    }
  }

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

    if (user?.isAuthenticated) {
      Promise.all([getBancos(), getCategorias()]).then((res) => {});
    }
  }, [user]);

  return (
    <Container>
      <Title>Home</Title>
      <Grid>
        {!user?.isAuthenticated ? (
          <UnauthorizedGrid>
            <HeroSection>
              <HeroTitle>Controle Financeiro</HeroTitle>
              <HeroSubtitle>
                Gerencie seu dinheiro com facilidade.
                <br />
                Saiba onde seu dinheiro está e visualize seus extratos de forma
                detalhada e tome decisões financeiras melhores.
              </HeroSubtitle>
            </HeroSection>

            <FeaturesGrid>
              <FeatureCard>
                <FaMoneyBillTransfer size={40} />
                <h3>Controle Total</h3>
                <p>Acompanhe todos os seus gastos e receitas em um só lugar</p>
              </FeatureCard>
              <FeatureCard>
                <GiPieChart size={40} />
                <h3>Relatórios Visuais</h3>
                <p>
                  Veja gráficos e análises detalhadas dos seus gastos por
                  categoria
                </p>
              </FeatureCard>
              <FeatureCard>
                <GiMoneyStack size={40} />
                <h3>Categorias Personalizadas</h3>
                <p>Organize seus gastos da forma que faz sentido para você</p>
              </FeatureCard>
              <FeatureCard>
                <IoIosCalculator size={40} />
                <h3>Calculadora</h3>
                <p>Planeje suas finanças com facilidade e precisão</p>
                <br /> (Apenas assinantes)
              </FeatureCard>
            </FeaturesGrid>

            <CTAButtonsContainer>
              <Link to="/cadastro">
                <PrimaryButton>Começar Agora</PrimaryButton>
              </Link>
              <Link to="/login">
                <SecondaryButton>Já tem conta? Entrar</SecondaryButton>
              </Link>
            </CTAButtonsContainer>
          </UnauthorizedGrid>
        ) : (
          <AuthenticatedGrid>
            <ButtonsRow>
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
              <Btn
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/playlist?list=PLR5jS4ueIBrkjYIxGmH6kH5BJVj4WDkoV",
                  )
                }
              >
                <span>Tutorial</span>
                <FaCirclePlay
                  size={18}
                  color={secondaryColor}
                  style={{ margin: "0 0 0 10px" }}
                />
              </Btn>
            </ButtonsRow>

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
                  <Btn onClick={() => handleMonthlyCheckout()}>
                    <span style={{ fontSize: "2rem", color: secondaryColor }}>
                      Plano Mensal
                    </span>
                  </Btn>
                  <Btn onClick={() => handleAnnualCheckout()}>
                    <span style={{ fontSize: "2rem", color: secondaryColor }}>
                      Plano Anual
                    </span>
                  </Btn>
                </div>
              </Box>
            ) : null}

            <DataSection>
              <DataCard>
                <CardHeader>
                  <CardTitle>Bancos</CardTitle>
                </CardHeader>
                {bancos.length > 0 ? (
                  <>
                    <ItemsList>
                      {bancos
                        .sort((a: Banco, b: Banco) =>
                          a.saldo < b.saldo ? 1 : -1,
                        )
                        .map((banco: Banco) => (
                          <ListItem key={banco.id}>
                            <span>{banco.nome}</span>
                            <span>R$ {banco.saldo.toFixed(2)}</span>
                          </ListItem>
                        ))}
                    </ItemsList>
                    <ActionButton onClick={() => history.push("/bancos/add")}>
                      <BsBank2 size={16} />
                      Novo Banco
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <EmptyMessage>Nenhum banco cadastrado</EmptyMessage>
                    <ActionButton onClick={() => history.push("/bancos/add")}>
                      <BsBank2 size={16} />
                      Adicionar Banco
                    </ActionButton>
                  </>
                )}
              </DataCard>

              <DataCard>
                <CardHeader>
                  <CardTitle>Categorias</CardTitle>
                </CardHeader>
                {categorias.length > 0 ? (
                  <>
                    <ItemsList>
                      {categorias
                        .sort((a: Categoria, b: Categoria) =>
                          a.saldo < b.saldo ? 1 : -1,
                        )
                        .map((categoria: Categoria) => (
                          <ListItem key={categoria.id}>
                            <span>{categoria.nome}</span>
                            <span>R$ {categoria.saldo.toFixed(2)}</span>
                          </ListItem>
                        ))}
                    </ItemsList>
                    <ActionButton
                      onClick={() => history.push("/categorias/add")}
                    >
                      <GrDirections size={16} />
                      Nova Categoria
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <EmptyMessage>Nenhuma categoria cadastrada</EmptyMessage>
                    <ActionButton
                      onClick={() => history.push("/categorias/add")}
                    >
                      <GrDirections size={16} />
                      Adicionar Categoria
                    </ActionButton>
                  </>
                )}
              </DataCard>
            </DataSection>

            <ChartContainer>
              <ChartHeader>
                <h3>Gastos por Categoria - Este Mês</h3>
                <ToggleButton
                  onClick={() => setChartOpen(!chartOpen)}
                  title={chartOpen ? "Fechar gráfico" : "Abrir gráfico"}
                >
                  {chartOpen ? (
                    <BiChevronUp size={20} />
                  ) : (
                    <BiChevronDown size={20} />
                  )}
                </ToggleButton>
              </ChartHeader>
              <ChartContent isOpen={chartOpen}>
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

                    const totalGastosMes = gastosByMonth.reduce(
                      (acc, curr) => acc + curr.valor,
                      0,
                    );

                    return (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            overflowX: "auto",
                          }}
                        >
                          <PieChart
                            title="Gastos por categoria"
                            series={[
                              {
                                arcLabel: (item) =>
                                  `R$ ${item.value.toFixed(2)}`,
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
                        </div>
                        <TotalDisplay>
                          <strong>Total: R$ {totalGastosMes.toFixed(2)}</strong>
                        </TotalDisplay>
                      </>
                    );
                  })()
                ) : (
                  <EmptyMessage>Não houve gastos neste mês</EmptyMessage>
                )}
              </ChartContent>
            </ChartContainer>
          </AuthenticatedGrid>
        )}
      </Grid>
    </Container>
  );
}
