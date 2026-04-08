import { Aeronave } from "../../entidades/Aeronave";
import { Funcionario } from "../../entidades/Funcionario";
import { selecionarAeronave } from "../sistema/seletores";
import { Relatorio } from "../Relatorio";

type PromptFn = (mensagem: string) => string;

export function processarMenuRelatorio(
  aeronaves: Aeronave[],
  funcionarios: Funcionario[],
  prompt: PromptFn
): void {
  const aeronave = selecionarAeronave(prompt, aeronaves);
  if (!aeronave) return;
  
  console.log("\n--- Gerar Relatorio ---");
  const cliente = prompt("Nome do cliente: ").trim();
  const dataEntrega = prompt("Data de entrega (dd/mm/aaaa): ").trim();

  const relatorio = new Relatorio();
  relatorio.gerarRelatorio(aeronave, funcionarios, cliente, dataEntrega);

  console.log("\n" + relatorio.getConteudo());

  const nomeArquivo = `relatorio_${aeronave.codigo}_${Date.now()}.txt`;
  relatorio.salvarEmArquivo(nomeArquivo);
  console.log(`Relatorio salvo em: ${nomeArquivo}`);
}
