const mongoose = require('mongoose');

const calendarioSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        unique: true
    },
    pesosPlanificados: [{
        idSocio: {
            type: String,
            required: true
        },
        idProducto: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 0
        },
        horaInicio: {
            type: String,
            required: true,
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        },
        horaFin: {
            type: String,
            required: true,
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        },
        slotsOcupados: {
            type: Number,
            required: true,
            min: 1
        },
        estado: {
            type: String,
            enum: ['planificado', 'completado', 'cancelado'],
            default: 'planificado'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Calendario', calendarioSchema);