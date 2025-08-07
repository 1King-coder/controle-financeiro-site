import React from "react";
import { WeekDayGastosDiv, SubTitle2 } from "./styled";
import { dayOfTheWeek } from "../../config/dates";
import { GastoGeral } from "../../types/GastoGeral";
import { Deposito } from "../../types/Deposito";
import { Popover, Button } from "flowbite-react";
import * as colors from "../../config/colors";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


type Props = {
  bancos: {[key:number]: string};
  categorias: {[key:number]: string};
  itemInWeekDay: GastoGeral[] | Deposito[];
  index: number;
  itemUrlPath: "depositos" | "gastos-gerais";
}

export function WeekDayPopoverCard(props: Props): JSX.Element {
  return (
    <WeekDayGastosDiv key={props.index}>
      <SubTitle2>{dayOfTheWeek.withFeira[props.index]}</SubTitle2>
      {
        props.itemInWeekDay.map((item: GastoGeral | Deposito) => {
          const splitedDate = new Date(item.data_de_competencia).toLocaleDateString("pt-br").split("/");
          const gastoDate = new Date (Number(splitedDate[2]), Number(splitedDate[1]) - 1,  Number(splitedDate[0]));
          return (
            <>          
              <Popover content={
                <div className="gastos-gerais-popover-content">
                  <div className="gastos-gerais-popover-title-div">
                    <h3 className="gastos-gerais-popover-title">Dados do Gasto</h3>
                  </div>
                  <table className="gastos-gerais-popover-table">
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">Banco:</td>
                      <td className="gastos-gerais-popover-table-data-cell">{props.bancos[item.banco.id]}</td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">Categoria:</td>
                      <td className="gastos-gerais-popover-table-data-cell">{props.categorias[item.categoria.id]}</td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">Descrição:</td>
                      <td className="gastos-gerais-popover-table-data-cell">{item.descricao}</td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">Valor:</td>
                      <td className="gastos-gerais-popover-table-data-cell">{`R$ ${item.valor}`}</td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">Data:</td>
                      <td className="gastos-gerais-popover-table-data-cell">{gastoDate.toLocaleDateString()}</td>
                    </tr>
                  </table>
                  <div className="gastos-gerais-popover-edit-delete-btns-div">
                    <Link to={`/${props.itemUrlPath}/${item.id}`} style={{justifyContent: "center", alignItems: "center", display: "flex", marginRight: "10px"}}>
                      <FaEdit size={20} color={colors.secondaryColor}/>
                    </Link>
                    <Link to={`/${props.itemUrlPath}/${item.id}`} style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
                      <MdDelete size={20} color={colors.dangerColor}/>
                    </Link>
                  </div>
                </div>
              } placement="right" trigger="hover" >
                <Button className="gastos-gerais-popover-btn">{item.descricao}</Button>
              </Popover>
            </>
          )
        })
      }
      
    </WeekDayGastosDiv>
  )
}