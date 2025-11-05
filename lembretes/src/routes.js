const express = require("express");
const { criarLembrete, listarLembretes } = require("./servicoLembretes");

const router = express.Router();

router.get("/lembretes", (req, res) => {
  res.send(listarLembretes());
});

router.put("/lembretes", async (req, res) => {
  const lembrete = await criarLembrete(req.body.texto);
  res.status(201).send(lembrete);
});

router.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

module.exports = router;
