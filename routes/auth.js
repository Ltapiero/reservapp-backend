// Rutas de usuarios / auth //
// host + /api/auth

const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  editarUsuario,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("surnames", "El apellido es obligatorio").not().isEmpty(),
    check("password", "El password debe de tener mínimo 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  crearUsuario
);

router.put("/", [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("name", "El nombre es obligatorio").not().isEmpty(),
  validarCampos,
  validarJWT,
  editarUsuario,
]);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de tener mínimo 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
