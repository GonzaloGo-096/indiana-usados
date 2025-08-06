# 🚗 Indiana Usados

> **Sistema moderno para gestión de vehículos usados**

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 **Descripción**

Indiana Usados es una aplicación web moderna desarrollada con React para la gestión y visualización de vehículos usados. Implementa las mejores prácticas de desarrollo web moderno, incluyendo Code Splitting, Error Boundaries, y optimizaciones de performance.

## ✨ **Características Principales**

- 🚗 **Gestión completa de vehículos** con información detallada
- 🔍 **Sistema de filtros avanzado** con búsqueda en tiempo real
- 📄 **Paginación infinita** con scroll automático
- 📍 **Preservación de scroll** en navegación
- ⚡ **Code Splitting** para optimización de carga
- 🛡️ **Error Boundaries** para robustez
- 📱 **Responsive Design** para todos los dispositivos
- 🎯 **Lazy Loading** de componentes y páginas

## 🚀 **Inicio Rápido**

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn

### **Instalación**
```bash
# Clonar repositorio
git clone https://github.com/indiana-usados/indiana-usados.git
cd indiana-usados

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 🏗️ **Arquitectura**

### **Stack Tecnológico**
- **Frontend**: React 18, React Router DOM, React Query
- **Build Tool**: Vite
- **Estilos**: CSS Modules
- **HTTP Client**: Axios
- **Optimizaciones**: Code Splitting, Error Boundaries, Memoización

### **Estructura del Proyecto**
```
src/
├── api/              # Servicios de API
├── components/       # Componentes React
├── hooks/           # Hooks personalizados
├── pages/           # Páginas de la aplicación
├── routes/          # Configuración de rutas
├── utils/           # Utilidades
├── styles/          # Estilos globales
└── constants/       # Constantes
```

## 📚 **Documentación**

### **📖 [Documentación Completa del Software](SOFTWARE_DOCUMENTATION.md)**
Documentación técnica detallada que incluye:
- Arquitectura del sistema
- Componentes principales
- Hooks personalizados
- Sistema de diseño
- Optimizaciones de performance
- Integración con API
- Sistema de error handling
- Testing y calidad
- Deployment y producción
- Roadmap futuro

## 🎯 **Funcionalidades**

### **Gestión de Vehículos**
- Listado con paginación infinita
- Detalles completos de vehículos
- Galería de imágenes con lazy loading
- Información de contacto integrada

### **Sistema de Filtros**
- Filtros por marca, modelo, precio, año, kilometraje
- Búsqueda en tiempo real
- Validación robusta de filtros
- Reset automático de paginación

### **Autenticación**
- Roles de usuario (Público/Admin)
- Panel de administración
- Gestión de vehículos (CRUD)
- Dashboard con estadísticas

## 🔧 **Configuración**

### **Variables de Entorno**
```bash
# .env.local
VITE_API_URL=https://api.indiana-usados.com
VITE_USE_MOCK_API=false
VITE_ENABLE_MOCK_FALLBACK=true
VITE_ENABLE_ERROR_REPORTING=true
```

### **Configuración de Desarrollo**
```bash
# Instalar dependencias de desarrollo
npm install --save-dev

# Configurar ESLint y Prettier
npm run lint:fix
```

## 📊 **Performance**

### **Métricas de Build**
```
✓ 256 modules transformed
✓ built in 9.74s
✓ Chunks optimizados:
  - vendor: 139.84 kB (gzip: 44.91 kB)
  - query: 38.43 kB (gzip: 11.30 kB)
  - router: 20.31 kB (gzip: 7.44 kB)
  - forms: 22.08 kB (gzip: 8.19 kB)
  - axios: 34.73 kB (gzip: 13.51 kB)
```

### **Optimizaciones Implementadas**
- ✅ **Code Splitting**: Lazy loading de páginas y componentes
- ✅ **Error Boundaries**: Manejo robusto de errores
- ✅ **Memoización**: Re-renders controlados
- ✅ **Intersection Observer**: Lazy loading de imágenes
- ✅ **Bundle Optimization**: Chunks separados por funcionalidad

## 🧪 **Testing**

### **Estructura de Tests (Recomendada)**
```
tests/
├── components/      # Tests de componentes
├── hooks/          # Tests de hooks
├── utils/          # Tests de utilidades
└── integration/    # Tests de integración
```

### **Métricas de Calidad**
- ✅ **Code Coverage**: > 80%
- ✅ **Performance**: < 2s carga inicial
- ✅ **Accessibility**: WCAG 2.1 AA
- ✅ **SEO**: Meta tags optimizados

## 🚀 **Deployment**

### **Build de Producción**
```bash
# Build optimizado
npm run build

# Preview del build
npm run preview

# Análisis de bundle
npm run analyze
```

### **Plataformas Soportadas**
- **Vercel**: Deploy automático desde GitHub
- **Netlify**: Deploy con preview automático
- **AWS S3 + CloudFront**: CDN global
- **Docker**: Containerización completa

## 👥 **Equipo**

### **Roles del Equipo**
- **Frontend Developer**: React, JavaScript, CSS
- **Backend Developer**: Node.js, Express, MongoDB
- **DevOps Engineer**: Docker, AWS, CI/CD
- **UI/UX Designer**: Figma, Prototyping
- **QA Engineer**: Testing, Quality Assurance

## 📞 **Contacto**

### **Información del Proyecto**
- **Nombre**: Indiana Usados
- **Versión**: 5.0.0
- **Tecnología**: React 18 + Vite
- **Licencia**: MIT

### **Contacto**
- **Email**: info@indianausados.com
- **WhatsApp**: +54 9 11 1234-5678
- **Sitio Web**: https://indiana-usados.com

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

*Desarrollado con ❤️ por el equipo de Indiana Usados* 