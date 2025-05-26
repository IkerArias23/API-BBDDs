const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cooperativa_agricola', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Modelos MongoDB
const agricultorSchema = new mongoose.Schema({
    idSocio: { type: String, required: true, unique: true },
    dni: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, required: true }
});

const productoSchema = new mongoose.Schema({
    idProducto: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    tipoContenedor: { type: String, required: true },
    cantidadTotalAlmacenada: { type: Number, default: 0 },
    factorTiempoEntrega: { type: Number, required: true } // horas para 500kg
});

const pesoSchema = new mongoose.Schema({
    idPeso: { type: String, required: true, unique: true },
    idSocio: { type: String, required: true, ref: 'Agricultor' },
    idProducto: { type: String, required: true, ref: 'Producto' },
    fechaHoraInicio: { type: Date, required: true },
    fechaHoraFin: { type: Date, required: true },
    categoriaRendimiento: { type: String, required: true },
    cantidad: { type: Number, required: true }
});

const empresaCompradoraSchema = new mongoose.Schema({
    cif: { type: String, required: true, unique: true },
    razonSocial: { type: String, required: true },
    direccionPostal: { type: String, required: true },
    localidad: { type: String, required: true },
    telefono: { type: String, required: true },
    representante: {
        dni: { type: String, required: true },
        nombreCompleto: { type: String, required: true },
        telefono: { type: String, required: true },
        correoElectronico: { type: String, required: true }
    }
});

const configSchema = new mongoose.Schema({
    horaInicioPesos: { type: String, required: true }, // formato HH:MM
    horaFinPesos: { type: String, required: true },    // formato HH:MM
    fechaActualizacion: { type: Date, default: Date.now }
});

const calendarioSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    pesosPlanificados: [{
        idSocio: { type: String, required: true },
        idProducto: { type: String, required: true },
        cantidad: { type: Number, required: true },
        horaInicio: { type: String, required: true }, // formato HH:MM
        horaFin: { type: String, required: true },     // formato HH:MM
        slotsOcupados: { type: Number, required: true }, // número de slots de 30 min
        estado: { type: String, enum: ['planificado', 'completado', 'cancelado'], default: 'planificado' }
    }]
});

// Modelos
const Agricultor = mongoose.model('Agricultor', agricultorSchema);
const Producto = mongoose.model('Producto', productoSchema);
const Peso = mongoose.model('Peso', pesoSchema);
const EmpresaCompradora = mongoose.model('EmpresaCompradora', empresaCompradoraSchema);
const Config = mongoose.model('Config', configSchema);
const Calendario = mongoose.model('Calendario', calendarioSchema);

// Funciones auxiliares
function calcularTiempoEntrega(cantidad, factorTiempo) {
    // Factor de tiempo es para 500kg
    const tiempoBase = (cantidad / 500) * factorTiempo;
    // Redondear a slots de 30 minutos (mínimo 30 min)
    const slots = Math.max(1, Math.ceil(tiempoBase * 2)); // 2 slots por hora
    return slots * 0.5; // convertir a horas
}

function horaAMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

