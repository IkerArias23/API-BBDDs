const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    idProducto: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    },
    tipoContenedor: {
        type: String,
        required: true,
        trim: true
    },
    cantidadTotalAlmacenada: {
        type: Number,
        default: 0,
        min: 0
    },
    factorTiempoEntrega: {
        type: Number,
        required: true,
        min: 0.1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);