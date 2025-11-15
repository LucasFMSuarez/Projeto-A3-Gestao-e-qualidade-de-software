// src/routes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const {
  criarObservacao,
  listarObservacoes,
  processarEvento
} = require("./servicoObservacoes");

// Criar observação com PUT, igual ao serviço de lembretes
router.put("/lembretes/:id/observacoes", async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).send({ erro: "O campo 'texto' é obrigatório." });

    const observacao = await criarObservacao(req.params.id, texto);
    res.status(201).send(observacao); // retorna somente a nova observação
  } catch (err) {
    console.error("Erro ao criar observação:", err);
    res.status(500).send({ erro: "Erro ao criar observação." });
  }
});

// Listar observações
router.get("/lembretes/:id/observacoes", async (req, res) => {
  try {
    const observacoes = await listarObservacoes(req.params.id);
    res.send(observacoes);
  } catch (err) {
    console.error("Erro ao listar observações:", err);
    res.status(500).send({ erro: "Erro ao listar observações." });
  }
});

// Receber eventos do barramento
router.post("/eventos", async (req, res) => {
  try {
    const { tipo, dados } = req.body;
     console.log(" Observações recebeu:", tipo, dados);
    if (!tipo) {
      return res.status(400).send({ erro: "Evento sem tipo" });
    }

    await processarEvento(tipo, dados);
    res.send({ msg: "ok" });
  } catch (err) {
    console.error("Erro ao processar evento:", err);
    res.status(500).send({ erro: "Erro ao processar evento." });
  }
});

// Excluir observação
router.delete("/observacoes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Evento para o barramento
    await axios.post("http://localhost:10000/eventos", {
      tipo: "ObservacaoExcluida",
      dados: { id }
    });

    res.send({ msg: "Observação excluída (evento enviado ao barramento)" });
  } catch (err) {
    console.error("Erro ao excluir observação:", err);
    res.status(500).send({ erro: "Erro ao excluir observação." });
  }
});


module.exports = router;