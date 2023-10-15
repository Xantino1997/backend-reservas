const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  }
});

const Product = mongoose.model('productos', productSchema);

console.log('productos models')
module.exports = Product;
