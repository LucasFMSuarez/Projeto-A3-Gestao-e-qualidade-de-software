// classificacao/src/routes.js
const express = require("express");
const { processarEvento } = require("./servicoClassificacao");

const router = express.Router();

router.post("/eventos", async (req, res) => {
  try {
    let tipo, dados;

    // aceitar os dois formatos que seu barramento pode enviar
    if (req.body.tipo && typeof req.body.tipo === "object") {
      tipo = req.body.tipo.tipo;
      dados = req.body.tipo.dados;
    } else {
      tipo = req.body.tipo;
      dados = req.body.dados;
    }

    if (!tipo) {
      return res.status(400).send({ erro: "Evento sem tipo" });
    }

    console.log("Classificação recebeu evento:", tipo, dados);

    await processarEvento(tipo, dados);

    res.status(200).send({ msg: "ok" });
  } catch (err) {
    console.error("Erro na rota de classificação:", err);
    res.status(500).send({ erro: "Erro ao processar evento." });
  }
});

module.exports = router;
