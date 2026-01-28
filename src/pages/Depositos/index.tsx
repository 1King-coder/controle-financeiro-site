import React from "react";
import {
  Title,
  TimeIntervalOptionsDiv,
  SubTitle1,
  DataGridBox,
  SubTitle2,
  StyledStaticDatePicker,
} from "./styled";
import axios from "../../services/axios";
import { Card, CardTitle, OptionBtn } from "../../styles/GlobalStyles";
import { dayOfTheWeek, months } from "../../config/dates";
import * as colors from "../../config/colors";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import {
  DatePicker,
  LocalizationProvider,
  MonthCalendar,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import WeekPicker from "../../components/WeekPicker";
import { WeekDayPopoverCard } from "../../components/WeekDayPopoverCard";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import { Deposito } from "../../types/Deposito";
import { useAuth } from "../../services/useAuth";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { fixDate } from "../../config/dates";
import ConfirmDialog from "../../components/ConfirmDialog";

class GetDepositosFunctions {
  static async getDepositos(id_user: Number): Promise<Deposito[]> {
    const response = await axios.get("/depositos/usuario/" + id_user);

    return await response.data;
  }

  static async getDepositosFilterByDateInterval(
    dateStart: Date,
    dateEnd: Date,
    id_user: Number,
  ): Promise<Deposito[]> {
    const filteredData = GetDepositosFunctions.getDepositos(id_user).then(
      (data: Deposito[]) => {
        const filteredData = data.filter((deposito: Deposito) => {
          const dateSplited = fixDate(deposito.data_de_competencia)
            .toLocaleDateString("pt-br", { timeZone: "America/Sao_Paulo" })
            .split("/");
          const dataDeposito = new Date(
            Number(dateSplited[2]),
            Number(dateSplited[1]) - 1,
            Number(dateSplited[0]),
          );

          if (dataDeposito >= dateStart && dataDeposito <= dateEnd) {
            return deposito;
          }
          return null;
        });

        return filteredData;
      },
    );

    return filteredData;
  }

  static async getDepositosFilterByMonthInterval(
    date: Date,
    id_user: Number,
  ): Promise<Deposito[]> {
    const filteredData = GetDepositosFunctions.getDepositos(id_user).then(
      (data: Deposito[]) => {
        const filteredData = data.filter((deposito: Deposito) => {
          const dateSplited = new Date(deposito.data_de_competencia)
            .toLocaleDateString("pt-br", { timeZone: "America/Sao_Paulo" })
            .split("/");
          const dataDeposito = new Date(
            Number(dateSplited[2]),
            Number(dateSplited[1]) - 1,
            Number(dateSplited[0]) + 1,
          );

          if (dataDeposito.getMonth() === date.getMonth()) {
            return deposito;
          }

          return null;
        });

        return filteredData;
      },
    );

    return filteredData;
  }

  static async getDepositosFilterByLastWeek(
    id_user: Number,
  ): Promise<Deposito[]> {
    const dateStart = new Date();
    const dateEnd = new Date();
    dateStart.setDate(dateStart.getDate() - 7);
    return await GetDepositosFunctions.getDepositosFilterByDateInterval(
      dateStart,
      dateEnd,
      id_user,
    );
  }
}

function getSemanaAtual(today: Date): Date[] {
  const dateStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay(),
  );
  const dateEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    dateStart.getDate() + 6,
  );
  return [dateStart, dateEnd];
}

