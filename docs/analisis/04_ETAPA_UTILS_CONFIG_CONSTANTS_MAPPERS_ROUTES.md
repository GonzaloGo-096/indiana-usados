# 📋 ETAPA 4: Análisis de `utils/`, `config/`, `constants/`, `mappers/` y `routes/`

Este documento analiza las carpetas de utilidades, configuración, constantes, transformadores de datos y rutas.

---

## 📁 4.1 Carpeta `utils/`

### 🎯 Propósito y Responsabilidad

**Funciones utilitarias reutilizables** para formateo, filtros, imágenes, logging y optimizaciones.

### 📂 Estructura

```
utils/
├── index.js                      # Exportaciones centralizadas
├── logger.js                     # Sistema de logging profesional
├── formatters.js                 # Formateo de precios, kilómetros, años
├── filters.js                    # Construcción de filtros para backend
├── cloudinaryUrl.js              # Generación de URLs de Cloudinary
├── extractPublicId.js            # Extracción de public_id de URLs
├── imageUtils.js                 # Utilidades de imágenes
├── imageExtractors.js            # Extractores de URLs de imágenes
├── preload.js                    # Funciones de preload
└── files.js                      # Utilidades de archivos
```

### 📄 Utilidades Principales

#### `logger.js` - Sistema de Logging

**Responsabilidad**: Sistema de logging profesional con niveles y filtrado por ambiente.

**Características**:
- ✅ **Niveles de log**: DEBUG, INFO, WARN, ERROR
- ✅ **Umbral por ambiente**: 
  - Development: DEBUG
  - Production: WARN
  - Debug on-demand: localStorage.debug='1'
- ✅ **Scrubber de PII**: Limpia datos sensibles automáticamente
- ✅ **Formato legible**: En dev es verbose, en prod es austero

**Uso**:
```javascript
import { logger } from '@utils/logger'

logger.debug('key', 'Mensaje', { data })
logger.info('key', 'Mensaje')
logger.warn('key', 'Advertencia')
logger.error('key', 'Error', error)
```

**Flujo**:
```
Logger recibe log
  ↓
Verifica nivel vs umbral del ambiente
  ↓
Si pasa umbral: Formatea mensaje
  ↓
Scrubea datos sensibles (si aplica)
  ↓
Output a console (coloreado en dev)
```

#### `formatters.js` - Formateo de Datos

**Responsabilidad**: Funciones para formatear datos de presentación.

**Funciones**:
- `formatPrice(price)`: Formatea precio en ARS
  - Retorna "Consultar" si no hay precio
  - Usa `Intl.NumberFormat` para formato argentino
- `formatKilometraje(kilometers)`: Formatea kilómetros con separadores

**Ejemplo**:
```javascript
formatPrice(15000000) // "$15.000.000"
formatKilometraje(50000) // "50.000"
```

#### `filters.js` - Construcción de Filtros

**Responsabilidad**: Convierte filtros del frontend (objetos) a formato backend (URLSearchParams).

**Función Principal**:
- `buildFiltersForBackend(filters)`: Convierte objeto de filtros a URLSearchParams
  - Solo incluye parámetros que no sean valores por defecto
  - Convierte arrays a strings con comas
  - Maneja rangos (año, precio, kilometraje)

**Flujo**:
```
Filtros del frontend (objeto)
  ↓
buildFiltersForBackend()
  ↓
Filtra valores por defecto
  ↓
Convierte a URLSearchParams
  ↓
Retorna string para query params
```

#### `cloudinaryUrl.js` - URLs de Cloudinary

**Responsabilidad**: Genera URLs optimizadas de Cloudinary con transformaciones.

**Características**:
- ✅ Cache en memoria (evita recomputes)
- ✅ Transformaciones automáticas (calidad, formato)
- ✅ Placeholders con blur
- ✅ Feature flags configurables
- ✅ Soporte para WebP, JPEG progresivo

**Función Principal**:
```javascript
cldUrl(publicId, options)
```

