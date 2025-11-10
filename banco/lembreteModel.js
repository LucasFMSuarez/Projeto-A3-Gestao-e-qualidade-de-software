const mongoose = require("mongoose");

const LembreteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // <-- Number aqui
  texto: String,
  status: { type: String, default: "aguardando" } // opcional se quiser status no lembrete
});

module.exports = mongoose.model("Lembrete", LembreteSchema);