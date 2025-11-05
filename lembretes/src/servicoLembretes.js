
const { enviarEvento } = require("./distribuidorEventos");

let contador = 0;
const lembretes = {};

async function criarLembrete(texto) {
  contador++;
  const novo = { contador, texto };
  lembretes[contador] = novo;

  // Envia evento
  await enviarEvento("LembreteCriado", { contador, texto });

  return novo;
}

function listarLembretes() {
  return lembretes;
}

module.exports = { criarLembrete, listarLembretes };