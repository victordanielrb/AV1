import { StatusPeca, TipoPeca } from "../tipo/enums";

export class Peca {
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;

  constructor(
    nome: string,
    tipo: TipoPeca,
    fornecedor: string,
    status: StatusPeca
  ) {
    this.nome = nome;
    this.tipo = tipo;
    this.fornecedor = fornecedor;
    this.status = status;
  }

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
  }

  salvar(): string {
    return JSON.stringify({
      nome: this.nome,
      tipo: this.tipo,
      fornecedor: this.fornecedor,
      status: this.status,
    });
  }

  carregar(dados: string): void {
    const peca = JSON.parse(dados) as Partial<Peca>;

    if (typeof peca.nome === "string") this.nome = peca.nome;
    if (typeof peca.fornecedor === "string") this.fornecedor = peca.fornecedor;
    if (peca.tipo) this.tipo = peca.tipo;
    if (peca.status) this.status = peca.status;
  }
}
