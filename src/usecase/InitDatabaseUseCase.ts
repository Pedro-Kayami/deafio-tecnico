import { connection } from "../database/connection";

export async function initDatabase(): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS lotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      ativo BOOLEAN DEFAULT TRUE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS boletos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome_sacado VARCHAR(255),
      id_lote INT NOT NULL,
      valor DECIMAL(10,2),
      linha_digitavel VARCHAR(255),
      ativo BOOLEAN DEFAULT TRUE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_lote) REFERENCES lotes(id)
    );
  `);

  console.log("✅ Banco de dados inicializado.");
}
