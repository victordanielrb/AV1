import { Aeronave } from "../../entidades/Aeronave";
import { Peca } from "../../entidades/Peca";
import { StatusPeca, TipoPeca } from "../../tipo/enums";
import { selecionarAeronave, selecionarEnum } from "../sistema/seletores";

type PromptFn = (mensagem: string) => string;

export function processarMenuPecas(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  let ativo = true;
  while (ativo) {
    console.log("\n--- Gerenciar Pecas ---");
    console.log("1. Listar Pecas de Aeronave");
    console.log("2. Adicionar Peca");
    console.log("3. Atualizar Status de Peca");
    console.log("0. Voltar");

    switch (prompt("Opcao: ").trim()) {
      case "1":
        listarPecas(aeronaves, prompt);
        break;
      case "2":
        adicionarPeca(aeronaves, salvar, prompt);
        break;
      case "3":
        atualizarStatusPeca(aeronaves, salvar, prompt);
        break;
      case "0":
        ativo = false;
        break;
      default:
        console.log("Opcao invalida.");
    }
  }
}

export function listarPecas(aeronaves: Aeronave[], prompt: PromptFn): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log(`\n--- Pecas de [${aeronave.codigo}] ${aeronave.modelo} ---`);
  if (aeronave.pecas.length === 0) {
    console.log("Nenhuma peca cadastrada.");
    return;
  }

  aeronave.pecas.forEach((p, i) =>
    console.log(`${i + 1}. ${p.nome} | ${p.tipo} | Forn: ${p.fornecedor} | ${p.status}`)
  );
}

export function adicionarPeca(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log("\n--- Adicionar Peca ---");
  const nome = prompt("Nome da peca: ").trim();
  const tipo = selecionarEnum(prompt, "Tipo", Object.values(TipoPeca)) as TipoPeca;
  const fornecedor = prompt("Fornecedor: ").trim();
  const status = selecionarEnum(prompt, "Status", Object.values(StatusPeca)) as StatusPeca;

  aeronave.pecas.push(new Peca(nome, tipo, fornecedor, status));
  salvar();
  console.log(`Peca "${nome}" adicionada a aeronave ${aeronave.codigo}.`);
}

export function atualizarStatusPeca(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;
  if (aeronave.pecas.length === 0) {
    console.log("Nenhuma peca nesta aeronave.");
    return;
  }

  console.log(`\nPecas de [${aeronave.codigo}]:`);
  aeronave.pecas.forEach((p, i) => console.log(`${i + 1}. ${p.nome} | ${p.status}`));

  const idx = parseInt(prompt("Numero da peca: ").trim()) - 1;
  if (idx < 0 || idx >= aeronave.pecas.length) {
    console.log("Selecao invalida.");
    return;
  }

  const peca = aeronave.pecas[idx];
  const novoStatus = selecionarEnum(prompt, "Novo Status", Object.values(StatusPeca)) as StatusPeca;
  peca.atualizarStatus(novoStatus);
  salvar();
  console.log(`Status de "${peca.nome}" atualizado para ${novoStatus}.`);
}
