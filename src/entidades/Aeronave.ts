import { TipoAeronave } from "../tipo/enums";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";

export class Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];

  constructor(
    codigo: string,
    modelo: string,
    tipo: TipoAeronave,
    capacidade: number,
    alcance: number
  ) {
    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
    this.pecas = [];
    this.etapas = [];
    this.testes = [];
  }

  detalhes(): string {
    return [
      "=".repeat(40),
      `Codigo:     ${this.codigo}`,
      `Modelo:     ${this.modelo}`,
      `Tipo:       ${this.tipo}`,
      `Capacidade: ${this.capacidade} passageiros`,
      `Alcance:    ${this.alcance} km`,
      `Pecas:      ${this.pecas.length}`,
      `Etapas:     ${this.etapas.length}`,
      `Testes:     ${this.testes.length}`,
      "=".repeat(40),
    ].join("\n");
  }

  salvar(): void {}

  carregar(): void {}
}
