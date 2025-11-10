const Observacao = require("../../banco/ObservacaoModel");
const { enviarEvento } = require("./distribuidorEventos");
const { v4: uuidv4 } = require("uuid");

async function criarObservacao(lembreteId, texto) {
  const id = uuidv4();

  const nova = await Observacao.create({
    id,
    texto,
    lembreteId,
    status: "aguardando"
  });

  await enviarEvento("ObservacaoCriada", {
    id,
    texto,
    lembreteId,
    status: "aguardando",
  });

  return await listarObservacoes(lembreteId);
}

async function listarObservacoes(lembreteId) {
  return await Observacao.find({ lembreteId });
}

async function atualizarStatusObservacao(id, status) {
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

const funcoes = {
  ObservacaoClassificada: async (observacao) => {
    await atualizarStatusObservacao(observacao.id, observacao.status);
  }
};

function processarEvento(tipo, dados) {
  const fn = funcoes[tipo];
  if (fn) fn(dados);
}

module.exports = {
  criarObservacao,
  listarObservacoes,
  processarEvento
};