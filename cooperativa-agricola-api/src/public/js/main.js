// Estado global de la aplicación
let appState = {
    currentSection: 'dashboard',
    agricultores: [],
    productos: [],
    empresas: [],
    loading: false
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    console.log('🌾 Inicializando Cooperativa Agrícola...');

    // Configurar navegación
    setupNavigation();

    // Configurar formularios
    setupForms();

    // Verificar estado de la API
    await checkAndDisplayAPIStatus();

    // Cargar datos del dashboard
    await loadDashboard();

    // Configurar fecha por defecto
    setupDefaultDates();

    console.log('✅ Aplicación inicializada correctamente');
}

// === NAVEGACIÓN ===
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Mostrar sección
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    appState.currentSection = sectionName;

    // Cargar datos específicos de la sección
    loadSectionData(sectionName);
}

async function loadSectionData(section) {
    switch(section) {
        case 'agricultores':
            await loadAgricultores();
            break;
        case 'productos':
            await loadProductos();
            break;
        case 'calendario':
            await loadSelectOptions();
            await loadCalendarioToday();
            break;
        case 'empresas':
            await loadEmpresas();
            break;
        case 'config':
            await loadConfig();
            break;
    }
}

// === ESTADO DE LA API ===
async function checkAndDisplayAPIStatus() {
    const statusElement = document.getElementById('api-status');

    try {
        const status = await checkAPIStatus();
        if (status.success) {
            statusElement.textContent = status.message;
            statusElement.classList.remove('error');
        } else {
            throw new Error(status.error);
        }
    } catch (error) {
        statusElement.textContent = '❌ API No Disponible';
        statusElement.classList.add('error');
        messages.error('No se puede conectar con el servidor');
    }
}

// === DASHBOARD ===
async function loadDashboard() {
    try {
        // Cargar estadísticas
        const [agricultores, productos, empresas] = await Promise.all([
            api.getAgricultores().catch(() => ({ count: 0 })),
            api.getProductos().catch(() => ({ count: 0 })),
            api.getEmpresas().catch(() => ({ count: 0 }))
        ]);

        document.getElementById('total-agricultores').textContent = agricultores.count || 0;
        document.getElementById('total-productos').textContent = productos.count || 0;
        document.getElementById('total-empresas').textContent = empresas.count || 0;

        // Cargar entregas de hoy
        const today = getTodayString();
        try {
            const calendario = await api.getCalendario(today);
            const entregas = calendario.data?.pesosPlanificados?.length || 0;
            document.getElementById('entregas-hoy').textContent = entregas;
        } catch (e) {
            document.getElementById('entregas-hoy').textContent = '0';
        }

    } catch (error) {
        console.error('Error cargando dashboard:', error);
        messages.error('Error al cargar estadísticas del dashboard');
    }
}

// === FORMULARIOS ===
function setupForms() {
    // Agricultor
    document.getElementById('form-agricultor').addEventListener('submit', handleAgricultor);

    // Producto
    document.getElementById('form-producto').addEventListener('submit', handleProducto);

    // Calendario
    document.getElementById('form-calendario').addEventListener('submit', handleCalendario);

    // Empresa
    document.getElementById('form-empresa').addEventListener('submit', handleEmpresa);

    // Configuración
    document.getElementById('form-config').addEventListener('submit', handleConfig);
}

function setupDefaultDates() {
    const today = getTodayString();
    const fechaEntrega = document.getElementById('fechaEntrega');
    const fechaCalendario = document.getElementById('fechaCalendario');

    if (fechaEntrega) fechaEntrega.value = today;
    if (fechaCalendario) fechaCalendario.value = today;
}

// === AGRICULTORES ===
async function loadAgricultores() {
    const tbody = document.querySelector('#table-agricultores tbody');
    showLoading(tbody, 'Cargando agricultores...');

    try {
        const response = await api.getAgricultores();
        appState.agricultores = response.data || [];

        if (appState.agricultores.length === 0) {
            showEmpty(tbody, 'No hay agricultores registrados');
            return;
        }

        tbody.innerHTML = appState.agricultores.map(agricultor => `
            <tr>
                <td>${agricultor.idSocio}</td>
                <td>${agricultor.dni}</td>
                <td>${agricultor.nombre} ${agricultor.apellidos}</td>
                <td>${agricultor.telefono}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error cargando agricultores:', error);
        showError(tbody, 'Error al cargar agricultores');
        messages.error('Error al cargar la lista de agricultores');
    }
}

async function handleAgricultor(e) {
    e.preventDefault();

    if (!validateForm(e.target)) {
        messages.error('Por favor, completa todos los campos correctamente');
        return;
    }

    const formData = {
        idSocio: document.getElementById('idSocio').value.trim().toUpperCase(),
        dni: document.getElementById('dni').value.trim().toUpperCase(),
        nombre: capitalize(document.getElementById('nombre').value.trim()),
        apellidos: capitalize(document.getElementById('apellidos').value.trim()),
        telefono: document.getElementById('telefono').value.trim()
    };

    try {
        await api.createAgricultor(formData);
        messages.success('Agricultor agregado exitosamente');
        clearForm('form-agricultor');
        await loadAgricultores();
        await loadDashboard();
    } catch (error) {
        console.error('Error creando agricultor:', error);
        messages.error('Error al agregar agricultor: ' + error.message);
    }
}

// === PRODUCTOS ===
async function loadProductos() {
    const tbody = document.querySelector('#table-productos tbody');
    showLoading(tbody, 'Cargando productos...');

    try {
        const response = await api.getProductos();
        appState.productos = response.data || [];

        if (appState.productos.length === 0) {
            showEmpty(tbody, 'No hay productos registrados');
            return;
        }

        tbody.innerHTML = appState.productos.map(producto => `
            <tr>
                <td>${producto.idProducto}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.categoria}</td>
                <td>${producto.factorTiempoEntrega}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error cargando productos:', error);
        showError(tbody, 'Error al cargar productos');
        messages.error('Error al cargar la lista de productos');
    }
}

