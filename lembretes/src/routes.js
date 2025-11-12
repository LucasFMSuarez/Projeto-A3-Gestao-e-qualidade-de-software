const express = require("express");
const { criarLembrete, listarLembretes, processarEvento } = require("./servicoLembretes");

const router = express.Router();

// Lista todos os lembretes
router.get("/lembretes", async (req, res) => {
  try {
    const lista = await listarLembretes();
    res.send(lista);
  } catch (err) {
    console.error("Erro ao listar lembretes:", err);
    res.status(500).send({ erro: "Erro ao listar lembretes." });
  }
});

// Cria um novo lembrete
router.put("/lembretes", async (req, res) => {
  try {
    const lembrete = await criarLembrete(req.body.texto);
    res.status(201).send(lembrete);
  } catch (err) {
    console.error("Erro ao criar lembrete:", err);
    res.status(500).send({ erro: "Erro ao criar lembrete." });
  }
});

// Recebe eventos do barramento
router.post("/eventos", async (req, res) => {
  const { tipo, dados } = req.body;
  console.log("Lembretes recebeu evento:", tipo, dados);

  try {
    await processarEvento(tipo, dados); // ✅ espera a atualização
    res.status(200).send({ msg: "ok" });
  } catch (err) {
    console.error("Erro ao processar evento:", err);
    res.status(500).send({ erro: "Erro ao processar evento." });
  }
});


module.exports = router;