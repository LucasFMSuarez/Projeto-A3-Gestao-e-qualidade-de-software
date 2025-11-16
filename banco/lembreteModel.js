const mongoose = require("mongoose");

const LembreteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, 
  texto: String,
  status: { type: String, default: "aguardando" } 
});

module.exports = mongoose.model("Lembrete", LembreteSchema);