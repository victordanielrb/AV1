import { Aeronave } from "../../entidades/Aeronave";
import { Etapa } from "../../entidades/Etapa";
import { Funcionario } from "../../entidades/Funcionario";
import { Peca } from "../../entidades/Peca";
import { Teste } from "../../entidades/Teste";
import { StatusEtapa } from "../../tipo/enums";

export function mapAeronaves(data: unknown): Aeronave[] {
  if (!Array.isArray(data)) return [];

  return data.map((a: any) => {
    const aeronave = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance);

    aeronave.pecas = (a.pecas ?? []).map(
      (p: any) => new Peca(p.nome, p.tipo, p.fornecedor, p.status)
    );

    aeronave.etapas = (a.etapas ?? []).map((e: any) => {
      const etapa = new Etapa(e.nome, e.prazo, e.status as StatusEtapa);
      etapa.funcionarioIds = e.funcionarioIds ?? [];
      return etapa;
    });

    aeronave.testes = (a.testes ?? []).map((t: any) => new Teste(t.tipo, t.resultado));
    return aeronave;
  });
}

export function mapFuncionarios(data: unknown): Funcionario[] {
  if (!Array.isArray(data)) return [];

  return data.map(
    (f: any) =>
      new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao)
  );
}