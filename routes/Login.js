const cors = require("cors");
require("dotenv").config();
const express = require("express");
const Login = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret =  process.env.SECRET_KEY;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


// Usar cookieParser para manejar las cookies en las solicitudes
Login.use(cookieParser());


// Middleware para analizar cuerpos de solicitud JSON
Login.use(express.json());

Login.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    // Si no se encuentra un usuario con el nombre de usuario dado
    return res.status(400).json('Usuario no encontrado');
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
 
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id, role: userDoc.role }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        httpOnly: true, // La cookie solo es accesible por el servidor
        path: '/', // La cookie es válida en todo el sitio
        secure: true // La cookie solo se enviará en conexiones HTTPS
      }).json({
        token,
        id: userDoc._id,
        username,
        role: userDoc.role,
        profilePicture: userDoc.profilePicture
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});


Login.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err || !info || !info.username) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.json({ username: info.username });
  });
});

console.log('Init Login backend')

module.exports = Login;
