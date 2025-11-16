// consulta/src/servicoConsulta.js
const Lembrete = require("../../banco/lembreteModel");
const Observacao = require("../../banco/observacaoModel");

// Classe 
class ConsultaService {
  // Retorna lembretes + observações
  async listarLembretesComObservacoes() {
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
}

// Instância 
const consultaService = new ConsultaService();

// Exportação 
module.exports = {
  listarLembretesComObservacoes: () =>
    consultaService.listarLembretesComObservacoes(),
};
