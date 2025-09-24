# 🚗 Indiana Usados

> **Aplicación web moderna para gestión de vehículos usados**

## 🎯 Descripción

Indiana Usados es una plataforma web desarrollada con React que permite a los usuarios explorar, filtrar y visualizar vehículos usados de manera intuitiva y eficiente.

## ✨ Características

- 🔍 **Búsqueda avanzada** con filtros por marca, modelo, precio, año
- 📱 **Diseño responsive** optimizado para móviles y desktop
- 🖼️ **Galería de imágenes** interactiva para cada vehículo
- ⚡ **Paginación infinita** para navegación fluida
- 🔐 **Panel administrativo** para gestión de contenido
- 🎨 **UI moderna** con componentes reutilizables

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd indiana-usados

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm test         # Ejecutar tests
```

## 🏗️ Tecnologías

- **Frontend**: React 18, Vite
- **Estado**: React Query, Context API
- **Routing**: React Router v6
- **HTTP**: Axios
- **Testing**: Vitest, Testing Library
- **Styling**: CSS Modules

## 📁 Estructura del Proyecto

```
src/
├── api/           # Normalizadores de datos
├── components/    # Componentes UI reutilizables
├── hooks/         # Custom hooks
├── mappers/       # Transformadores de datos
├── pages/         # Páginas de la aplicación
├── services/      # Servicios de API
├── utils/         # Utilidades y helpers
└── styles/        # Estilos globales
```

## 📚 Documentación

- [Documentación Técnica](./docs/README.md)
- [Sistema de Paginación](./docs/PAGINACION_VEHICULOS.md)

### ⚙️ Variables de entorno (Vite)

Definí estas variables en tus `.env.development` y `.env.production`.
Solo se listan las claves usadas por el código actual.

Core de la app:
- `VITE_ENVIRONMENT`: development | staging | production
- `VITE_API_URL`: base URL del backend (ej.: http://localhost:3001)
- `VITE_API_TIMEOUT`: timeout en ms (ej.: 8000)
- `VITE_DEBUG`: true|false (logs de depuración en desarrollo)
- `VITE_ERROR_BOUNDARIES`: true|false
- `VITE_LAZY_LOADING`: true|false
- `VITE_IMAGE_OPTIMIZATION`: true|false
- `VITE_AUTH_ENABLED`: true|false
- `VITE_AUTH_STORAGE_KEY`: clave storage token (ej.: indiana_auth_token)
- `VITE_USER_STORAGE_KEY`: clave storage usuario (ej.: indiana_user_data)
- `VITE_CONTACT_EMAIL`: email público de contacto
- `VITE_CONTACT_WHATSAPP`: número sin símbolos (ej.: 5491112345678)

Imágenes/Cloudinary:
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_IMG_PROGRESSIVE_JPEG`: true|false
- `VITE_IMG_PLACEHOLDER_BLUR`: true|false
- `VITE_IMG_METRICS`: true|false (solo dev)

Notas:
- `src/config/index.js` es la fuente única de configuración. `src/config/env.js` está deprecado y se mantendrá solo por compatibilidad.
- En producción, usá `VITE_DEBUG=false`.

### 🧪 Uso del logger (dev/prod)

API mínima:

```js
import { logger } from '@utils/logger'

logger.debug('axios:config', { baseURL })
logger.info('vehicles:load', 'Lista cargada')
logger.warn('axios:error', 'HTTP error', { method: 'GET', url: '/api', status: 404, ms: 120 })
logger.error('ui:error-boundary', 'Unhandled error', error)
```

Notas:
- Dev muestra `debug/info/warn/error` con timestamp legible.
- Prod muestra solo `warn/error` y aplica scrubber básico (sin PII).
- `localStorage.debug = '1'` habilita `debug` temporalmente en prod.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo**: Equipo Indiana Usados
- **Versión**: 2.0.0
- **Última actualización**: 2024