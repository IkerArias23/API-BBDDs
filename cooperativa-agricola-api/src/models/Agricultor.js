const mongoose = require('mongoose');

const agricultorSchema = new mongoose.Schema({
    idSocio: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dni: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Agricultor', agricultorSchema);