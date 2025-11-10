const conectarBanco = require("../../banco/conexao");
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());

conectarBanco();

app.use(routes);

app.listen(4000, () => {
  console.log("Lembretes. Porta 4000");
});

module.exports = app;