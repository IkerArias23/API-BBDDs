const Pesada = require('../models/Pesada');
const Producto = require('../models/Producto');

const obtenerPesadas = async (req, res) => {
    try {
        const pesadas = await Pesada.find().sort({ fechaHoraInicio: -1 });
        res.json({
            success: true,
            count: pesadas.length,
            data: pesadas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener pesadas',
            error: error.message
        });
    }
};

const obtenerPesada = async (req, res) => {
    try {
        const pesada = await Pesada.findOne({ idPeso: req.params.id });

        if (!pesada) {
            return res.status(404).json({
                success: false,
                message: 'Pesada no encontrada'
            });
        }

        res.json({
            success: true,
            data: pesada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener pesada',
            error: error.message
        });
    }
};

const crearPesada = async (req, res) => {
    try {
        const pesada = new Pesada(req.body);
        await pesada.save();

        // Actualizar cantidad total del producto
        await Producto.findOneAndUpdate(
            { idProducto: pesada.idProducto },
            { $inc: { cantidadTotalAlmacenada: pesada.cantidad } }
        );

        res.status(201).json({
            success: true,
            message: 'Pesada registrada exitosamente',
            data: pesada
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'El ID de pesada ya existe'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al registrar pesada',
            error: error.message
        });
    }
};

module.exports = {
    obtenerPesadas,
    obtenerPesada,
    crearPesada
};