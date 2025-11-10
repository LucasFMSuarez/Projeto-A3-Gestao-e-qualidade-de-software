// src/routes.js
const express = require("express");
const { criarObservacao, listarObservacoes, processarEvento } = require("./servicoObservacoes");

const router = express.Router();

// Cria nova observação
router.put("/lembretes/:id/observacoes", async (req, res) => {
  try {
    const observacoes = await criarObservacao(req.params.id, req.body.texto);
    res.status(201).send(observacoes);
  } catch {
    res.status(500).send({ erro: "Erro ao criar observação." });
  }
});

// Lista observações
router.get("/lembretes/:id/observacoes", (req, res) => {
  const observacoes = listarObservacoes(req.params.id);
  res.send(observacoes);
});

// Recebe eventos do barramento
router.post("/eventos", (req, res) => {
  const { tipo, dados } = req.body;
  processarEvento(tipo, dados);
  res.status(200).send({ msg: "ok" });
});

module.exports = router;
