import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";

async function gerarPdfFake() {
  const pdfDoc = await PDFDocument.create();

  const nomes = ["MARCIA CARVALHO", "JOSE DA SILVA", "MARCOS ROBERTO"];

  for (const nome of nomes) {
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const fontSize = 24;

    page.drawText(`BOLETO DE: ${nome}`, {
      x: 50,
      y: height / 2,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();

  const outputPath = path.join(__dirname, "../../uploads/pdf_fake_boletos.pdf");
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`✅ PDF fake gerado com sucesso em: ${outputPath}`);
}

gerarPdfFake();
