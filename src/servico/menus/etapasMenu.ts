import { Aeronave } from "../../entidades/Aeronave";
import { Etapa } from "../../entidades/Etapa";
import { Funcionario } from "../../entidades/Funcionario";
import { StatusEtapa } from "../../tipo/enums";
import { selecionarAeronave, selecionarEtapaDaAeronave } from "../sistema/seletores";

type PromptFn = (mensagem: string) => string;

export function processarMenuEtapas(
  aeronaves: Aeronave[],
  funcionarios: Funcionario[],
  salvar: () => void,
  prompt: PromptFn
): void {
  let ativo = true;
  while (ativo) {
    console.log("\n--- Gerenciar Etapas ---");
    console.log("1. Listar Etapas");
    console.log("2. Adicionar Etapa");
    console.log("3. Iniciar Etapa");
    console.log("4. Finalizar Etapa");
    console.log("5. Adicionar Funcionario a Etapa");
    console.log("6. Listar Funcionarios de Etapa");
    console.log("0. Voltar");

    switch (prompt("Opcao: ").trim()) {
      case "1":
        listarEtapas(aeronaves, prompt);
        break;
      case "2":
        adicionarEtapa(aeronaves, salvar, prompt);
        break;
      case "3":
        iniciarEtapa(aeronaves, salvar, prompt);
        break;
      case "4":
        finalizarEtapa(aeronaves, salvar, prompt);
        break;
      case "5":
        adicionarFuncionarioEtapa(aeronaves, funcionarios, salvar, prompt);
        break;
      case "6":
        listarFuncionariosEtapa(aeronaves, funcionarios, prompt);
        break;
      case "0":
        ativo = false;
        break;
      default:
        console.log("Opcao invalida.");
    }
  }
}

export function listarEtapas(aeronaves: Aeronave[], prompt: PromptFn): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log(`\n--- Etapas de [${aeronave.codigo}] ---`);
  if (aeronave.etapas.length === 0) {
    console.log("Nenhuma etapa cadastrada.");
    return;
  }

  aeronave.etapas.forEach((e, i) =>
    console.log(`${i + 1}. ${e.nome} | Prazo: ${e.prazo} | ${e.status} | Func: ${e.funcionarioIds.length}`)
  );
}

export function adicionarEtapa(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  console.log("\n--- Adicionar Etapa ---");
  const nome = prompt("Nome da etapa: ").trim();
  const prazo = prompt("Prazo (dd/mm/aaaa): ").trim();

  aeronave.etapas.push(new Etapa(nome, prazo));
  salvar();
  console.log(`Etapa "${nome}" adicionada.`);
}

export function iniciarEtapa(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
  if (!resultado) return;
  const { etapa, idx } = resultado;

  if (etapa.status !== StatusEtapa.PENDENTE) {
    console.log(`Etapa "${etapa.nome}" nao esta pendente (status: ${etapa.status}).`);
    return;
  }

  if (idx > 0) {
    const anterior = aeronave.etapas[idx - 1];
    if (anterior.status !== StatusEtapa.CONCLUIDA) {
      console.log(`A etapa anterior "${anterior.nome}" precisa ser concluida primeiro.`);
      return;
    }
  }

  etapa.iniciar();
  salvar();
  console.log(`Etapa "${etapa.nome}" iniciada.`);
}

export function finalizarEtapa(
  aeronaves: Aeronave[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
  if (!resultado) return;
  const { etapa } = resultado;

  if (etapa.status !== StatusEtapa.ANDAMENTO) {
    console.log(`Etapa "${etapa.nome}" nao esta em andamento (status: ${etapa.status}).`);
    return;
  }

  etapa.finalizar();
  salvar();
  console.log(`Etapa "${etapa.nome}" concluida.`);
}

export function adicionarFuncionarioEtapa(
  aeronaves: Aeronave[],
  funcionarios: Funcionario[],
  salvar: () => void,
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
  if (!resultado) return;
  const { etapa } = resultado;

  if (funcionarios.length === 0) {
    console.log("Nenhum funcionario cadastrado.");
    return;
  }

  console.log("\nSelecione o funcionario:");
  funcionarios.forEach((f, i) => {
    const ja = etapa.funcionarioIds.includes(f.id) ? " [ja adicionado]" : "";
    console.log(`${i + 1}. ${f.nome} | ${f.nivelPermissao}${ja}`);
  });

  const idx = parseInt(prompt("Numero: ").trim()) - 1;
  if (idx < 0 || idx >= funcionarios.length) {
    console.log("Selecao invalida.");
    return;
  }

  const func = funcionarios[idx];
  if (etapa.funcionarioIds.includes(func.id)) {
    console.log(`${func.nome} ja esta nesta etapa.`);
    return;
  }

  etapa.adicionarFuncionario(func.id);
  salvar();
  console.log(`${func.nome} adicionado a etapa "${etapa.nome}".`);
}

export function listarFuncionariosEtapa(
  aeronaves: Aeronave[],
  funcionarios: Funcionario[],
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;

  const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
  if (!resultado) return;
  const { etapa } = resultado;

  const funcs = etapa.listarFuncionarios(funcionarios);
  console.log(`\n--- Funcionarios da Etapa "${etapa.nome}" ---`);
  if (funcs.length === 0) {
    console.log("Nenhum funcionario associado.");
    return;
  }

  funcs.forEach((f, i) =>
    console.log(`${i + 1}. ${f.nome} | ${f.nivelPermissao} | Tel: ${f.telefone}`)
  );
}
