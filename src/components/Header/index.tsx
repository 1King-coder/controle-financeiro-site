import React from "react";
import { FaHome } from "react-icons/fa";
import { CiAlignLeft } from "react-icons/ci";
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
          <CiAlignLeft size={24} color={colors.secondaryColor}/>
        </Box>
      </Link>
    </Nav>
  )
}