import promptSync from "prompt-sync";
import { Aeronave } from "../entidades/Aeronave";
import { Funcionario } from "../entidades/Funcionario";
import { Peca } from "../entidades/Peca";
import { Etapa } from "../entidades/Etapa";
import { Teste } from "../entidades/Teste";
import { Relatorio } from "./Relatorio";
import { Database } from "./Database";
import {
  TipoAeronave,
  TipoPeca,
  StatusPeca,
  StatusEtapa,
  NivelPermissao,
  TipoTeste,
  ResultadoTeste,
} from "../tipo/enums";
import {
  proximoId,
  selecionarAeronave,
  selecionarEnum,
  selecionarEtapaDaAeronave,
} from "./sistema/seletores";

const prompt = promptSync({ sigint: true });

export class Sistema {
  private aeronaves: Aeronave[] = [];
  private funcionarios: Funcionario[] = [];
  private logado: Funcionario | null = null;

  constructor() {
    //carrega a "db"
    this.aeronaves = Database.carregarAeronaves();
    this.funcionarios = Database.carregarFuncionarios();
    this.criarAdminPadrao();
  }

  private salvar(): void {
    Database.salvarAeronaves(this.aeronaves);
    Database.salvarFuncionarios(this.funcionarios);
  }

  private criarAdminPadrao(): void {
    //admin padrao pra teste
    if (this.funcionarios.length === 0) {
      this.funcionarios.push(
        new Funcionario(
          "1",
          "Administrador",
          "(00) 00000-0000",
          "Sede Aerocode",
          "admin",
          "admin123",
          NivelPermissao.ADMINISTRADOR
        )
      );
      this.salvar();
      console.log("Primeiro acesso detectado.");
      console.log("Usuario padrao criado  ->  usuario: admin  |  senha: admin\n");
    }
  }

  // ─── Ponto de entrada ────────────────────────────────────────────────────────

  iniciar(): void {
    console.log("\n" + "=".repeat(52));
    console.log("   AEROCODE - AV1");
    console.log("=".repeat(52) + "\n");

    while (true) {
      if (!this.logado) {
        const continuar = this.telaLogin();
        if (!continuar) break;
      } else {
        this.menuPrincipal();
      }
    }
    console.log("\n=== Sistema encerrado. Ate logo! ===\n");
  }

  // ─── Autenticação ────────────────────────────────────────────────────────────

  private telaLogin(): boolean {
    console.log("--- Login ---");
    const usuario = prompt('Usuario (ou "sair" para encerrar): ').trim();
    if (usuario.toLowerCase() === "sair") return false;
    const senha = prompt("Senha: ", { echo: "*" }).trim();

    const f = this.funcionarios.find((f) => f.autenticar(usuario, senha));
    if (f) {
      this.logado = f;
      console.log(`\nBem-vindo, ${f.nome}! Perfil: [${f.nivelPermissao}]\n`);
      return true;
    }
    console.log("\nCredenciais invalidas. Tente novamente.\n");
    return true;
  }

  private logout(): void {
    console.log(`\nAte logo, ${this.logado!.nome}!\n`);
    this.logado = null;
  }

  // ─── Menu principal ──────────────────────────────────────────────────────────

