// classificacao/src/distribuidorEventos.js
const axios = require("axios");

async function enviarEvento(tipo, dados) {
  try {
    await axios.post("http://localhost:10000/eventos", {
      tipo,
      dados
    });
  } catch (err) {
    console.error("Erro ao enviar evento (classificação):", err.message);
    // não lança para não quebrar o serviço
  }
}

module.exports = { enviarEvento };
