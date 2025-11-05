# 📋 ETAPA 3: Análisis de `api/`, `services/` y `hooks/`

Este documento analiza las carpetas relacionadas con la comunicación con el backend y la lógica de negocio.

---

## 📁 3.1 Carpeta `api/`

### 🎯 Propósito y Responsabilidad

**Configuración y exportación de instancias de Axios** para comunicación HTTP con el backend.

### 📂 Estructura

```
api/
├── index.js              # Exportaciones centralizadas
└── axiosInstance.js      # Configuración de instancias Axios
```

### 📄 Archivos

#### `axiosInstance.js` - Configuración de Axios

**Responsabilidad**: Crear y configurar instancias de Axios con:
- Base URL centralizada
- Timeouts configurables
- Headers por defecto
- Interceptores para autenticación
- Manejo de errores

**Instancias Creadas**:

1. **`axiosInstance`**: Instancia principal para operaciones públicas
   - Usa `config.api.baseURL`
   - Timeout desde `config.api.timeout`
   - Headers estándar (JSON)

2. **`authAxiosInstance`**: Instancia para operaciones de autenticación
   - Misma base URL
   - Interceptor automático para agregar token
   - Headers específicos para auth

**Características**:
- ✅ Configuración centralizada desde `@config`
- ✅ Validación de entorno
- ✅ Timeouts configurables
- ✅ Interceptor de autenticación automático
- ✅ Logging de errores con `logger`

**Flujo de Autenticación en Interceptor**:
```
Request con authAxiosInstance
  ↓
Interceptor verifica token en localStorage
  ↓
Si existe: Agrega header Authorization
  ↓
Si no existe: Request sin token (para login)
  ↓
Request enviado al backend
```

#### `index.js` - Exportaciones

**Responsabilidad**: Exportar instancias de Axios para uso en toda la aplicación.

**Exporta**:
- `axiosInstance`: Para operaciones públicas
- `authAxiosInstance`: Para operaciones autenticadas

**Uso**:
```javascript
import { axiosInstance, authAxiosInstance } from '@api'
```

---

## 📁 3.2 Carpeta `services/`

### 🎯 Propósito y Responsabilidad

**Lógica de negocio y comunicación con APIs**. Los servicios encapsulan las llamadas HTTP y transforman datos.

### 📂 Estructura

```
services/
├── index.js                      # Exportaciones centralizadas
├── vehiclesApi.js                # Servicio de vehículos (público)
├── authService.js                # Servicio de autenticación
└── admin/
    └── vehiclesAdminService.js   # Servicio de vehículos (admin)
```

### 📄 Servicios

#### `vehiclesApi.js` - Servicio de Vehículos Público

**Responsabilidad**: Manejar todas las operaciones públicas de vehículos.

**Métodos Principales**:

1. **`getVehicles({ filters, limit, cursor, signal })`**
   - Obtiene lista de vehículos con filtros
   - Soporta paginación con cursor
   - Abort signal para cancelación
   - Normaliza filtros con `buildFiltersForBackend()`

2. **`getVehicleById(id)`**
   - Obtiene un vehículo específico por ID
   - Valida ID antes de hacer request
   - Normaliza respuesta del backend

**Características**:
- ✅ Validación de parámetros
- ✅ Normalización de filtros
- ✅ Soporte para AbortController (cancelación)
- ✅ Logging de requests
- ✅ Manejo de errores

**Flujo de `getVehicles`**:
```
Llamada con filtros, limit, cursor
  ↓
buildFiltersForBackend() normaliza filtros
  ↓
Construye URL con query params
  ↓
Request a /photos/getallphotos
  ↓
Retorna response.data normalizado
```

#### `authService.js` - Servicio de Autenticación

**Responsabilidad**: Manejar autenticación de usuarios (login, logout, verificación de token).

**Métodos Esperados**:
- `login(credentials)`: Autenticación
- `logout()`: Cerrar sesión
- `verifyToken()`: Verificar validez de token
- `refreshToken()`: Renovar token (si aplica)

