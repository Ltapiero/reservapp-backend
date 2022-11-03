const { Schema, model } = require("mongoose");

const EmpresaSchema = Schema({
  name: {
    type: String,
    require: true,
  },
});

module.exports = model("Empresa", EmpresaSchema);
