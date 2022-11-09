// Rutas de companies
// host + /api/companies

const { Router } = require("express");
const { getEmpresas } = require("../controllers/companies");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.use(validarJWT);

// Obtener empresas
router.get("/", getEmpresas);

module.exports = router;
