  const observacoesService = require("../../observacoes/src/servicoObservacoes");
  const express = require("express");
  const axios = require("axios");
  const lembreteService = require("./servicoLembretes");

  const router = express.Router();

  // Lista todos os lembretes
  router.get("/lembretes", async (req, res) => {
    try {
      const lista = await lembreteService.listarLembretes();
      res.send(lista);
    } catch (err) {
      console.error("Erro ao listar lembretes:", err);
      res.status(500).send({ erro: "Erro ao listar lembretes." });
    }
  });

  // Cria um novo lembrete
  router.put("/lembretes", async (req, res) => {
    const { texto, status } = req.body;
    try {
      const lembrete = await lembreteService.criarLembrete(texto, status);
      res.status(201).send(lembrete);
    } catch (err) {
      res.status(500).send({ erro: err.message });
    }
  });

  // Criar observação
  router.put("/lembretes/:id/observacoes", async (req, res) => {
    const { texto, status } = req.body;
    try {
      const obs = await observacoesService.criarObservacao(req.params.id, texto, status);
      res.status(201).send(obs);
    } catch (err) {
      res.status(500).send({ erro: err.message });
    }
  });

  // Recebe eventos do barramento
  router.post("/eventos", async (req, res) => {
    const { tipo, dados } = req.body;
    console.log("Lembretes recebeu evento:", tipo, dados);

    try {
      await lembreteService.processarEvento(tipo, dados);
      res.status(200).send({ msg: "ok" });
    } catch (err) {
      console.error("Erro ao processar evento:", err);
      res.status(500).send({ erro: "Erro ao processar evento." });
    }
  });

  // Excluir lembrete
  router.delete("/lembretes/:id", async (req, res) => {
    try {
      const id = req.params.id;

      // Enviar evento para excluir 
      await axios.post("http://localhost:10000/eventos", {
        tipo: "LembreteExcluido",
        dados: { id }
      });

      res.send({ msg: "Lembrete excluído (evento enviado ao barramento)" });
    } catch (err) {
      console.error("Erro ao excluir lembrete:", err);
      res.status(500).send({ erro: "Erro ao excluir lembrete." });
    }
  });

  module.exports = router;
