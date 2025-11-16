// classificacao/src/servicoClassificacao.js
const { enviarEvento } = require("./distribuidorEventos");

class ClassificacaoService {
  constructor() {
    this.palavraChave = "importante";

    this.funcoes = {
      LembreteCriado: async (dados) => {
        await this.classificarLembrete(dados);
      },
      ObservacaoCriada: async (dados) => {
        await this.classificarObservacao(dados);
      }
    };
  }

  // Classifica lembrete
  async classificarLembrete(dados) {
    const texto = dados && dados.texto ? String(dados.texto) : "";
    const status = dados.status
      ? dados.status
      : (texto.includes(this.palavraChave) ? "importante" : "comum");
    const atualizado = { ...dados, status };

    console.log(" Lembrete classificado:", atualizado);

    await enviarEvento("LembreteClassificado", atualizado);
  }

  // Classifica observação
  async classificarObservacao(dados) {
    const texto = dados && dados.texto ? String(dados.texto) : "";
    const status = dados.status
      ? dados.status
      : (texto.includes(this.palavraChave) ? "importante" : "comum");
    const atualizado = { ...dados, status };

    console.log(" Observação classificada:", atualizado);

    await enviarEvento("ObservacaoClassificada", atualizado);
  }

  // Processa eventos recebidos
  async processarEvento(tipo, dados) {
    const fn = this.funcoes[tipo];
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
}


const classificacaoService = new ClassificacaoService();

module.exports = {
  processarEvento: (tipo, dados) => classificacaoService.processarEvento(tipo, dados),
  palavraChave: classificacaoService.palavraChave
};
