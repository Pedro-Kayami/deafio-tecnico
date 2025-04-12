export interface CreateBoletoRequest {
  nome_sacado: string;
  unidade: string | number;
  valor: number;
  linha_digitavel: string;
}
