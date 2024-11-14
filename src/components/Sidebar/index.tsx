import React from "react";  
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import  { MenuItemStyles } from "../../types/MenuItemStyles";
import { FaHome, FaGlobe, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { GrDirections } from "react-icons/gr";
import * as colors from "../../config/colors";
import { CollapseBtn } from "./styled";
import { GiMoneyStack } from "react-icons/gi";

export default function SideBar(): JSX.Element {
  const menuItemStyles: MenuItemStyles = {
    
    button: ({ level, active, disabled }) => {
      // only apply styles on first level elements of the tree
      
      if (level === 0)
        return {
          fontSize: 20,
          fontWeight: 'bold',
          color: disabled ? colors.primaryColor : colors.secondaryColor,
          backgroundColor: active ? colors.tertiaryColor : undefined,
          
        };
      if (level === 1)
        return {
          fontSize: 18,
          color: disabled ? colors.primaryColor : colors.secondaryColor,
          backgroundColor: active ? colors.tertiaryColor : undefined,
        }
    },
  }

  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <Sidebar collapsed={collapsed} style={{ backgroundColor: colors.tertiaryColor }}>
      <CollapseBtn onClick={() => setCollapsed(!collapsed)}>
        {
          collapsed ? <FaArrowRight size={30}/> : <FaArrowLeft size={30}/>
        }
      </CollapseBtn>
      <Menu menuItemStyles={menuItemStyles}>
        <MenuItem icon={<FaHome size={24}/>} component={<Link to="/" />}>Home</MenuItem>
        <SubMenu label="Visão Geral" icon={<FaGlobe size={24} />}>
          <MenuItem component={<Link to="/bancos" />} suffix={<BsBank2 size={24} />}>Bancos</MenuItem>
          <MenuItem component={<Link to="/direcionamentos" />} suffix={<GrDirections size={24} />}>Direcionamentos</MenuItem>
          <MenuItem component={<Link to="/gastos-gerais" />} suffix={<FaMoneyBillTransfer size={24} />}>Gastos Gerais</MenuItem>
          <MenuItem component={<Link to="/depositos" />} suffix={<GiMoneyStack size={24} />}>Depósitos</MenuItem>
        </SubMenu>
      </Menu>

    </Sidebar>
  )
}