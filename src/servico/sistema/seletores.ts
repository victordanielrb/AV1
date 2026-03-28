import { Aeronave } from "../../entidades/Aeronave";
import { Etapa } from "../../entidades/Etapa";
import { Funcionario } from "../../entidades/Funcionario";

type PromptFn = (mensagem: string) => string;

export function selecionarAeronave(prompt: PromptFn, aeronaves: Aeronave[]): Aeronave | null {
  if (aeronaves.length === 0) {
    console.log("\nNenhuma aeronave cadastrada.");
    return null;
  }

  console.log("\nSelecione uma aeronave:");
  aeronaves.forEach((a, i) => {
    console.log(`${i + 1}. [${a.codigo}] ${a.modelo}`);
  });

  const idx = parseInt(prompt("Numero: ").trim()) - 1;
  if (idx < 0 || idx >= aeronaves.length) {
    console.log("Selecao invalida.");
    return null;
  }

  return aeronaves[idx];
}

export function selecionarEtapaDaAeronave(
  prompt: PromptFn,
  aeronave: Aeronave
): { etapa: Etapa; idx: number } | null {
  if (aeronave.etapas.length === 0) {
    console.log("Nenhuma etapa nesta aeronave.");
    return null;
  }

  console.log("\nSelecione uma etapa:");
  aeronave.etapas.forEach((e, i) => {
    console.log(`${i + 1}. ${e.nome} | ${e.status}`);
  });

  const idx = parseInt(prompt("Numero: ").trim()) - 1;
  if (idx < 0 || idx >= aeronave.etapas.length) {
    console.log("Selecao invalida.");
    return null;
  }

  return { etapa: aeronave.etapas[idx], idx };
}

export function selecionarEnum(prompt: PromptFn, label: string, valores: string[]): string {
  console.log(`\n${label}:`);
  valores.forEach((v, i) => console.log(`  ${i + 1}. ${v}`));

  let idx = -1;
  while (idx < 0 || idx >= valores.length) {
    const entrada = prompt(`Opcao [1-${valores.length}]: `).trim();
    idx = parseInt(entrada) - 1;
    if (isNaN(idx) || idx < 0 || idx >= valores.length) {
      console.log("Opcao invalida.");
      idx = -1;
    }
  }

  return valores[idx];
}

export function proximoId(funcionarios: Funcionario[]): string {
  if (funcionarios.length === 0) return "1";
  const maxId = Math.max(...funcionarios.map((f) => parseInt(f.id) || 0));
  return (maxId + 1).toString();
}