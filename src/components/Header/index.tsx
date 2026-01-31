import React from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { CiAlignLeft } from "react-icons/ci";
import { GrDirections } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { BsArrowReturnLeft, BsBank2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa";
import {
  Nav,
  Box,
  BoxSide,
  UsernameP,
  HoverEffect,
  BoxSideRight,
  Tooltip,
  DropdownContainer,
  DropdownMenu,
  DropdownItemWrapper,
  DropdownItemLink,
  DropdownBuyItemLink,
  NavContainer,
  HamburgerButton,
} from "./styled";
import { Link, Redirect, Router } from "react-router-dom";
import * as colors from "../../config/colors";
import { IoPersonCircle } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from "../../services/useAuth";
import { toast } from "react-toastify";
import history from "../../services/history";
import { relative } from "path";
import { Button } from "flowbite-react";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import axios from "../../services/axios";
import { IoIosCalculator } from "react-icons/io";

export default function Header(): JSX.Element {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
    history.replace("/login");
  };

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Nav>
      <BoxSideRight style={{ cursor: "pointer" }}>
        <div>
          <BsArrowReturnLeft
            onClick={() => history.goBack()}
            size={24}
            color={colors.secondaryColor}
          />
        </div>
      </BoxSideRight>

      <Link to="/">
        <Box>
          <div>
            <FaHome size={24} color={colors.secondaryColor} />
          </div>
          <Tooltip>Início</Tooltip>
        </Box>
      </Link>
      {user?.isAuthenticated ? (
        <>
          <NavContainer isOpen={mobileMenuOpen}>
            <Link to="/bancos">
              <Box onClick={closeMobileMenu}>
                <div>
                  <BsBank2 size={24} color={colors.secondaryColor} />
                </div>
                <Tooltip>Bancos</Tooltip>
              </Box>
            </Link>
            <Link to="/categorias">
              <Box onClick={closeMobileMenu}>
                <div>
                  <GrDirections size={24} color={colors.secondaryColor} />
                </div>
                <Tooltip>Categorias</Tooltip>
              </Box>
            </Link>
            <Link to="/gastos-gerais">
              <Box onClick={closeMobileMenu}>
                <div>
                  <FaMoneyBillTransfer
                    size={24}
                    color={colors.secondaryColor}
                  />
                </div>
                <Tooltip>Gastos Gerais</Tooltip>
              </Box>
            </Link>
            <Link to="/depositos">
              <Box onClick={closeMobileMenu}>
                <div>
                  <GiMoneyStack size={24} color={colors.secondaryColor} />
                </div>
                <Tooltip>Depósitos</Tooltip>
              </Box>
            </Link>
            <Link to="/transferencias">
              <Box onClick={closeMobileMenu}>
                <div>
                  <BiTransfer size={24} color={colors.secondaryColor} />
                </div>
                <Tooltip>Transferências</Tooltip>
              </Box>
            </Link>
            <Link to="/envia-por-planilha">
              <Box onClick={closeMobileMenu}>
                <div>
                  <BsFillFileEarmarkSpreadsheetFill
                    size={24}
                    color={colors.secondaryColor}
                  />
                </div>
                <Tooltip>Importar Planilha</Tooltip>
              </Box>
            </Link>

            <Link to="/calc-planejamento">
              <Box onClick={closeMobileMenu}>
                <div>
                  <IoIosCalculator size={24} color={colors.secondaryColor} />
                </div>
                <Tooltip>Calculadora de Planejamento</Tooltip>
              </Box>
            </Link>

            <DropdownContainer>
              <Box>
                <div>
                  <FaPlus size={24} color={colors.secondaryColor} />
                </div>
              </Box>
              <Tooltip>Adicionar</Tooltip>
              <DropdownMenu>
                <DropdownItemWrapper>
                  <DropdownItemLink to="/bancos/add">
                    <BsBank2 size={18} />
                    Adicionar Banco
                  </DropdownItemLink>
                </DropdownItemWrapper>
                <DropdownItemWrapper>
                  <DropdownItemLink to="/categorias/add">
                    <GrDirections size={18} />
                    Adicionar Categoria
                  </DropdownItemLink>
                </DropdownItemWrapper>
                <DropdownItemWrapper>
                  <DropdownItemLink to="/gastos-gerais/add">
                    <FaMoneyBillTransfer size={18} />
                    Adicionar Gasto
                  </DropdownItemLink>
                </DropdownItemWrapper>
                <DropdownItemWrapper>
                  <DropdownItemLink to="/depositos/add">
                    <GiMoneyStack size={18} />
                    Adicionar Depósito
                  </DropdownItemLink>
                </DropdownItemWrapper>
                <DropdownItemWrapper>
                  <DropdownItemLink to="/transferencias/add">
                    <BiTransfer size={18} />
                    Adicionar Transferência
                  </DropdownItemLink>
                </DropdownItemWrapper>
              </DropdownMenu>
            </DropdownContainer>
            {!user.hasSubscription ? (
              <DropdownContainer>
                <Box>
                  <div>
                    <FaCartPlus size={24} color={colors.secondaryColor} />
                  </div>
                </Box>
                <Tooltip>Escolher plano</Tooltip>
                <DropdownMenu>
                  <DropdownItemWrapper>
                    <DropdownBuyItemLink
                      onClick={() => handleMonthlyCheckout()}
                    >
                      Plano Mensal
                    </DropdownBuyItemLink>
                  </DropdownItemWrapper>
                  <DropdownItemWrapper>
                    <DropdownBuyItemLink onClick={() => handleAnnualCheckout()}>
                      Plano Anual
                    </DropdownBuyItemLink>
                  </DropdownItemWrapper>
                </DropdownMenu>
              </DropdownContainer>
            ) : null}
          </NavContainer>

          <HamburgerButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            <CiAlignLeft />
          </HamburgerButton>

          <BoxSide style={{ cursor: "pointer" }}>
            <HoverEffect>
              <div>
                <IoLogOut
                  onClick={handleLogout}
                  size={24}
                  color={colors.secondaryColor}
                />
              </div>
            </HoverEffect>
            <Link to="perfil">
              <UsernameP>{user.username}</UsernameP>
            </Link>
          </BoxSide>

          <BoxSideRight
            onClick={() => history.goBack()}
            style={{ cursor: "pointer" }}
          >
            <div>
              <BsArrowReturnLeft size={24} color={colors.secondaryColor} />
            </div>
          </BoxSideRight>
        </>
      ) : (
        <Link to={"/login"}>
          <BoxSide>
            <div>
              <IoPersonCircle size={24} color={colors.secondaryColor} />
            </div>
          </BoxSide>
        </Link>
      )}
    </Nav>
  );
}
