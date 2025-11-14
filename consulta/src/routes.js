// consulta/src/routes.js
const express = require("express");
const router = express.Router();

const { listarLembretesComObservacoes } = require("./servicoConsulta");
const { processarEvento } = require("./funcoesEventos");

// GET /lembretes
router.get("/lembretes", async (req, res) => {
  try {
    const resultado = await listarLembretesComObservacoes();
    res.status(200).send(resultado);
  } catch (err) {
    console.error("Erro ao listar lembretes:", err);
    res.status(500).send({ erro: "Erro ao listar." });
  }
});

// POST /eventos
router.post("/eventos", async (req, res) => {
  console.log("Consulta recebeu evento:", req.body);
  const { tipo, dados } = req.body;

  try {
    await processarEvento(tipo, dados);
  } catch (err) {
    console.error("Erro ao processar evento na consulta:", err.message);
  }

  res.status(200).send({ msg: "ok" });
});

module.exports = router;
