const usuarioCtrl = {};
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Definir el almacenamiento de archivos para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Clave secreta para JWT
const SECRET_KEY = 'tu_clave_secreta'; // Usa una clave segura en variables de entorno

// Obtener todos los usuarios
usuarioCtrl.getUsu = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    const usuariosConFoto = usuarios.map(usuario => ({
      ...usuario._doc,
      foto: usuario.foto
        ? `http://localhost:4000/img/${usuario.foto}`
        : `http://localhost:4000/img/noFoto.png`,
    }));
    res.json(usuariosConFoto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

// Obtener un usuario por ID
usuarioCtrl.getUsuById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// Crear un usuario
usuarioCtrl.createUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad, password } = req.body;

    if (!nombre || !correo || !apellido || !telefono || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt); // Hasheando la contraseña

    // Foto por defecto si no se proporciona una nueva
    const nombreFoto = req.file ? req.file.filename : 'noFoto.png';

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      correo,
      telefono,
      edad,
      password: passwordHash, // Guardar contraseña hasheada
      foto: nombreFoto,
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario creado', usuario: usuarioGuardado });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};


// Iniciar sesión
// Iniciar sesión
usuarioCtrl.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Comparar la contraseña hasheada
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario._id }, SECRET_KEY, { expiresIn: '1h' });

    // Enviar respuesta con el token y usuario
    res.json({ message: 'Login exitoso', token, usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error); // Para depuración
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};


// Middleware para verificar token
usuarioCtrl.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = verified; // Establecer el usuario verificado en la solicitud
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};


// Actualizar un usuario
usuarioCtrl.updateUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad, password } = req.body;
    const { id } = req.params;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos
    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.correo = correo || usuario.correo;
    usuario.telefono = telefono || usuario.telefono;
    usuario.edad = edad || usuario.edad;

    // Si se proporciona una nueva contraseña, encriptarla antes de actualizar
    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    // Si se sube una nueva foto, actualizarla
    if (req.file) {
      // Eliminar la foto anterior si existe
      if (usuario.foto && usuario.foto !== 'noFoto.png') {
        const filePath = path.join(__dirname, `../public/img/${usuario.foto}`);
        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error al eliminar la foto:', err);
          }
        });
      }
      usuario.foto = req.file.filename;
    }

    const usuarioActualizado = await usuario.save();
    res.json({ message: 'Usuario actualizado', usuario: usuarioActualizado });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar un usuario
usuarioCtrl.deleteUsu = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar la foto del usuario si existe en el sistema de archivos
    if (usuario.foto && usuario.foto !== 'noFoto.png') {
      const filePath = path.join(__dirname, `../public/img/${usuario.foto}`);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error al eliminar la foto:', err);
        }
      });
    }

    // Eliminar usuario de la base de datos
    await Usuario.findByIdAndDelete(id);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = usuarioCtrl;
