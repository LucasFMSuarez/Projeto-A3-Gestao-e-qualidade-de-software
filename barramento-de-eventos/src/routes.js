// barramento/src/rotas.js
const express = require("express");
const router = express.Router();
const { enviarEvento, armazenarEvento, listarEventos } = require("./servicoBarramento");

router.post("/eventos", async (req, res) => {
  const evento = req.body;

  if (!evento || !evento.tipo) {
    console.log("Evento inválido recebido:", evento);
    return res.status(400).send({ erro: "Evento inválido: faltando 'tipo'" });
  }

  console.log("Evento recebido:", evento);
  armazenarEvento(evento);

  // envia para os microsserviços
  try {
    await enviarEvento("http://localhost:4000/eventos", evento);
    await enviarEvento("http://localhost:5000/eventos", evento);
    await enviarEvento("http://localhost:6000/eventos", evento);
    await enviarEvento("http://localhost:7000/eventos", evento);
  } catch (err) {
    console.log("Erro enviando evento:", err.message);
  }

  res.status(200).send({ msg: "ok" });
});

router.get("/eventos", (req, res) => {
  res.send(listarEventos());
});

module.exports = router;
