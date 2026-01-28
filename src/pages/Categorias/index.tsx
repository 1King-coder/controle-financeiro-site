import React from "react";
import { ActionButton, Title } from "./styled";
import axios from "../../services/axios";
import { Categoria, SaldoCategoriaPorBanco } from "../../types/Categoria";
import {
  Card,
  CardTitle,
  Container,
  FullLineCard,
  FullLineCardTitle,
  OptionBtn,
  ScrollableDiv,
} from "../../styles/GlobalStyles";
import { Chart } from "react-google-charts";
import { useAuth } from "../../services/useAuth";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";

class GetCategoriasDataFuncions {
  static async getSaldosCategoriasPorBanco(
    id_categoria: number,
  ): Promise<SaldoCategoriaPorBanco[]> {
    const response = await axios.get(
      `saldos-por-categoria/categoria/${id_categoria}`,
    );

    return response.data;
  }

  static async getCategorias(id_user: Number): Promise<Categoria[]> {
    const response = await axios.get("/categorias/usuario/" + id_user);

    return response.data;
  }
}

export default function Categorias(): JSX.Element {
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] =
    React.useState(0);
  const [dadosSaldoCategoriaPorBanco, setDadosSaldoCategoriaPorBanco] =
    React.useState([["Banco", "saldo"]]);
  const [NomeCategoriaSelected, setNomeCategoriaSelected] = React.useState("");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = React.useState<
    number | null
  >(null);
  const { user } = useAuth();

  React.useEffect(() => {
    GetCategoriasDataFuncions.getCategorias(user!.id).then(
      (data: Categoria[]) => {
        setCategorias(data);
        if (data.length > 0) {
          setOptionSelectedId(data[0].id);
        }
      },
    );
  }, []);

  React.useEffect(() => {
    if (optionSelectedId !== 0) {
      GetCategoriasDataFuncions.getCategorias(user!.id).then(
        (data: Categoria[]) => {
          setCategorias(data);
          GetCategoriasDataFuncions.getSaldosCategoriasPorBanco(
            optionSelectedId,
          ).then((data: SaldoCategoriaPorBanco[]) => {
            const dados = [["Banco", "Saldo"]];
            if (data.length === 0) {
              toast.warning("Esta Categoria não possui saldo em nenhum banco.");
              setDadosSaldoCategoriaPorBanco([
                ["Banco", "Saldo"],
                ["", ""],
              ]);
              return;
            }
            setNomeCategoriaSelected(data[0].categoria.nome);
            data.forEach((saldoCategoriaPorBanco: SaldoCategoriaPorBanco) => {
              if (!saldoCategoriaPorBanco.banco) return;
              // @ts-ignore
              dados.push([
                saldoCategoriaPorBanco.banco.nome,
                // @ts-ignore
                Math.abs(saldoCategoriaPorBanco.saldo),
              ]);
            });
            setDadosSaldoCategoriaPorBanco(dados);
          });
        },
      );
    }
  }, [optionSelectedId]);

  function handleDeleteCategoria(id_categoria: number) {
    setCategoriaToDelete(id_categoria);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (categoriaToDelete) {
      axios
        .delete(`/categorias/${categoriaToDelete}`)
        .then(() => {
          const updatedCategorias = categorias.filter(
            (categoria: Categoria) => categoria.id !== categoriaToDelete,
          );
          setCategorias(updatedCategorias);
          toast.success("Categoria deletada com sucesso.");
          setShowDeleteModal(false);
          setCategoriaToDelete(null);
          window.location.reload();
        })
        .catch((error) => {
          toast.error(
            "Erro ao deletar categoria: " +
              (error.response?.data?.message || error.message),
          );
        });
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setCategoriaToDelete(null);
  }

  const pieChartOptions = {
    title: `Saldo por Banco ${NomeCategoriaSelected}`,
    titleTextStyle: {
      color: "black",
      position: "center",
      fontSize: 20,
    },
    pieHole: 0.4,
    is3D: true,
  };

  const tableChartFormatters = [
    {
      type: "NumberFormat" as const,
      column: 1,
      options: {
        prefix: "R$ ",
      },
    },
  ];

  const tableChartOptions = {
    cssClassNames: {
      headerRow: "saldo-por-categoria-table-header",
      tableRow: "saldo-por-categoria-table-row",
      oddTableRow: "saldo-por-categoria-table-row",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <Title>Visão Geral de Categorias</Title>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <ScrollableDiv>
          {categorias.map((categoria: Categoria) => {
            return (
              <OptionBtn
                id={categoria.id}
                key={categoria.id}
                selected={categoria.id === optionSelectedId}
                onClick={() => setOptionSelectedId(categoria.id)}
              >
                {categoria.nome}
              </OptionBtn>
            );
          })}
        </ScrollableDiv>
        <Card>
          <CardTitle>
            {"Saldo Total da Categoria " + NomeCategoriaSelected}
          </CardTitle>
          <p
            style={{
              color: "black",
              fontSize: "25px",
              fontWeight: "bold",
              marginTop: "10px",
              textAlign: "center",
            }}
          >{`R$ ${categorias
            .reduce((acc, categoria) => {
              if (categoria.id === optionSelectedId) {
                return acc + Math.abs(categoria.saldo);
              }
              return acc;
            }, 0)
            .toFixed(2)}`}</p>
          <ActionButton onClick={() => handleDeleteCategoria(optionSelectedId)}>
            <span>Deletar Categoria</span>
          </ActionButton>
        </Card>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
          marginLeft: "6rem",
          marginRight: "1rem",
        }}
      >
        <Chart
          chartType="PieChart"
          width="100%"
          height="100%"
          data={dadosSaldoCategoriaPorBanco}
          options={pieChartOptions}
        />
        <Chart
          chartType="Table"
          width="100%"
          height="100%"
          data={dadosSaldoCategoriaPorBanco}
          options={tableChartOptions}
          formatters={tableChartFormatters}
        />
      </div>

      <FullLineCard>
        <FullLineCardTitle>Saldo Total</FullLineCardTitle>
        <p
          style={{
            color: "black",
            fontSize: "40px",
            fontWeight: "bold",
            marginTop: "40px",
            textAlign: "center",
          }}
        >{`R$ ${categorias
          .reduce((acc, categoria) => {
            return acc + Math.abs(categoria.saldo);
          }, 0)
          .toFixed(2)}`}</p>
      </FullLineCard>

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
