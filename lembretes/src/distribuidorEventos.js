const axios = require("axios");

async function enviarEvento(tipo, dados) {
  await axios.post("http://localhost:10000/eventos", {
    tipo,
    dados,
  });
}

module.exports = { enviarEvento };