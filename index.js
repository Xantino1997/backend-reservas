const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/Login");
const productosRouter = require("./routes/Productos");
// const logoutRouter = require("./routes/logout");
// const noticiasRouter = require("./routes/crearNoticias");
// const postRouter = require("./routes/crearPost");
// const saveImage = require("./routes/cloudinary");
// const VideoRouter = require("./routes/VideoSubido");
// const RecuperoRouter = require("./routes/recuperar");
// const captchaRouter = require("./routes/captcha");
// const changeRouter = require("./routes/changePass");
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
// app.use(logoutRouter);
// app.use(noticiasRouter);
// app.use(postRouter);
// app.use(saveImage);
// app.use(VideoRouter);
// app.use(RecuperoRouter);
// app.use(captchaRouter);
// app.use(changeRouter);

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
