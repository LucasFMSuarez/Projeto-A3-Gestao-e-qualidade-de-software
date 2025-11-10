// src/servicoObservacoes.js
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Armazena as observações agrupadas pelo ID do lembrete
const observacoesPorLembreteId = {};

// Define funções associadas a tipos de eventos recebidos
const funcoes = {
  ObservacaoClassificada: (observacao) => {
    const observacoes = observacoesPorLembreteId[observacao.lembreteId];
    if (!observacoes) return;

    const obsParaAtualizar = observacoes.find(o => o.id === observacao.id);
    if (!obsParaAtualizar) return;

    obsParaAtualizar.status = observacao.status;

    // Notifica o barramento de eventos sobre a atualização
    axios.post("http://localhost:10000/eventos", {
      tipo: "ObservacaoAtualizada",
      dados: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status
      }
    }).catch(err => console.error("Erro ao enviar evento:", err.message));
  }
};

// Cria uma nova observação associada a um lembrete
async function criarObservacao(lembreteId, texto) {
  const idObs = uuidv4();
  const observacoesDoLembrete = observacoesPorLembreteId[lembreteId] || [];

  const novaObservacao = { id: idObs, texto, status: "aguardando" };
  observacoesDoLembrete.push(novaObservacao);
  observacoesPorLembreteId[lembreteId] = observacoesDoLembrete;

  // Envia o evento de criação para o barramento
  await axios.post("http://localhost:10000/eventos", {
    tipo: "ObservacaoCriada",
    dados: { id: idObs, texto, lembreteId, status: "aguardando" }
  }).catch(err => console.error("Erro ao enviar evento:", err.message));

  return observacoesDoLembrete;
}

// Retorna todas as observações de um lembrete específico
function listarObservacoes(lembreteId) {
  return observacoesPorLembreteId[lembreteId] || [];
}

// Processa eventos recebidos do barramento
function processarEvento(tipo, dados) {
  const funcao = funcoes[tipo];
  if (funcao) funcao(dados);
}

module.exports = { observacoesPorLembreteId,criarObservacao, listarObservacoes, processarEvento };
