const { response } = require("express");
const Reservation = require("../models/Reservation");

const getReservas = async (req, res = response) => {
  const reservas = await Reservation.find({ user: req.uid })
    .populate("user", "name")
    .populate("empresa", "name logo");
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

    const validationReservation = await Reservation.findOne({
      fecha: req.body.fecha,
      empresa: req.body.empresa,
    });

    if (validationReservation !== null) {
      return res.status(404).json({
        ok: false,
        msg: "Ya hay una reserva para esa fecha",
      });
    }

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
