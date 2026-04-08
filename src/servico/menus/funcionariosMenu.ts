import { Funcionario } from "../../entidades/Funcionario";
import { NivelPermissao } from "../../tipo/enums";
import { proximoId, selecionarEnum } from "../sistema/seletores";

type PromptFn = (mensagem: string, opcoes?: { echo: string }) => string;

export function processarMenuFuncionarios(
  funcionarios: Funcionario[],
  logado: Funcionario | null,
  salvar: () => void,
  prompt: PromptFn
): void {
  let ativo = true;
  while (ativo) {
    console.log("\n--- Gerenciar Funcionarios ---");
    console.log("1. Listar Funcionarios");
    console.log("2. Cadastrar Funcionario");
    console.log("3. Remover Funcionario");
    console.log("0. Voltar");

    switch (prompt("Opcao: ").trim()) {
      case "1":
        listarFuncionarios(funcionarios);
        break;
      case "2":
        cadastrarFuncionario(funcionarios, salvar, prompt);
        break;
      case "3":
        removerFuncionario(funcionarios, logado, salvar, prompt);
        break;
      case "0":
        ativo = false;
        break;
      default:
        console.log("Opcao invalida.");
    }
  }
}

export function listarFuncionarios(funcionarios: Funcionario[]): void {
  console.log("\n--- Lista de Funcionarios ---");
  if (funcionarios.length === 0) {
    console.log("Nenhum funcionario cadastrado.");
    return;
  }

  funcionarios.forEach((f, i) =>
    console.log(
      `${i + 1}. [${f.id}] ${f.nome} | ${f.nivelPermissao} | Usuario: ${f.usuario} | Tel: ${f.telefone}`
    )
  );
}

export function cadastrarFuncionario(
  funcionarios: Funcionario[],
  salvar: () => void,
  prompt: PromptFn
): void {
  console.log("\n--- Cadastrar Funcionario ---");
  const id = proximoId(funcionarios);
  const nome = prompt("Nome: ").trim();
  const telefone = prompt("Telefone: ").trim();
  const endereco = prompt("Endereco: ").trim();

  let usuario = "";
  do {
    usuario = prompt("Usuario (login): ").trim();
    if (!usuario) {
      console.log("Usuario nao pode ser vazio.");
      continue;
    }
    if (funcionarios.find((f) => f.usuario === usuario)) {
      console.log("Usuario ja existe. Escolha outro.");
      usuario = "";
    }
  } while (!usuario);

  const senha = prompt("Senha: ", { echo: "*" }).trim();
  const nivel = selecionarEnum(prompt, "Nivel de Permissao", Object.values(NivelPermissao)) as NivelPermissao;

  funcionarios.push(new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel));
  salvar();
  console.log(`Funcionario "${nome}" cadastrado com ID ${id}.`);
}

export function removerFuncionario(
  funcionarios: Funcionario[],
  logado: Funcionario | null,
  salvar: () => void,
  prompt: PromptFn
): void {
  listarFuncionarios(funcionarios);
  if (funcionarios.length === 0) return;

  const idx = parseInt(prompt("Numero do funcionario para remover: ").trim()) - 1;
  if (idx < 0 || idx >= funcionarios.length) {
    console.log("Selecao invalida.");
    return;
  }

  const f = funcionarios[idx];
  if (logado && f.id === logado.id) {
    console.log("Voce nao pode remover a si mesmo.");
    return;
  }

  const conf = prompt(`Confirmar remocao de "${f.nome}"? (s/n): `).trim().toLowerCase();
  if (conf === "s") {
    funcionarios.splice(idx, 1);
    salvar();
    console.log("Funcionario removido.");
  } else {
    console.log("Operacao cancelada.");
  }
}
