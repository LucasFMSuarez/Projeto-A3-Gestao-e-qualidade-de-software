// barramento/src/servicoBarramento.js
const axios = require("axios");

// Array para armazenar eventos
const eventos = [];

// Envia evento para o barramento
async function enviarEvento(url, evento) {
  try {
    await axios.post(url, evento, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000
    });
  } catch (error) {
    console.error(`Erro enviando evento para ${url}: ${error.message}`);
  }
}

// Adiciona evento localmente
function armazenarEvento(evento) {
  eventos.push(evento);
}

// Retorna todos os eventos
function listarEventos() {
  return eventos;
}

module.exports = {
  enviarEvento,
  armazenarEvento,
  listarEventos
};
