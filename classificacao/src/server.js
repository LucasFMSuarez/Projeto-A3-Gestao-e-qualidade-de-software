// classificacao/src/server.js
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(routes);

if (require.main === module) {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => console.log(`Classificação. Porta ${PORT}`));
}

module.exports = app;
