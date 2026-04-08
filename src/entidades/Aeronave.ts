import { TipoAeronave } from "../tipo/enums";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";
import { Database } from "../servico/Database";

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

  salvar(): void {
    const aeronaves = Database.carregarAeronaves();
    const index = aeronaves.findIndex((aero) => aero.codigo === this.codigo);
    //procura a aeronave pelo codigo, se encontrar atualiza, senao adiciona nova
    //aparentemente findIndex retorna -1 se nao encontrar
    if (index !== -1 ) {
      aeronaves[index] = this;
    } else {
      aeronaves.push(this);
    }
    Database.salvarAeronaves(aeronaves);
  }

  carregar(): void {}
}
