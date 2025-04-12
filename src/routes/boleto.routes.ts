import { Router } from "express";
import multer from "multer";
import { BoletoController } from "../controller/BoletoController";

const router = Router();
const upload = multer({ dest: "uploads/" });
const controller = new BoletoController();

router.post("/importar-boletos", upload.single("arquivo"), (req, res) => {
  controller.importarBoletos(req, res);
});

router.get("/boletos", (req, res) => {
  controller.listarBoletos(req, res);
});

router.post('/importar-pdf', upload.single('arquivo'), (req, res) => {
    controller.importarPdf(req, res)
  })

export default router;