**Opciones**:
- `qualityMode`: 'auto' (máxima) o 'eco' (80%)
- `width`, `height`: Dimensiones
- `format`: 'webp', 'jpg', etc.

#### `imageExtractors.js` - Extractores de Imágenes

**Responsabilidad**: Extrae URLs de imágenes desde estructuras de datos del backend.

**Funciones**:
- `extractVehicleImageUrls(vehicle)`: Extrae fotoPrincipal y fotoHover
- `extractAllImageUrls(vehicle, options)`: Extrae todas las URLs
  - `includeExtras`: Incluir fotos extras o no

**Optimización**: Operaciones rápidas (~2-3 ops/vehículo)

#### `files.js` - Utilidades de Archivos

**Responsabilidad**: Validación y manipulación de archivos.

**Funciones Esperadas**:
- Validación de tipos de archivo
- Validación de tamaño
- Validación de formato (WebP, etc.)

#### `preload.js` - Preload de Recursos

**Responsabilidad**: Funciones para pre-cargar recursos (imágenes, rutas).

---

## 📁 4.2 Carpeta `config/`

### 🎯 Propósito y Responsabilidad

**Configuración centralizada** de la aplicación: API, autenticación, React Query, imágenes, etc.

### 📂 Estructura

```
config/
├── index.js                      # Configuración principal exportada
├── auth.js                       # Configuración de autenticación
├── reactQuery.js                 # Configuración de React Query
└── images.js                     # Configuración de imágenes Cloudinary
```

### 📄 Archivos de Configuración

#### `index.js` - Configuración Principal

**Responsabilidad**: Exporta objeto `config` unificado con toda la configuración.

**Secciones**:
- **API**: baseURL, timeout, headers
- **Validación de entorno**: development, staging, production
- **Valores por defecto**: Para todos los módulos

**Estructura**:
```javascript
export const config = {
  api: {
    baseURL: string,
    timeout: number,
    headers: object
  },
  environment: 'development' | 'staging' | 'production'
}
```

**Características**:
- ✅ Validación de entorno
- ✅ Variables de entorno con fallbacks seguros
- ✅ Configuración por ambiente

#### `auth.js` - Configuración de Autenticación

**Responsabilidad**: Configuración específica de autenticación.

**Exporta**:
```javascript
export const AUTH_CONFIG = {
  api: {
    baseURL: string,
    endpoints: {
      login: '/user/loginuser'
    },
    timeout: number
  },
  storage: {
    tokenKey: 'auth_token',
    userKey: 'auth_user'
  },
  routes: {
    login: '/admin/login',
    dashboard: '/admin',
    home: '/'
  },
  headers: {
    authorization: 'Authorization',
    bearerPrefix: 'Bearer '
  }
}
```

**Uso**:
```javascript
import { AUTH_CONFIG } from '@config/auth'

// En authService
const response = await axios.post(
  AUTH_CONFIG.api.baseURL + AUTH_CONFIG.api.endpoints.login,
  credentials
)
```

#### `reactQuery.js` - Configuración de React Query

**Responsabilidad**: Configuración centralizada de React Query (TanStack Query).

**Exporta**:
```javascript
export const REACT_QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutos
      gcTime: 1000 * 60 * 30,         // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'online'
    },
    mutations: {
      retry: 2,
      networkMode: 'online'
    }
  }
}
```

**También incluye**:
- `REACT_QUERY_TEST_CONFIG`: Configuración para tests (sin retry, sin cache)

**Uso**:
```javascript
import { QueryClient } from '@tanstack/react-query'
import { REACT_QUERY_CONFIG } from '@config/reactQuery'

const queryClient = new QueryClient(REACT_QUERY_CONFIG)
```

#### `images.js` - Configuración de Imágenes

**Responsabilidad**: Configuración de Cloudinary y optimización de imágenes.

**Contenido Esperado**:
- Cloud name
- Transformaciones por defecto
- Feature flags (progressive JPEG, blur placeholder)
- Tamaños de imágenes

---

## 📁 4.3 Carpeta `constants/`

### 🎯 Propósito y Responsabilidad

