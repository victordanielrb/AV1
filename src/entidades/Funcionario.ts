import { Database } from "../servico/Database";
import { NivelPermissao } from "../tipo/enums";

export class Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;

  constructor(
    id: string,
    nome: string,
    telefone: string,
    endereco: string,
    usuario: string,
    senha: string,
    nivelPermissao: NivelPermissao
  ) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.nivelPermissao = nivelPermissao;
  }

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  salvar(): void {

    const funcionarios = Database.carregarFuncionarios();
    const index = funcionarios.findIndex((f) => f.id === this.id);
    //procura o funcionario pelo id, se encontrar atualiza, senao adiciona novo
    //aparentemente findIndex retorna -1 se nao encontrar
    if (index !== -1 ) {
      funcionarios[index] = this;
    } else {
      funcionarios.push(this);
    }
  }

  carregar(): void {}
}
