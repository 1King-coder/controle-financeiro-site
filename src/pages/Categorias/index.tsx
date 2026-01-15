import React from "react";
import { ActionButton, Title } from "./styled";
import axios from "../../services/axios";
import { Categoria, SaldoCategoriaPorBanco } from "../../types/Categoria";
import { Card, CardTitle, Container, FullLineCard, FullLineCardTitle, OptionBtn, ScrollableDiv } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";
import { useAuth } from "../../services/useAuth";
import {toast} from "react-toastify"


class GetCategoriasDataFuncions {

  static async getSaldosCategoriasPorBanco(id_categoria: number): Promise<SaldoCategoriaPorBanco[]>{
    const response = await axios.get("saldos-por-categoria/categoria/" + id_categoria);
    
    return response.data;
  }
  

  static async getCategorias(id_user: Number): Promise<Categoria[]>{
    const response = await axios.get("/categorias/usuario/" + id_user);
    
    return response.data;
  }
}


export default function Categorias(): JSX.Element {
  const [categorias, setCategorias]: [Categoria[], any] = React.useState([]);
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(0);
  const [dadosSaldoCategoriaPorBanco, setDadosSaldoCategoriaPorBanco] = React.useState([["Banco", "saldo"]]);
  const [NomeCategoriaSelected, setNomeCategoriaSelected] = React.useState("");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = React.useState<number | null>(null);
  const {user} = useAuth()

  React.useEffect(() => {
    GetCategoriasDataFuncions.getCategorias(user!.id).then((data: Categoria[]) => {
      setCategorias(data)
      if (data.length > 0) {
        setOptionSelectedId(data[0].id)
      }
    })
  }, [])

  React.useEffect(() => {
    if (optionSelectedId !== 0) {
      GetCategoriasDataFuncions.getCategorias(user!.id).then((data: Categoria[]) => {
        setCategorias(data);
        GetCategoriasDataFuncions.getSaldosCategoriasPorBanco(optionSelectedId).then((data: SaldoCategoriaPorBanco[]) => {
          const dados = [["Categoria", "Saldo"]];
          if (data.length === 0) {
            toast.warning("Este Banco não possui saldo em nenhuma categoria.");
            setDadosSaldoCategoriaPorBanco([["Banco", "Saldo"], ["", ""]]);
            return
          }
          setNomeCategoriaSelected(data[0].categoria.nome);
          data.forEach((saldoCategoriaPorBanco: SaldoCategoriaPorBanco) => {
            // @ts-ignore
            dados.push([saldoCategoriaPorBanco.banco.nome, Math.abs(saldoCategoriaPorBanco.saldo)]);
          })
          setDadosSaldoCategoriaPorBanco(dados);
        })
      })
    }
    
  }, [optionSelectedId]);

  function handleDeleteCategoria(id_categoria: number) {
    setCategoriaToDelete(id_categoria);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (categoriaToDelete) {
      axios.delete(`/categorias/${categoriaToDelete}`).then(() => {
        const updatedCategorias = categorias.filter((categoria: Categoria) => categoria.id !== categoriaToDelete);
        setCategorias(updatedCategorias);
        toast.success("Categoria deletada com sucesso.");
        setShowDeleteModal(false);
        setCategoriaToDelete(null);
      }).catch((error) => {
        toast.error("Erro ao deletar categoria: " + (error.response?.data?.message || error.message));
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

  }

  const tableChartFormatters = [
    {
      type: "NumberFormat" as const,
      column: 1,
      options: {
        prefix: "R$ ",
      }
    },
    
  ]

  const tableChartOptions = {
    cssClassNames: {
      headerRow: "saldo-por-categoria-table-header",
      tableRow: "saldo-por-categoria-table-row",
      oddTableRow: "saldo-por-categoria-table-row",
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "white",
    }}>
      <Title>Visão Geral de Categorias</Title>
      <div style={
        {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center", 
          marginBottom: "10px"
        }
      }>

        <ScrollableDiv>
          {
            categorias.map((categoria: Categoria) => {
              return (
                  <OptionBtn id={categoria.id} key={categoria.id} selected={categoria.id === optionSelectedId} onClick={() => setOptionSelectedId(categoria.id)}>
                  {categoria.nome}
                  </OptionBtn>
              )
            })
          }
        </ScrollableDiv>
        <Card>
          <CardTitle>{"Saldo Total da Categoria " + NomeCategoriaSelected}</CardTitle>
          <p
            style= {
              {
                color: "black",
                fontSize: "25px",
                fontWeight: "bold",
                marginTop: "10px",
                textAlign: "center"
              }
            }
          >{`R$ ${categorias.reduce((acc, categoria) => {
            if (categoria.id === optionSelectedId) {
              return acc + Math.abs(categoria.saldo)
              
            }
            return acc;
          }, 0).toFixed(2)}`}</p>
          <ActionButton onClick={() => handleDeleteCategoria(optionSelectedId)}>
            <span>Deletar Categoria</span>
          </ActionButton>
        </Card>

      </div>
        <div style={
          {
            display: "flex", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginTop: "0.5rem",
            marginLeft: "6rem",
            marginRight: "1rem" 
          }
        }>
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
          style= {
            {
              color: "black",
              fontSize: "40px",
              fontWeight: "bold",
              marginTop: "40px",
              textAlign: "center"
            }
          }
        >{`R$ ${categorias.reduce((acc, categoria) => {
          return acc + Math.abs(categoria.saldo)
        }, 0).toFixed(2)}`}</p>
      </FullLineCard>

      {showDeleteModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px"
          }}>
            <h2 style={{ marginBottom: "20px", color: "black" }}>Confirmar Exclusão</h2>
            <p style={{ marginBottom: "30px", color: "black" }}>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button 
                onClick={cancelDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#dc3545",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      

      



      
      
      
    </div>
  );
}