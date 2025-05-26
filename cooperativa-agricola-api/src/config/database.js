const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/cooperativa_agricola',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

        // Event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB desconectado');
        });

    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;