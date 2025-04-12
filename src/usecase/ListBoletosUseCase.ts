import { connection } from "../database/connection";
import { ListBoletosResponse } from "../services/response/ListBoletosResponse";

export class ListBoletosUseCase {
  async execute(filters: any): Promise<ListBoletosResponse[]> {
    const { nome, valor_inicial, valor_final, id_lote } = filters;

    let query = "SELECT * FROM boletos WHERE 1 = 1";
    const params: any[] = [];

    if (nome) {
      query += " AND nome_sacado LIKE ?";
      params.push(`%${nome}%`);
    }
    if (valor_inicial) {
      query += " AND valor >= ?";
      params.push(Number(valor_inicial));
    }
    if (valor_final) {
      query += " AND valor <= ?";
      params.push(Number(valor_final));
    }
    if (id_lote) {
      query += " AND id_lote = ?";
      params.push(Number(id_lote));
    }

    const [rows] = await connection.query(query, params);
    return rows as ListBoletosResponse[];
  }
}
