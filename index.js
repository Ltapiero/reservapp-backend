const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio publico
app.use(express.static("public"));

// Lectura y parseo del body

app.use(express.json());

// rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reservation", require("./routes/reservation"));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
