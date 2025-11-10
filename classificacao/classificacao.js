const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const palavraChave = "importante";

const funcoes = {
  // CLASSIFICA LEMBRETE
  LembreteCriado: async (lembrete) => {
    const status = lembrete.texto.includes(palavraChave)
      ? "importante"
      : "comum";

    const atualizado = { ...lembrete, status };

    console.log("✅ Lembrete classificado:", atualizado);

    await axios.post("http://localhost:10000/eventos", {
      tipo: "LembreteClassificado",
      dados: atualizado,
    });
  },

  // CLASSIFICA OBSERVAÇÃO
  ObservacaoCriada: async (observacao) => {
    const status = observacao.texto.includes(palavraChave)
      ? "importante"
      : "comum";

    const atualizado = { ...observacao, status };

    console.log("Observação classificada:", atualizado);

    await axios.post("http://localhost:10000/eventos", {
      tipo: "ObservacaoClassificada",
      dados: atualizado,
    });
  },
};

app.post("/eventos", async (req, res) => {
  let tipo, dados;

  // Caso venha no formato errado: { tipo: { tipo, dados } }
  if (req.body.tipo && typeof req.body.tipo === "object") {
    tipo = req.body.tipo.tipo;
    dados = req.body.tipo.dados;
  }

  // Caso venha no formato normal: { tipo, dados }
  else {
    tipo = req.body.tipo;
    dados = req.body.dados;
  }

  console.log("Classificação recebeu evento:", tipo, dados);

  try {
    const fn = funcoes[tipo];
    if (fn) await fn(dados);
    else console.log("⚠ Tipo ignorado pela classificação:", tipo);
  } catch (err) {
    console.error("Erro na classificação:", err.message);
  }

  res.status(200).send({ msg: "ok" });
});

app.listen(7000, () => console.log("Classificação. Porta 7000"));