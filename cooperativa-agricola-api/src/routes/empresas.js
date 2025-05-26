const express = require('express');
const router = express.Router();
const {
    obtenerEmpresas,
    obtenerEmpresa,
    crearEmpresa
} = require('../controllers/empresaController');

router.get('/', obtenerEmpresas);
router.get('/:cif', obtenerEmpresa);
router.post('/', crearEmpresa);

module.exports = router;