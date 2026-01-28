import { Banco } from "./Banco";
import { Categoria } from "./Categoria";

export type Deposito = {
  id: number;
  banco: Banco;
  categoria: Categoria;
  descricao: string;
  data_de_competencia: string;
  valor: number;
  ativo: boolean;
  created_at: string;
};
