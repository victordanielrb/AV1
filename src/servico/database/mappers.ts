import { Aeronave } from "../../entidades/Aeronave";
import { Etapa } from "../../entidades/Etapa";
import { Funcionario } from "../../entidades/Funcionario";
import { Peca } from "../../entidades/Peca";
import { Teste } from "../../entidades/Teste";
import { StatusEtapa } from "../../tipo/enums";

//mapeamento de entidades, dados -> objeto com tipagem e metodos 
//deixar solto ia poluir dms 
export function mapAeronaves(data: any): Aeronave[] {
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => {
    const aeronave = new Aeronave(item.codigo, item.modelo, item.tipo, item.capacidade, item.alcance);

    aeronave.pecas = (item.pecas ?? []).map(
      (p: any) => new Peca(p.nome, p.tipo, p.fornecedor, p.status)
    );

    aeronave.etapas = (item.etapas ?? []).map((e: any) => {
      const etapa = new Etapa(e.nome, e.prazo, e.status as StatusEtapa);
      etapa.funcionarioIds = e.funcionarioIds ?? [];
      return etapa;
    });

    aeronave.testes = (item.testes ?? []).map((t: any) => new Teste(t.tipo, t.resultado));
    return aeronave;
  });
}

export function mapFuncionarios(data: any): Funcionario[] {
  if (!Array.isArray(data)) return [];

  return data.map(
    (f: any) =>
      new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao)
  );
}