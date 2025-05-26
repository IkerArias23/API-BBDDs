const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos
const connectDB = require('./config/database');

// Importar rutas
const indexRoutes = require('./routes/index');
const agricultoresRoutes = require('./routes/agricultores');
const productosRoutes = require('./routes/productos');
const pesadasRoutes = require('./routes/pesadas');
const empresasRoutes = require('./routes/empresas');
const configRoutes = require('./routes/config');
const calendarioRoutes = require('./routes/calendario');
const utilsRoutes = require('./routes/utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas principales
app.use('/api', indexRoutes);
app.use('/api/agricultores', agricultoresRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pesadas', pesadasRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/config', configRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/setup', utilsRoutes);

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        availableEndpoints: [
            '/api/status',
            '/api/agricultores',
            '/api/productos',
            '/api/pesadas',
            '/api/empresas',
            '/api/config',
            '/api/calendario',
            '/api/setup'
        ]
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 API disponible en: http://localhost:${PORT}/api`);
    console.log(`📊 Estado del servidor: http://localhost:${PORT}/api/status`);
});

module.exports = app;