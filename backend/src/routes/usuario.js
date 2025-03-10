const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const usuarioCtrl = require('../controller/usuarioController');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../img'));
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname); 
    const nombre = req.body.nombre?.replace(/\s+/g, '') || 'usuario'; 
    const apellido = req.body.apellido?.replace(/\s+/g, '') || 'anonimo'; 
    const telefono = req.body.telefono?.replace(/\s+/g, '') || '0000'; 
    const nombreFoto = `${nombre}${apellido}${telefono}${extension}`; 
    req.body.nombreFoto = nombreFoto; 
    callback(null, nombreFoto);
  }
});

const upload = multer({ storage });
const router = Router();

// Rutas de usuario
router.get('/', usuarioCtrl.getUsu);
router.get('/:id', usuarioCtrl.getUsuById);
router.post('/', upload.single('foto'), usuarioCtrl.createUsu);
router.put('/:id', upload.single('foto'), usuarioCtrl.updateUsu);
router.delete('/:id', usuarioCtrl.deleteUsu);

// Rutas de autenticación
router.post('/login', usuarioCtrl.login);

// Protección con token en la obtención de usuarios
router.get('/secure', usuarioCtrl.verifyToken, usuarioCtrl.getUsu);

module.exports = router;
