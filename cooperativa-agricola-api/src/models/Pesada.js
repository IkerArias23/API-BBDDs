const mongoose = require('mongoose');

const pesadaSchema = new mongoose.Schema({
    idPeso: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    idSocio: {
        type: String,
        required: true,
        ref: 'Agricultor'
    },
    idProducto: {
        type: String,
        required: true,
        ref: 'Producto'
    },
    fechaHoraInicio: {
        type: Date,
        required: true
    },
    fechaHoraFin: {
        type: Date,
        required: true
    },
    categoriaRendimiento: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pesada', pesadaSchema);