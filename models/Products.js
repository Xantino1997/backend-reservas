const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
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
    required: true,
  },
});

const Product = mongoose.model("productos", productSchema);

console.log("productos models");
module.exports = Product;
