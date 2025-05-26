// Configuración de la API
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000
};

// Clase para manejar todas las peticiones a la API
class CooperativaAPI {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    // Método genérico para hacer peticiones
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error(`Error en petición ${endpoint}:`, error);
            throw error;
        }
    }

    // Métodos GET
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // Métodos POST
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Métodos PUT
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Métodos DELETE
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // === MÉTODOS ESPECÍFICOS DE LA API ===

    // Status del servidor
    async getStatus() {
        return this.get('/status');
    }

    // Agricultores
    async getAgricultores() {
        return this.get('/agricultores');
    }

    async getAgricultor(id) {
        return this.get(`/agricultores/${id}`);
    }

    async createAgricultor(data) {
        return this.post('/agricultores', data);
    }

    async updateAgricultor(id, data) {
        return this.put(`/agricultores/${id}`, data);
    }

    async deleteAgricultor(id) {
        return this.delete(`/agricultores/${id}`);
    }

    // Productos
    async getProductos() {
        return this.get('/productos');
    }

    async getProducto(id) {
        return this.get(`/productos/${id}`);
    }

    async createProducto(data) {
        return this.post('/productos', data);
    }

    async updateProducto(id, data) {
        return this.put(`/productos/${id}`, data);
    }

    // Empresas
    async getEmpresas() {
        return this.get('/empresas');
    }

    async getEmpresa(cif) {
        return this.get(`/empresas/${cif}`);
    }

    async createEmpresa(data) {
        return this.post('/empresas', data);
    }

    // Pesadas
    async getPesadas() {
        return this.get('/pesadas');
    }

    async getPesada(id) {
        return this.get(`/pesadas/${id}`);
    }

    async createPesada(data) {
        return this.post('/pesadas', data);
    }

    // Calendario
    async getCalendario(fecha) {
        return this.get(`/calendario/${fecha}`);
    }

    async planificarEntrega(data) {
        return this.post('/calendario/planificar', data);
    }

    async buscarHueco(data) {
        return this.post('/calendario/buscar-hueco', data);
    }

    // Configuración
    async getConfig() {
        return this.get('/config');
    }

    async updateConfig(data) {
        return this.put('/config', data);
    }

    // Utilidades
    async loadExampleData() {
        return this.post('/setup/datos-ejemplo');
    }
}

// Instancia global de la API
const api = new CooperativaAPI();

// Función para verificar el estado de la API
async function checkAPIStatus() {
    try {
        const status = await api.getStatus();
        return {
            success: true,
            message: '✅ API Conectada',
            data: status
        };
    } catch (error) {
        return {
            success: false,
            message: '❌ API No Disponible',
            error: error.message
        };
    }
}