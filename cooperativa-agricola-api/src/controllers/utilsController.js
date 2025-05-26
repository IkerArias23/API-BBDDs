const Agricultor = require('../models/Agricultor');
const Producto = require('../models/Producto');
const Empresa = require('../models/Empresa');

const insertarDatosEjemplo = async (req, res) => {
    try {
        // Limpiar datos existentes
        await Promise.all([
            Agricultor.deleteMany({}),
            Producto.deleteMany({}),
            Empresa.deleteMany({})
        ]);

        // 10 Agricultores de ejemplo
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

        // 4 Productos de ejemplo
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

        // Empresas de ejemplo
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

        // Insertar datos
        await Agricultor.insertMany(agricultores);
        await Producto.insertMany(productos);
        await Empresa.insertMany(empresas);

        res.json({
            success: true,
            message: 'Datos de ejemplo insertados correctamente',
            data: {
                agricultores: agricultores.length,
                productos: productos.length,
                empresas: empresas.length
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al insertar datos de ejemplo',
            error: error.message
        });
    }
};

module.exports = {
    insertarDatosEjemplo
};