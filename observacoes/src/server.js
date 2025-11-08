// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(bodyParser.json());

// Rotas da aplicação
app.use(routes);

// Inicializa o servidor
app.listen(5000, () => {
  console.log("Observações. Porta 5000");
});
