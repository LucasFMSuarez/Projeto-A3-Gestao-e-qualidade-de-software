const mongoose = require("mongoose");

const ObservacaoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  lembreteId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "aguardando"
  }
});

module.exports = mongoose.model("Observacao", ObservacaoSchema);