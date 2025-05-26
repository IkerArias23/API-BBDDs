const Calendario = require('../models/Calendario');
const Producto = require('../models/Producto');
const Config = require('../models/Config');
const { calcularTiempoEntrega, encontrarHuecoDisponible } = require('../utils/timeCalculator');

const obtenerCalendario = async (req, res) => {
    try {
        const fecha = new Date(req.params.fecha);
        const calendario = await Calendario.findOne({ fecha });

        res.json({
            success: true,
            data: calendario || { fecha, pesosPlanificados: [] }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener calendario',
            error: error.message
        });
    }
};

const planificarEntrega = async (req, res) => {
    try {
        const { fecha, idSocio, idProducto, cantidad } = req.body;

        // Validar que existe el producto
        const producto = await Producto.findOne({ idProducto });
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Calcular tiempo necesario
        const tiempoHoras = calcularTiempoEntrega(cantidad, producto.factorTiempoEntrega);
        const slotsNecesarios = Math.ceil(tiempoHoras * 2); // slots de 30 min

        // Obtener configuración de horarios
        const config = await Config.findOne();
        const horaInicio = config ? config.horaInicioPesos : '08:00';
        const horaFin = config ? config.horaFinPesos : '18:00';

        // Buscar o crear calendario para la fecha
        const fechaObj = new Date(fecha);
        let calendario = await Calendario.findOne({ fecha: fechaObj });

        if (!calendario) {
            calendario = new Calendario({
                fecha: fechaObj,
                pesosPlanificados: []
            });
        }

        // Encontrar hueco disponible
        const hueco = encontrarHuecoDisponible(
            calendario.pesosPlanificados,
            horaInicio,
            horaFin,
            slotsNecesarios
        );

        if (!hueco) {
            return res.status(400).json({
                success: false,
                message: 'No hay huecos disponibles para esta fecha',
                suggestion: 'Pruebe con otra fecha o reduzca la cantidad'
            });
        }

        // Crear nueva planificación
        const nuevaPlanificacion = {
            idSocio,
            idProducto,
            cantidad,
            horaInicio: hueco.horaInicio,
            horaFin: hueco.horaFin,
            slotsOcupados: slotsNecesarios
        };

        calendario.pesosPlanificados.push(nuevaPlanificacion);
        await calendario.save();

        res.status(201).json({
            success: true,
            message: 'Entrega planificada exitosamente',
            data: {
                planificacion: nuevaPlanificacion,
                tiempoCalculado: `${tiempoHoras} horas (${slotsNecesarios} slots de 30 min)`,
                producto: producto.descripcion
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al planificar entrega',
            error: error.message
        });
    }
};

const buscarHueco = async (req, res) => {
    try {
        const { fecha, idProducto, cantidad } = req.body;

        const producto = await Producto.findOne({ idProducto });
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const tiempoHoras = calcularTiempoEntrega(cantidad, producto.factorTiempoEntrega);
        const slotsNecesarios = Math.ceil(tiempoHoras * 2);

        let fechaBusqueda = new Date(fecha);
        const fechaLimite = new Date(fecha);
        fechaLimite.setDate(fechaLimite.getDate() + 30); // Buscar hasta 30 días

        while (fechaBusqueda <= fechaLimite) {
            const calendario = await Calendario.findOne({ fecha: fechaBusqueda });
            const pesosPlanificados = calendario ? calendario.pesosPlanificados : [];

            const config = await Config.findOne();
            const horaInicio = config ? config.horaInicioPesos : '08:00';
            const horaFin = config ? config.horaFinPesos : '18:00';

            const hueco = encontrarHuecoDisponible(pesosPlanificados, horaInicio, horaFin, slotsNecesarios);

            if (hueco) {
                return res.json({
                    success: true,
                    message: 'Hueco disponible encontrado',
                    data: {
                        fechaDisponible: fechaBusqueda.toISOString().split('T')[0],
                        horaInicio: hueco.horaInicio,
                        horaFin: hueco.horaFin,
                        tiempoNecesario: `${tiempoHoras} horas (${slotsNecesarios} slots)`,
                        producto: producto.descripcion
                    }
                });
            }

            fechaBusqueda.setDate(fechaBusqueda.getDate() + 1);
        }

        res.status(404).json({
            success: false,
            message: 'No se encontraron huecos disponibles en los próximos 30 días',
            data: {
                tiempoNecesario: `${tiempoHoras} horas (${slotsNecesarios} slots)`,
                suggestion: 'Considere reducir la cantidad o contactar para horarios especiales'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en búsqueda de hueco',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCalendario,
    planificarEntrega,
    buscarHueco
};