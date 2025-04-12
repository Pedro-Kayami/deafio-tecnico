import { connection } from "../database/connection";
import { CreateBoletoRequest } from "../services/request/CreateBoletoRequest";
import { CreateBoletoResponse } from "../services/response/CreateBoletoResponse";

export class CreateBoletoUseCase {
  async execute(data: CreateBoletoRequest): Promise<CreateBoletoResponse> {
    const nomeLote = data.unidade.toString().padStart(4, "0");

    const [loteRows] = await connection.query(
      "SELECT id FROM lotes WHERE nome = ?",
      [nomeLote]
    );

    let id_lote;
    if ((loteRows as any[]).length > 0) {
      id_lote = (loteRows as any[])[0].id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO lotes (nome, ativo, criado_em) VALUES (?, 1, NOW())",
        [nomeLote]
      );
      id_lote = (result as any).insertId;
    }

    const [insertResult] = await connection.query(
      "INSERT INTO boletos (nome_sacado, id_lote, valor, linha_digitavel, ativo, criado_em) VALUES (?, ?, ?, ?, 1, NOW())",
      [data.nome_sacado, id_lote, data.valor, data.linha_digitavel]
    );

    return {
      id: (insertResult as any).insertId,
      nome_sacado: data.nome_sacado,
      id_lote,
      valor: data.valor,
      linha_digitavel: data.linha_digitavel,
    };
  }
}
