const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let eventos = [];

// Função para enviar eventos para qualquer URL
async function enviarEvento(url, evento) {
  try {
    await axios.post(url, evento, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
  } catch (error) {
    console.error(`Erro enviando evento para ${url}: ${error.message}`);
    // Ignora o erro para não quebrar o barramento
  }
}

app.post('/eventos', async (req, res) => {
  const evento = req.body;
  
   // IGNORA eventos vazios
  if (!evento || !evento.tipo) {
    console.log("Evento inválido recebido:", evento);
    return res.status(400).send({ erro: "Evento inválido: faltando 'tipo'" });
  }
  console.log(" Evento recebido:", evento);
  eventos.push(evento);


  // Envia o evento para todos os microsserviços
 try {
    await axios.post("http://localhost:4000/eventos", evento);
    await axios.post("http://localhost:5000/eventos", evento);
    await axios.post("http://localhost:6000/eventos", evento);
    await axios.post("http://localhost:7000/eventos", evento);
  } catch (error) {
    console.log("Erro enviando evento:", error.message);
  }
  res.status(200).send({ msg: 'ok' });
});

app.get('/eventos', (req, res) => {
  res.send(eventos);
});

app.listen(10000, () => {
  console.log('Barramento de eventos rodando na porta 10000.');
});