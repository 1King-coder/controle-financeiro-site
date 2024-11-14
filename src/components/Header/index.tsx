import React from "react";
import { FaHome } from "react-icons/fa";
import { CiAlignLeft } from "react-icons/ci";
import { GrDirections } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { Nav, Box } from "./styled";
import { Link } from "react-router-dom";
import * as colors from "../../config/colors";

export default function Header(): JSX.Element {
  return (
    <Nav>
      <Link to="/">
        <Box>
          <FaHome size={24} color={colors.secondaryColor}/>
        </Box>
      </Link>
      <Link to="/bancos">
        <Box>
          <BsBank2 size={24} color={colors.secondaryColor}/>
        </Box>
      </Link>
      <Link to="/direcionamentos">
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
    </Nav>
  )
}