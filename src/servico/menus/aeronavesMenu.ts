import { Aeronave } from "../../entidades/Aeronave";
import { TipoAeronave } from "../../tipo/enums";
import { selecionarAeronave, selecionarEnum } from "../sistema/seletores";

type PromptFn = (mensagem: string) => string;

export function processarMenuAeronaves(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  let ativo = true;
  while (ativo) {
    console.log("\n--- Gerenciar Aeronaves ---");
    console.log("1. Listar Aeronaves");
    console.log("2. Cadastrar Aeronave");
    console.log("3. Ver Detalhes");
    console.log("4. Remover Aeronave");
    console.log("0. Voltar");

    switch (prompt("Opcao: ").trim()) {
      case "1":
        listarAeronaves(aeronaves);
        break;
      case "2":
        cadastrarAeronave(aeronaves, salvar, prompt);
        break;
      case "3":
        verDetalhesAeronave(aeronaves, prompt);
        break;
      case "4":
        removerAeronave(aeronaves, salvar, prompt);
        break;
      case "0":
        ativo = false;
        break;
      default:
        console.log("Opcao invalida.");
    }
  }
}

export function listarAeronaves(aeronaves: Aeronave[]): void {
  console.log("\n--- Lista de Aeronaves ---");
  if (aeronaves.length === 0) {
    console.log("Nenhuma aeronave cadastrada.");
    return;
  }

  aeronaves.forEach((a, i) => {
    console.log(
      `${i + 1}. [${a.codigo}] ${a.modelo} | ${a.tipo} | Cap: ${a.capacidade} | Alcance: ${a.alcance}km`
    );
  });
}

export function cadastrarAeronave(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  console.log("\n--- Cadastrar Aeronave ---");
  let codigo = "";

  do {
    codigo = prompt("Codigo (unico): ").trim();
    if (!codigo) {
      console.log("Codigo nao pode ser vazio.");
      continue;
    }
    if (aeronaves.find((a) => a.codigo === codigo)) {
      console.log("Codigo ja existe. Tente outro.");
      codigo = "";
    }
  } while (!codigo);

  const modelo = prompt("Modelo: ").trim();
  const tipo = selecionarEnum(prompt, "Tipo", Object.values(TipoAeronave)) as TipoAeronave;
  const capacidade = parseInt(prompt("Capacidade (passageiros): ").trim()) || 0;
  const alcance = parseInt(prompt("Alcance (km): ").trim()) || 0;

  aeronaves.push(new Aeronave(codigo, modelo, tipo, capacidade, alcance));
  salvar();
  console.log(`Aeronave [${codigo}] ${modelo} cadastrada com sucesso!`);
}

export function verDetalhesAeronave(aeronaves: Aeronave[], prompt: PromptFn): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log("\n" + aeronave.detalhes());

  if (aeronave.pecas.length > 0) {
    console.log("\nPecas:");
    aeronave.pecas.forEach((p, i) =>
      console.log(`  ${i + 1}. ${p.nome} | ${p.tipo} | Forn: ${p.fornecedor} | ${p.status}`)
    );
  }
  if (aeronave.etapas.length > 0) {
    console.log("\nEtapas:");
    aeronave.etapas.forEach((e, i) =>
      console.log(`  ${i + 1}. ${e.nome} | Prazo: ${e.prazo} | ${e.status}`)
    );
  }
  if (aeronave.testes.length > 0) {
    console.log("\nTestes:");
    aeronave.testes.forEach((t, i) =>
      console.log(`  ${i + 1}. ${t.tipo} | ${t.resultado}`)
    );
  }
}

export function removerAeronave(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  const conf = prompt(
    `Confirmar remocao de [${aeronave.codigo}] ${aeronave.modelo}? (s/n): `
  )
    .trim()
    .toLowerCase();

  if (conf === "s") {
    const idx = aeronaves.findIndex((a) => a.codigo === aeronave.codigo);
    if (idx >= 0) aeronaves.splice(idx, 1);
    salvar();
    console.log("Aeronave removida.");
  } else {
    console.log("Operacao cancelada.");
  }
}
