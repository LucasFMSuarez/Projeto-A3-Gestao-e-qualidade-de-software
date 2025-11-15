// banco/conexao.js
const mongoose = require("mongoose");

// Classe POO 
class Database {
  constructor(url) {
    this.url = url;
  }

  async conectar() {
    try {
      await mongoose.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(" MongoDB conectado com sucesso!");
    } catch (err) {
      console.error(" Erro ao conectar no MongoDB:", err);
    }
  }
}

const db = new Database(
  "coloque o banco aqui"
);

// Exporta a função db
module.exports = () => db.conectar();
