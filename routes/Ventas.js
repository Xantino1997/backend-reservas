const cors = require("cors");
require("dotenv").config();
const express = require("express");
const Ventas = express.Router();
const User = require("../models/User");
const Comprobante = require("../models/Comprobante-pagos");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret =  process.env.SECRET_KEY;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


// Usar cookieParser para manejar las cookies en las solicitudes
Ventas.use(cookieParser());


// Middleware para analizar cuerpos de solicitud JSON
Ventas.use(express.json());


Ventas.get("/comprobantes", async (req, res) => {
    try {
      const comprobantes = await Comprobante.find();
      res.json(comprobantes);
    } catch (error) {
      console.error('Error al obtener los comprobantes:', error);
      res.status(500).json({ error: 'Hubo un error al obtener los comprobantes' });
    }
  });

  console.log('vents')

  module.exports = Ventas;