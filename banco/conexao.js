// banco/conexao.js
const mongoose = require("mongoose");

async function conectarBanco() {
  try {
    await mongoose.connect("mongodb+srv://luizwashingtonmuraro:L11272615@a3.cngehuq.mongodb.net/?appName=A3", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(" MongoDB conectado com sucesso!");
  } catch (err) {
    console.error(" Erro ao conectar no MongoDB:", err);
  }
}

module.exports = conectarBanco;
