import { Aeronave } from "../../entidades/Aeronave";
import { Teste } from "../../entidades/Teste";
import { ResultadoTeste, TipoTeste } from "../../tipo/enums";
import { selecionarAeronave, selecionarEnum } from "../sistema/seletores";

type PromptFn = (mensagem: string) => string;

export function processarMenuTestes(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  let ativo = true;
  while (ativo) {
    console.log("\n--- Gerenciar Testes ---");
    console.log("1. Listar Testes de Aeronave");
    console.log("2. Realizar Teste");
    console.log("0. Voltar");

    switch (prompt("Opcao: ").trim()) {
      case "1":
        listarTestes(aeronaves, prompt);
        break;
      case "2":
        realizarTeste(aeronaves, salvar, prompt);
        break;
      case "0":
        ativo = false;
        break;
      default:
        console.log("Opcao invalida.");
    }
  }
}

export function listarTestes(aeronaves: Aeronave[], prompt: PromptFn): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log(`\n--- Testes de [${aeronave.codigo}] ---`);
  if (aeronave.testes.length === 0) {
    console.log("Nenhum teste registrado.");
    return;
  }

  aeronave.testes.forEach((t, i) => console.log(`${i + 1}. ${t.tipo} | ${t.resultado}`));
}

export function realizarTeste(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log("\n--- Realizar Teste ---");
  const tipo = selecionarEnum(prompt, "Tipo de Teste", Object.values(TipoTeste)) as TipoTeste;
  const resultado = selecionarEnum(prompt, "Resultado", Object.values(ResultadoTeste)) as ResultadoTeste;

  aeronave.testes.push(new Teste(tipo, resultado));
  salvar();
  console.log(`Teste ${tipo} registrado com resultado: ${resultado}.`);
}