async function handleProducto(e) {
    e.preventDefault();

    if (!validateForm(e.target)) {
        messages.error('Por favor, completa todos los campos correctamente');
        return;
    }

    const formData = {
        idProducto: document.getElementById('idProducto').value.trim().toUpperCase(),
        descripcion: capitalize(document.getElementById('descripcion').value.trim()),
        categoria: document.getElementById('categoria').value,
        tipoContenedor: document.getElementById('tipoContenedor').value.trim(),
        factorTiempoEntrega: parseFloat(document.getElementById('factorTiempoEntrega').value),
        cantidadTotalAlmacenada: 0
    };

    try {
        await api.createProducto(formData);
        messages.success('Producto agregado exitosamente');
        clearForm('form-producto');
        await loadProductos();
        await loadDashboard();
    } catch (error) {
        console.error('Error creando producto:', error);
        messages.error('Error al agregar producto: ' + error.message);
    }
}

// === CALENDARIO ===
async function loadSelectOptions() {
    try {
        // Cargar agricultores para select
        if (appState.agricultores.length === 0) {
            const agricultoresResponse = await api.getAgricultores();
            appState.agricultores = agricultoresResponse.data || [];
        }

        const selectAgricultor = document.getElementById('selectAgricultor');
        selectAgricultor.innerHTML = '<option value="">Seleccionar agricultor...</option>' +
            appState.agricultores.map(a =>
                `<option value="${a.idSocio}">${a.nombre} ${a.apellidos} (${a.idSocio})</option>`
            ).join('');

        // Cargar productos para select
        if (appState.productos.length === 0) {
            const productosResponse = await api.getProductos();
            appState.productos = productosResponse.data || [];
        }

        const selectProducto = document.getElementById('selectProducto');
        selectProducto.innerHTML = '<option value="">Seleccionar producto...</option>' +
            appState.productos.map(p =>
                `<option value="${p.idProducto}">${p.descripcion} (${p.idProducto})</option>`
            ).join('');

    } catch (error) {
        console.error('Error cargando opciones de select:', error);
        messages.error('Error al cargar opciones del formulario');
    }
}

async function loadCalendarioToday() {
    const today = getTodayString();
    document.getElementById('fechaCalendario').value = today;
    await loadCalendario();
}

