/**
 * Utilidades para cálculos de tiempo y slots
 */

/**
 * Calcula el tiempo de entrega basado en cantidad y factor
 * @param {number} cantidad - Cantidad en kg
 * @param {number} factorTiempo - Factor de tiempo para 500kg
 * @returns {number} Tiempo en horas
 */
function calcularTiempoEntrega(cantidad, factorTiempo) {
    const tiempoBase = (cantidad / 500) * factorTiempo;
    const slots = Math.max(1, Math.ceil(tiempoBase * 2)); // slots de 30 min
    return slots * 0.5; // convertir a horas
}

/**
 * Convierte hora (HH:MM) a minutos
 * @param {string} hora - Hora en formato HH:MM
 * @returns {number} Minutos desde medianoche
 */
function horaAMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

/**
 * Convierte minutos a hora (HH:MM)
 * @param {number} minutos - Minutos desde medianoche
 * @returns {string} Hora en formato HH:MM
 */
function minutosAHora(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Encuentra un hueco disponible en el calendario
 * @param {Array} pesosPlanificados - Array de pesos planificados
 * @param {string} horaInicio - Hora de inicio de jornada
 * @param {string} horaFin - Hora de fin de jornada
 * @param {number} slotsNecesarios - Número de slots de 30 min necesarios
 * @returns {Object|null} Objeto con horaInicio y horaFin del hueco, o null
 */
function encontrarHuecoDisponible(pesosPlanificados, horaInicio, horaFin, slotsNecesarios) {
    const inicioMinutos = horaAMinutos(horaInicio);
    const finMinutos = horaAMinutos(horaFin);

    // Crear array de ocupación (slots de 30 min)
    const totalSlots = (finMinutos - inicioMinutos) / 30;
    const ocupado = new Array(totalSlots).fill(false);

    // Marcar slots ocupados
    pesosPlanificados.forEach(peso => {
        const inicioSlot = (horaAMinutos(peso.horaInicio) - inicioMinutos) / 30;
        const finSlot = inicioSlot + peso.slotsOcupados;

        for (let i = inicioSlot; i < finSlot; i++) {
            if (i >= 0 && i < totalSlots) {
                ocupado[i] = true;
            }
        }
    });

    // Buscar hueco consecutivo
    for (let i = 0; i <= totalSlots - slotsNecesarios; i++) {
        let disponible = true;
        for (let j = i; j < i + slotsNecesarios; j++) {
            if (ocupado[j]) {
                disponible = false;
                break;
            }
        }

        if (disponible) {
            const horaInicioHueco = minutosAHora(inicioMinutos + i * 30);
            const horaFinHueco = minutosAHora(inicioMinutos + (i + slotsNecesarios) * 30);

            return {
                horaInicio: horaInicioHueco,
                horaFin: horaFinHueco
            };
        }
    }

    return null;
}

module.exports = {
    calcularTiempoEntrega,
    horaAMinutos,
    minutosAHora,
    encontrarHuecoDisponible
};