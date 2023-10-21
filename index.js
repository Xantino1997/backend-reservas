const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/Login");
const productosRouter = require("./routes/Productos");
const ventasRouter = require("./routes/Ventas");

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.DB_KEY;
const jwtSecretKey = process.env.SECRET_KEY;
const jsonParser = bodyParser.json({ limit: "50mb" });
const urlencodedParser = bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
});
app.use(
  cors({
    origin: "https://reservas-nine.vercel.app",
    // origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(jsonParser);
app.use(urlencodedParser);

require("dotenv").config();

// Configuración de middleware

app.use(express.json());
app.use(loginRouter);
app.use(productosRouter);
app.use(ventasRouter);

// Conexión a la base de datos MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Error de conexión a la base de datos:")
);
db.once("open", () => {
  console.log("Conexión exitosa a la base de datos");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
