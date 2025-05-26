const Config = require('../models/Config');

const obtenerConfig = async (req, res) => {
    try {
        let config = await Config.findOne();

        if (!config) {
            // Crear configuración por defecto
            config = new Config({
                horaInicioPesos: '08:00',
                horaFinPesos: '18:00'
            });
            await config.save();
        }

        res.json({
            success: true,
            data: config
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener configuración',
            error: error.message
        });
    }
};

const actualizarConfig = async (req, res) => {
    try {
        let config = await Config.findOne();

        if (!config) {
            config = new Config(req.body);
        } else {
            Object.assign(config, req.body);
            config.fechaActualizacion = new Date();
        }

        await config.save();

        res.json({
            success: true,
            message: 'Configuración actualizada exitosamente',
            data: config
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar configuración',
            error: error.message
        });
    }
};

module.exports = {
    obtenerConfig,
    actualizarConfig
};