// barramento/src/server.js
const express = require("express");
const rotas = require("./routes");

const app = express();
app.use(express.json());
app.use(rotas);

const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Barramento de eventos rodando na porta ${PORT}.`);
});