async function loadCalendario() {
    const fecha = document.getElementById('fechaCalendario').value;
    const container = document.getElementById('calendario-slots');

    if (!fecha) {
        container.innerHTML = '<p>Selecciona una fecha para ver las entregas</p>';
        return;
    }

    container.innerHTML = '<p>Cargando calendario...</p>';

    try {
        const response = await api.getCalendario(fecha);
        const entregas = response.data?.pesosPlanificados || [];

        if (entregas.length === 0) {
            container.innerHTML = '<div class="slot">No hay entregas planificadas para esta fecha</div>';
            return;
        }

        container.innerHTML = entregas.map(entrega => `
            <div class="slot occupied">
                <strong>${entrega.horaInicio} - ${entrega.horaFin}</strong><br>
                <span>Agricultor: ${entrega.idSocio}</span><br>
                <span>Producto: ${entrega.idProducto}</span><br>
                <span>Cantidad: ${formatNumber(entrega.cantidad)} kg</span>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error cargando calendario:', error);
        container.innerHTML = '<div class="slot" style="color: #f44336;">Error al cargar el calendario</div>';
    }
}

async function handleCalendario(e) {
    e.preventDefault();

    if (!validateForm(e.target)) {
        messages.error('Por favor, completa todos los campos');
        return;
    }

    const formData = {
        fecha: document.getElementById('fechaEntrega').value,
        idSocio: document.getElementById('selectAgricultor').value,
        idProducto: document.getElementById('selectProducto').value,
        cantidad: parseInt(document.getElementById('cantidad').value)
    };

    try {
        const response = await api.planificarEntrega(formData);
        messages.success('Entrega planificada exitosamente');
        clearForm('form-calendario');
        setupDefaultDates();
        await loadCalendario();
        await loadDashboard();
    } catch (error) {
        console.error('Error planificando entrega:', error);
        messages.error('Error al planificar entrega: ' + error.message);
    }
}

async function buscarHueco() {
    const fecha = document.getElementById('fechaEntrega').value;
    const idProducto = document.getElementById('selectProducto').value;
    const cantidad = document.getElementById('cantidad').value;

    if (!fecha || !idProducto || !cantidad) {
        messages.error('Completa todos los campos para buscar hueco disponible');
        return;
    }

    try {
        const response = await api.buscarHueco({
            fecha,
            idProducto,
            cantidad: parseInt(cantidad)
        });

        if (response.data) {
            const data = response.data;
            messages.success(
                `Hueco encontrado: ${formatDate(data.fechaDisponible)} de ${data.horaInicio} a ${data.horaFin}`
            );
        }
    } catch (error) {
        console.error('Error buscando hueco:', error);
        messages.error('Error al buscar hueco: ' + error.message);
    }
}

// === EMPRESAS ===
async function loadEmpresas() {
    const tbody = document.querySelector('#table-empresas tbody');
    showLoading(tbody, 'Cargando empresas...');

    try {
        const response = await api.getEmpresas();
        appState.empresas = response.data || [];

        if (appState.empresas.length === 0) {
            showEmpty(tbody, 'No hay empresas registradas');
            return;
        }

        tbody.innerHTML = appState.empresas.map(empresa => `
            <tr>
                <td>${empresa.cif}</td>
                <td>${empresa.razonSocial}</td>
                <td>${empresa.localidad}</td>
                <td>${empresa.representante.nombreCompleto}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error cargando empresas:', error);
        showError(tbody, 'Error al cargar empresas');
        messages.error('Error al cargar la lista de empresas');
    }
}

async function handleEmpresa(e) {
    e.preventDefault();

    if (!validateForm(e.target)) {
        messages.error('Por favor, completa todos los campos correctamente');
        return;
    }

    const formData = {
        cif: document.getElementById('cif').value.trim().toUpperCase(),
        razonSocial: document.getElementById('razonSocial').value.trim(),
        direccionPostal: document.getElementById('direccion').value.trim(),
        localidad: capitalize(document.getElementById('localidad').value.trim()),
        telefono: document.getElementById('telefonoEmpresa').value.trim(),
        representante: {
            dni: document.getElementById('dniRepresentante').value.trim().toUpperCase(),
            nombreCompleto: document.getElementById('nombreRepresentante').value.trim(),
            telefono: document.getElementById('telefonoRepresentante').value.trim(),
            correoElectronico: document.getElementById('emailRepresentante').value.trim().toLowerCase()
        }
    };

    try {
        await api.createEmpresa(formData);
        messages.success('Empresa agregada exitosamente');
        clearForm('form-empresa');
        await loadEmpresas();
        await loadDashboard();
    } catch (error) {
        console.error('Error creando empresa:', error);
        messages.error('Error al agregar empresa: ' + error.message);
    }
}

// === CONFIGURACIÓN ===
async function loadConfig() {
    try {
        const response = await api.getConfig();
        const config = response.data;

        document.getElementById('horaInicio').value = config.horaInicioPesos;
        document.getElementById('horaFin').value = config.horaFinPesos;

        const systemInfo = document.getElementById('system-info');
        systemInfo.innerHTML = `
            <p><strong>Horario Actual:</strong> ${config.horaInicioPesos} - ${config.horaFinPesos}</p>
            <p><strong>Última Actualización:</strong> ${formatDateTime(config.fechaActualizacion)}</p>
        `;

    } catch (error) {
        console.error('Error cargando configuración:', error);
        messages.error('Error al cargar la configuración');
    }
}

async function handleConfig(e) {
    e.preventDefault();

    if (!validateForm(e.target)) {
        messages.error('Por favor, completa todos los campos');
        return;
    }

    const formData = {
        horaInicioPesos: document.getElementById('horaInicio').value,
        horaFinPesos: document.getElementById('horaFin').value
    };

    try {
        await api.updateConfig(formData);
        messages.success('Configuración actualizada exitosamente');
        await loadConfig();
    } catch (error) {
        console.error('Error actualizando configuración:', error);
        messages.error('Error al actualizar configuración: ' + error.message);
    }
}

// === UTILIDADES ===
async function loadExampleData() {
    if (!confirmAction('¿Deseas cargar los datos de ejemplo? Esto puede sobrescribir datos existentes.')) {
        return;
    }

    try {
        await api.loadExampleData();
        messages.success('Datos de ejemplo cargados exitosamente');
        await loadDashboard();

        // Recargar la sección actual
        if (appState.currentSection !== 'dashboard') {
            await loadSectionData(appState.currentSection);
        }
    } catch (error) {
        console.error('Error cargando datos de ejemplo:', error);
        messages.error('Error al cargar datos de ejemplo: ' + error.message);
    }
}

// Hacer funciones globales disponibles
window.showSection = showSection;
window.loadCalendario = loadCalendario;
window.buscarHueco = buscarHueco;
window.loadExampleData = loadExampleData;