**Características**:
- ✅ Usa `authAxiosInstance` para requests autenticados
- ✅ Manejo de tokens (localStorage/sessionStorage)
- ✅ Manejo de errores de autenticación

#### `vehiclesAdminService.js` - Servicio Admin de Vehículos

**Responsabilidad**: Operaciones CRUD de vehículos para administradores.

**Métodos Esperados**:
- `createVehicle(formData)`: Crear vehículo
- `updateVehicle(id, formData)`: Actualizar vehículo
- `deleteVehicle(id)`: Eliminar vehículo
- `getAllVehicles()`: Obtener todos (sin paginación)

**Características**:
- ✅ Usa FormData para upload de imágenes
- ✅ Headers de autenticación requeridos
- ✅ Manejo de errores específicos

---

## 📁 3.3 Carpeta `hooks/`

### 🎯 Propósito y Responsabilidad

**Custom hooks** que encapsulan lógica reutilizable y estado compartido entre componentes.

### 📂 Estructura

```
hooks/
├── index.js                      # Exportaciones centralizadas
├── auth/
│   ├── index.js
│   └── useAuth.js                # Hook de autenticación
├── admin/
│   ├── index.js
│   └── useCarMutation.js         # Hook para mutaciones de autos
├── vehicles/
│   ├── index.js
│   ├── useVehiclesList.js        # Hook para lista de vehículos
│   └── useVehicleDetail.js       # Hook para detalle de vehículo
├── ui/
│   ├── index.js
│   ├── useDeviceDetection.jsx    # Detección de dispositivo
│   └── useScrollPosition.js      # Posición de scroll
├── images/
│   ├── index.js
│   └── useImageOptimization.js   # Optimización de imágenes
├── forms/
│   └── index.js                  # Hooks de formularios
├── perf/
│   ├── index.js
│   ├── usePreloadImages.js       # Preload de imágenes
│   └── usePreloadRoute.js        # Preload de rutas
└── README.md                     # Documentación
```

### 📄 Hooks Principales

#### `auth/useAuth.js` - Hook de Autenticación

**Responsabilidad**: Gestionar estado y operaciones de autenticación.

**Estado que Expone**:
```javascript
{
    isAuthenticated: boolean,
    isLoading: boolean,
    user: object | null,
    error: string | null
}
```

**Funciones que Expone**:
- `login(credentials)`: Iniciar sesión
- `logout()`: Cerrar sesión
- `refreshToken()`: Renovar token

**Características**:
- ✅ Context Provider para estado global
- ✅ Persistencia de sesión (localStorage)
- ✅ Verificación automática de token al montar
- ✅ Auto-logout si token expirado

**Uso**:
```javascript
const { isAuthenticated, login, logout } = useAuth()
```

#### `vehicles/useVehiclesList.js` - Hook para Lista de Vehículos

**Responsabilidad**: Gestionar estado y operaciones de lista de vehículos con React Query.

**Características**:
- ✅ Usa React Query para cache y refetch
- ✅ Paginación con cursor
- ✅ Filtros dinámicos
- ✅ Abort signal para cancelación
- ✅ Estados: loading, error, data
- ✅ Refetch manual disponible

**Retorna**:
```javascript
{
    vehicles: array,
    isLoading: boolean,
    isError: boolean,
    error: object,
    refetch: function,
    hasNextPage: boolean,
    fetchNextPage: function
}
```

**Flujo**:
```
Componente usa useVehiclesList(filters)
  ↓
React Query verifica cache
  ↓
Si no en cache: Llamada a vehiclesService.getVehicles()
  ↓
Actualiza cache y retorna datos
  ↓
Componente renderiza con datos
```

#### `vehicles/useVehicleDetail.js` - Hook para Detalle

**Responsabilidad**: Obtener y cachear detalle de un vehículo específico.

**Características**:
- ✅ React Query con key por ID
- ✅ Cache automático
- ✅ Prefetch de datos relacionados
- ✅ Estados de loading/error

#### `admin/useCarMutation.js` - Hook para Mutaciones Admin

**Responsabilidad**: Gestionar mutaciones (create, update, delete) de vehículos.

