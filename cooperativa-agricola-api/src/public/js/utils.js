// Utilidades generales para la aplicación

// Formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Obtener fecha de hoy en formato YYYY-MM-DD
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// Validaciones
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateDNI(dni) {
    const re = /^\d{8}[A-Z]$/;
    return re.test(dni);
}

function validateCIF(cif) {
    const re = /^[A-Z]\d{8}$/;
    return re.test(cif);
}

function validatePhone(phone) {
    const re = /^\d{9}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Sistema de mensajes
class MessageSystem {
    constructor() {
        this.container = document.getElementById('messages');
        this.messages = [];
    }

    show(message, type = 'success', duration = 5000) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        this.container.appendChild(messageElement);
        this.messages.push(messageElement);

        // Auto-remove después del tiempo especificado
        setTimeout(() => {
            this.remove(messageElement);
        }, duration);

        return messageElement;
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 8000) {
        return this.show(message, 'error', duration);
    }

    remove(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
            this.messages = this.messages.filter(msg => msg !== messageElement);
        }
    }

    clear() {
        this.messages.forEach(msg => this.remove(msg));
        this.messages = [];
    }
}

// Instancia global del sistema de mensajes
const messages = new MessageSystem();

// Loading states
function showLoading(element, text = 'Cargando...') {
    if (element) {
        element.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 20px; color: #666;">${text}</td></tr>`;
    }
}

function showError(element, text = 'Error al cargar datos') {
    if (element) {
        element.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 20px; color: #f44336;">${text}</td></tr>`;
    }
}

function showEmpty(element, text = 'No hay datos disponibles') {
    if (element) {
        element.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 20px; color: #666;">${text}</td></tr>`;
    }
}

// Limpiar formularios
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Validar formulario completo
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    let firstInvalidInput = null;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f44336';
            if (!firstInvalidInput) {
                firstInvalidInput = input;
            }
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });

    // Validaciones específicas
    inputs.forEach(input => {
        const value = input.value.trim();

        if (input.type === 'email' && value && !validateEmail(value)) {
            isValid = false;
            input.style.borderColor = '#f44336';
            if (!firstInvalidInput) firstInvalidInput = input;
        }

        if (input.id === 'dni' && value && !validateDNI(value)) {
            isValid = false;
            input.style.borderColor = '#f44336';
            if (!firstInvalidInput) firstInvalidInput = input;
        }

        if (input.id === 'cif' && value && !validateCIF(value)) {
            isValid = false;
            input.style.borderColor = '#f44336';
            if (!firstInvalidInput) firstInvalidInput = input;
        }

        if (input.type === 'tel' && value && !validatePhone(value)) {
            isValid = false;
            input.style.borderColor = '#f44336';
            if (!firstInvalidInput) firstInvalidInput = input;
        }
    });

    if (!isValid && firstInvalidInput) {
        firstInvalidInput.focus();
    }

    return isValid;
}

// Confirmar acciones
function confirmAction(message = '¿Estás seguro?') {
    return confirm(message);
}

// Capitalizar texto
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Generar ID único simple
function generateId(prefix = 'ID') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}${timestamp}${random}`.toUpperCase();
}

// Formatear números
function formatNumber(number, decimals = 0) {
    return Number(number).toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Debounce function para búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll suave a elemento
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Copiar texto al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        messages.success('Copiado al portapapeles');
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        messages.error('Error al copiar al portapapeles');
        return false;
    }
}

// Descargar datos como JSON
function downloadJSON(data, filename = 'data.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Parsear query params de URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Actualizar URL sin recargar página
function updateURL(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    history.pushState({}, '', url);
}

// Detectar si está en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Storage helpers (localStorage)
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Event helpers
function addEventListeners(selectors, event, callback) {
    const elements = typeof selectors === 'string'
        ? document.querySelectorAll(selectors)
        : selectors;

    elements.forEach(element => {
        element.addEventListener(event, callback);
    });
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}