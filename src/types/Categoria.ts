import { SaldoBancoPorCategoria } from "./Banco";

export type Categoria = {
  id: number;
  nome: string;
  saldo: number;
  updated_at: string;
}

export type SaldoCategoriaPorBanco = SaldoBancoPorCategoria

export type CategoriaPorBancoPieChartProps = {
  id_banco: number;
} 