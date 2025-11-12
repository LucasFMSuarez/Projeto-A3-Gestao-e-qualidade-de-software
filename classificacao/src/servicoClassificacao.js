// classificacao/src/servicoClassificacao.js
const { enviarEvento } = require("./distribuidorEventos");

// palavra-chave usada na classificação
const palavraChave = "importante";

const funcoes = {
  LembreteCriado: async (dados) => {
    const texto = dados && dados.texto ? String(dados.texto) : "";
    const status = texto.includes(palavraChave) ? "importante" : "comum";
    const atualizado = { ...dados, status };

    console.log(" Lembrete classificado:", atualizado);

    // envia evento de volta ao barramento
    await enviarEvento("LembreteClassificado", atualizado);
  },

  ObservacaoCriada: async (dados) => {
    const texto = dados && dados.texto ? String(dados.texto) : "";
    const status = texto.includes(palavraChave) ? "importante" : "comum";
    const atualizado = { ...dados, status };

    console.log(" Observação classificada:", atualizado);

    await enviarEvento("ObservacaoClassificada", atualizado);
  }
};

async function processarEvento(tipo, dados) {
  const fn = funcoes[tipo];
  if (fn) {
    try {
      await fn(dados);
    } catch (err) {
      console.error("Erro ao processar evento na classificação:", err.message);
    }
  } else {
    console.log(" Tipo ignorado pela classificação:", tipo);
  }
}

module.exports = {
  processarEvento,
  // exportar funcoes/palavraChave pode ajudar em testes
  funcoes,
  palavraChave
};
