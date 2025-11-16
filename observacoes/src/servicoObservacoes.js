// servicoObservacoes.js
const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("./distribuidorEventos");
const { v4: uuidv4 } = require("uuid");

class ObservacoesService {
  constructor() {
    this.funcoes = {
      ObservacaoClassificada: async (observacao) => {
        await this.atualizarStatusObservacao(observacao.id, observacao.status);
      }
    };
  }

  // Cria nova observação
async criarObservacao(lembreteId, texto, status = "aguardando") {
  const id = uuidv4();

  const nova = await Observacao.create({
    id,
    texto,
    lembreteId,
    status, // <- usar status recebido
  });

  await enviarEvento("ObservacaoCriada", {
    id,
    texto,
    lembreteId,
    status,
  });

  return nova;
}


  // Lista observações de um lembrete específico
  async listarObservacoes(lembreteId) {
    return Observacao.find({ lembreteId });
  }

  // Atualiza status da observação
  async atualizarStatusObservacao(id, status) {
    const obs = await Observacao.findOne({ id });
    if (!obs) return;

    obs.status = status;
    await obs.save();

    await enviarEvento("ObservacaoAtualizada", {
      id: obs.id,
      texto: obs.texto,
      lembreteId: obs.lembreteId,
      status: obs.status,
    });
  }

  // Processa eventos recebidos
  async processarEvento(tipo, dados) {
    const fn = this.funcoes[tipo];
    if (fn) await fn(dados);
  }
}


const observacoesService = new ObservacoesService();

// Exportação 
module.exports = {
  criarObservacao: (lembreteId, texto, status) => observacoesService.criarObservacao(lembreteId, texto, status),
  listarObservacoes: (lembreteId) => observacoesService.listarObservacoes(lembreteId),
  processarEvento: (tipo, dados) => observacoesService.processarEvento(tipo, dados)
};