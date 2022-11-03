const { Schema, model } = require("mongoose");

const ReservationSchema = Schema({
  fecha: {
    type: Date,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  empresa: {
    type: Schema.Types.ObjectId,
    ref: "Empresa",
    required: true,
  },
});

ReservationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Reservation", ReservationSchema);
