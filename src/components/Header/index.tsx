import React from "react";
import { FaHome } from "react-icons/fa";
import { CiAlignLeft } from "react-icons/ci";
import { Nav } from "./styled";
import { Link } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <Nav>
      <Link to="/">
        <FaHome size={24}/>
      </Link>
      <Link to="/bancos">
        <CiAlignLeft size={24}/>
      </Link>
    </Nav>
  )
}