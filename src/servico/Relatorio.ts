import * as fs from "fs";
import { Aeronave } from "../entidades/Aeronave";
import { Funcionario } from "../entidades/Funcionario";

export class Relatorio {
  private conteudo: string = "";

  gerarRelatorio(
    aeronave: Aeronave,
    funcionariosGlobais: Funcionario[],
    cliente: string,
    dataEntrega: string
  ): void {


    //Checka se ja existe um relatório, caso sim faz update
    const arquivosExistentes = fs.readdirSync(".").filter(f => new RegExp(`^relatorio_${aeronave.codigo}_.*\\.txt$`).test(f));
    if (arquivosExistentes.length > 0) {
      const relatorioExistente = fs.readFileSync(arquivosExistentes[0], "utf-8");
      this.conteudo = relatorioExistente;
    }
    const linha = "=".repeat(60);
    const linhaFina = "-".repeat(60);
    let t = "";

    t += linha + "\n";
    t += "        RELATORIO FINAL DE AERONAVE - AEROCODE\n";
    t += linha + "\n\n";

    t += "INFORMACOES DA AERONAVE\n";
    t += linhaFina + "\n";
    t += `Codigo:      ${aeronave.codigo}\n`;
    t += `Modelo:      ${aeronave.modelo}\n`;
    t += `Tipo:        ${aeronave.tipo}\n`;
    t += `Capacidade:  ${aeronave.capacidade} passageiros\n`;
    t += `Alcance:     ${aeronave.alcance} km\n\n`;

    t += "INFORMACOES DE ENTREGA\n";
    t += linhaFina + "\n";
    t += `Cliente:     ${cliente}\n`;
    t += `Data:        ${dataEntrega}\n\n`;

    t += "PECAS UTILIZADAS\n";
    t += linhaFina + "\n";
    if (aeronave.pecas.length === 0) {
      t += "Nenhuma peca registrada.\n";
    } else {
      aeronave.pecas.forEach((p, i) => {
        t += `${i + 1}. ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`;
      });
    }
    t += "\n";

    t += "ETAPAS REALIZADAS\n";
    t += linhaFina + "\n";
    if (aeronave.etapas.length === 0) {
      t += "Nenhuma etapa registrada.\n";
    } else {
      aeronave.etapas.forEach((e, i) => {
        t += `${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}\n`;
        const funcs = e.listarFuncionarios(funcionariosGlobais);
        if (funcs.length > 0) {
          t += `   Funcionarios: ${funcs.map((f) => f.nome).join(", ")}\n`;
        }
      });
    }
    t += "\n";

    t += "RESULTADOS DOS TESTES\n";
    t += linhaFina + "\n";
    if (aeronave.testes.length === 0) {
      t += "Nenhum teste registrado.\n";
    } else {
      aeronave.testes.forEach((te, i) => {
        t += `${i + 1}. Tipo: ${te.tipo} | Resultado: ${te.resultado}\n`;
      });
    }
    t += "\n";

    t += linha + "\n";
    t += `Relatorio gerado em: ${new Date().toLocaleString("pt-BR")}\n`;
    t += linha + "\n";

    this.conteudo = t;
  }

  salvarEmArquivo(nomeArquivo: string): void {
    fs.writeFileSync(nomeArquivo, this.conteudo, "utf-8");
  }

  getConteudo(): string {
    return this.conteudo;
  }
}
