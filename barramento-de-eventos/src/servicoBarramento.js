// barramento/src/servicoBarramento.js
const axios = require("axios");

// Classe 
class BarramentoService {
  constructor() {
    this.eventos = [];
  }

  async enviarEvento(url, evento) {
    try {
      await axios.post(url, evento, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000
      });
    } catch (error) {
      console.error(`Erro enviando evento para ${url}: ${error.message}`);
    }
  }

  armazenarEvento(evento) {
    this.eventos.push(evento);
  }

  listarEventos() {
    return this.eventos;
  }
}

const barramento = new BarramentoService();

// Exportamos as funções 
module.exports = {
  enviarEvento: (url, evento) => barramento.enviarEvento(url, evento),
  armazenarEvento: (evento) => barramento.armazenarEvento(evento),
  listarEventos: () => barramento.listarEventos()
};
