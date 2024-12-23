export type Banco = {
  id: number;
  nome: string;
  saldo: number;
  updated_at: string;
}

export type SaldoBancoPorDirecionamento = {
  id_banco: number;
  id_direcionamento: number;
  nome_banco: string;
  nome_direcionamento: string;
  saldo: number;
}

export type BancoPorDirecionamentoPieChartProps = {
  id_banco: number;
}