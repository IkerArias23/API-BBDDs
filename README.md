# 🌾 API Cooperativa Agrícola

> Sistema de gestión para cooperativa agrícola desarrollado con Node.js, Express y MongoDB

## 📋 Descripción

API REST completa para la gestión de una cooperativa agrícola que permite:
- Registrar agricultores y productos
- Gestionar operaciones de pesada
- Planificar entregas con sistema de calendario inteligente
- Administrar empresas compradoras
- Búsqueda automática de huecos disponibles

**Desarrollado como proyecto final para la asignatura de Bases de Datos - Universidad Alfonso X el Sabio (UAX)**

## ✨ Características

### ✅ Requisitos Implementados
- **Base de datos MongoDB** con 6 colecciones principales
- **API REST completa** con todos los endpoints CRUD
- **10 agricultores y 4 productos** de ejemplo precargados
- **Sistema de calendario** con gestión de slots de 30 minutos
- **Planificación automática** que garantiza mínimo 4 slots por entrega
- **Funcionalidad opcional**: Búsqueda inteligente de huecos disponibles

### 🚀 Funcionalidades Destacadas
- **Cálculo automático de tiempos** basado en factores de entrega
- **Prevención de solapamientos** en el calendario
- **Horarios configurables** para operaciones de pesada
- **Validación completa** de datos de entrada
- **Manejo robusto de errores**

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Utilidades**: Moment.js, CORS, dotenv
- **Validación**: Express-validator

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/cooperativa-agricola-api.git
cd cooperativa-agricola-api
