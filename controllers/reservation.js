const { response } = require("express");
const Reservation = require("../models/Reservation");
const Empresa = require("../models/Empresa");

const getReservas = async (req, res = response) => {
  const reservas = await Reservation.find({ user: req.uid })
    .populate("user", "name")
    .populate("empresa", "name");
  // const reservas = await Reservation.find({ user: req.uid }).populate("user", "name");

  res.json({
    ok: true,
    reservas,
  });
};

const crearReserva = async (req, res = response) => {
  const reservation = new Reservation(req.body);

  try {
    //validar usuario y empresa
    reservation.user = req.uid;
    reservation.empresa = req.body.empresa;

    await reservation.save();

    res.json({
      ok: true,
      evento: reservation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarReserva = (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizarReserva",
  });
};

const eliminarReserva = async (req, res = response) => {
  const reservaId = req.params.id;
  const uid = req.uid;
  console.log(req);

  try {
    const reserva = await Reservation.findById(reservaId);

    if (!reserva) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    if (reserva.user.toString() !== uid) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    await Reservation.findByIdAndDelete(reservaId);

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
};