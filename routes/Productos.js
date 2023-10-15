const express = require('express');
const productosRouter = express.Router();
const Product = require('../models/Products');
const cloudinary = require('cloudinary').v2; // Asegúrate de tener instalado cloudinary y configurada la API

// Ruta para guardar un producto
productosRouter.post('/products', async (req, res) => {
  try {
    const { title, price, description, discount, image } = req.body;

    // Subir la imagen a Cloudinary y obtener la URL
    const uploadedImage = await cloudinary.uploader.upload(image, { folder: 'product_images' });

    // Crear un nuevo producto con los datos proporcionados
    const newProduct = new Product({
      title,
      price,
      description,
      discount,
      image: uploadedImage.secure_url
    });

    // Guardar el producto en la base de datos
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todos los productos
productosRouter.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


console.log("Products bakcend");
module.exports = productosRouter;
