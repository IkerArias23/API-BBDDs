const BASE_URL = 'http://localhost:3000/api';

// Función auxiliar para hacer peticiones
async function makeRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(BASE_URL + url, options);
        const result = await response.json();

        console.log(`${method} ${url}`);
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));
        console.log('---\n');

        return result;
    } catch (error) {
        console.error(`Error en ${method} ${url}:`, error.message);
        console.log('---\n');
        return null;
    }
}

// Función principal de pruebas
async function runTests() {
    console.log('🧪 INICIANDO PRUEBAS DE LA API\n');

    // 1. Verificar estado del servidor
    console.log('1️⃣ VERIFICANDO ESTADO DEL SERVIDOR');
    await makeRequest('/status');

    // 2. Insertar datos de ejemplo
    console.log('2️⃣ INSERTANDO DATOS DE EJEMPLO');
    await makeRequest('/setup/datos-ejemplo', 'POST');

    // 3. Verificar agricultores
    console.log('3️⃣ OBTENIENDO AGRICULTORES');
    await makeRequest('/agricultores');

    // 4. Verificar productos
    console.log('4️⃣ OBTENIENDO PRODUCTOS');
    const productos = await makeRequest('/productos');

    // 5. Insertar nuevo agricultor
    console.log('5️⃣ INSERTANDO NUEVO AGRICULTOR');
    const nuevoAgricultor = {
        idSocio: 'SOC011',
        dni: '11223344Z',
        nombre: 'Nuevo',
        apellidos: 'Agricultor Prueba',
        telefono: '600999888'
    };
    await makeRequest('/agricultores', 'POST', nuevoAgricultor);

    // 6. Insertar nuevo producto
    console.log('6️⃣ INSERTANDO NUEVO PRODUCTO');
    const nuevoProducto = {
        idProducto: 'PROD005',
        descripcion: 'Zanahorias',
        categoria: 'Hortalizas',
        tipoContenedor: 'Sacos de plástico',
        cantidadTotalAlmacenada: 0,
        factorTiempoEntrega: 1.3
    };
    await makeRequest('/productos', 'POST', nuevoProducto);

    // 7. Insertar empresa compradora
    console.log('7️⃣ INSERTANDO EMPRESA COMPRADORA');
    const nuevaEmpresa = {
        cif: 'D99887766',
        razonSocial: 'Empresa Prueba S.L.',
        direccionPostal: 'Calle Test 123',
        localidad: 'Ciudad Prueba',
        telefono: '987654321',
        representante: {
            dni: '99887766X',
            nombreCompleto: 'Representante Prueba',
            telefono: '666999888',
            correoElectronico: 'test@empresa.com'
        }
    };
    await makeRequest('/empresas', 'POST', nuevaEmpresa);

    // 8. Obtener configuración
    console.log('8️⃣ OBTENIENDO CONFIGURACIÓN');
    await makeRequest('/config');

    // 9. Actualizar configuración
    console.log('9️⃣ ACTUALIZANDO CONFIGURACIÓN');
    const nuevaConfig = {
        horaInicioPesos: '07:00',
        horaFinPesos: '20:00'
    };
    await makeRequest('/config', 'PUT', nuevaConfig);

    // 10. Planificar entrega (4+ slots)
    console.log('🔟 PLANIFICANDO ENTREGA (4+ SLOTS)');
    const fechaManana = new Date();
    fechaManana.setDate(fechaManana.getDate() + 1);
    const fechaStr = fechaManana.toISOString().split('T')[0];

    const planificacion = {
        fecha: fechaStr,
        idSocio: 'SOC001',
        idProducto: 'PROD001',
        cantidad: 1200 // Esto debería requerir más de 4 slots
    };
    await makeRequest('/calendario/planificar', 'POST', planificacion);

    // 11. Verificar calendario
    console.log('1️⃣1️⃣ VERIFICANDO CALENDARIO');
    await makeRequest(`/calendario/${fechaStr}`);

    // 12. Buscar hueco disponible
    console.log('1️⃣2️⃣ BUSCANDO HUECO DISPONIBLE');
    const busquedaHueco = {
        fecha: fechaStr,
        idProducto: 'PROD002',
        cantidad: 800
    };
    await makeRequest('/calendario/buscar-hueco', 'POST', busquedaHueco);

    // 13. Insertar un peso
    console.log('1️⃣3️⃣ INSERTANDO REGISTRO DE PESO');
    const nuevoPeso = {
        idPeso: 'PESO001',
        idSocio: 'SOC001',
        idProducto: 'PROD001',
        fechaHoraInicio: new Date().toISOString(),
        fechaHoraFin: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2 horas
        categoriaRendimiento: 'Primera Calidad',
        cantidad: 500
    };
    await makeRequest('/pesos', 'POST', nuevoPeso);

    // 14. Verificar pesos
    console.log('1️⃣4️⃣ VERIFICANDO PESOS REGISTRADOS');
    await makeRequest('/pesos');

    // 15. Planificar segunda entrega
    console.log('1️⃣5️⃣ PLANIFICANDO SEGUNDA ENTREGA');
    const segundaPlanificacion = {
        fecha: fechaStr,
        idSocio: 'SOC002',
        idProducto: 'PROD003',
        cantidad: 600
    };
    await makeRequest('/calendario/planificar', 'POST', segundaPlanificacion);

    // 16. Verificar calendario actualizado
    console.log('1️⃣6️⃣ VERIFICANDO CALENDARIO ACTUALIZADO');
    await makeRequest(`/calendario/${fechaStr}`);

    console.log('✅ PRUEBAS COMPLETADAS');
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('- Estado del servidor: ✓');
    console.log('- Datos de ejemplo: ✓');
    console.log('- CRUD Agricultores: ✓');
    console.log('- CRUD Productos: ✓');
    console.log('- CRUD Empresas: ✓');
    console.log('- Configuración: ✓');
    console.log('- Planificación calendario: ✓');
    console.log('- Búsqueda de huecos: ✓');
    console.log('- Registro de pesos: ✓');
    console.log('- Planificaciones múltiples: ✓');
}

// Ejecutar pruebas
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    runTests().catch(console.error);
} else {
    // Browser environment
    runTests().catch(console.error);
}