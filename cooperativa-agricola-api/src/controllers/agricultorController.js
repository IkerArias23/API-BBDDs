const Agricultor = require('../models/Agricultor');

/**
 * Obtener todos los agricultores
 */
const obtenerAgricultores = async (req, res) => {
    try {
        const agricultores = await Agricultor.find().sort({ nombre: 1 });
        res.json({
            success: true,
            count: agricultores.length,
            data: agricultores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener agricultores',
            error: error.message
        });
    }
};

/**
 * Obtener agricultor por ID
 */
const obtenerAgricultor = async (req, res) => {
    try {
        const agricultor = await Agricultor.findOne({ idSocio: req.params.id });

        if (!agricultor) {
            return res.status(404).json({
                success: false,
                message: 'Agricultor no encontrado'
            });
        }

        res.json({
            success: true,
            data: agricultor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener agricultor',
            error: error.message
        });
    }
};

/**
 * Crear nuevo agricultor
 */
const crearAgricultor = async (req, res) => {
    try {
        const agricultor = new Agricultor(req.body);
        await agricultor.save();

        res.status(201).json({
            success: true,
            message: 'Agricultor creado exitosamente',
            data: agricultor
        });
    } catch (error) {
        if (error.code === 11000) {
            const campo = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `El ${campo} ya existe en el sistema`
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al crear agricultor',
            error: error.message
        });
    }
};

/**
 * Actualizar agricultor
 */
const actualizarAgricultor = async (req, res) => {
    try {
        const agricultor = await Agricultor.findOneAndUpdate(
            { idSocio: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!agricultor) {
            return res.status(404).json({
                success: false,
                message: 'Agricultor no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Agricultor actualizado exitosamente',
            data: agricultor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar agricultor',
            error: error.message
        });
    }
};

/**
 * Eliminar agricultor
 */
const eliminarAgricultor = async (req, res) => {
    try {
        const agricultor = await Agricultor.findOneAndDelete({ idSocio: req.params.id });

        if (!agricultor) {
            return res.status(404).json({
                success: false,
                message: 'Agricultor no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Agricultor eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar agricultor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerAgricultores,
    obtenerAgricultor,
    crearAgricultor,
    actualizarAgricultor,
    eliminarAgricultor
};