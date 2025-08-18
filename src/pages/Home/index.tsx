import React from "react";
import { Box, Title, Grid } from "./styled";
import { Container, StyledButton } from "../../styles/GlobalStyles";
import { useAuth } from "../../services/useAuth";
import { primaryColor, secondaryColor } from "../../config/colors";
import { Link } from "react-router-dom";
import axios from "../../services/axios";
import { SubTitle1 } from "../GastosGerais/styled";
import { Banco } from "../../types/Banco";
import { Categoria } from "../../types/Categoria";
import history from "../../services/history";
export default function Home(): JSX.Element {
  const [bancos, setBancos] = React.useState<any[]>([]);
  const [categorias, setCategorias] = React.useState<any[]>([]);
  const { user } = useAuth()

  React.useEffect(() => {
    async function fetchData () {
      const fetchedBancos = await axios.get("/bancos/usuario/" + user!.id);
      const fetchedCategorias = await axios.get("/categorias/usuario/" + user!.id);

      return {
        bancos: fetchedBancos.data,
        categorias: fetchedCategorias.data
      }
    }
    if (user?.isAuthenticated) {
      fetchData().then(
        (res) => {
          setBancos(res.bancos);
          setCategorias(res.categorias);
        }
      )
    }

  }, [])

  return (

      <Container>
        <Title>Home</Title>
        <Grid>
          {
            !user?.isAuthenticated ? (
              <>
                <Link to="/login">
                  <StyledButton>
                  
                    <span style={{color: secondaryColor}}>Entrar</span>
                  </StyledButton>
                </Link>
                <Link to="/cadastro">
                  <StyledButton>
                    <span style={{color: secondaryColor}}>Cadastrar-se</span>
                  </StyledButton>
                </Link>
              </>
            ) : (
              <>
                <Box>
                  <Link to={`/bancos`}>
                  
                    <SubTitle1 style={{marginBottom:10, marginTop:0}}>Bancos</SubTitle1>
                  </Link>
                  {
                    bancos.length > 0 ? bancos.sort((a:Banco, b:Banco) => a.saldo < b.saldo ? 1 : -1).map((banco: Banco) => {
                      
                      return (
                        <>
                          <div style={{display: "flex", justifyContent: "space-between", width: 250, margin:8, border:"1px solid black", padding:10}}>

                            <span >{banco.nome}:</span>
                            <span >{`R$${banco.saldo.toFixed(2)}`}</span>
                          </div>
                        </>
                      )
                    }) : (<></>)
                  }
                  <StyledButton style={{fontSize: 20}} onClick={() => history.push("/bancos/add")}>Adicionar novo Banco</StyledButton>
                </Box>
                <Box>
                  <Link to="/categorias">
                    <SubTitle1 style={{marginBottom:10, marginTop:0}}>Categorias</SubTitle1>
                  </Link>
                  {
                    categorias.length > 0 ? categorias.sort((a:Categoria, b:Categoria) => a.saldo < b.saldo ? 1 : -1).map((categoria: Categoria) => {
                      
                      return (
                        <>
                          <div style={{display: "flex", justifyContent: "space-between", width: 250, margin:8, border:"1px solid black", padding:10}}>

                            <span >{categoria.nome}:</span>
                            <span style={{ position: "-webkit-sticky", left:"50%"}}>{`R$${categoria.saldo.toFixed(2)}`}</span>
                          </div>
                        </>
                      )
                    }) : (<></>)
                  }
                  <StyledButton style={{fontSize: 20}} onClick={() => history.push("/categorias/add")}>Adicionar nova Categoria</StyledButton>
                </Box>

              </>
              
            )
          }
          
        </Grid> 
      </Container>

  );
}