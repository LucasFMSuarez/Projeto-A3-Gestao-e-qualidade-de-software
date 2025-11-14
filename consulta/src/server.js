const conectarBanco = require("../../banco/conexao");
const app = require("./app");

conectarBanco();

app.listen(6000, () => console.log("Consulta. Porta 6000"));