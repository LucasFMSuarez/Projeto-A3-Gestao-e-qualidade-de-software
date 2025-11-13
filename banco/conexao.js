// banco/conexao.js
const mongoose = require("mongoose");

async function conectarBanco() {
  try {
    await mongoose.connect("coloque seu banco", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(" MongoDB conectado com sucesso!");
  } catch (err) {
    console.error(" Erro ao conectar no MongoDB:", err);
  }
}

module.exports = conectarBanco;
