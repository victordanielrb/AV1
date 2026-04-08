import promptSync from "prompt-sync";
import { Aeronave } from "../entidades/Aeronave";
import { Funcionario } from "../entidades/Funcionario";
import { Database } from "./Database";
import { NivelPermissao } from "../tipo/enums";
import {
  cadastrarAeronave,
  listarAeronaves,
  processarMenuAeronaves,
  removerAeronave,
  verDetalhesAeronave,
} from "./menus/aeronavesMenu";
import {
  adicionarPeca,
  atualizarStatusPeca,
  listarPecas,
  processarMenuPecas,
} from "./menus/pecasMenu";
import {
  adicionarEtapa,
  adicionarFuncionarioEtapa,
  finalizarEtapa,
  iniciarEtapa,
  listarEtapas,
  listarFuncionariosEtapa,
  processarMenuEtapas,
} from "./menus/etapasMenu";
import {
  cadastrarFuncionario,
  listarFuncionarios,
  processarMenuFuncionarios,
  removerFuncionario,
} from "./menus/funcionariosMenu";
import {
  listarTestes,
  processarMenuTestes,
  realizarTeste,
} from "./menus/testesMenu";
import { processarMenuRelatorio } from "./menus/relatorioMenu";

const prompt = promptSync({ sigint: true });

export class Sistema {
  private aeronaves: Aeronave[] = [];
  private funcionarios: Funcionario[] = [];
  private logado: Funcionario | null = null;

  constructor() {
    //Carrega os dados usando txt
    this.aeronaves = Database.carregarAeronaves();
    this.funcionarios = Database.carregarFuncionarios();
    this.criarAdminPadrao();
  }

  private salvar(): void {
    Database.salvarAeronaves(this.aeronaves);
    Database.salvarFuncionarios(this.funcionarios);
  }
  //Pra testes 
  private criarAdminPadrao(): void {
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

  private telaLogin(): boolean {
    console.log("--- Login ---");
    const usuario = prompt('Usuario (ou "sair" para encerrar): ').trim();
    if (usuario.toLowerCase() === "sair") return false;

    const senha = prompt("Senha: ", { echo: "*" }).trim();
    const f = this.funcionarios.find((funcionario) => funcionario.autenticar(usuario, senha));

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


  //Separei os menus em diversas funções pra manter mais limpo, sem um monte de switch case 
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
        case "1":
          this.menuAeronaves();
          break;
        case "2":
          this.menuPecas();
          break;
        case "3":
          this.menuEtapas();
          break;
        case "4":
          this.menuFuncionarios();
          break;
        case "5":
          this.menuTestes();
          break;
        case "6":
          this.menuRelatorio();
          break;
        case "7":
          this.logout();
          break;
        case "0":
          this.logout();
          process.exit(0);
        default:
          console.log("Opcao invalida.");
      }
      return;
    }

    if (nivel === NivelPermissao.ENGENHEIRO) {
      console.log("1. Visualizar Aeronaves");
      console.log("2. Gerenciar Pecas");
      console.log("3. Gerenciar Etapas");
      console.log("4. Gerenciar Testes");
      console.log("5. Gerar Relatorio");
      console.log("6. Logout");
      console.log("0. Sair");

      switch (prompt("Opcao: ").trim()) {
        case "1":
          this.listarAeronaves();
          break;
        case "2":
          this.menuPecas();
          break;
        case "3":
          this.menuEtapas();
          break;
        case "4":
          this.menuTestes();
          break;
        case "5":
          this.menuRelatorio();
          break;
        case "6":
          this.logout();
          break;
        case "0":
          this.logout();
          process.exit(0);
        default:
          console.log("Opcao invalida.");
      }
      return;
    }

    console.log("1. Visualizar Aeronaves");
    console.log("2. Atualizar Status de Peca");
    console.log("3. Iniciar Etapa");
    console.log("4. Finalizar Etapa");
    console.log("5. Logout");
    console.log("0. Sair");

    switch (prompt("Opcao: ").trim()) {
      case "1":
        this.listarAeronaves();
        break;
      case "2":
        this.atualizarStatusPeca();
        break;
      case "3":
        this.iniciarEtapa();
        break;
      case "4":
        this.finalizarEtapa();
        break;
      case "5":
        this.logout();
        break;
      case "0":
        this.logout();
        process.exit(0);
      default:
        console.log("Opcao invalida.");
    }
  }
  
  private menuAeronaves(): void {
    processarMenuAeronaves(this.aeronaves, () => this.salvar(), prompt);
  }

  private menuPecas(): void {
    processarMenuPecas(this.aeronaves, () => this.salvar(), prompt);
  }

  private menuEtapas(): void {
    processarMenuEtapas(this.aeronaves, this.funcionarios, () => this.salvar(), prompt);
  }

  private menuFuncionarios(): void {
    processarMenuFuncionarios(this.funcionarios, this.logado, () => this.salvar(), prompt);
  }

  private menuTestes(): void {
    processarMenuTestes(this.aeronaves, () => this.salvar(), prompt);
  }

  private menuRelatorio(): void {
    processarMenuRelatorio(this.aeronaves, this.funcionarios, prompt);
  }

  private listarAeronaves(): void {
    listarAeronaves(this.aeronaves);
  }

  private cadastrarAeronave(): void {
    cadastrarAeronave(this.aeronaves, () => this.salvar(), prompt);
  }

  private verDetalhesAeronave(): void {
    verDetalhesAeronave(this.aeronaves, prompt);
  }

  private removerAeronave(): void {
    removerAeronave(this.aeronaves, () => this.salvar(), prompt);
  }

  private listarPecas(): void {
    listarPecas(this.aeronaves, prompt);
  }

  private adicionarPeca(): void {
    adicionarPeca(this.aeronaves, () => this.salvar(), prompt);
  }

  private atualizarStatusPeca(): void {
    atualizarStatusPeca(this.aeronaves, () => this.salvar(), prompt);
  }

  private listarEtapas(): void {
    listarEtapas(this.aeronaves, prompt);
  }

  private adicionarEtapa(): void {
    adicionarEtapa(this.aeronaves, () => this.salvar(), prompt);
  }

  private iniciarEtapa(): void {
    iniciarEtapa(this.aeronaves, () => this.salvar(), prompt);
  }

  private finalizarEtapa(): void {
    finalizarEtapa(this.aeronaves, () => this.salvar(), prompt);
  }

  private adicionarFuncionarioEtapa(): void {
    adicionarFuncionarioEtapa(this.aeronaves, this.funcionarios, () => this.salvar(), prompt);
  }

  private listarFuncionariosEtapa(): void {
    listarFuncionariosEtapa(this.aeronaves, this.funcionarios, prompt);
  }

  private listarFuncionarios(): void {
    listarFuncionarios(this.funcionarios);
  }

  private cadastrarFuncionario(): void {
    cadastrarFuncionario(this.funcionarios, () => this.salvar(), prompt);
  }

  private removerFuncionario(): void {
    removerFuncionario(this.funcionarios, this.logado, () => this.salvar(), prompt);
  }

  private listarTestes(): void {
    listarTestes(this.aeronaves, prompt);
  }

  private realizarTeste(): void {
    realizarTeste(this.aeronaves, () => this.salvar(), prompt);
  }
}
