import React from "react";
import { ActionButton, Title } from "./styled";
import axios from "../../services/axios";
import { Banco, BancoPorCategoriaPieChartProps, SaldoBancoPorCategoria } from "../../types/Banco";
import { Card, CardTitle, Container, FullLineCard, FullLineCardTitle, OptionBtn, ScrollableDiv } from "../../styles/GlobalStyles";
import {Chart} from "react-google-charts";
import { backgroundColor, secondaryColor, tertiaryColor } from "../../config/colors";
import { title } from "process";
import { table } from "console";
import { useAuth } from "../../services/useAuth";
import { toast } from "react-toastify";

class GetBancosDataFuncions {

  static async getSaldosBancosPorCategoria(id_banco: number): Promise<SaldoBancoPorCategoria[]>{
    const response = await axios.get("/saldos-por-categoria/banco/" + id_banco);
    
    return response.data;
  }
  

  static async getBancos(id_user: number): Promise<Banco[]>{
    const response = await axios.get(`/bancos/usuario/${id_user}`);
    
    return response.data;
  }
}


export default function Bancos(): JSX.Element {
  
  const [dadosSaldoBancoPorCategoria, setDadosSaldoBancoPorCategoria] = React.useState([["Categoria", "saldo"]]);
  const [nomeBancoSelected, setNomeBancoSelected] = React.useState("");
  const { user } = useAuth();

  const [bancos, setBancos]: [Banco[], any] = React.useState([]);
  
  const [optionSelectedId, setOptionSelectedId]: [number, any] = React.useState(0);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [bancoToDelete, setBancoToDelete] = React.useState<number | null>(null);

  React.useEffect(() => {
    GetBancosDataFuncions.getBancos(user!.id).then((data: Banco[]) => {
      setBancos(data);
      if (data.length > 0) {
        setOptionSelectedId(data[0].id);
      }
    });
  }, []);

  React.useEffect(() => {
    if (optionSelectedId !== 0) {
      GetBancosDataFuncions.getBancos(user!.id).then((data: Banco[]) => {
        setBancos(data);
        GetBancosDataFuncions.getSaldosBancosPorCategoria(optionSelectedId).then((data: SaldoBancoPorCategoria[]) => {
          if (data.length === 0) {
            toast.warning("Este Banco não possui saldo em nenhuma categoria.")
            setDadosSaldoBancoPorCategoria([["Categoria", "Saldo"], ["", ""]])
            return
          }
          const dados = [["Categoria", "Saldo"]];
          setNomeBancoSelected(data[0].banco.nome);
          data.forEach((saldoBancoPorCategoria: SaldoBancoPorCategoria) => {
            // @ts-ignore
            dados.push([saldoBancoPorCategoria.categoria.nome, Math.abs(saldoBancoPorCategoria.saldo)]);
          })
          setDadosSaldoBancoPorCategoria(dados);
        })
      })
    }
    
  }, [optionSelectedId]);

  

  
  const pieChartOptions = {
    title: `Saldo por categoria ${nomeBancoSelected}`,
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

  function handleDeleteBanco(id_banco: number) {
    setBancoToDelete(id_banco);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (bancoToDelete) {
      axios.delete(`/bancos/${bancoToDelete}`).then(() => {
        const updatedBancos = bancos.filter((banco: Banco) => banco.id !== bancoToDelete);
        setBancos(updatedBancos);
        toast.success("Banco deletado com sucesso.");
        setShowDeleteModal(false);
        setBancoToDelete(null);
      }).catch((error) => {
        toast.error("Erro ao deletar banco: " + error.response?.data?.message || error.message);
      });
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setBancoToDelete(null);
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "white",
    }}>
      <Title>Visão Geral de Bancos</Title>
      <div style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "20px"}}>
        
        <ScrollableDiv>
          {
            bancos.map((banco: Banco) => {
              return (
                  <OptionBtn id={banco.id} key={banco.id} selected={banco.id === optionSelectedId} onClick={() => setOptionSelectedId(banco.id)}>
                  {banco.nome}
                  </OptionBtn>
              )
            })
          }
        </ScrollableDiv>
        
        <Card >
          <CardTitle>{"Saldo Total do Banco " + nomeBancoSelected}</CardTitle>
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
          >{`R$ ${bancos.reduce((acc, banco) => {
            if (banco.id === optionSelectedId) {
              return acc + Math.abs(banco.saldo)
              
            }
            return acc;
          }, 0).toFixed(2)}`}</p>
          <ActionButton onClick={() => handleDeleteBanco(optionSelectedId)}>
            <span>Deletar Banco</span>
          </ActionButton>
        </Card>
        

      </div>
      
        <div style={{            
            display: "flex", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginTop: "0.5rem",
            marginLeft: "6rem",
            marginRight: "1rem" 
        }}>
          <Chart
          chartType="PieChart"
          width="100%"
          height="100%"
          data={dadosSaldoBancoPorCategoria}
          options={pieChartOptions}
          />
          <Chart
          chartType="Table"
          width="100%"
          height="100%"
          data={dadosSaldoBancoPorCategoria}
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
        >{`R$ ${bancos.reduce((acc, banco) => {
          return acc + Math.abs(banco.saldo)
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
              Tem certeza que deseja excluir este banco? Esta ação não pode ser desfeita.
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