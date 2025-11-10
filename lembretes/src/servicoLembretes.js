const Lembrete = require("../../banco/lembreteModel");
const { enviarEvento } = require("./distribuidorEventos");

const palavraChave = "importante"; // palavra-chave para classificação

// Gera ID incremental de forma segura
async function gerarIdSequencial() {
  const ultimo = await Lembrete.findOne().sort({ id: -1 }).lean();
  const ultimoId = ultimo && typeof ultimo.id !== "undefined" ? Number(ultimo.id) : 0;
  return Number.isFinite(ultimoId) ? ultimoId + 1 : 1;
}

// Cria lembrete e envia evento inicial
async function criarLembrete(texto) {
  const id = await gerarIdSequencial();

  const novo = await Lembrete.create({
    id,
    texto,
    status: "aguardando" // status inicial antes da classificação
  });

  // Envia evento para barramento para que o serviço de classificação trate
  await enviarEvento({
    tipo: "LembreteCriado",
    dados: {
      id: novo.id,
      texto: novo.texto,
      status: novo.status
    }
  });

  return novo;
}

// Lista todos os lembretes
async function listarLembretes() {
  return Lembrete.find();
}

// Atualiza status após classificação
async function atualizarStatusLembrete(id, status) {
  const lembrete = await Lembrete.findOne({ id });
  if (!lembrete) return;

  lembrete.status = status;
  await lembrete.save();

  // Reenvia evento de atualização
  await enviarEvento({
    tipo: "LembreteAtualizado",
    dados: {
      id: lembrete.id,
      texto: lembrete.texto,
      status: lembrete.status
    }
  });
}

// Funções para processar eventos recebidos do barramento
const funcoes = {
  LembreteClassificado: async (dados) => {
    await atualizarStatusLembrete(dados.id, dados.status);
  }
};

// Processa eventos recebidos
function processarEvento(tipo, dados) {
  const fn = funcoes[tipo];
  if (fn) fn(dados);
}

module.exports = {
  criarLembrete,
  listarLembretes,
  processarEvento
};