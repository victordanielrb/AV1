import * as fs from "fs";
import * as path from "path";
import { Aeronave } from "../entidades/Aeronave";
import { Funcionario } from "../entidades/Funcionario";
import { mapAeronaves, mapFuncionarios } from "./database/mappers";

const DATA_DIR = "./dados";
const AERONAVES_FILE = path.join(DATA_DIR, "aeronaves.txt");
const FUNCIONARIOS_FILE = path.join(DATA_DIR, "funcionarios.txt");

export class Database {
  private static garantirDiretorio(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  static salvarAeronaves(aeronaves: Aeronave[]): void {
    this.garantirDiretorio();
    fs.writeFileSync(AERONAVES_FILE, JSON.stringify(aeronaves, null, 2), "utf-8");
  }

  static carregarAeronaves(): Aeronave[] {
    if (!fs.existsSync(AERONAVES_FILE)) return [];
    try {
      const data: unknown = JSON.parse(fs.readFileSync(AERONAVES_FILE, "utf-8"));
      return mapAeronaves(data);
    } catch {
      return [];
    }
  }

  static salvarFuncionarios(funcionarios: Funcionario[]): void {
    this.garantirDiretorio();
    fs.writeFileSync(FUNCIONARIOS_FILE, JSON.stringify(funcionarios, null, 2), "utf-8");
  }

  static carregarFuncionarios(): Funcionario[] {
    if (!fs.existsSync(FUNCIONARIOS_FILE)) return [];
    try {
      const data: unknown = JSON.parse(fs.readFileSync(FUNCIONARIOS_FILE, "utf-8"));
      return mapFuncionarios(data);
    } catch {
      return [];
    }
  }
}
