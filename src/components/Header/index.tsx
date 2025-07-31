import React from "react";
import { FaHome } from "react-icons/fa";
import { CiAlignLeft } from "react-icons/ci";
import { GrDirections } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { Nav, Box, BoxSide } from "./styled";
import { Link } from "react-router-dom";
import * as colors from "../../config/colors";
import { IoPersonCircle } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from "../../services/useAuth";
import { toast } from "react-toastify";
import history from "../../services/history";

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
          <FaHome size={24} color={colors.secondaryColor}/>
        </Box>
      </Link>
      {
        user?.isAuthenticated ? (
          <>
          <Link to="/bancos"> 
            <Box>
              <BsBank2 size={24} color={colors.secondaryColor}/>
            </Box>
          </Link>
          <Link to="/categorias">
            <Box>
              <GrDirections size={24} color={colors.secondaryColor}/>
            </Box>
          </Link>
          <Link to="/gastos-gerais">
            <Box>
              <FaMoneyBillTransfer size={24} color={colors.secondaryColor}/>
            </Box>
          </Link>
          <Link to="/depositos">
            <Box>
              <GiMoneyStack size={24} color={colors.secondaryColor}/>
            </Box>
          </Link>
          <Link to="/transferencias">
            <Box>
              <BiTransfer size={24} color={colors.secondaryColor}/>
            </Box>
          </Link>
          <BoxSide onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <IoLogOut size={24} color={colors.secondaryColor}/>
          </BoxSide>
          </>
        ) : (
          <Link to={"/login"}>
            <BoxSide>
              <IoPersonCircle size={24} color={colors.secondaryColor}/>
            </BoxSide>
          </Link>
        )
      }
    </Nav>
  )
}