function minutosAHora(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// RUTAS DE LA API

// 1. AGRICULTORES
app.get('/api/agricultores', async (req, res) => {
    try {
        const agricultores = await Agricultor.find();
        res.json(agricultores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/agricultores', async (req, res) => {
    try {
        const agricultor = new Agricultor(req.body);
        await agricultor.save();
        res.status(201).json(agricultor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. PRODUCTOS
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 3. PESOS
app.get('/api/pesos', async (req, res) => {
    try {
        const pesos = await Peso.find();
        res.json(pesos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pesos', async (req, res) => {
    try {
        const peso = new Peso(req.body);
        await peso.save();

        // Actualizar cantidad total del producto
        await Producto.findOneAndUpdate(
            { idProducto: peso.idProducto },
            { $inc: { cantidadTotalAlmacenada: peso.cantidad } }
        );

        res.status(201).json(peso);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. EMPRESAS COMPRADORAS
app.get('/api/empresas', async (req, res) => {
    try {
        const empresas = await EmpresaCompradora.find();
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/empresas', async (req, res) => {
    try {
        const empresa = new EmpresaCompradora(req.body);
        await empresa.save();
        res.status(201).json(empresa);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 5. CONFIGURACIÓN
app.get('/api/config', async (req, res) => {
    try {
        let config = await Config.findOne();
        if (!config) {
            config = new Config({
                horaInicioPesos: '08:00',
                horaFinPesos: '18:00'
            });
            await config.save();
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/config', async (req, res) => {
    try {
        let config = await Config.findOne();
        if (!config) {
            config = new Config(req.body);
        } else {
            Object.assign(config, req.body);
            config.fechaActualizacion = new Date();
        }
        await config.save();
        res.json(config);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 6. CALENDARIO
app.get('/api/calendario/:fecha', async (req, res) => {
    try {
        const fecha = new Date(req.params.fecha);
        const calendario = await Calendario.findOne({ fecha });
        res.json(calendario || { fecha, pesosPlanificados: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/calendario/planificar', async (req, res) => {
    try {
        const { fecha, idSocio, idProducto, cantidad } = req.body;

        // Obtener producto para calcular tiempo
        const producto = await Producto.findOne({ idProducto });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Calcular tiempo necesario
        const tiempoHoras = calcularTiempoEntrega(cantidad, producto.factorTiempoEntrega);
        const slotsNecesarios = Math.ceil(tiempoHoras * 2); // slots de 30 min

        // Obtener configuración de horarios
        const config = await Config.findOne();
        const horaInicio = config ? config.horaInicioPesos : '08:00';
        const horaFin = config ? config.horaFinPesos : '18:00';

        // Buscar hueco disponible
        const fechaObj = new Date(fecha);
        let calendario = await Calendario.findOne({ fecha: fechaObj });

        if (!calendario) {
            calendario = new Calendario({ fecha: fechaObj, pesosPlanificados: [] });
        }

        // Encontrar hueco disponible
        const hueco = encontrarHuecoDisponible(calendario.pesosPlanificados, horaInicio, horaFin, slotsNecesarios);

        if (!hueco) {
            return res.status(400).json({ error: 'No hay huecos disponibles para esta fecha' });
        }

        // Crear planificación
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
            mensaje: 'Planificación creada exitosamente',
            planificacion: nuevaPlanificacion,
            tiempoCalculado: `${tiempoHoras} horas (${slotsNecesarios} slots de 30 min)`
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Función para encontrar hueco disponible
function encontrarHuecoDisponible(pesosPlanificados, horaInicio, horaFin, slotsNecesarios) {
    const inicioMinutos = horaAMinutos(horaInicio);
    const finMinutos = horaAMinutos(horaFin);
    const duracionMinutos = slotsNecesarios * 30;

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

// 7. BUSCAR HUECO DISPONIBLE (Funcionalidad opcional)
app.post('/api/calendario/buscar-hueco', async (req, res) => {
    try {
        const { fecha, idProducto, cantidad } = req.body;

        const producto = await Producto.findOne({ idProducto });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
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
                    fechaDisponible: fechaBusqueda.toISOString().split('T')[0],
                    horaInicio: hueco.horaInicio,
                    horaFin: hueco.horaFin,
                    tiempoNecesario: `${tiempoHoras} horas (${slotsNecesarios} slots)`,
                    producto: producto.descripcion
                });
            }

            fechaBusqueda.setDate(fechaBusqueda.getDate() + 1);
        }

        res.status(404).json({
            error: 'No se encontraron huecos disponibles en los próximos 30 días',
            tiempoNecesario: `${tiempoHoras} horas (${slotsNecesarios} slots)`
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. INSERTAR DATOS DE EJEMPLO
app.post('/api/setup/datos-ejemplo', async (req, res) => {
    try {
        // Limpiar datos existentes
        await Promise.all([
            Agricultor.deleteMany({}),
            Producto.deleteMany({}),
            EmpresaCompradora.deleteMany({})
        ]);

        // Insertar 10 agricultores
        const agricultores = [
            { idSocio: 'SOC001', dni: '12345678A', nombre: 'Juan', apellidos: 'García López', telefono: '600123456' },
            { idSocio: 'SOC002', dni: '23456789B', nombre: 'María', apellidos: 'Rodríguez Pérez', telefono: '600234567' },
            { idSocio: 'SOC003', dni: '34567890C', nombre: 'Pedro', apellidos: 'Martínez Ruiz', telefono: '600345678' },
            { idSocio: 'SOC004', dni: '45678901D', nombre: 'Ana', apellidos: 'López Sánchez', telefono: '600456789' },
            { idSocio: 'SOC005', dni: '56789012E', nombre: 'Carlos', apellidos: 'Fernández Díaz', telefono: '600567890' },
            { idSocio: 'SOC006', dni: '67890123F', nombre: 'Isabel', apellidos: 'González Moreno', telefono: '600678901' },
            { idSocio: 'SOC007', dni: '78901234G', nombre: 'Miguel', apellidos: 'Jiménez Herrera', telefono: '600789012' },
            { idSocio: 'SOC008', dni: '89012345H', nombre: 'Carmen', apellidos: 'Ruiz Castillo', telefono: '600890123' },
            { idSocio: 'SOC009', dni: '90123456I', nombre: 'Francisco', apellidos: 'Morales Vega', telefono: '600901234' },
            { idSocio: 'SOC010', dni: '01234567J', nombre: 'Lucía', apellidos: 'Serrano Torres', telefono: '600012345' }
        ];

        // Insertar 4 productos
        const productos = [
            {
                idProducto: 'PROD001',
                descripcion: 'Tomates',
                categoria: 'Hortalizas',
                tipoContenedor: 'Cajas de plástico',
                cantidadTotalAlmacenada: 0,
                factorTiempoEntrega: 1.5
            },
            {
                idProducto: 'PROD002',
                descripcion: 'Naranjas',
                categoria: 'Cítricos',
                tipoContenedor: 'Sacos de malla',
                cantidadTotalAlmacenada: 0,
                factorTiempoEntrega: 1.0
            },
            {
                idProducto: 'PROD003',
                descripcion: 'Patatas',
                categoria: 'Tubérculos',
                tipoContenedor: 'Sacos de yute',
                cantidadTotalAlmacenada: 0,
                factorTiempoEntrega: 0.8
            },
            {
                idProducto: 'PROD004',
                descripcion: 'Aceitunas',
                categoria: 'Frutos',
                tipoContenedor: 'Bidones plásticos',
                cantidadTotalAlmacenada: 0,
                factorTiempoEntrega: 2.0
            }
        ];

        // Insertar empresas compradoras de ejemplo
        const empresas = [
            {
                cif: 'A12345678',
                razonSocial: 'Distribuciones Agrícolas S.A.',
                direccionPostal: 'Calle Principal 123',
                localidad: 'Madrid',
                telefono: '911234567',
                representante: {
                    dni: '11111111A',
                    nombreCompleto: 'José Antonio García',
                    telefono: '666111111',
                    correoElectronico: 'ja.garcia@distribuciones.com'
                }
            },
            {
                cif: 'B87654321',
                razonSocial: 'Frutas y Verduras del Sur S.L.',
                direccionPostal: 'Avenida del Campo 456',
                localidad: 'Sevilla',
                telefono: '954123456',
                representante: {
                    dni: '22222222B',
                    nombreCompleto: 'Carmen López Ruiz',
                    telefono: '666222222',
                    correoElectronico: 'c.lopez@frutasdelsur.com'
                }
            }
        ];

        // Guardar en la base de datos
        await Agricultor.insertMany(agricultores);
        await Producto.insertMany(productos);
        await EmpresaCompradora.insertMany(empresas);

        res.json({
            mensaje: 'Datos de ejemplo insertados correctamente',
            resumen: {
                agricultores: agricultores.length,
                productos: productos.length,
                empresas: empresas.length
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ejemplo de planificación con 4 slots mínimos
app.post('/api/setup/ejemplo-planificacion', async (req, res) => {
    try {
        const fechaEjemplo = new Date();
        fechaEjemplo.setDate(fechaEjemplo.getDate() + 1); // Mañana

        const planificacion = {
            fecha: fechaEjemplo.toISOString().split('T')[0],
            idSocio: 'SOC001',
            idProducto: 'PROD001',
            cantidad: 1000 // Esto requerirá al menos 4 slots de 30 min
        };

        const response = await fetch(`http://localhost:${PORT}/api/calendario/planificar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planificacion)
        });

        if (response.ok) {
            const resultado = await response.json();
            res.json({
                mensaje: 'Ejemplo de planificación creado',
                planificacion: resultado
            });
        } else {
            res.status(400).json({ error: 'Error al crear planificación de ejemplo' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de estado
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        mensaje: 'API de Cooperativa Agrícola funcionando correctamente',
        fecha: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 API disponible en: http://localhost:${PORT}/api`);
    console.log(`📊 Estado del servidor: http://localhost:${PORT}/api/status`);
});

// Manejo de errores de conexión
mongoose.connection.on('connected', () => {
    console.log('✅ Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Desconectado de MongoDB');
});