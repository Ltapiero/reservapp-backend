// Rutas de eventos
// host + /api/events

const { Router } = require("express");
const { check } = require("express-validator");
const { getReservas, crearReserva, actualizarReserva, eliminarReserva } = require("../controllers/reservation");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.use(validarJWT);

// Obtener reservas
router.get("/", getReservas);

// Crear una nueva reserva
router.post("/", [check("fecha", "La fecha tiene que ser obligatoria").custom(isDate), validarCampos], crearReserva);

// Actualizar reserva
router.put("/:id", actualizarReserva);

//Borrar reserva
router.delete("/:id", eliminarReserva);

module.exports = router;
