export type Direcionamento = {
  id: number;
  nome: string;
  saldo: number;
  updated_at: string;
}

export type SaldoDirecionamentoPorBanco = {
  id_banco: number;
  id_direcionamento: number;
  nome_banco: string;
  nome_direcionamento: string;
  saldo: number;
}

export type DirecionamentoPorBancoPieChartProps = {
  id_banco: number;
}