const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().sort({ descripcion: 1 });
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

const obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findOne({ idProducto: req.params.id });

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

const crearProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: producto
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'El ID del producto ya existe'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findOneAndUpdate(
            { idProducto: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto
};