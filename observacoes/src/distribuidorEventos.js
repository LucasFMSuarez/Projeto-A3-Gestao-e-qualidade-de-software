// src/distribuidorEventos.js
const axios = require("axios");

async function enviarEvento(evento) {
  try {
    await axios.post("http://localhost:10000/eventos", evento);
  } catch (err) {
    console.error("Erro ao enviar evento:", err.message);
  }
}

module.exports = { enviarEvento };
