const Empresa = require('../models/Empresa');

const obtenerEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.find().sort({ razonSocial: 1 });
        res.json({
            success: true,
            count: empresas.length,
            data: empresas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener empresas',
            error: error.message
        });
    }
};

const obtenerEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ cif: req.params.cif });

        if (!empresa) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        res.json({
            success: true,
            data: empresa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener empresa',
            error: error.message
        });
    }
};

const crearEmpresa = async (req, res) => {
    try {
        const empresa = new Empresa(req.body);
        await empresa.save();

        res.status(201).json({
            success: true,
            message: 'Empresa creada exitosamente',
            data: empresa
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'El CIF ya existe en el sistema'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al crear empresa',
            error: error.message
        });
    }
};

module.exports = {
    obtenerEmpresas,
    obtenerEmpresa,
    crearEmpresa
};