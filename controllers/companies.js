const Empresa = require("../models/Empresa");

const getEmpresas = async (req, res = response) => {
  const empresas = await Empresa.find();

  res.json({
    ok: true,
    empresas,
  });
};

module.exports = {
  getEmpresas,
};
