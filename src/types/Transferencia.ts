import { Banco } from "./Banco";
import { Categoria } from "./Categoria";

export type Transferencia = {
  id: number;
  origem: Banco | Categoria;
  destino: Banco | Categoria;
  intermediario: Banco | Categoria;
  valor: number;
  data_de_competencia: string;
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
  data_de_competencia: string;
  created_at: string;
}