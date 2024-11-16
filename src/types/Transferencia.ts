export type Transferencia = {
  id: number;
  id_origem: number;
  id_destino: number;
  id_intermediario: number;
  valor: number;
  descricao: string;
  created_at: string;
}

export type TransferenciaWithNames = {
  id: number;
  origem: string;
  destino: string;
  intermediario: string;
  valor: number;
  descricao: string;
  created_at: string;
}