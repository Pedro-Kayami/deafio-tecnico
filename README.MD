# 🚀 Desafio Técnico Backend - Green Acesso

Este projeto tem como objetivo a importação e gestão de boletos em um sistema de portaria condominial, integrando arquivos `.csv` e `.pdf`, com exportação de relatórios em PDF.

---

## ♻️ Tecnologias
- Node.js + TypeScript
- Express
- MySQL
- PDF-lib / PDFKit
- Multer (upload de arquivos)
- csv-parser (leitura de arquivos CSV)

---

## ⚖️ Estrutura do Projeto
```
src/
├── controller/
│   └── BoletoController.ts
├── database/
│   └── connection.ts
├── routes/
│   └── boleto.routes.ts
├── services/
│   ├── request/
│   │   └── CreateBoletoRequest.ts
│   └── response/
│       ├── CreateBoletoResponse.ts
│       └── ListBoletosResponse.ts
├── usecase/
│   ├── CreateBoletoUseCase.ts
│   ├── ListBoletosUseCase.ts
│   ├── ImportPdfBoletosUseCase.ts
│   └── InitDatabaseUseCase.ts
├── utils/
│   └── gerarPdfFake.ts
├── index.ts
```

---

## ⚙️ Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar o projeto
```bash
npm run dev
```

> Ao iniciar, o projeto cria automaticamente as tabelas `lotes` e `boletos` no banco.

---

## 🔗 Endpoints

### ✉ Importação de boletos via CSV
```http
POST /api/importar-boletos
```
- Enviar via `form-data`
- Campo: `arquivo` (tipo: File)
- Formato esperado:
```csv
nome;unidade;valor;linha_digitavel
JOSE DA SILVA;17;182.54;123456123456123456
```

---

### 🔹 Importação de PDF paginado (1 por boleto)
```http
POST /api/importar-pdf
```
- Enviar via `form-data`
- Campo: `arquivo` (tipo: File)
- PDF deve conter uma página por boleto, na mesma ordem de inserção
- Resultado: arquivos individuais salvos na pasta `/boletos-pdf/{id}.pdf`

---

### 📃 Listagem de boletos com filtros
```http
GET /api/boletos
```
Filtros:
- `nome`
- `id_lote`
- `valor_inicial`
- `valor_final`

Exemplo:
```
/api/boletos?nome=JOSE&id_lote=1&valor_inicial=100&valor_final=500
```

---

### 📄 Geração de relatório PDF (em base64)
```http
GET /api/boletos?relatorio=1
```
Retorna:
```json
{
  "base64": "JVBERi0xLjQKJ..."
}
```
- Tabela com ID, nome, valor, lote e linha digitável

---

## 🎨 Geração de PDF fake para testes
```bash
npm run gerar-pdf-fake
```
- Gera 3 páginas com nomes fictícios em `uploads/pdf_fake_boletos.pdf`

---

## 📁 Pastas importantes
```
uploads/         # arquivos temporários recebidos
boletos-pdf/     # PDFs divididos por boleto (ex: 1.pdf, 2.pdf)
```

---

## 📚 Observações
- O nome da unidade é convertido automaticamente para o padrão de 4 dígitos (ex: 17 → 0017)
- Os boletos inseridos em CSV são vinculados automaticamente aos seus lotes
- O PDF é dividido em páginas com nomes baseados no ID de cada boleto

---

Desenvolvido por Pedro Scarpin para o desafio técnico da Green Acesso. 🚀

