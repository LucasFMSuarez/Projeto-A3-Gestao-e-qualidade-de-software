// src/servicoObservacoes.js
const { v4: uuidv4 } = require("uuid");
const { enviarEvento } = require("./distribuidorEventos");

// Armazena as observações agrupadas pelo ID do lembrete
const observacoesPorLembreteId = {};


const funcoes = {
  ObservacaoClassificada: (observacao) => {
    const observacoes = observacoesPorLembreteId[observacao.lembreteId];
    if (!observacoes) return;

    const obsParaAtualizar = observacoes.find(o => o.id === observacao.id);
    if (!obsParaAtualizar) return;

    obsParaAtualizar.status = observacao.status;

    enviarEvento({
      tipo: "ObservacaoAtualizada",
      dados: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status
      }
    });
  }
};

// Cria uma nova observação
async function criarObservacao(lembreteId, texto) {
  const idObs = uuidv4();
  const observacoesDoLembrete = observacoesPorLembreteId[lembreteId] || [];

  const novaObservacao = { id: idObs, texto, status: "aguardando" };
  observacoesDoLembrete.push(novaObservacao);
  observacoesPorLembreteId[lembreteId] = observacoesDoLembrete;

  await enviarEvento({
    tipo: "ObservacaoCriada",
    dados: { id: idObs, texto, lembreteId, status: "aguardando" }
  });

  return observacoesDoLembrete;
}

// Lista observações de um lembrete
function listarObservacoes(lembreteId) {
  return observacoesPorLembreteId[lembreteId] || [];
}

// Processa evento recebido
function processarEvento(tipo, dados) {
  const funcao = funcoes[tipo];
  if (funcao) funcao(dados);
}

module.exports = { observacoesPorLembreteId, criarObservacao, listarObservacoes, processarEvento };
