import express from "express";
import boletoRoutes from "./routes/boleto.routes";
import { initDatabase } from "./usecase/InitDatabaseUseCase";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", boletoRoutes);

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
