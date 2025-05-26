const express = require('express');
const router = express.Router();
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto
} = require('../controllers/productoController');

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);

module.exports = router;