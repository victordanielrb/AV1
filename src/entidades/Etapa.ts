import { StatusEtapa } from "../tipo/enums";
import { Funcionario } from "./Funcionario";

export class Etapa {
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionarioIds: string[];

  constructor(nome: string, prazo: string, status: StatusEtapa = StatusEtapa.PENDENTE) {
    this.nome = nome;
    this.prazo = prazo;
    this.status = status;
    this.funcionarioIds = [];
  }

  iniciar(): void {
    this.status = StatusEtapa.ANDAMENTO;
  }

  finalizar(): void {
    this.status = StatusEtapa.CONCLUIDA;
  }

  adicionarFuncionario(funcionarioId: string): void {
    if (!this.funcionarioIds.includes(funcionarioId)) {
      this.funcionarioIds.push(funcionarioId);
    }
  }

  listarFuncionarios(todosFuncionarios: Funcionario[]): Funcionario[] {
    return todosFuncionarios.filter((f) => this.funcionarioIds.includes(f.id));
  }
}
