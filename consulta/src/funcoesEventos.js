// consulta/src/funcoesEventos.js
const Lembrete = require("../../banco/lembreteModel");
const Observacao = require("../../banco/observacaoModel");

const funcoes = {
  LembreteCriado: async (dados) => {
    await Lembrete.create({
      id: dados.id,
      texto: dados.texto,
      status: dados.status,
    });
    console.log("Consulta armazenou lembrete:", dados);
  },

  LembreteAtualizado: async (dados) => {
    await Lembrete.findOneAndUpdate(
      { id: dados.id },
      { status: dados.status }
    );
    console.log("Consulta atualizou lembrete:", dados);
  },

  ObservacaoCriada: async (dados) => {
    await Observacao.findOneAndUpdate(
      { id: dados.id },
      {
        texto: dados.texto,
        status: dados.status,
        lembreteId: dados.lembreteId,
      },
      { upsert: true, new: true }
    );
    console.log("Consulta armazenou/atualizou observação:", dados);
  },

  ObservacaoAtualizada: async (dados) => {
    await Observacao.findOneAndUpdate(
      { id: dados.id },
      { texto: dados.texto, status: dados.status }
    );
    console.log("Consulta atualizou observação:", dados);
  },
};

async function processarEvento(tipo, dados) {
  const fn = funcoes[tipo];

  if (fn) {
    await fn(dados);
  } else {
    console.log("⚠ Consulta ignorou tipo:", tipo);
  }
}

module.exports = { processarEvento };
