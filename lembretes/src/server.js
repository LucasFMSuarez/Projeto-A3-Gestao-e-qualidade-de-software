const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(express.json());

// conectarBanco();
app.use(cors());
app.use(routes);

if (require.main === module) {
  const conectarBanco = require("../../banco/conexao");
  conectarBanco();
  app.listen(4000, () => console.log("Lembretes. Porta 4000"));
}

module.exports = app;