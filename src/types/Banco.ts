import {Categoria} from "../types/Categoria"

export type Banco = {
  id: number;
  nome: string;
  saldo: number;
  updated_at: string;
}

export type SaldoBancoPorCategoria = {
  banco: Banco;
  categoria: Categoria;
  saldo: number;
}

export type BancoPorCategoriaPieChartProps = {
  id_banco: number;
}