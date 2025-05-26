const express = require('express');
const router = express.Router();
const {
    obtenerConfig,
    actualizarConfig
} = require('../controllers/configController');

router.get('/', obtenerConfig);
router.put('/', actualizarConfig);

module.exports = router;