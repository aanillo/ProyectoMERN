const { Schema, model } = require('mongoose');


const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, min: 0, max: 120 },
  telefono: { type: Number, required: true },
  correo: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'El correo debe tener un formato válido']
  },
  password: { type: String, required: true },
  foto: { type: String }, // Campo para almacenar la ruta de la imagen
}, {
  timestamps: true,
});


module.exports = model('Usuario', usuarioSchema);