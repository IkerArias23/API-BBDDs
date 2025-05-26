const express = require('express');
const router = express.Router();
const {
    obtenerPesadas,
    obtenerPesada,
    crearPesada
} = require('../controllers/pesadaController');

router.get('/', obtenerPesadas);
router.get('/:id', obtenerPesada);
router.post('/', crearPesada);

module.exports = router;