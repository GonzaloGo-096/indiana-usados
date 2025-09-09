# 📚 Documentación del Proyecto

## 🎯 Visión General

**Indiana Usados** es una aplicación web moderna para la gestión y visualización de vehículos usados, construida con React, Vite y tecnologías modernas.

## 🏗️ Arquitectura

### Frontend
- **React 18** - Biblioteca principal
- **Vite** - Build tool y dev server
- **React Query** - Gestión de estado del servidor
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Estructura de Carpetas
```
src/
├── api/           # Normalizadores y configuración API
├── components/    # Componentes reutilizables
├── hooks/         # Custom hooks
├── mappers/       # Transformadores de datos
├── pages/         # Páginas principales
├── services/      # Servicios de API
├── utils/         # Utilidades
└── styles/        # Estilos globales
```

## 🚀 Funcionalidades Principales

- ✅ **Lista de vehículos** con paginación infinita
- ✅ **Filtros avanzados** por marca, modelo, precio, etc.
- ✅ **Detalle de vehículo** con galería de imágenes
- ✅ **Panel administrativo** para gestión
- ✅ **Autenticación** y autorización
- ✅ **Responsive design** para móviles y desktop

## 📖 Documentación Técnica

- [Paginación de Vehículos](./PAGINACION_VEHICULOS.md) - Sistema de paginación implementado
- [README Principal](../README.md) - Guía de instalación y uso

## 🔧 Desarrollo

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Tests
```bash
npm test
```

## 📝 Notas de Desarrollo

- **Código limpio**: Sin documentación obsoleta, solo lo esencial
- **Tests**: Cobertura completa con Vitest
- **Performance**: Optimizado para producción
- **Mantenible**: Estructura modular y escalable
