const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
    cif: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    razonSocial: {
        type: String,
        required: true,
        trim: true
    },
    direccionPostal: {
        type: String,
        required: true,
        trim: true
    },
    localidad: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    representante: {
        dni: {
            type: String,
            required: true,
            trim: true
        },
        nombreCompleto: {
            type: String,
            required: true,
            trim: true
        },
        telefono: {
            type: String,
            required: true,
            trim: true
        },
        correoElectronico: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Empresa', empresaSchema);