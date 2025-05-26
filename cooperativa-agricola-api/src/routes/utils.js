const express = require('express');
const router = express.Router();
const { insertarDatosEjemplo } = require('../controllers/utilsController');

router.post('/datos-ejemplo', insertarDatosEjemplo);

module.exports = router;