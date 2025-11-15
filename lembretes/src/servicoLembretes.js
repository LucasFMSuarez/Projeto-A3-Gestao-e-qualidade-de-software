// servicoLembretes.js
const Lembrete = require("../../banco/lembreteModel");
const { enviarEvento } = require("./distribuidorEventos");

// Classe com toda a lógica interna de lembretes
class LembretesService {
  constructor() {
    this.funcoes = {
      LembreteClassificado: async (dados) => {
        await this.atualizarStatusLembrete(dados.id, dados.status);
      }
    };
  }

  // Gera ID incremental
  async gerarIdSequencial() {
    const ultimo = await Lembrete.findOne().sort({ id: -1 }).lean();
    const ultimoId =
      ultimo && typeof ultimo.id !== "undefined"
        ? Number(ultimo.id)
        : 0;

    return Number.isFinite(ultimoId) ? ultimoId + 1 : 1;
  }

  // Cria lembrete e envia evento
  async criarLembrete(texto) {
    const id = await this.gerarIdSequencial();

    const novo = await Lembrete.create({
      id,
      texto,
      status: "aguardando"
    });

    await enviarEvento("LembreteCriado", {
      id: novo.id,
      texto: novo.texto,
      status: novo.status
    });

    return novo;
  }

  // Lista todos os lembretes
  async listarLembretes() {
    return Lembrete.find();
  }

  // Atualiza status após classificação
  async atualizarStatusLembrete(id, status) {
    const lembrete = await Lembrete.findOne({ id });
    if (!lembrete) return;

    lembrete.status = status;
    await lembrete.save();

    await enviarEvento("LembreteAtualizado", {
      id: lembrete.id,
      texto: lembrete.texto,
      status: lembrete.status
    });
  }

  // Processa eventos recebidos
  async processarEvento(tipo, dados) {
    const fn = this.funcoes[tipo];
    if (fn) await fn(dados);
  }
}

// Instância
const lembretesService = new LembretesService();

// EXPORTAÇÃO 
module.exports = {
  criarLembrete: (texto) => lembretesService.criarLembrete(texto),
  listarLembretes: () => lembretesService.listarLembretes(),
  processarEvento: (tipo, dados) => lembretesService.processarEvento(tipo, dados)
};