**Constantes y design tokens** reutilizables en toda la aplicación.

### 📂 Estructura

```
constants/
├── index.js                      # Exportaciones centralizadas
├── filterOptions.js              # Opciones de filtros
└── forms.js                      # Constantes de formularios
```

### 📄 Constantes Principales

#### `filterOptions.js` - Opciones de Filtros

**Responsabilidad**: Define opciones disponibles para filtros de vehículos.

**Exporta**:
- `FILTER_DEFAULTS`: Valores por defecto de rangos
  ```javascript
  {
    AÑO: { min: 1990, max: 2024 },
    PRECIO: { min: 5000000, max: 100000000 },
    KILOMETRAJE: { min: 0, max: 200000 }
  }
  ```
- `marcas`: Array de marcas disponibles
- `cajas`: Tipos de caja de cambios
- `combustibles`: Tipos de combustible
- `segmentos`: Segmentos de vehículos

**Uso**:
```javascript
import { FILTER_DEFAULTS, marcas } from '@constants'

// En componentes de filtros
<Select options={marcas} />
<RangeSlider min={FILTER_DEFAULTS.PRECIO.min} max={FILTER_DEFAULTS.PRECIO.max} />
```

#### `forms.js` - Constantes de Formularios

**Responsabilidad**: Reglas y constantes para validación de formularios.

**Exporta**:
```javascript
export const FORM_RULES = {
  MIN_EXTRA_PHOTOS: 5,
  MAX_EXTRA_PHOTOS: 8,
  TOTAL_MIN_PHOTOS: 7,
  MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB
  SUPPORTED_TYPES: ['image/webp']
}
```

**Uso**: En `CarFormRHF` y validaciones de imágenes.

---

## 📁 4.4 Carpeta `mappers/`

### 🎯 Propósito y Responsabilidad

**Transformadores de datos** entre formato backend y formato frontend.

### 📂 Estructura

```
mappers/
├── index.js                      # Exportaciones centralizadas
├── vehicleMapper.js              # Mapper principal de vehículos
└── admin/
    └── toAdminListItem.js        # Mapper para lista admin
```

### 📄 Mappers Principales

#### `vehicleMapper.js` - Mapper de Vehículos

**Responsabilidad**: Transforma datos del backend a formato esperado por el frontend.

**Arquitectura en Capas**:
```
Backend API
  ↓
vehicleMapper.js (CAPA 2)
  ↓ (usa)
imageExtractors.js (CAPA 1 - performance)
  ↓
Componentes Frontend
```

**Funciones Principales**:

1. **`mapVehiclesPage(data)`**: Transforma página de vehículos (lista)
   - Usa `extractVehicleImageUrls()` para performance
   - `includeExtras: false` (lista no necesita extras)
   - Retorna: Array de vehículos con `fotoPrincipal`, `fotoHover` (strings)

2. **`mapVehicle(data)`**: Transforma vehículo individual (detalle)
   - Usa `extractAllImageUrls()` con `includeExtras: true`
   - Retorna: Vehículo con `fotoPrincipal`, `fotoHover`, `imagenes[]` (strings)

**Características**:
- ✅ **Performance optimizado**: ~2-3 ops/vehículo usando extractors
- ✅ **Passthrough completo**: Conserva todos los campos del backend
- ✅ **Consistencia**: Mismo formato entre lista y detalle

**Flujo de Uso**:

**LISTADO**:
```
Backend.getAllPhotos()
  ↓
mapVehiclesPage(data)
  ↓
extractVehicleImageUrls() + extractAllImageUrls(includeExtras: false)
  ↓
Vehículos con fotoPrincipal, fotoHover (strings)
  ↓
AutosGrid → CardAuto
```

**DETALLE**:
```
Backend.getOnePhoto(id)
  ↓
mapVehicle(data)
  ↓
extractVehicleImageUrls() + extractAllImageUrls(includeExtras: true)
  ↓
Vehículo con fotoPrincipal, fotoHover, imagenes[] (strings)
  ↓
CardDetalle → ImageCarousel
```

