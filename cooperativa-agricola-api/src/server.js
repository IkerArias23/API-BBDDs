const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

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

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api', indexRoutes);
app.use('/api/agricultores', agricultoresRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pesadas', pesadasRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/config', configRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/setup', utilsRoutes);

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint de API no encontrado',
        availableEndpoints: [
            '/api/status - Estado del servidor',
            '/api/agricultores - Gestión de agricultores',
            '/api/productos - Gestión de productos',
            '/api/pesadas - Gestión de pesadas',
            '/api/empresas - Gestión de empresas',
            '/api/config - Configuración del sistema',
            '/api/calendario - Sistema de calendario',
            '/api/setup - Utilidades y datos de ejemplo'
        ]
    });
});

app.listen(PORT, () => {
    console.log('🌾=====================================🌾');
    console.log('🚀 COOPERATIVA AGRÍCOLA - SERVIDOR ACTIVO');
    console.log('🌾=====================================🌾');
    console.log(`📱 Interfaz Web: http://localhost:${PORT}`);
    console.log(`🔗 API REST: http://localhost:${PORT}/api`);
    console.log(`📊 Estado API: http://localhost:${PORT}/api/status`);
    console.log(`📚 Documentación: http://localhost:${PORT}/api/docs`);
    console.log('🌾=====================================🌾');
    console.log('✅ Sistema listo para usar');
});

module.exports = app;