  private menuPrincipal(): void {
    const nivel = this.logado!.nivelPermissao;
    console.log(`\n--- Menu Principal [${this.logado!.nome} | ${nivel}] ---`);

    if (nivel === NivelPermissao.ADMINISTRADOR) {
      console.log("1. Gerenciar Aeronaves");
      console.log("2. Gerenciar Pecas");
      console.log("3. Gerenciar Etapas");
      console.log("4. Gerenciar Funcionarios");
      console.log("5. Gerenciar Testes");
      console.log("6. Gerar Relatorio");
      console.log("7. Logout");
      console.log("0. Sair");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.menuAeronaves(); break;
        case "2": this.menuPecas(); break;
        case "3": this.menuEtapas(); break;
        case "4": this.menuFuncionarios(); break;
        case "5": this.menuTestes(); break;
        case "6": this.menuRelatorio(); break;
        case "7": this.logout(); break;
        case "0": this.logout(); process.exit(0);
        default: console.log("Opcao invalida.");
      }
    } else if (nivel === NivelPermissao.ENGENHEIRO) {
      console.log("1. Visualizar Aeronaves");
      console.log("2. Gerenciar Pecas");
      console.log("3. Gerenciar Etapas");
      console.log("4. Gerenciar Testes");
      console.log("5. Gerar Relatorio");
      console.log("6. Logout");
      console.log("0. Sair");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.listarAeronaves(); break;
        case "2": this.menuPecas(); break;
        case "3": this.menuEtapas(); break;
        case "4": this.menuTestes(); break;
        case "5": this.menuRelatorio(); break;
        case "6": this.logout(); break;
        case "0": this.logout(); process.exit(0);
        default: console.log("Opcao invalida.");
      }
    } else {
      // OPERADOR
      console.log("1. Visualizar Aeronaves");
      console.log("2. Atualizar Status de Peca");
      console.log("3. Iniciar Etapa");
      console.log("4. Finalizar Etapa");
      console.log("5. Logout");
      console.log("0. Sair");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.listarAeronaves(); break;
        case "2": this.atualizarStatusPeca(); break;
        case "3": this.iniciarEtapa(); break;
        case "4": this.finalizarEtapa(); break;
        case "5": this.logout(); break;
        case "0": this.logout(); process.exit(0);
        default: console.log("Opcao invalida.");
      }
    }
  }

  // ─── Aeronaves ───────────────────────────────────────────────────────────────

  private menuAeronaves(): void {
    let ativo = true;
    while (ativo) {
      console.log("\n--- Gerenciar Aeronaves ---");
      console.log("1. Listar Aeronaves");
      console.log("2. Cadastrar Aeronave");
      console.log("3. Ver Detalhes");
      console.log("4. Remover Aeronave");
      console.log("0. Voltar");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.listarAeronaves(); break;
        case "2": this.cadastrarAeronave(); break;
        case "3": this.verDetalhesAeronave(); break;
        case "4": this.removerAeronave(); break;
        case "0": ativo = false; break;
        default: console.log("Opcao invalida.");
      }
    }
  }

  private listarAeronaves(): void {
    console.log("\n--- Lista de Aeronaves ---");
    if (this.aeronaves.length === 0) {
      console.log("Nenhuma aeronave cadastrada.");
      return;
    }
    this.aeronaves.forEach((a, i) => {
      console.log(
        `${i + 1}. [${a.codigo}] ${a.modelo} | ${a.tipo} | Cap: ${a.capacidade} | Alcance: ${a.alcance}km`
      );
    });
  }

  private cadastrarAeronave(): void {
    console.log("\n--- Cadastrar Aeronave ---");
    let codigo = "";
    do {
      codigo = prompt("Codigo (unico): ").trim();
      if (!codigo) {
        console.log("Codigo nao pode ser vazio.");
        continue;
      }
      if (this.aeronaves.find((a) => a.codigo === codigo)) {
        console.log("Codigo ja existe. Tente outro.");
        codigo = "";
      }
    } while (!codigo);

    const modelo = prompt("Modelo: ").trim();
    const tipo = selecionarEnum(prompt, "Tipo", Object.values(TipoAeronave)) as TipoAeronave;
    const capacidade = parseInt(prompt("Capacidade (passageiros): ").trim()) || 0;
    const alcance = parseInt(prompt("Alcance (km): ").trim()) || 0;

    this.aeronaves.push(new Aeronave(codigo, modelo, tipo, capacidade, alcance));
    this.salvar();
    console.log(`Aeronave [${codigo}] ${modelo} cadastrada com sucesso!`);
  }

  private verDetalhesAeronave(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
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

  private removerAeronave(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    const conf = prompt(
      `Confirmar remocao de [${aeronave.codigo}] ${aeronave.modelo}? (s/n): `
    )
      .trim()
      .toLowerCase();
    if (conf === "s") {
      this.aeronaves = this.aeronaves.filter((a) => a.codigo !== aeronave.codigo);
      this.salvar();
      console.log("Aeronave removida.");
    } else {
      console.log("Operacao cancelada.");
    }
  }

  // ─── Pecas ───────────────────────────────────────────────────────────────────

  private menuPecas(): void {
    let ativo = true;
    while (ativo) {
      console.log("\n--- Gerenciar Pecas ---");
      console.log("1. Listar Pecas de Aeronave");
      console.log("2. Adicionar Peca");
      console.log("3. Atualizar Status de Peca");
      console.log("0. Voltar");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.listarPecas(); break;
        case "2": this.adicionarPeca(); break;
        case "3": this.atualizarStatusPeca(); break;
        case "0": ativo = false; break;
        default: console.log("Opcao invalida.");
      }
    }
  }

  private listarPecas(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
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

  private adicionarPeca(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    console.log("\n--- Adicionar Peca ---");
    const nome = prompt("Nome da peca: ").trim();
    const tipo = selecionarEnum(prompt, "Tipo", Object.values(TipoPeca)) as TipoPeca;
    const fornecedor = prompt("Fornecedor: ").trim();
    const status = selecionarEnum(prompt, "Status", Object.values(StatusPeca)) as StatusPeca;

    aeronave.pecas.push(new Peca(nome, tipo, fornecedor, status));
    this.salvar();
    console.log(`Peca "${nome}" adicionada a aeronave ${aeronave.codigo}.`);
  }

  private atualizarStatusPeca(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    if (aeronave.pecas.length === 0) {
      console.log("Nenhuma peca nesta aeronave.");
      return;
    }
    console.log(`\nPecas de [${aeronave.codigo}]:`);
    aeronave.pecas.forEach((p, i) =>
      console.log(`${i + 1}. ${p.nome} | ${p.status}`)
    );
    const idx = parseInt(prompt("Numero da peca: ").trim()) - 1;
    if (idx < 0 || idx >= aeronave.pecas.length) {
      console.log("Selecao invalida.");
      return;
    }
    const peca = aeronave.pecas[idx];
    const novoStatus = selecionarEnum(prompt, "Novo Status", Object.values(StatusPeca)) as StatusPeca;
    peca.atualizarStatus(novoStatus);
    this.salvar();
    console.log(`Status de "${peca.nome}" atualizado para ${novoStatus}.`);
  }

  // ─── Etapas ──────────────────────────────────────────────────────────────────

  private menuEtapas(): void {
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
        case "1": this.listarEtapas(); break;
        case "2": this.adicionarEtapa(); break;
        case "3": this.iniciarEtapa(); break;
        case "4": this.finalizarEtapa(); break;
        case "5": this.adicionarFuncionarioEtapa(); break;
        case "6": this.listarFuncionariosEtapa(); break;
        case "0": ativo = false; break;
        default: console.log("Opcao invalida.");
      }
    }
  }

  private listarEtapas(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    console.log(`\n--- Etapas de [${aeronave.codigo}] ---`);
    if (aeronave.etapas.length === 0) {
      console.log("Nenhuma etapa cadastrada.");
      return;
    }
    aeronave.etapas.forEach((e, i) =>
      console.log(
        `${i + 1}. ${e.nome} | Prazo: ${e.prazo} | ${e.status} | Func: ${e.funcionarioIds.length}`
      )
    );
  }

  private adicionarEtapa(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    console.log("\n--- Adicionar Etapa ---");
    const nome = prompt("Nome da etapa: ").trim();
    const prazo = prompt("Prazo (dd/mm/aaaa): ").trim();
    aeronave.etapas.push(new Etapa(nome, prazo));
    this.salvar();
    console.log(`Etapa "${nome}" adicionada.`);
  }

  private iniciarEtapa(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
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
    this.salvar();
    console.log(`Etapa "${etapa.nome}" iniciada.`);
  }

  private finalizarEtapa(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
    if (!resultado) return;
    const { etapa } = resultado;

    if (etapa.status !== StatusEtapa.ANDAMENTO) {
      console.log(`Etapa "${etapa.nome}" nao esta em andamento (status: ${etapa.status}).`);
      return;
    }
    etapa.finalizar();
    this.salvar();
    console.log(`Etapa "${etapa.nome}" concluida.`);
  }

  private adicionarFuncionarioEtapa(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
    if (!resultado) return;
    const { etapa } = resultado;

    if (this.funcionarios.length === 0) {
      console.log("Nenhum funcionario cadastrado.");
      return;
    }
    console.log("\nSelecione o funcionario:");
    this.funcionarios.forEach((f, i) => {
      const ja = etapa.funcionarioIds.includes(f.id) ? " [ja adicionado]" : "";
      console.log(`${i + 1}. ${f.nome} | ${f.nivelPermissao}${ja}`);
    });
    const idx = parseInt(prompt("Numero: ").trim()) - 1;
    if (idx < 0 || idx >= this.funcionarios.length) {
      console.log("Selecao invalida.");
      return;
    }
    const func = this.funcionarios[idx];
    if (etapa.funcionarioIds.includes(func.id)) {
      console.log(`${func.nome} ja esta nesta etapa.`);
      return;
    }
    etapa.adicionarFuncionario(func.id);
    this.salvar();
    console.log(`${func.nome} adicionado a etapa "${etapa.nome}".`);
  }

  private listarFuncionariosEtapa(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    const resultado = selecionarEtapaDaAeronave(prompt, aeronave);
    if (!resultado) return;
    const { etapa } = resultado;

    const funcs = etapa.listarFuncionarios(this.funcionarios);
    console.log(`\n--- Funcionarios da Etapa "${etapa.nome}" ---`);
    if (funcs.length === 0) {
      console.log("Nenhum funcionario associado.");
      return;
    }
    funcs.forEach((f, i) =>
      console.log(`${i + 1}. ${f.nome} | ${f.nivelPermissao} | Tel: ${f.telefone}`)
    );
  }

  // ─── Funcionarios ────────────────────────────────────────────────────────────

  private menuFuncionarios(): void {
    let ativo = true;
    while (ativo) {
      console.log("\n--- Gerenciar Funcionarios ---");
      console.log("1. Listar Funcionarios");
      console.log("2. Cadastrar Funcionario");
      console.log("3. Remover Funcionario");
      console.log("0. Voltar");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.listarFuncionarios(); break;
        case "2": this.cadastrarFuncionario(); break;
        case "3": this.removerFuncionario(); break;
        case "0": ativo = false; break;
        default: console.log("Opcao invalida.");
      }
    }
  }

  private listarFuncionarios(): void {
    console.log("\n--- Lista de Funcionarios ---");
    if (this.funcionarios.length === 0) {
      console.log("Nenhum funcionario cadastrado.");
      return;
    }
    this.funcionarios.forEach((f, i) =>
      console.log(
        `${i + 1}. [${f.id}] ${f.nome} | ${f.nivelPermissao} | Usuario: ${f.usuario} | Tel: ${f.telefone}`
      )
    );
  }

  private cadastrarFuncionario(): void {
    console.log("\n--- Cadastrar Funcionario ---");
    const id = proximoId(this.funcionarios);
    const nome = prompt("Nome: ").trim();
    const telefone = prompt("Telefone: ").trim();
    const endereco = prompt("Endereco: ").trim();

    let usuario = "";
    do {
      usuario = prompt("Usuario (login): ").trim();
      if (!usuario) { console.log("Usuario nao pode ser vazio."); continue; }
      if (this.funcionarios.find((f) => f.usuario === usuario)) {
        console.log("Usuario ja existe. Escolha outro.");
        usuario = "";
      }
    } while (!usuario);

    const senha = prompt("Senha: ", { echo: "*" }).trim();
    const nivel = selecionarEnum(
      prompt,
      "Nivel de Permissao",
      Object.values(NivelPermissao)
    ) as NivelPermissao;

    this.funcionarios.push(
      new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel)
    );
    this.salvar();
    console.log(`Funcionario "${nome}" cadastrado com ID ${id}.`);
  }

  private removerFuncionario(): void {
    this.listarFuncionarios();
    if (this.funcionarios.length === 0) return;

    const idx = parseInt(prompt("Numero do funcionario para remover: ").trim()) - 1;
    if (idx < 0 || idx >= this.funcionarios.length) {
      console.log("Selecao invalida.");
      return;
    }
    const f = this.funcionarios[idx];
    if (f.id === this.logado!.id) {
      console.log("Voce nao pode remover a si mesmo.");
      return;
    }
    const conf = prompt(`Confirmar remocao de "${f.nome}"? (s/n): `).trim().toLowerCase();
    if (conf === "s") {
      this.funcionarios.splice(idx, 1);
      this.salvar();
      console.log("Funcionario removido.");
    } else {
      console.log("Operacao cancelada.");
    }
  }

  // ─── Testes ──────────────────────────────────────────────────────────────────

  private menuTestes(): void {
    let ativo = true;
    while (ativo) {
      console.log("\n--- Gerenciar Testes ---");
      console.log("1. Listar Testes de Aeronave");
      console.log("2. Realizar Teste");
      console.log("0. Voltar");
      switch (prompt("Opcao: ").trim()) {
        case "1": this.listarTestes(); break;
        case "2": this.realizarTeste(); break;
        case "0": ativo = false; break;
        default: console.log("Opcao invalida.");
      }
    }
  }

  private listarTestes(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    console.log(`\n--- Testes de [${aeronave.codigo}] ---`);
    if (aeronave.testes.length === 0) {
      console.log("Nenhum teste registrado.");
      return;
    }
    aeronave.testes.forEach((t, i) =>
      console.log(`${i + 1}. ${t.tipo} | ${t.resultado}`)
    );
  }

  private realizarTeste(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;
    console.log("\n--- Realizar Teste ---");
    const tipo = selecionarEnum(prompt, "Tipo de Teste", Object.values(TipoTeste)) as TipoTeste;
    const resultado = selecionarEnum(
      prompt,
      "Resultado",
      Object.values(ResultadoTeste)
    ) as ResultadoTeste;

    aeronave.testes.push(new Teste(tipo, resultado));
    this.salvar();
    console.log(`Teste ${tipo} registrado com resultado: ${resultado}.`);
  }

  // ─── Relatorio ───────────────────────────────────────────────────────────────

  private menuRelatorio(): void {
    const aeronave = selecionarAeronave(prompt, this.aeronaves);
    if (!aeronave) return;

    console.log("\n--- Gerar Relatorio ---");
    const cliente = prompt("Nome do cliente: ").trim();
    const dataEntrega = prompt("Data de entrega (dd/mm/aaaa): ").trim();

    const relatorio = new Relatorio();
    relatorio.gerarRelatorio(aeronave, this.funcionarios, cliente, dataEntrega);

    console.log("\n" + relatorio.getConteudo());

    const nomeArquivo = `relatorio_${aeronave.codigo}_${Date.now()}.txt`;
    relatorio.salvarEmArquivo(nomeArquivo);
    console.log(`Relatorio salvo em: ${nomeArquivo}`);
  }

}
