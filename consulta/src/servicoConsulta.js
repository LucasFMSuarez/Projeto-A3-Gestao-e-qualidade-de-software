// consulta/src/servicoConsulta.js
const Lembrete = require("../../banco/lembreteModel");
const Observacao = require("../../banco/observacaoModel");

// Retorna lembretes + observações
async function listarLembretesComObservacoes() {
  const lembretes = await Lembrete.find();
  const resultado = {};

  for (const lembrete of lembretes) {
    const observacoes = await Observacao.find({ lembreteId: lembrete.id });

    resultado[lembrete.id] = {
      id: lembrete.id,
      texto: lembrete.texto,
      status: lembrete.status,
      observacoes,
    };
  }

  return resultado;
}

module.exports = {
  listarLembretesComObservacoes,
};