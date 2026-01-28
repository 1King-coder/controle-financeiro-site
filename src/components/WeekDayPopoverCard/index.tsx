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
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { fixDate } from "../../config/dates";
import ConfirmDialog from "../ConfirmDialog";

type Props = {
  bancos: { [key: number]: string };
  categorias: { [key: number]: string };
  itemInWeekDay: GastoGeral[] | Deposito[];
  index: number;
  itemUrlPath: "depositos" | "gastos-gerais";
};

export function WeekDayPopoverCard(props: Props): JSX.Element {
  const [itemToDelete, setItemToDelete]: [number | null, any] =
    React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog]: [boolean, any] =
    React.useState(false);
  const [isDeleting, setIsDeleting]: [boolean, any] = React.useState(false);
  const total: number = props.itemInWeekDay
    .map((item: GastoGeral | Deposito) => item.valor)
    .reduce((acc: number, i: number) => acc + i, 0);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await axios.delete(`${props.itemUrlPath}/${itemToDelete}/`);
    if (res.status === 200) {
      toast.success(
        props.itemUrlPath === "gastos-gerais"
          ? "Gasto deletado com sucesso"
          : "Depósito deletado com sucesso",
      );
      setShowConfirmDialog(false);
      setIsDeleting(false);
      window.location.reload();
    } else {
      toast.error(
        props.itemUrlPath === "gastos-gerais"
          ? "Erro ao deletar gasto"
          : "Erro ao deletar depósito",
      );
      setIsDeleting(false);
    }
  };

  return (
    <WeekDayGastosDiv key={props.index}>
      <SubTitle2>{dayOfTheWeek.withFeira[props.index]}</SubTitle2>
      <SubTitle2>Total: R${Math.round(total * 1e2) / 1e2}</SubTitle2>
      {props.itemInWeekDay.map((item: GastoGeral | Deposito) => {
        const gastoDate = fixDate(item.data_de_competencia).toLocaleDateString(
          "pt-br",
          { timeZone: "America/Sao_Paulo" },
        );
        return (
          <>
            <Popover
              content={
                <div className="gastos-gerais-popover-content">
                  <div className="gastos-gerais-popover-title-div">
                    <h3 className="gastos-gerais-popover-title">
                      Dados do Gasto
                    </h3>
                  </div>
                  <table className="gastos-gerais-popover-table">
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">
                        Banco:
                      </td>
                      <td className="gastos-gerais-popover-table-data-cell">
                        {props.bancos[item.banco.id]}
                      </td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">
                        Categoria:
                      </td>
                      <td className="gastos-gerais-popover-table-data-cell">
                        {props.categorias[item.categoria.id]}
                      </td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">
                        Descrição:
                      </td>
                      <td className="gastos-gerais-popover-table-data-cell">
                        {item.descricao}
                      </td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">
                        Valor:
                      </td>
                      <td className="gastos-gerais-popover-table-data-cell">{`R$ ${item.valor}`}</td>
                    </tr>
                    <tr>
                      <td className="gastos-gerais-popover-table-label-cell">
                        Data:
                      </td>
                      <td className="gastos-gerais-popover-table-data-cell">
                        {gastoDate}
                      </td>
                    </tr>
                  </table>
                  <div className="gastos-gerais-popover-edit-delete-btns-div">
                    <Link
                      to={
                        props.itemUrlPath === "gastos-gerais"
                          ? `/gastos/edit/${item.id}`
                          : `/depositos/edit/${item.id}`
                      }
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        marginRight: "10px",
                        pointerEvents: item.ativo ? "auto" : "none",
                        opacity: item.ativo ? 1 : 0.5,
                        cursor: item.ativo ? "pointer" : "not-allowed",
                      }}
                    >
                      <FaEdit size={20} color={colors.secondaryColor} />
                    </Link>
                    <span
                      onClick={() => {
                        setItemToDelete(item.id);
                        setShowConfirmDialog(true);
                      }}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        pointerEvents: item.ativo ? "auto" : "none",
                        opacity: item.ativo ? 1 : 0.5,
                        cursor: item.ativo ? "pointer" : "not-allowed",
                      }}
                    >
                      <MdDelete size={20} color={colors.dangerColor} />
                    </span>
                  </div>
                </div>
              }
              placement="right"
              trigger="hover"
            >
              <Button className="gastos-gerais-popover-btn">
                {item.descricao}
              </Button>
            </Popover>
          </>
        );
      })}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmação de exclusão"
        message={`Tem certeza que deseja excluir este ${
          props.itemUrlPath === "gastos-gerais" ? "gasto" : "depósito"
        }? Esta ação não pode ser desfeita.`}
        onConfirm={() => handleDelete()}
        onCancel={() => setShowConfirmDialog(false)}
        isLoading={isDeleting}
      />
    </WeekDayGastosDiv>
  );
}
