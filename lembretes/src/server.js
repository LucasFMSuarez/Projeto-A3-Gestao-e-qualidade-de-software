const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());

// NÃO chama conectarBanco aqui!
// conectarBanco();

app.use(routes);

if (require.main === module) {
  // só conecta se estiver rodando o servidor diretamente
  const conectarBanco = require("../../banco/conexao");
  conectarBanco();
  app.listen(4000, () => console.log("Lembretes. Porta 4000"));
}

module.exports = app;