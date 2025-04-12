import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import PDFDocument = require("pdfkit");
import { CreateBoletoUseCase } from "../usecase/CreateBoletoUseCase";
import { ListBoletosUseCase } from "../usecase/ListBoletosUseCase";
import { CreateBoletoRequest } from "../services/request/CreateBoletoRequest";
import { ImportPdfBoletosUseCase } from "../usecase/ImportPdfUseCase";

export class BoletoController {
  async importarBoletos(req: Request, res: Response) {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).send("Arquivo CSV é obrigatório.");

    const resultados: CreateBoletoRequest[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv({ separator: ";" }))
          .on("data", (data) =>
            resultados.push({
              nome_sacado: data.nome,
              unidade: data.unidade,
              valor: Number(data.valor),
              linha_digitavel: data.linha_digitavel,
            })
          )
          .on("end", resolve)
          .on("error", reject);
      });

      const usecase = new CreateBoletoUseCase();

      for (const boleto of resultados) {
        await usecase.execute(boleto);
      }

      res.send("Importação concluída com sucesso!");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao importar boletos.");
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  async listarBoletos(req: Request, res: Response) {
    try {
      const { relatorio } = req.query;
      const usecase = new ListBoletosUseCase();
      const boletos = await usecase.execute(req.query);

      if (relatorio === "1") {
        const doc = new PDFDocument();
        const buffers: Uint8Array[] = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          const base64 = pdfData.toString("base64");
          res.json({ base64 });
        });

        doc.fontSize(18).text("Relatório de Boletos", { align: "center" });
        doc.moveDown();
        doc
          .fontSize(12)
          .text(
            "ID | Nome Sacado           | Lote | Valor   | Linha Digitável"
          );
        doc.moveDown(0.5);

        boletos.forEach((b) => {
          const linha = `${b.id} | ${b.nome_sacado.padEnd(22)} | ${
            b.id_lote
          } | ${Number(b.valor).toFixed(2).padEnd(7)} | ${b.linha_digitavel}`;
          doc.text(linha);
        });

        doc.end();
        return;
      }

      res.json(boletos);
    } catch (err) {
      console.error("Erro ao buscar boletos:", err);
      res.status(500).send("Erro interno do servidor");
    }
  }

  async importarPdf(req: Request, res: Response) {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).send("Arquivo PDF é obrigatório.");

    try {
      const usecase = new ImportPdfBoletosUseCase();
      await usecase.execute(filePath);
      res.send("PDF processado com sucesso.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao processar PDF.");
    } finally {
      fs.unlinkSync(filePath);
    }
  }
}
