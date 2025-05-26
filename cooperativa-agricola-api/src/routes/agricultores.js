const express = require('express');
const router = express.Router();
const {
    obtenerAgricultores,
    obtenerAgricultor,
    crearAgricultor,
    actualizarAgricultor,
    eliminarAgricultor
} = require('../controllers/agricultorController');

// Rutas para agricultores
router.get('/', obtenerAgricultores);
router.get('/:id', obtenerAgricultor);
router.post('/', crearAgricultor);
router.put('/:id', actualizarAgricultor);
router.delete('/:id', eliminarAgricultor);

module.exports = router;