const express = require('express');
const path = require('path');
const cors = require('cors');


const app = express();


// Configuración
app.set('port', process.env.PORT || 4000); // Guardando variable port y que la procese, pero que si no está, que nos escuche en el 4000


// Middleware: funciones para validar las configuraciones y si todo está OK, pasamos a las rutas
app.use(cors());
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'img'))); // Esto permitirá acceder a las imágenes en el navegador a través de una URL, como http://localhost:4000/img/nombre-de-la-imagen.jpg


// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API rest full');
});


// Ruta para nuestra API de usuario
const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuarios', usuarioRoutes);


module.exports = app;