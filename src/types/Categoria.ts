export type Categoria = {
  id: number;
  nome: string;
  saldo: number;
  updated_at: string;
}

export type SaldoCategoriaPorBanco = {
  id_banco: number;
  id_categoria: number;
  nome_banco: string;
  nome_categoria: string;
  saldo: number;
}

export type CategoriaPorBancoPieChartProps = {
  id_banco: number;
} 