export function Depositos(): JSX.Element {
  const [Depositos, setDepositos] = React.useState<Deposito[]>([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] =
    React.useState(2);
  const [depositosByActualWeekDay, setdepositosByActualWeekDay] =
    React.useState(Array<Deposito[]>([]));
  const [depositosByWeekDay, setdepositosByWeekDay] = React.useState(
    Array<Deposito[]>([]),
  );
  const [depositoToDelete, setDepositoToDelete]: [number | null, any] =
    React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog]: [boolean, any] =
    React.useState(false);
  const [isDeleting, setIsDeleting]: [boolean, any] = React.useState(false);
  const [bancos, setBancos]: [any, any] = React.useState([]);
  const [categorias, setCategorias]: [any, any] = React.useState([]);
  const [startWeekDayDate, setStartWeekDayDate]: [Dayjs, any] = React.useState(
    dayjs(),
  );
  const [selectedMonthDate, setSelectedMonthDate]: [Dayjs, any] =
    React.useState(dayjs());
  const [depositosByMonth, setdepositosByMonth]: [Deposito[], any] =
    React.useState([]);
  const [isLoding, setIsLoading]: [boolean, any] = React.useState(true);
  const { user } = useAuth();

  React.useEffect(() => {
    async function getBancos() {
      const bancosNameById: { [key: number]: string } = {};
      axios
        .get(`/bancos/usuario/${user!.id}?includeDeleted=true`)
        .then((response) => {
          const data: Banco[] = response.data;

          data.forEach((banco: Banco) => {
            bancosNameById[banco.id] = banco.nome;
          });
          setBancos(bancosNameById);
        });
    }

    async function getCategorias() {
      const categoriasNameById: { [key: number]: string } = {};
      axios
        .get(`/categorias/usuario/${user!.id}?includeDeleted=true`)
        .then((response) => {
          const data: Categoria[] = response.data;

          data.forEach((categoria: Categoria) => {
            categoriasNameById[categoria.id] = categoria.nome;
          });
          setCategorias(categoriasNameById);
        });
    }

    Promise.all([getBancos(), getCategorias()]).then((res) => {
      setIsLoading(false);
    });
  }, [user]);

  React.useEffect(() => {
    GetDepositosFunctions.getDepositosFilterByMonthInterval(
      selectedMonthDate.toDate(),
      user!.id,
    ).then((data: Deposito[]) => {
      setdepositosByMonth(data);
    });
  }, [selectedMonthDate, user]);

  React.useEffect(() => {
    const semanaSelecionada = getSemanaAtual(startWeekDayDate.toDate());

    GetDepositosFunctions.getDepositosFilterByDateInterval(
      semanaSelecionada[0],
      semanaSelecionada[1],
      user!.id,
    ).then((data: Deposito[]) => {
      setDepositos(data);
      const listdepositosByWeekDay: Array<Deposito[]> = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ];
      data.forEach((deposito: Deposito) => {
        const dateSplited = fixDate(deposito.data_de_competencia)
          .toLocaleDateString("pt-br", { timeZone: "America/Sao_Paulo" })
          .split("/");
        const dataDeposito = new Date(
          Number(dateSplited[2]),
          Number(dateSplited[1]) - 1,
          Number(dateSplited[0]),
        );

        listdepositosByWeekDay[dataDeposito.getDay()].push(deposito);
      });
      setdepositosByWeekDay(listdepositosByWeekDay);
    });
  }, [startWeekDayDate, user]);

  React.useEffect(() => {
    const semanaAtual = getSemanaAtual(new Date());

    GetDepositosFunctions.getDepositosFilterByDateInterval(
      semanaAtual[0],
      semanaAtual[1],
      user!.id,
    ).then((data: Deposito[]) => {
      setDepositos(data);
      const listdepositosByActualWeekDay: Array<Deposito[]> = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ];
      data.forEach((deposito: Deposito) => {
        const dateSplited = fixDate(deposito.data_de_competencia)
          .toLocaleDateString("pt-br", { timeZone: "America/Sao_Paulo" })
          .split("/");
        const dataDeposito = new Date(
          Number(dateSplited[2]),
          Number(dateSplited[1]) - 1,
          Number(dateSplited[0]),
        );

        listdepositosByActualWeekDay[dataDeposito.getDay()].push(deposito);
      });
      setdepositosByActualWeekDay(listdepositosByActualWeekDay);
    });
  }, [user]);

  const handleDeleteDeposito = async () => {
    setIsDeleting(true);
    const res = await axios.delete(`depositos/${depositoToDelete}/`);
    if (res.status === 200) {
      toast.success("Depósito deletado com sucesso");
      setShowConfirmDialog(false);
      setIsDeleting(false);
      window.location.reload();
    } else {
      toast.error("Erro ao deletar depósito");
      setIsDeleting(false);
    }
  };

  return isLoding ? (
    <div>Loading</div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        height: "fit-content",
        justifyContent: "center",
        margin: "0 auto",
        backgroundColor: "white",
      }}
    >
      <Title>Depósitos</Title>
      <TimeIntervalOptionsDiv>
        <OptionBtn
          id={1}
          key={1}
          selected={1 === optionSelectedId}
          onClick={() => setOptionSelectedId(1)}
        >
          Semanal
        </OptionBtn>
        <OptionBtn
          id={2}
          key={2}
          selected={2 === optionSelectedId}
          onClick={() => setOptionSelectedId(2)}
        >
          Mensal
        </OptionBtn>
        <OptionBtn
          id={3}
          key={3}
          selected={3 === optionSelectedId}
          onClick={() => setOptionSelectedId(3)}
        >
          Anual
        </OptionBtn>
      </TimeIntervalOptionsDiv>

      <div>
        {optionSelectedId === 1 ? (
          <div style={{ marginTop: "2rem" }}>
            <SubTitle1>
              Semana Atual:{" "}
              {getSemanaAtual(new Date())[0].toLocaleDateString("pt-br", {
                timeZone: "America/Sao_Paulo",
              })}{" "}
              -{" "}
              {getSemanaAtual(new Date())[1].toLocaleDateString("pt-br", {
                timeZone: "America/Sao_Paulo",
              })}{" "}
            </SubTitle1>
            <div
              style={{
                display: "flow",
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
            >
              {depositosByActualWeekDay.map(
                (depositosInWeekDay: Deposito[], index: number) => {
                  return (
                    <WeekDayPopoverCard
                      itemUrlPath="depositos"
                      key={index}
                      bancos={bancos}
                      categorias={categorias}
                      itemInWeekDay={depositosInWeekDay}
                      index={index}
                    />
                  );
                },
              )}
            </div>
            <SubTitle1>
              Semana Selecionada:{" "}
              {getSemanaAtual(startWeekDayDate.toDate())[0].toLocaleDateString(
                "pt-br",
                { timeZone: "America/Sao_Paulo" },
              )}{" "}
              -{" "}
              {getSemanaAtual(startWeekDayDate.toDate())[1].toLocaleDateString(
                "pt-br",
                { timeZone: "America/Sao_Paulo" },
              )}{" "}
            </SubTitle1>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <div style={{ marginRight: "2rem" }}>
                <WeekPicker
                  value={startWeekDayDate}
                  onChange={(newValue: any) => setStartWeekDayDate(newValue)}
                />
              </div>
            </div>
            <div
              style={{
                display: "flow",
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
            >
              {depositosByWeekDay.map(
                (depositosInWeekDay: Deposito[], index: number) => {
                  return (
                    <WeekDayPopoverCard
                      itemUrlPath="depositos"
                      key={index}
                      bancos={bancos}
                      categorias={categorias}
                      itemInWeekDay={depositosInWeekDay}
                      index={index}
                    />
                  );
                },
              )}
            </div>
          </div>
        ) : optionSelectedId === 2 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <SubTitle1>
              Você selecionou o mês de{" "}
              {months[selectedMonthDate.toDate().getMonth()]} de{" "}
              {new Date().getFullYear()}
            </SubTitle1>
            <div style={{ margin: "auto" }}>
              <SubTitle2>Selecione o mês e o ano</SubTitle2>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StyledStaticDatePicker
                  value={selectedMonthDate}
                  onChange={(newValue: any) => setSelectedMonthDate(newValue)}
                  views={["year", "month"]}
                  disableFuture={true}
                  slotProps={{
                    actionBar: {
                      actions: [],
                    },
                    toolbar: {
                      hidden: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            {(() => {
              const rows = depositosByMonth.map((deposito: Deposito) => {
                return {
                  id: deposito.id,
                  banco: bancos[deposito.banco.id],
                  categoria: categorias[deposito.categoria.id],
                  descricao: deposito.descricao,
                  valor: deposito.valor,
                  data_de_competencia: fixDate(
                    deposito.data_de_competencia,
                  ).toLocaleDateString("pt-br", {
                    timeZone: "America/Sao_Paulo",
                  }),
                  opcoes: (
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <Link
                        to={`depositos/edit/${deposito.id}/`}
                        style={{
                          pointerEvents: deposito.ativo ? "auto" : "none",
                          opacity: deposito.ativo ? 1 : 0.5,
                          cursor: deposito.ativo ? "pointer" : "not-allowed",
                        }}
                      >
                        <FaEdit size={24} color={colors.secondaryColor} />
                      </Link>
                      <span
                        onClick={() => {
                          setDepositoToDelete(deposito.id);
                          setShowConfirmDialog(true);
                        }}
                        style={{
                          pointerEvents: deposito.ativo ? "auto" : "none",
                          opacity: deposito.ativo ? 1 : 0.5,
                          cursor: deposito.ativo ? "pointer" : "not-allowed",
                        }}
                      >
                        <MdDelete size={24} color={colors.dangerColor} />
                      </span>
                    </div>
                  ),
                };
              });

              const columns: GridColDef[] = [
                {
                  field: "id",
                  headerName: "ID",
                  width: 70,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                },
                {
                  field: "banco",
                  headerName: "Banco",
                  width: 150,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                },
                {
                  field: "categoria",
                  headerName: "Categoria",
                  width: 150,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                },
                {
                  field: "descricao",
                  headerName: "Descrição",
                  width: 150,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                },
                {
                  field: "valor",
                  headerName: "Valor",
                  width: 150,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                  type: "number",
                  valueFormatter: (value: number) => `R$ ${value.toFixed(2)}`,
                },
                {
                  field: "data_de_competencia",
                  headerName: "Data",
                  width: 150,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                },
                {
                  field: "opcoes",
                  headerName: "Opções",
                  width: 130,
                  headerClassName: "datagrid-headers",
                  headerAlign: "center",
                  renderCell: (params) => params.value,
                },
              ];
              type PieChartData = {
                id: number;
                value: number;
                label: string;
              };

              const groupedByCategoriaDepositos: { [key: number]: number } =
                depositosByMonth.reduce(
                  (
                    groupedByCategoriaDepositos: { [key: string]: number },
                    item: any,
                  ) => {
                    if (
                      !groupedByCategoriaDepositos.hasOwnProperty(
                        item.categoria.id,
                      )
                    ) {
                      groupedByCategoriaDepositos[item.categoria.id] = 0;
                    }

                    groupedByCategoriaDepositos[item.categoria.id] +=
                      item.valor;
                    return groupedByCategoriaDepositos;
                  },
                  {},
                );

              const groupedByBancoDepositos: { [key: number]: number } =
                depositosByMonth.reduce(
                  (
                    groupedByBancoDepositos: { [key: string]: number },
                    item: any,
                  ) => {
                    if (
                      !groupedByBancoDepositos.hasOwnProperty(item.banco.id)
                    ) {
                      groupedByBancoDepositos[item.banco.id] = 0;
                    }

                    groupedByBancoDepositos[item.banco.id] += item.valor;
                    return groupedByBancoDepositos;
                  },
                  {},
                );

              const pieChartGroupedByCategoriaData: PieChartData[] =
                Object.keys(groupedByCategoriaDepositos).map(
                  (categoria: string) => ({
                    id: Number(categoria),
                    value: groupedByCategoriaDepositos[Number(categoria)],
                    label: categorias[Number(categoria)],
                  }),
                );

              const pieChartGroupedByBancoData: PieChartData[] = Object.keys(
                groupedByBancoDepositos,
              ).map((Bancos: string) => ({
                id: Number(Bancos),
                value: groupedByBancoDepositos[Number(Bancos)],
                label: bancos[Number(Bancos)],
              }));

              const totalDepositos = depositosByMonth.reduce(
                (total, item) => total + item.valor,
                0,
              );

              return (
                <>
                  <DataGridBox>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      sx={{
                        boxShadow: 4,
                        border: 2,
                        borderColor: colors.primaryColor,
                        "& .MuiDataGrid-cell:hover": {
                          color: "primary.main",
                        },
                        width: "100%",
                        height: "20rem",
                        position: "relative",
                        margin: "10px auto",
                        backgroundColor: colors.tertiaryColor,
                        fontSize: 16,
                      }}
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    />
                  </DataGridBox>
                  <Card>
                    <CardTitle>
                      Total de Depósitos do mês de{" "}
                      {months[selectedMonthDate.toDate().getMonth()]}
                    </CardTitle>
                    <p
                      style={{
                        color: "black",
                        fontSize: "3rem",
                        fontWeight: "bold",
                        marginTop: "10px auto",
                        textAlign: "center",
                      }}
                    >
                      R$ {totalDepositos.toFixed(2)}
                    </p>
                  </Card>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "10px auto",
                    }}
                  >
                    <PieChart
                      title="Depósitos por categoria"
                      series={[
                        {
                          arcLabel: (item) => `R$ ${item.value.toFixed(2)}`,
                          arcLabelMinAngle: 30,
                          data: pieChartGroupedByCategoriaData,
                          innerRadius: 90,
                          color: "#fff",
                          highlightScope: { fade: "global", highlight: "item" },
                        },
                      ]}
                      width={800}
                      height={500}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#fff",
                        },
                      }}
                    />

                    <PieChart
                      title="Depósitos por banco"
                      series={[
                        {
                          arcLabel: (item) => `R$ ${item.value.toFixed(2)}`,
                          data: pieChartGroupedByBancoData,
                          innerRadius: 90,
                          color: "#fff",
                          highlightScope: { fade: "global", highlight: "item" },
                          arcLabelMinAngle: 30,
                        },
                      ]}
                      width={800}
                      height={500}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#fff",
                        },
                      }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        ) : null}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Confirmação de exclusão"
          message="Tem certeza que deseja excluir este depósito? Esta ação não pode ser desfeita."
          onConfirm={() => handleDeleteDeposito()}
          onCancel={() => setShowConfirmDialog(false)}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
