const mongoose = require("mongoose");

const ComprobanteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descuento: {
    type: Number,
    default: 0,
  },
  imagen: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  localidad: {
    type: String,
    required: true,
  },
  numeroFactura: {
    type: String,
    required: false,
  },
  fecha: {
    type: String,
    default: () => {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = date.toTimeString().split(" ")[0];
      return `${formattedDate} hora:${formattedTime}`;
    },
  },
});

const Comprobante = mongoose.model("Comprobante", ComprobanteSchema);

module.exports = Comprobante;
