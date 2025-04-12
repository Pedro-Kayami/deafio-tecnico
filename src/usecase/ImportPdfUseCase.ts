import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { connection } from "../database/connection";

export class ImportPdfBoletosUseCase {
    async execute(filePath: string): Promise<void> {
      const existingPdfBytes = fs.readFileSync(filePath)
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const totalPages = pdfDoc.getPageCount()
  
      // Busca boletos em ordem crescente de ID
      const [boletos] = await connection.query(`
        SELECT id, nome_sacado FROM boletos ORDER BY id ASC
      `)
  
      const outputDir = path.join(__dirname, "../../boletos-pdf")
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
  
      for (let i = 0; i < totalPages; i++) {
        const novoPdf = await PDFDocument.create()
        const [pagina] = await novoPdf.copyPages(pdfDoc, [i])
        novoPdf.addPage(pagina)
  
        const boleto = (boletos as any[])[i]
        if (boleto) {
          const pdfBytes = await novoPdf.save()
          const outputPath = path.join(outputDir, `${boleto.id}.pdf`)
          fs.writeFileSync(outputPath, pdfBytes)
        }
      }
    }
  }
  
