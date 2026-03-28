import { TipoTeste, ResultadoTeste } from "../tipo/enums";

export class Teste {
  tipo: TipoTeste;
  resultado: ResultadoTeste;

  constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
    this.tipo = tipo;
    this.resultado = resultado;
  }

  salvar(): void {}

  carregar(): void {}
}
