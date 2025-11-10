// src/server.js
const conectarBanco = require("../../banco/conexao");
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());

conectarBanco();

app.use(routes);

app.listen(5000, () => console.log("Observações. Porta 5000"));
