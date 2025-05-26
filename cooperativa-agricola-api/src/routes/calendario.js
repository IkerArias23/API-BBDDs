const express = require('express');
const router = express.Router();
const {
    obtenerCalendario,
    planificarEntrega,
    buscarHueco
} = require('../controllers/calendarioController');

router.get('/:fecha', obtenerCalendario);
router.post('/planificar', planificarEntrega);
router.post('/buscar-hueco', buscarHueco);

module.exports = router;