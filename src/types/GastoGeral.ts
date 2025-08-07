import { Banco } from "./Banco"
import { Categoria } from "./Categoria"

export type GastoGeral = {
  id: number,
  banco: Banco,
  categoria: Categoria,
  tipo_gasto: string,
  descricao: string,
  data_de_competencia:string,
  valor: number,
  created_at: string
}