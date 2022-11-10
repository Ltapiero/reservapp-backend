const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo",
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      surnames: usuario.surnames,
      gender: usuario.gender,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const editarUsuario = async (req, res = response) => {
  const usuarioId = req.body.uid;
  const { password } = req.body;
  const uid = req.uid;

  try {
    let usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "No existe ese usuario por ese id",
      });
    }

    if (usuario._id.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar",
      });
    }

    let usuarioUpdated = {
      ...req.body,
    };

    console.log(usuarioUpdated);

    // let usuarioUpdated = {
    //   name: req.body.name,
    //   surnames: req.body.surnames,
    //   gender: req.body.gender,
    //   uid: req.body.uid,
    // };

    if (req.body.password !== "") {
      const salt = bcrypt.genSaltSync();
      usuarioUpdated.password = bcrypt.hashSync(password, salt);
      console.log(usuarioUpdated);
    } else {
      delete usuarioUpdated.password;
      delete usuarioUpdated.repeatPassword;
    }

    console.log(usuarioUpdated);

    const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, usuarioUpdated, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese correo",
      });
    }

    // Confirmar los passwords

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar nuestro JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      surnames: usuario.surnames,
      gender: usuario.gender,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;
  console.log(uid, name);

  let usuario = await Usuario.findOne({ _id: uid });
  console.log(usuario);
  const token = await generarJWT(uid, name);
  res.json({
    ok: true,
    uid: usuario.id,
    name: usuario.name,
    surnames: usuario.surnames,
    gender: usuario.gender,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  editarUsuario,
};