#### `admin/toAdminListItem.js` - Mapper Admin

**Responsabilidad**: Transforma vehículo a formato para lista del Dashboard admin.

**Características**:
- Formato simplificado para tabla/lista
- Incluye solo campos necesarios para admin
- Posiblemente incluye acciones/estados

---

## 📁 4.5 Carpeta `routes/`

### 🎯 Propósito y Responsabilidad

**Configuración de rutas** de la aplicación usando React Router.

### 📂 Estructura

```
routes/
├── PublicRoutes.jsx              # Rutas públicas
└── AdminRoutes.jsx               # Rutas de administración
```

### 📄 Archivos de Rutas

#### `PublicRoutes.jsx` - Rutas Públicas

**Responsabilidad**: Define todas las rutas públicas accesibles sin autenticación.

**Rutas**:
- `/` → Home
- `/vehiculos` → Lista de vehículos
- `/vehiculo/:id` → Detalle de vehículo
- `/nosotros` → Página Nosotros
- `/postventa` → Página Postventa
- `*` → NotFound (404)

**Características**:
- ✅ **Lazy loading**: Todas las páginas cargadas bajo demanda
- ✅ **Layout incluido**: Nav + Footer + main
- ✅ **Suspense**: Fallback con LoadingSpinner
- ✅ **Code splitting**: Cada página en bundle separado

**Estructura**:
```jsx
<>
  <Nav />
  <main>
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* ... más rutas */}
      </Routes>
    </Suspense>
  </main>
  <Footer />
</>
```

#### `AdminRoutes.jsx` - Rutas de Administración

**Responsabilidad**: Define rutas del panel de administración.

**Rutas**:
- `/admin/login` → Login (público)
- `/admin` → Dashboard (protegido con RequireAuth)
- `*` → NotFound

**Características**:
- ✅ **Lazy loading**: Páginas admin cargadas bajo demanda
- ✅ **Protección de rutas**: Usa `RequireAuth` HOC
- ✅ **Suspense**: Fallback específico para admin
- ✅ **Sin layout**: Admin tiene su propio layout

**Estructura**:
```jsx
<div className="admin-container">
  <Suspense fallback={<AdminLoading />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />
    </Routes>
  </Suspense>
</div>
```

**Flujo de Protección**:
```
Usuario accede a /admin
  ↓
RequireAuth verifica autenticación
  ↓
Si autenticado: Renderiza Dashboard
  ↓
Si NO autenticado: Redirige a /admin/login
```

---

## 📊 Resumen de estas Carpetas

### ✅ Fortalezas:

1. **Configuración centralizada**: Un solo lugar para cambiar configs
2. **Constantes reutilizables**: DRY principle aplicado
3. **Mappers bien estructurados**: Separación clara backend ↔ frontend
4. **Lazy loading en rutas**: Optimización de bundle
5. **Logger profesional**: Sistema de logging robusto
6. **Utilidades modulares**: Cada utilidad con responsabilidad única

### ⚠️ Áreas de Mejora:

1. **Tests**: Falta cobertura en utils y mappers
2. **TypeScript**: Tipado ayudaría en mappers y utils
3. **Documentación**: Algunos utils podrían tener más ejemplos
4. **Cache**: El cache de Cloudinary podría tener límite configurable

### 🔄 Flujo de Datos:

```
Backend Response
  ↓
vehicleMapper.js (transforma)
  ↓
Datos normalizados
  ↓
Componentes usan datos
  ↓
formatters.js (formatea para UI)
  ↓
Usuario ve datos formateados
```

---

## 🎓 Conceptos Clave:

1. **Configuration Pattern**: Centralizar configuración para mantenibilidad
2. **Mapper Pattern**: Transformar datos entre capas
3. **Constants Pattern**: Design tokens y valores reutilizables
4. **Utility Functions**: Funciones puras reutilizables
5. **Lazy Loading Routes**: Code splitting por ruta
6. **Protected Routes**: HOC para autenticación

---

**Próxima Etapa**: Análisis de `pages/`, `styles/` y `assets/`
