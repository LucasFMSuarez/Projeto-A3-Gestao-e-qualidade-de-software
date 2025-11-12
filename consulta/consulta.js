const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Lembrete = require("../banco/lembreteModel");
const Observacao = require("../banco/observacaoModel");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://luizwashingtonmuraro:L11272615@a3.cngehuq.mongodb.net/?appName=A3", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Retorna lembretes com suas observações
app.get("/lembretes", async (req, res) => {
  const lembretes = await Lembrete.find();
  const resultado = {};

  for (const lembrete of lembretes) {
    const observacoes = await Observacao.find({ lembreteId: lembrete.id });

    resultado[lembrete.id] = {
      id: lembrete.id,
      texto: lembrete.texto,
      status: lembrete.status,
      observacoes
    };
  }

  res.status(200).send(resultado);
});

// Recebe eventos e grava no banco
const funcoes = {
  LembreteCriado: async (dados) => {
    await Lembrete.create({
      id: dados.id,
      texto: dados.texto,
      status: dados.status
    });
    console.log("Consulta armazenou lembrete:", dados);
  },

  LembreteAtualizado: async (dados) => {
    await Lembrete.findOneAndUpdate(
      { id: dados.id },
      { status: dados.status }
    );
    console.log("Consulta atualizou lembrete:", dados);
  },
ObservacaoCriada: async (dados) => {
  await Observacao.findOneAndUpdate(
    { id: dados.id },       // Procura pela observação pelo id
    {
      texto: dados.texto,
      status: dados.status,
      lembreteId: dados.lembreteId
    },
    { upsert: true, new: true } // Cria se não existir
  );
  console.log("Consulta armazenou/atualizou observação:", dados);
},

  ObservacaoAtualizada: async (dados) => {
    await Observacao.findOneAndUpdate(
      { id: dados.id },
      {
        texto: dados.texto,
        status: dados.status
      }
    );
    console.log("Consulta atualizou observação:", dados);
  }
};

app.post("/eventos", async (req, res) => {
  console.log("Consulta recebeu evento:", req.body);

  const { tipo, dados } = req.body;

  try {
    const fn = funcoes[tipo];
    if (fn) await fn(dados);
    else console.log("⚠ Consulta ignorou tipo:", tipo);
  } catch (err) {
    console.error("Erro ao processar evento na consulta:", err.message);
  }

  res.status(200).send({ msg: "ok" });
});

app.listen(6000, () => console.log("Consulta. Porta 6000"));