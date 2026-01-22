import React from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { CiAlignLeft } from "react-icons/ci";
import { GrDirections } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { BsArrowReturnLeft, BsBank2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
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
} from "./styled";
import { Link } from "react-router-dom";
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

export default function Header(): JSX.Element {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
    history.replace("/login");
  };

  return (
    <Nav>
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
          <Link to="/bancos">
            <Box>
              <div>
                <BsBank2 size={24} color={colors.secondaryColor} />
              </div>
              <Tooltip>Bancos</Tooltip>
            </Box>
          </Link>
          <Link to="/categorias">
            <Box>
              <div>
                <GrDirections size={24} color={colors.secondaryColor} />
              </div>
              <Tooltip>Categorias</Tooltip>
            </Box>
          </Link>
          <Link to="/gastos-gerais">
            <Box>
              <div>
                <FaMoneyBillTransfer size={24} color={colors.secondaryColor} />
              </div>
              <Tooltip>Gastos Gerais</Tooltip>
            </Box>
          </Link>
          <Link to="/depositos">
            <Box>
              <div>
                <GiMoneyStack size={24} color={colors.secondaryColor} />
              </div>
              <Tooltip>Depósitos</Tooltip>
            </Box>
          </Link>
          <Link to="/transferencias">
            <Box>
              <div>
                <BiTransfer size={24} color={colors.secondaryColor} />
              </div>
              <Tooltip>Transferências</Tooltip>
            </Box>
          </Link>
          <Link to="/envia-por-planilha">
            <Box>
              <div>
                <BsFillFileEarmarkSpreadsheetFill
                  size={24}
                  color={colors.secondaryColor}
                />
              </div>
              <Tooltip>Importar Planilha</Tooltip>
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
