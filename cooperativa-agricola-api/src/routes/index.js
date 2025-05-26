const express = require('express');
const router = express.Router();

/**
 * Ruta principal de estado
 */
router.get('/status', (req, res) => {
    res.json({
        success: true,
        message: 'API de Cooperativa Agrícola funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            agricultores: '/api/agricultores',
            productos: '/api/productos',
            pesadas: '/api/pesadas',
            empresas: '/api/empresas',
            config: '/api/config',
            calendario: '/api/calendario',
            utils: '/api/setup'
        }
    });
});

/**
 * Documentación básica de la API
 */
router.get('/docs', (req, res) => {
    res.json({
        success: true,
        message: 'Documentación de la API',
        endpoints: [
            {
                path: '/api/status',
                method: 'GET',
                description: 'Estado del servidor'
            },
            {
                path: '/api/agricultores',
                methods: ['GET', 'POST'],
                description: 'Gestión de agricultores'
            },
            {
                path: '/api/productos',
                methods: ['GET', 'POST'],
                description: 'Gestión de productos'
            },
            {
                path: '/api/pesadas',
                methods: ['GET', 'POST'],
                description: 'Gestión de pesadas'
            },
            {
                path: '/api/empresas',
                methods: ['GET', 'POST'],
                description: 'Gestión de empresas compradoras'
            },
            {
                path: '/api/config',
                methods: ['GET', 'PUT'],
                description: 'Configuración del sistema'
            },
            {
                path: '/api/calendario',
                methods: ['GET', 'POST'],
                description: 'Sistema de calendario y planificación'
            },
            {
                path: '/api/setup',
                methods: ['POST'],
                description: 'Utilidades y datos de ejemplo'
            }
        ]
    });
});

module.exports = router;