**Funciones**:
- `createMutation`: Crear vehículo
- `updateMutation`: Actualizar vehículo
- `deleteMutation`: Eliminar vehículo

**Características**:
- ✅ Optimistic updates
- ✅ Invalidación de queries relacionadas
- ✅ Manejo de errores
- ✅ Loading states

**Uso**:
```javascript
const { createMutation, updateMutation } = useCarMutation()

createMutation.mutate(formData, {
    onSuccess: () => {
        // Refetch lista
        // Cerrar modal
    }
})
```

#### `ui/useDeviceDetection.jsx` - Detección de Dispositivo

**Responsabilidad**: Detectar tipo de dispositivo (mobile, tablet, desktop).

**Estado**:
```javascript
{
    isMobile: boolean,
    isTablet: boolean,
    isDesktop: boolean,
    deviceType: 'mobile' | 'tablet' | 'desktop'
}
```

**Características**:
- ✅ Context Provider para acceso global
- ✅ Media queries para detección
- ✅ Actualización en resize

**Uso**:
```javascript
const { isMobile, isDesktop } = useDevice()
```

#### `ui/useScrollPosition.js` - Posición de Scroll

**Responsabilidad**: Trackear posición de scroll de la ventana.

**Retorna**:
```javascript
{
    x: number,
    y: number,
    isAtTop: boolean,
    isAtBottom: boolean
}
```

**Características**:
- ✅ Throttling para performance
- ✅ Flags útiles (isAtTop, isAtBottom)

#### `images/useImageOptimization.js` - Optimización de Imágenes

**Responsabilidad**: Optimizar carga y renderizado de imágenes.

**Funcionalidades**:
- Lazy loading
- Preload de imágenes importantes
- Optimización de formatos
- Placeholder mientras carga

#### `perf/usePreloadImages.js` - Preload de Imágenes

**Responsabilidad**: Pre-cargar imágenes antes de que se necesiten.

**Uso**:
```javascript
usePreloadImages(imageUrls)
```

**Beneficio**: Mejora percepción de velocidad.

#### `perf/usePreloadRoute.js` - Preload de Rutas

**Responsabilidad**: Pre-cargar componentes de rutas al hacer hover en links.

**Uso**:
```javascript
usePreloadRoute('/vehiculos')
```

**Beneficio**: Navegación instantánea aparente.

---

## 📊 Resumen de `api/`, `services/` y `hooks/`

### ✅ Fortalezas:

1. **Separación clara de responsabilidades**:
   - `api/`: Configuración HTTP
   - `services/`: Lógica de negocio
   - `hooks/`: Estado y efectos reutilizables

2. **React Query integrado**: Cache, refetch, optimizations

3. **Hooks organizados por dominio**: auth, vehicles, ui, perf

4. **Configuración centralizada**: Una sola fuente de verdad para API

5. **Performance optimizations**: Preload, lazy loading, abort signals

### ⚠️ Áreas de Mejora:

1. **Tests**: Falta cobertura de tests en hooks y services

2. **TypeScript**: Tipado ayudaría a detectar errores temprano

3. **Error handling**: Podría estandarizarse más

4. **Documentación**: Algunos hooks podrían tener más JSDoc

### 🔄 Flujo Completo de Datos:

```
Componente
  ↓
Hook (ej: useVehiclesList)
  ↓
React Query (cache, refetch)
  ↓
Service (ej: vehiclesService)
  ↓
API Instance (axiosInstance)
  ↓
Backend
  ↓
Respuesta normalizada
  ↓
React Query cachea
  ↓
Hook retorna datos
  ↓
Componente renderiza
```

---

## 🎓 Conceptos Clave:

1. **React Query**: Gestión de estado del servidor con cache
2. **Custom Hooks**: Encapsular lógica reutilizable
3. **Axios Instances**: Configuración centralizada de HTTP
4. **Services Pattern**: Separar lógica de negocio de componentes
5. **AbortController**: Cancelación de requests
6. **Optimistic Updates**: Actualizar UI antes de confirmar con backend

---

**Próxima Etapa**: Análisis de `utils/`, `config/`, `constants/`, `mappers/` y `routes/`
