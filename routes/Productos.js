const express = require("express");
const productosRouter = express.Router();
const Product = require("../models/Products");
const cloudinary = require("cloudinary").v2; // Asegúrate de tener instalado cloudinary y configurada la API
const nodemailer = require("nodemailer");
const mercadopago = require("mercadopago");

// Ruta para guardar un producto
productosRouter.post("/products", async (req, res) => {
  try {
    const { title, price, description, discount, imagen, localidad, quantity } =
      req.body;

    // Subir la imagen a Cloudinary y obtener la URL
    const uploadedImage = await cloudinary.uploader.upload(imagen, {
      folder: "product_images",
    });

    // Crear un nuevo producto con los datos proporcionados
    const newProduct = new Product({
      title,
      price,
      description,
      localidad,
      quantity,
      discount,
      imagen: uploadedImage.secure_url,
    });

    // Guardar el producto en la base de datos
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todos los productos
productosRouter.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productosRouter.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al buscar el producto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Ruta para editar un producto por su ID
productosRouter.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { title, precio, description, descuento, imagen, quantity, localidad } =
    req.body;

  try {
    let updatedImageUrl = imagen; // Almacenar la URL de la imagen original

    if (req.body.newImagen) {
      const uploadedImage = await cloudinary.uploader.upload(
        req.body.newImagen,
        { folder: "product_images" }
      );
      updatedImageUrl = uploadedImage.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        precio,
        description,
        descuento,
        imagen: updatedImageUrl,
        quantity,
        localidad,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return res
      .status(500)
      .json({ message: "Error del servidor al actualizar el producto" });
  }
});
const config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ala282016@gmail.com",
    pass: "enyb yajs tjze exfy",
  },
};

const transporter = nodemailer.createTransport(config);

productosRouter.post("/procesar-pago", async (req, res) => {
  const { nombre, correo, productId, productDetails, cantidad, numeroFactura } =
    req.body;

  const PrecioDescuento =
    productDetails.precio -
    (productDetails.precio * productDetails.descuento) / 100;

  const CantidadePrecio = PrecioDescuento * cantidad;

  try {
    // Reducir la cantidad disponible del producto
    const product = await Product.findById(productId);
    if (product) {
      if (product.descuento > 0) {
        product.quantity -= cantidad;
      } else {
        product.quantity -= productDetails.precio;
      }
      product.numeroFactura = numeroFactura; // Guardar el número de factura en el producto
      await product.save();
    }

    // Enviar un correo electrónico con los detalles de la compra
    const mailOptions = {
      from: "confirmar_pago@gmail.com",
      to: correo,
      subject: "Confirmación de compra",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: black; text-align: center;">
          <h1 style="color: white; background-color: black;">¡Gracias por tu compra!</h1>
          <p>Estimado(a) ${nombre},</p>
          <p>Has realizado una compra exitosa en nuestra tienda. A continuación se detallan los elementos de tu compra:</p>
          <p style="color: white; background-color: rgba(0,0,0,0.5);"><strong>Número de Comprobante:</strong> ${numeroFactura}</p>
          <p><strong>Compraste:</strong> ${cantidad} pasajes  ${productDetails.title}</p>
          <p><strong>Precio Real:</strong> ${productDetails.precio}</p>\n\n
          <p><strong>Descuento:</strong> ${productDetails.descuento}%</p>
          <p><strong>Precio con Descuento:</strong> ${PrecioDescuento}</p>\n
          -------------------------------------------------\n
          <h2>Total a Pagar :</h2>${CantidadePrecio}
          <p>Puedes verificar tu compra y ver más detalles en <a href="http://localhost:3000/login">localhost:3000/login</a> si estás logeado. Si no estás logeado, por favor inicia sesión para ver más detalles.</p>
          <p>Tu número de comprobante es: <p style={{ backgroundColor: "lightgray", fontSize: "20px", fontFamily: "Courier New, monospace" }}>${numeroFactura}</p></p>
          <p>¡Gracias de nuevo por tu compra!</p>
          <div style="display: flex; justify-content: center;">
            <img src="https://img.freepik.com/foto-gratis/concepto-dia-mundial-turismo-avion_23-2148608808.jpg?size=626&ext=jpg&ga=GA1.1.1492510228.1692215746&semt=ais" alt="Imagen de confirmación de compra" style="max-width: 200px; height: auto; margin-top: 20px;" />
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
      } else {
        console.log("Correo electrónico enviado: " + info.response);
      }
    });

    res.json({ message: "Proceso de pago completado" });
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({ message: "Hubo un problema al procesar el pago" });
  }
});

console.log("Products bakcend");
module.exports = productosRouter;
