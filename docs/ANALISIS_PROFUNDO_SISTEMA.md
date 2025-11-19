# ANÁLISIS PROFUNDO DEL SISTEMA - INDIANA USADOS

**Fecha**: 19 de Noviembre, 2025  
**Propósito**: Análisis exhaustivo de 3 áreas críticas del sistema  
**Estado**: Documento de análisis pre-implementación

---

## ÍNDICE

1. [Rutas Privadas y Autenticación](#1-rutas-privadas-y-autenticación)
2. [Campo Cilindrada - Formato Decimal](#2-campo-cilindrada---formato-decimal)
3. [Sistema de Gestión de Fotos](#3-sistema-de-gestión-de-fotos)
4. [Conclusiones y Plan de Acción](#4-conclusiones-y-plan-de-acción)

---

## 1. RUTAS PRIVADAS Y AUTENTICACIÓN

### 1.1 ARQUITECTURA ACTUAL

#### Flujo de Autenticación Completo

```
USUARIO → LOGIN FORM → authService.login() → BACKEND /user/loginuser
                                    ↓
                              RESPUESTA: { token, user }
                                    ↓
                          localStorage.setItem()
                                    ↓
                          useAuth hook actualiza estado
                                    ↓
                          RequireAuth valida autenticación
                                    ↓
                          ACCESO A DASHBOARD
```

### 1.2 COMPONENTES CLAVE

#### A. `useAuth` Hook - Gestión de Sesión
**Ubicación**: `src/hooks/auth/useAuth.js`

**Responsabilidades**:
- ✅ Gestión completa de autenticación (login, logout)
- ✅ Validación automática de tokens expirados
- ✅ Verificación periódica cada 5 minutos
- ✅ Decodificación y validación de JWT
- ✅ Manejo robusto de errores

**Estados Gestionados**:
```javascript
{
  user: null | Object,           // Datos del usuario autenticado
  isAuthenticated: boolean,       // Estado de autenticación
  isLoading: boolean,             // Cargando verificación
  error: string | null            // Mensajes de error
}
```

**Funciones Expuestas**:
- `login(credentials)` - Autenticar usuario
- `logout()` - Cerrar sesión y limpiar estado
- `getToken()` - Obtener token válido
- `clearError()` - Limpiar errores
- `checkAuthStatus()` - Verificar estado actual

**Validación de Token JWT**:
```javascript
isTokenExpired(token) {
  // 1. Decodificar payload del JWT (base64)
  const payload = JSON.parse(atob(token.split('.')[1]))
  
  // 2. Comparar timestamp de expiración
  const currentTime = Math.floor(Date.now() / 1000)
  
  // 3. Retornar si está expirado
  return payload.exp < currentTime
}
```

#### B. `RequireAuth` Component - Protección de Rutas
**Ubicación**: `src/components/auth/RequireAuth.jsx`

**Lógica de Protección**:
```javascript
// 1. Si está cargando → Mostrar "Verificando autenticación..."
if (isLoading) return <LoadingMessage />

// 2. Si está autenticado → Renderizar children (Dashboard)
if (isAuthenticated) return children

// 3. Si NO está autenticado → Redirigir a /admin/login
return <Navigate to="/admin/login" replace />
```

**Uso en Rutas**:
```jsx
// src/routes/AdminRoutes.jsx
<Route path="/" element={
  <RequireAuth>
    <Dashboard />
  </RequireAuth>
} />
```

#### C. Instancias de Axios - Separación de Concerns

**1. `axiosInstance` - Llamadas Públicas**
```javascript
// src/api/axiosInstance.js
const axiosInstance = axios.create({
  baseURL: config.api.baseURL,  // De variable de entorno
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
```

**Uso**: 
- Listado de vehículos (`/photos/getallphotos`)
- Detalle de vehículo (`/photos/getonephoto/:id`)

**2. `authAxiosInstance` - Llamadas Autenticadas**
```javascript
const authAxiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor que agrega token automáticamente
authAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor que maneja 401 Unauthorized
authAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
      // Emitir evento global
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)
```

**Uso**:
- Login (`/user/loginuser`)
- Crear vehículo (`/photos/create`)
- Actualizar vehículo (`/photos/updatephoto/:id`)
- Eliminar vehículo (`/photos/deletephoto/:id`)

#### D. `AuthUnauthorizedListener` - Manejo Global de 401
**Ubicación**: `src/components/auth/AuthUnauthorizedListener.jsx`

**Funcionalidad**:
```javascript
// Escucha evento 'auth:unauthorized' disparado por axios interceptor
useEffect(() => {
  const handleUnauthorized = () => {
    // 1. Logout desde useAuth
    logout()
    
    // 2. Mostrar mensaje al usuario
    // 3. Navegar a login si está en ruta protegida
  }
  
  window.addEventListener('auth:unauthorized', handleUnauthorized)
  return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
}, [logout])
```

### 1.3 SERVICIOS DE BACKEND

#### A. Servicio de Autenticación
**Ubicación**: `src/services/authService.js`

```javascript
// Función de login
async login(credentials) {
  const response = await authAxiosInstance.post(
    AUTH_CONFIG.api.endpoints.login,  // /user/loginuser
    credentials
  )
  return response.data  // { success, data: { token, user } }
}

// Función de limpieza
clearLocalStorage() {
  localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)
  localStorage.removeItem(AUTH_CONFIG.storage.userKey)
}
```

#### B. Servicio de Administración de Vehículos
**Ubicación**: `src/services/admin/vehiclesAdminService.js`

```javascript
const vehiclesAdminService = {
  // Crear vehículo (requiere auth)
  async createVehicle(formData) {
    const response = await authAxiosInstance.post('/photos/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    })
    return response.data
  },

  // Actualizar vehículo (requiere auth)
  async updateVehicle(id, formData) {
    const response = await authAxiosInstance.put(
      `/photos/updatephoto/${id}`, 
      formData, 
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      }
    )
    return response.data
  },

  // Eliminar vehículo (requiere auth)
  async deleteVehicle(id) {
    const response = await authAxiosInstance.delete(`/photos/deletephoto/${id}`)
    return response.data
  }
}
```

#### C. Servicio Público de Vehículos
**Ubicación**: `src/services/vehiclesApi.js`

```javascript
export const vehiclesService = {
  // GET lista (público)
  async getVehicles({ filters = {}, limit = 12, cursor = null, signal } = {}) {
    const response = await axiosInstance.get('/photos/getallphotos', {
      params: { filters, limit, cursor },
      signal
    })
    return response.data
  },

  // GET detalle (público)
  async getVehicleById(id) {
    const response = await axiosInstance.get(`/photos/getonephoto/${id}`)
    return response?.data?.getOnePhoto || response?.data
  }
}
```

### 1.4 CONFIGURACIÓN

#### Variables de Entorno
**Archivo**: `.env` (en raíz del proyecto)

```env
# API Backend
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=15000

# Entorno
VITE_ENVIRONMENT=development

# Debug
VITE_DEBUG=true

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn

# Contacto
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
```

#### Config Centralizado
**Ubicación**: `src/config/index.js`

```javascript
export const config = {
  environment: 'development' | 'staging' | 'production',
  
  api: {
    baseURL: process.env.VITE_API_URL,
    timeout: process.env.VITE_API_TIMEOUT,
    headers: { ... }
  },
  
  features: {
    debug: boolean,
    errorBoundaries: boolean,
    lazyLoading: boolean,
    imageOptimization: boolean
  },
  
  contact: { email, whatsapp },
  images: { cloudinary: { ... } }
}
```

#### Auth Config
**Ubicación**: `src/config/auth.js`

```javascript
export const AUTH_CONFIG = {
  api: {
    endpoints: {
      login: '/user/loginuser'
    }
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

### 1.5 RUTAS DE LA APLICACIÓN

#### Estructura de Routing
**Archivo Principal**: `src/App.jsx`

```jsx
<Router>
  <DeviceProvider>
    <AuthUnauthorizedListener />
    <ScrollOnRouteChange />
    <Routes>
      {/* Rutas públicas */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Rutas de admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  </DeviceProvider>
</Router>
```

#### Rutas Públicas
**Ubicación**: `src/routes/PublicRoutes.jsx`

```jsx
const PublicRoutes = () => (
  <>
    <Nav />
    <main>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/vehiculo/:id" element={<VehiculoDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/postventa" element={<Postventa />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </>
)
```

#### Rutas de Admin
**Ubicación**: `src/routes/AdminRoutes.jsx`

```jsx
const AdminRoutes = () => (
  <div className="admin-container">
    <Suspense fallback={<AdminLoading />}>
      <Routes>
        {/* Ruta de login - SIN protección */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas - CON RequireAuth */}
        <Route path="/" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </div>
)
```

### 1.6 DIAGRAMA DE FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIO DE APLICACIÓN                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  App.jsx monta Router       │
        │  + AuthUnauthorizedListener │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  useAuth hook se inicializa │
        │  checkAuthStatus()          │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │  ¿Hay token en localStorage?        │
        └─────────────┬───────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
    ❌ NO                       ✅ SÍ
        │                           │
        │                           ▼
        │           ┌───────────────────────────┐
        │           │ ¿Token expirado?          │
        │           └───────────┬───────────────┘
        │                       │
        │           ┌───────────┴──────────┐
        │           │                      │
        │           ▼                      ▼
        │       ✅ VÁLIDO              ❌ EXPIRADO
        │           │                      │
        │           │                      │
        │           ▼                      ▼
        │   isAuthenticated=true   logout() + limpiar
        │           │                      │
        └───────────┴──────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Usuario navega a /admin    │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  RequireAuth verifica estado│
        └─────────────┬───────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
 isAuthenticated=false    isAuthenticated=true
        │                           │
        ▼                           ▼
 <Navigate to="/admin/login" />  <Dashboard />
        │                           │
        ▼                           ▼
 ┌──────────────┐         ┌──────────────────┐
 │  Login Form  │         │  Dashboard Monta │
 └──────┬───────┘         └────────┬─────────┘
        │                          │
        ▼                          ▼
 authService.login()    React Query usa mutations
        │                          │
        ▼                          ▼
 POST /user/loginuser    authAxiosInstance agrega token
        │                          │
        ▼                          ▼
 Guarda token + user     POST/PUT/DELETE protegidos
        │                          │
        ▼                          │
 Actualiza useAuth                 │
        │                          │
        ▼                          │
 Navega a /admin                   │
        │                          │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  SESIÓN ACTIVA       │
        │  - Token válido      │
        │  - Verificación 5min │
        │  - Listener 401      │
        └──────────────────────┘
```

### 1.7 PUNTOS CRÍTICOS DE CONTACTO FRONT-BACKEND

#### 1. Login/Autenticación
```
FRONTEND                           BACKEND
--------                           -------
authService.login()    →   POST /user/loginuser
{ username, password }     
                          ←   { success: true, data: { token, user } }
localStorage.setItem()
useAuth actualiza estado
```

#### 2. Crear Vehículo
```
FRONTEND                           BACKEND
--------                           -------
vehiclesAdminService   →   POST /photos/create
+ authAxiosInstance          + Authorization: Bearer <token>
+ FormData multipart         + FormData con campos + imágenes
                          ←   { success: true, data: vehicleCreated }
React Query refetch()
```

#### 3. Actualizar Vehículo
```
FRONTEND                           BACKEND
--------                           -------
vehiclesAdminService   →   PUT /photos/updatephoto/:id
+ authAxiosInstance          + Authorization: Bearer <token>
+ FormData multipart         + FormData con cambios + imágenes
                          ←   { success: true, data: vehicleUpdated }
React Query refetch()
```

#### 4. Eliminar Vehículo
```
FRONTEND                           BACKEND
--------                           -------
vehiclesAdminService   →   DELETE /photos/deletephoto/:id
+ authAxiosInstance          + Authorization: Bearer <token>
                          ←   { success: true, message: "Deleted" }
React Query refetch()
```

#### 5. Token Expirado (401)
```
FRONTEND                           BACKEND
--------                           -------
Cualquier llamada      →   POST/PUT/DELETE
con token expirado         
                          ←   401 Unauthorized
axios interceptor detecta
window.dispatchEvent('auth:unauthorized')
AuthUnauthorizedListener → logout()
Navega a /admin/login
```

### 1.8 SEGURIDAD Y VALIDACIÓN

#### Validaciones Frontend
- ✅ Token JWT decodificado y validado en cliente
- ✅ Verificación periódica cada 5 minutos
- ✅ Interceptor axios maneja 401 automáticamente
- ✅ Limpieza completa de localStorage en logout
- ✅ RequireAuth protege rutas administrativas

#### Validaciones Backend (esperadas)
- ✅ Verificación de firma JWT
- ✅ Validación de expiración en servidor
- ✅ Middleware de autenticación en rutas protegidas
- ✅ CORS configurado correctamente
- ✅ Rate limiting en endpoints críticos

---

## 2. CAMPO CILINDRADA - FORMATO DECIMAL

### 2.1 ESTADO ACTUAL

#### Definición en Tipos
**Ubicación**: `src/types/vehicle.js`

```javascript
/**
 * @property {number} [cilindrada] - Cilindrada del motor
 */
```

**Problema**: Definido como `number` entero, sin soporte para decimales.

#### Uso en Formulario
**Ubicación**: `src/components/admin/CarForm/CarFormRHF.jsx`

```javascript
// Campo numérico
const NUMERIC_FIELDS = ['precio', 'cilindrada', 'anio', 'kilometraje']

// Input HTML
<input
  type="number"
  {...register('cilindrada', { required: 'Cilindrada es requerida' })}
  className={styles.input}
  placeholder="0"
/>
```

**Problema**: 
- `type="number"` sin atributo `step` → Solo permite enteros
- Placeholder "0" no indica formato decimal
- No hay validación para formato X.X

#### Procesamiento de Datos
**Ubicación**: `src/components/admin/CarForm/CarFormRHF.jsx` (líneas 136-143)

```javascript
// Construcción de FormData
NUMERIC_FIELDS.forEach(key => {
  const numValue = Number(value).toString()
  formData.append(key, numValue)
})
```

**Problema**: `Number(value)` convierte correctamente pero no valida formato.

#### Visualización en Detalle
**Ubicación**: `src/components/vehicles/Detail/CardDetalle/CardDetalle.jsx`

```javascript
{ label: 'Cilindrada', value: vehicleData.cilindrada }
```

**Problema**: Se muestra tal cual viene del backend, sin formateo especial.

### 2.2 FORMATO DESEADO

#### Ejemplos Válidos
```
2.0  ✅
2.1  ✅
3.0  ✅
4.2  ✅
1.6  ✅
5.7  ✅
```

#### Formato Inválido
```
2    ❌ (debe ser 2.0)
21   ❌ (debe ser 2.1)
2.12 ❌ (máximo 1 decimal)
.5   ❌ (debe tener parte entera)
```

### 2.3 CAMBIOS NECESARIOS

#### A. Actualizar Tipos
**Archivo**: `src/types/vehicle.js`

```javascript
// ANTES
* @property {number} [cilindrada] - Cilindrada del motor

// DESPUÉS
* @property {string} [cilindrada] - Cilindrada del motor (formato: X.X, ej: 2.0, 3.5)
```

**Justificación**: Cambiar a `string` permite validar formato específico y preservar el punto decimal.

#### B. Actualizar Formulario

**1. Input con Step Decimal**
```jsx
<input
  type="number"
  step="0.1"
  min="0"
  max="10"
  {...register('cilindrada', { 
    required: 'Cilindrada es requerida',
    pattern: {
      value: /^\d{1}\.\d{1}$/,
      message: 'Formato inválido. Use X.X (ej: 2.0, 3.5)'
    }
  })}
  placeholder="2.0"
/>
```

**2. Validación Custom**
```javascript
// Hook personalizado para validar cilindrada
const validateCilindrada = (value) => {
  // Verificar formato X.X
  const regex = /^\d{1}\.\d{1}$/
  
  if (!regex.test(value)) {
    return 'Formato inválido. Use X.X (ej: 2.0, 3.5)'
  }
  
  // Verificar rango razonable (0.5 - 9.9)
  const num = parseFloat(value)
  if (num < 0.5 || num > 9.9) {
    return 'Cilindrada debe estar entre 0.5 y 9.9'
  }
  
  return true
}
```

**3. Procesamiento en FormData**
```javascript
// Remover 'cilindrada' de NUMERIC_FIELDS
const NUMERIC_FIELDS = ['precio', 'anio', 'kilometraje']

// Manejar cilindrada por separado
const buildVehicleFormData = (data) => {
  const formData = new FormData()
  
  // Campos numéricos enteros
  NUMERIC_FIELDS.forEach(key => {
    const numValue = Number(data[key]).toString()
    formData.append(key, numValue)
  })
  
  // Cilindrada como string con formato validado
  if (data.cilindrada) {
    formData.append('cilindrada', data.cilindrada.toString())
  }
  
  // ... resto de campos
}
```

#### C. Actualizar Normalización

**Ubicación**: `src/components/admin/mappers/normalizeForForm.js`

```javascript
// ANTES
cilindrada: d.cilindrada ?? '',

// DESPUÉS
cilindrada: d.cilindrada 
  ? parseFloat(d.cilindrada).toFixed(1) 
  : '',
```

**Justificación**: Asegurar que siempre tenga formato X.X al cargar desde backend.

#### D. Actualizar Visualización

**Ubicación**: `src/components/vehicles/Detail/CardDetalle/CardDetalle.jsx`

```javascript
// OPCIÓN 1: Formatear en el mapper
cilindrada: auto.cilindrada 
  ? `${parseFloat(auto.cilindrada).toFixed(1)} L`
  : '',

// OPCIÓN 2: Crear formatter específico
// src/utils/formatters.js
export const formatCilindrada = (value) => {
  if (!value) return ''
  return `${parseFloat(value).toFixed(1)} L`
}

// Uso en CardDetalle
{ label: 'Cilindrada', value: formatCilindrada(vehicleData.cilindrada) }
```

### 2.4 IMPACTO EN BACKEND

#### Cambios Necesarios en Base de Datos
```javascript
// MongoDB Schema - ANTES
cilindrada: {
  type: Number,
  required: false
}

// MongoDB Schema - DESPUÉS
cilindrada: {
  type: String,  // Cambio de Number a String
  required: false,
  validate: {
    validator: function(v) {
      return /^\d{1}\.\d{1}$/.test(v);
    },
    message: 'Cilindrada debe tener formato X.X (ej: 2.0, 3.5)'
  }
}
```

#### Migración de Datos Existentes
```javascript
// Script de migración
db.vehicles.find({ cilindrada: { $exists: true } }).forEach(doc => {
  if (typeof doc.cilindrada === 'number') {
    const formatted = doc.cilindrada.toFixed(1)
    db.vehicles.updateOne(
      { _id: doc._id },
      { $set: { cilindrada: formatted } }
    )
  }
})
```

### 2.5 CASOS EDGE A CONSIDERAR

#### 1. Datos Antiguos sin Formato
**Problema**: Vehículos antiguos con cilindrada como entero (2 en vez de 2.0)

**Solución**: Normalización defensiva
```javascript
const normalizeCilindrada = (value) => {
  if (!value) return ''
  
  const str = value.toString()
  
  // Si ya tiene punto, verificar formato
  if (str.includes('.')) {
    return parseFloat(str).toFixed(1)
  }
  
  // Si no tiene punto, agregarlo
  return `${parseInt(str)}.0`
}
```

#### 2. Input del Usuario
**Problema**: Usuario escribe "2" en vez de "2.0"

**Solución**: Auto-completar en onBlur
```jsx
<input
  type="number"
  step="0.1"
  onBlur={(e) => {
    const value = e.target.value
    if (value && !value.includes('.')) {
      e.target.value = `${value}.0`
    }
  }}
/>
```

#### 3. Validación en Edición
**Problema**: Al editar, cilindrada puede venir en formato antiguo

**Solución**: Normalizar en initImageState
```javascript
// src/components/admin/mappers/normalizeForForm.js
export const normalizeDetailToFormInitialData = (detail) => {
  return {
    ...detail,
    cilindrada: normalizeCilindrada(detail.cilindrada)
  }
}
```

---

## 3. SISTEMA DE GESTIÓN DE FOTOS

### 3.1 ARQUITECTURA ACTUAL

#### Hook Principal: `useImageReducer`
**Ubicación**: `src/components/admin/hooks/useImageReducer.js`

**Estructura de Estado**:
```javascript
{
  // FOTOS PRINCIPALES (campos individuales)
  fotoPrincipal: {
    existingUrl: string,      // URL de Cloudinary
    publicId: string,          // ID de Cloudinary
    originalName: string,      // Nombre original
    file: File | null,         // Nuevo archivo
    remove: boolean            // Marcar para eliminar
  },
  fotoHover: {
    // ... misma estructura
  },
  
  // FOTOS EXTRAS (arrays)
  existingExtras: [
    {
      url: string,
      publicId: string,
      originalName: string,
      remove: boolean          // ✅ CLAVE: Flag de eliminación
    }
  ],
  fotosExtra: [File, File, ...]  // Archivos nuevos del input
}
```

### 3.2 MANEJO DE FOTOS PRINCIPALES

#### Flujo de Foto Principal/Hover

**1. Modo CREATE**
```javascript
// Estado inicial
fotoPrincipal: {
  existingUrl: '',
  publicId: '',
  originalName: '',
  file: null,
  remove: false
}

// Usuario selecciona archivo
setFile('fotoPrincipal', newFile)
→ {
  existingUrl: '',
  publicId: '',
  file: newFile,
  remove: false
}

// Al enviar FormData
if (fotoPrincipal.file) {
  formData.append('fotoPrincipal', fotoPrincipal.file)
}
```

**2. Modo EDIT**
```javascript
// Estado inicial (con foto existente)
fotoPrincipal: {
  existingUrl: 'https://res.cloudinary.com/xxx/image/upload/v123/abc.webp',
  publicId: 'vehicles/abc',
  originalName: 'foto1.webp',
  file: null,
  remove: false
}

// Usuario MANTIENE foto
→ No se hace nada, backend preserva existente

// Usuario REEMPLAZA foto
setFile('fotoPrincipal', newFile)
→ {
  existingUrl: 'https://...',  // Se mantiene por si cancela
  publicId: 'vehicles/abc',
  file: newFile,
  remove: false  // ✅ Auto-restaura si estaba marcada
}

// Al enviar FormData
if (fotoPrincipal.file) {
  formData.append('fotoPrincipal', fotoPrincipal.file)
  // Backend hace OVERWRITE con mismo publicId → No zombies
}

// Usuario ELIMINA foto (edge case raro)
removeImage('fotoPrincipal')
→ {
  existingUrl: 'https://...',
  publicId: 'vehicles/abc',
  file: null,
  remove: true  // ✅ Marcada para eliminar
}
```

**Nota Importante**: El backend hace **overwrite** de fotos principales usando el mismo `public_id`, no genera "fotos zombies".

### 3.3 MANEJO DE FOTOS EXTRAS

#### Estados de Fotos Extras

**1. Modo CREATE**
```javascript
{
  existingExtras: [],  // Vacío, no hay fotos previas
  fotosExtra: []       // Usuario debe subir mínimo 5
}

// Usuario selecciona archivos múltiples
setMultipleExtras([file1, file2, file3, file4, file5])
→ {
  existingExtras: [],
  fotosExtra: [file1, file2, file3, file4, file5]
}

// Validación
if (fotosExtra.length < 5) {
  error = 'Se requieren mínimo 5 fotos extras'
}
```

**2. Modo EDIT - Sin Cambios**
```javascript
{
  existingExtras: [
    { url: '...', publicId: 'vehicles/extra1', remove: false },
    { url: '...', publicId: 'vehicles/extra2', remove: false },
    { url: '...', publicId: 'vehicles/extra3', remove: false },
    { url: '...', publicId: 'vehicles/extra4', remove: false },
    { url: '...', publicId: 'vehicles/extra5', remove: false }
  ],
  fotosExtra: []  // Sin archivos nuevos
}

// Al enviar FormData
formData.append('fotosExtraState', JSON.stringify({ preserve: true }))
formData.append('eliminadas', JSON.stringify([]))
// Backend preserva todas las existentes
```

**3. Modo EDIT - Agregar Fotos Nuevas**
```javascript
// Usuario selecciona 2 archivos adicionales
setMultipleExtras([newFile1, newFile2])
→ {
  existingExtras: [/* 5 fotos actuales */],
  fotosExtra: [newFile1, newFile2]  // ✅ Archivos nuevos
}

// Al enviar FormData
fotosExtra.forEach(file => {
  formData.append('fotosExtra', file)
})

// Backend agrega estas fotos a las existentes
// Total: 5 existentes + 2 nuevas = 7 fotos
```

**4. Modo EDIT - Eliminar Fotos Existentes**
```javascript
// Usuario hace click en "Eliminar" de foto en índice 2
removeExistingExtra(2)
→ {
  existingExtras: [
    { url: '...', publicId: 'vehicles/extra1', remove: false },
    { url: '...', publicId: 'vehicles/extra2', remove: false },
    { url: '...', publicId: 'vehicles/extra3', remove: true },  // ✅ Marcada
    { url: '...', publicId: 'vehicles/extra4', remove: false },
    { url: '...', publicId: 'vehicles/extra5', remove: false }
  ],
  fotosExtra: []
}

// Al enviar FormData
const publicIdsToDelete = existingExtras
  .filter(photo => photo.remove)
  .map(photo => photo.publicId)

formData.append('eliminadas', JSON.stringify(['vehicles/extra3']))

// Backend elimina estas fotos de Cloudinary
```

**5. Modo EDIT - Restaurar Foto Marcada**
```javascript
// Usuario hace click en "Restaurar" de foto en índice 2
restoreExistingExtra(2)
→ {
  existingExtras: [
    { url: '...', publicId: 'vehicles/extra1', remove: false },
    { url: '...', publicId: 'vehicles/extra2', remove: false },
    { url: '...', publicId: 'vehicles/extra3', remove: false },  // ✅ Restaurada
    { url: '...', publicId: 'vehicles/extra4', remove: false },
    { url: '...', publicId: 'vehicles/extra5', remove: false }
  ],
  fotosExtra: []
}
```

### 3.4 CONSTRUCCIÓN DE FORMDATA

#### Función `buildImageFormData`
**Ubicación**: `src/components/admin/hooks/useImageReducer.js` (líneas 301-393)

```javascript
const buildImageFormData = (formData) => {
  // 1. FOTOS PRINCIPALES - Overwrite automático
  ['fotoPrincipal', 'fotoHover'].forEach(key => {
    const { file, remove, publicId, existingUrl } = imageState[key]
    
    if (file) {
      formData.append(key, file)
      // Backend hace overwrite con mismo public_id
    }
    // Si no hay file, backend mantiene existente
  })
  
  // 2. FOTOS EXTRAS - Nuevas
  const extraFiles = []
  if (imageState.fotosExtra && imageState.fotosExtra.length > 0) {
    extraFiles.push(...imageState.fotosExtra)
  }
  
  // 3. FOTOS EXTRAS - Eliminadas
  const publicIdsToDelete = []
  if (imageState.existingExtras) {
    imageState.existingExtras.forEach((photo) => {
      if (photo.remove && photo.publicId) {
        publicIdsToDelete.push(photo.publicId)
      }
    })
  }
  
  // 4. ESTRATEGIA DE ENVÍO
  
  // A. Estado completo como JSON
  const fotosState = {
    fotosNuevas: extraFiles.length > 0 ? extraFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      sent: true
    })) : [],
    eliminadas: publicIdsToDelete,
    timestamp: new Date().toISOString(),
    hasChanges: extraFiles.length > 0 || publicIdsToDelete.length > 0
  }
  formData.append('fotosState', JSON.stringify(fotosState))
  
  // B. Archivos nuevos
  if (extraFiles.length > 0) {
    extraFiles.forEach(file => {
      formData.append('fotosExtra', file)
    })
  } else {
    // Placeholder para backend
    formData.append('fotosExtraState', JSON.stringify({ preserve: true }))
  }
  
  // C. IDs eliminadas (compatibilidad)
  formData.append('eliminadas', JSON.stringify(publicIdsToDelete))
  
  return formData
}
```

### 3.5 LÓGICA DE ELIMINACIÓN

#### Fotos Principales vs Fotos Extras

| Aspecto | Fotos Principales | Fotos Extras |
|---------|-------------------|--------------|
| **Eliminación Frontend** | Flag `remove` en objeto | Flag `remove` en array item |
| **Envío al Backend** | No se envía si `file` es null | Se envía `publicId` en array `eliminadas` |
| **Comportamiento Backend** | Overwrite con mismo `public_id` | Eliminación explícita de Cloudinary |
| **Zombies** | ❌ No genera (overwrite) | ❌ No genera (eliminación explícita) |
| **Restaurar** | ✅ Posible (antes de submit) | ✅ Posible (antes de submit) |

#### Acciones del Reducer

**REMOVE_IMAGE** (fotos principales)
```javascript
case IMAGE_ACTIONS.REMOVE_IMAGE:
  const { key: removeKey } = action.payload
  return {
    ...state,
    [removeKey]: {
      ...state[removeKey],
      file: null,
      remove: true  // ✅ Marcada para eliminar
    }
  }
```

**REMOVE_EXISTING_EXTRA** (fotos extras)
```javascript
case IMAGE_ACTIONS.REMOVE_EXISTING_EXTRA:
  const { index } = action.payload
  const existingExtras = [...state.existingExtras]
  
  if (existingExtras[index]) {
    existingExtras[index] = {
      ...existingExtras[index],
      remove: true  // ✅ Marcada para eliminar
    }
  }
  
  return {
    ...state,
    existingExtras
  }
```

**RESTORE_EXISTING_EXTRA** (restaurar)
```javascript
case IMAGE_ACTIONS.RESTORE_EXISTING_EXTRA:
  const { index: restoreIndex } = action.payload
  const existingExtrasToRestore = [...state.existingExtras]
  
  if (existingExtrasToRestore[restoreIndex]) {
    existingExtrasToRestore[restoreIndex] = {
      ...existingExtrasToRestore[restoreIndex],
      remove: false  // ✅ Restaurada
    }
  }
  
  return {
    ...state,
    existingExtras: existingExtrasToRestore
  }
```

### 3.6 INTERFAZ DE USUARIO

#### Preview de Fotos Principales
**Ubicación**: `src/components/admin/CarForm/CarFormRHF.jsx`

```jsx
// Obtener preview
const preview = getPreviewFor('fotoPrincipal')

{preview ? (
  <div className={styles.imagePreview}>
    <img src={preview} alt="Preview" />
    <button onClick={() => removeImage('fotoPrincipal')}>
      ❌ Eliminar
    </button>
    {imageState.fotoPrincipal.remove && (
      <button onClick={() => restoreImage('fotoPrincipal')}>
        ↩️ Restaurar
      </button>
    )}
  </div>
) : (
  <input 
    type="file" 
    accept="image/webp"
    onChange={(e) => setFile('fotoPrincipal', e.target.files[0])}
  />
)}
```

#### Preview de Fotos Extras Existentes
```jsx
{imageState.existingExtras.map((photo, index) => (
  <div key={photo.publicId} className={styles.existingPhoto}>
    <img 
      src={photo.url} 
      alt={`Extra ${index + 1}`}
      className={photo.remove ? styles.markedForDelete : ''}
    />
    {photo.remove ? (
      <>
        <span className={styles.deletedLabel}>Será eliminada</span>
        <button onClick={() => restoreExistingExtra(index)}>
          ↩️ Restaurar
        </button>
      </>
    ) : (
      <button onClick={() => removeExistingExtra(index)}>
        ❌ Eliminar
      </button>
    )}
  </div>
))}
```

#### Input para Fotos Extras Nuevas
```jsx
<input 
  type="file" 
  accept="image/webp"
  multiple
  onChange={(e) => setMultipleExtras(e.target.files)}
/>

{imageState.fotosExtra.length > 0 && (
  <div className={styles.newPhotosPreview}>
    <p>Fotos nuevas a subir: {imageState.fotosExtra.length}</p>
    {imageState.fotosExtra.map((file, index) => (
      <div key={index} className={styles.newPhoto}>
        <img src={URL.createObjectURL(file)} alt={`Nueva ${index + 1}`} />
        <span>{file.name}</span>
      </div>
    ))}
  </div>
)}
```

### 3.7 VALIDACIONES

#### Validación en CREATE
```javascript
validateImages('create') {
  const errors = {}
  
  // Fotos principales requeridas
  if (!imageState.fotoPrincipal.file) {
    errors.fotoPrincipal = 'La foto principal es requerida'
  }
  
  if (!imageState.fotoHover.file) {
    errors.fotoHover = 'La foto hover es requerida'
  }
  
  // Mínimo 5 fotos extras
  if (imageState.fotosExtra.length < 5) {
    errors.fotosExtra = 'Se requieren mínimo 5 fotos extras (total: 7 fotos)'
  }
  
  // Máximo 8 fotos extras
  if (imageState.fotosExtra.length > 8) {
    errors.fotosExtra = 'Máximo 8 fotos extras permitidas'
  }
  
  return errors
}
```

#### Validación en EDIT
```javascript
validateImages('edit') {
  // Validación opcional - usuario puede editar solo texto
  // No se requieren cambios en imágenes
  return {}
}
```

### 3.8 LIMPIEZA DE MEMORIA

#### Cleanup de Object URLs
```javascript
const cleanupObjectUrls = () => {
  // Limpiar URLs de fotos principales
  ['fotoPrincipal', 'fotoHover'].forEach(key => {
    const { file } = imageState[key]
    if (file) {
      try {
        URL.revokeObjectURL(URL.createObjectURL(file))
      } catch (_) {
        // Ignorar errores
      }
    }
  })
  
  // Limpiar URLs de fotos extras
  imageState.fotosExtra.forEach(file => {
    try {
      URL.revokeObjectURL(URL.createObjectURL(file))
    } catch (_) {
      // Ignorar errores
    }
  })
}

// Llamar en useEffect cleanup
useEffect(() => {
  return () => {
    cleanupObjectUrls()
  }
}, [])
```

### 3.9 INTERACCIÓN CON BACKEND

#### Estructura de FormData Enviada

```javascript
FormData {
  // DATOS DEL VEHÍCULO
  marca: "Toyota",
  modelo: "Corolla",
  anio: "2020",
  precio: "15000",
  cilindrada: "2.0",  // ✅ Nuevo formato
  // ... otros campos
  
  // FOTOS PRINCIPALES (si hay cambios)
  fotoPrincipal: File,  // Solo si hay nuevo archivo
  fotoHover: File,      // Solo si hay nuevo archivo
  
  // FOTOS EXTRAS (si hay cambios)
  fotosExtra: File,     // Puede haber múltiples con mismo nombre
  fotosExtra: File,
  fotosExtra: File,
  
  // METADATA DE FOTOS
  fotosState: JSON.stringify({
    fotosNuevas: [
      { name: "foto1.webp", size: 12345, type: "image/webp", sent: true }
    ],
    eliminadas: ["vehicles/extra3", "vehicles/extra5"],
    timestamp: "2025-11-19T...",
    hasChanges: true
  }),
  
  // COMPATIBILIDAD
  fotosExtraState: JSON.stringify({ preserve: true }),  // Si no hay nuevas
  eliminadas: JSON.stringify(["vehicles/extra3", "vehicles/extra5"])
}
```

#### Respuesta Esperada del Backend

**CREATE exitoso**:
```json
{
  "success": true,
  "data": {
    "_id": "abc123",
    "marca": "Toyota",
    "modelo": "Corolla",
    "fotoPrincipal": "https://res.cloudinary.com/xxx/vehicles/principal_abc123.webp",
    "fotoHover": "https://res.cloudinary.com/xxx/vehicles/hover_abc123.webp",
    "fotoExtra1": "https://res.cloudinary.com/xxx/vehicles/extra1_abc123.webp",
    "fotoExtra2": "https://res.cloudinary.com/xxx/vehicles/extra2_abc123.webp",
    // ... hasta fotoExtra8 si existen
  }
}
```

**UPDATE exitoso**:
```json
{
  "success": true,
  "data": {
    "_id": "abc123",
    // ... campos actualizados
    "updatedAt": "2025-11-19T..."
  },
  "message": "Vehículo actualizado correctamente"
}
```

**ERROR**:
```json
{
  "success": false,
  "error": "Error al subir imágenes",
  "details": {
    "cloudinaryError": "Invalid image format"
  }
}
```

### 3.10 PROBLEMAS CONOCIDOS Y SOLUCIONES

#### Problema 1: Fotos "Zombies" en Cloudinary
**Estado**: ✅ RESUELTO

**Solución Implementada**:
- Fotos principales usan **overwrite** con mismo `public_id`
- Fotos extras envían array `eliminadas` con `publicId` de las que se deben borrar
- Backend elimina explícitamente las fotos marcadas

#### Problema 2: Input Múltiple Reemplaza Todo
**Estado**: ✅ RESUELTO

**Solución**:
- Separar `existingExtras` (preservadas) de `fotosExtra` (nuevas)
- Backend combina ambas en el resultado final

#### Problema 3: Preview de Fotos Grandes
**Estado**: ⚠️ A MEJORAR

**Problema**: Crear Object URLs de archivos grandes puede causar lag

**Solución Propuesta**:
- Usar thumbnails para preview
- Lazy loading de previews
- Limitar tamaño máximo de archivo (ej: 2MB)

```javascript
const validateFileSize = (file) => {
  const MAX_SIZE = 2 * 1024 * 1024  // 2MB
  if (file.size > MAX_SIZE) {
    return 'El archivo debe ser menor a 2MB'
  }
  return true
}
```

#### Problema 4: Usuario Cancela Upload a Mitad
**Estado**: ⚠️ PARCIALMENTE RESUELTO

**Problema**: Si cierra modal, los Object URLs quedan en memoria

**Solución Actual**:
- `cleanupObjectUrls()` se llama en unmount del formulario

**Mejora Propuesta**:
- Agregar confirmación antes de cerrar si hay cambios
- Cleanup automático en navegación

### 3.11 MEJORAS FUTURAS

#### 1. Comprensión de Imágenes en Cliente
```javascript
import imageCompression from 'browser-image-compression'

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  
  return await imageCompression(file, options)
}
```

#### 2. Progress Bar de Upload
```javascript
const uploadWithProgress = (formData, onProgress) => {
  return authAxiosInstance.post('/photos/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      onProgress(percentCompleted)
    }
  })
}
```

#### 3. Drag & Drop para Fotos
```jsx
const handleDrop = (e) => {
  e.preventDefault()
  const files = Array.from(e.dataTransfer.files)
  const validFiles = files.filter(f => f.type === 'image/webp')
  setMultipleExtras(validFiles)
}

<div 
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
  className={styles.dropZone}
>
  Arrastra fotos aquí
</div>
```

#### 4. Reordenar Fotos Extras
```javascript
const reorderPhoto = (fromIndex, toIndex) => {
  const newExtras = [...imageState.existingExtras]
  const [removed] = newExtras.splice(fromIndex, 1)
  newExtras.splice(toIndex, 0, removed)
  
  dispatch({ 
    type: IMAGE_ACTIONS.REORDER_EXTRAS, 
    payload: { newOrder: newExtras } 
  })
}
```

---

## 4. CONCLUSIONES Y PLAN DE ACCIÓN

### 4.1 PRIORIDADES

#### ⚡ ALTA PRIORIDAD

**1. Campo Cilindrada - Formato Decimal**
- **Impacto**: Medio
- **Complejidad**: Baja
- **Tiempo estimado**: 2-3 horas
- **Afecta**: Frontend + Backend + Base de datos
- **Requiere migración**: ✅ SÍ

**Tareas**:
1. ✅ Actualizar tipos JSDoc
2. ✅ Modificar input HTML (agregar `step="0.1"`)
3. ✅ Agregar validación de formato (regex `/^\d{1}\.\d{1}$/`)
4. ✅ Crear función de normalización
5. ✅ Actualizar formatter para visualización
6. ⚠️ Coordinar cambio en backend
7. ⚠️ Ejecutar script de migración de datos

#### 🟡 MEDIA PRIORIDAD

**2. Documentación de Flujo de Autenticación**
- **Impacto**: Bajo (sistema funciona correctamente)
- **Complejidad**: Baja
- **Tiempo estimado**: 1 hora
- **Afecta**: Documentación únicamente

**Tareas**:
1. ✅ Documento ya creado (este archivo)
2. ✅ Diagramas de flujo completados
3. ✅ Puntos de contacto identificados
4. 🔲 Agregar ejemplos de uso
5. 🔲 Crear guía de troubleshooting

**3. Mejoras en Sistema de Fotos**
- **Impacto**: Medio
- **Complejidad**: Media-Alta
- **Tiempo estimado**: 4-6 horas
- **Afecta**: UX principalmente

**Tareas**:
1. ✅ Sistema actual funciona correctamente
2. 🔲 Agregar validación de tamaño (max 2MB)
3. 🔲 Implementar progress bar de upload
4. 🔲 Agregar comprensión de imágenes en cliente
5. 🔲 Implementar drag & drop
6. 🔲 Agregar reordenamiento de fotos

#### 🟢 BAJA PRIORIDAD

**4. Optimizaciones de Performance**
- **Impacto**: Bajo
- **Complejidad**: Media
- **Tiempo estimado**: Variable

**Tareas**:
1. 🔲 Implementar lazy loading de previews
2. 🔲 Optimizar cleanup de Object URLs
3. 🔲 Agregar confirmación antes de cerrar modal con cambios
4. 🔲 Implementar retry automático en upload fallido

### 4.2 RIESGOS IDENTIFICADOS

#### ❗ Cilindrada - Cambio de Tipo de Dato

**Riesgo**: Datos inconsistentes durante migración

**Mitigación**:
1. Crear backup completo de base de datos
2. Ejecutar script de migración en staging primero
3. Validar todos los registros migrados
4. Mantener compatibilidad con formato antiguo durante transición
5. Agregar logs extensivos en backend

#### ⚠️ Fotos - Pérdida de Imágenes en Edición

**Riesgo**: Usuario cierra modal sin guardar y pierde cambios

**Mitigación actual**:
- Cleanup de Object URLs en unmount (implementado)
- Estado se resetea correctamente

**Mejora propuesta**:
- Agregar modal de confirmación: "¿Seguro que quieres cerrar sin guardar?"
- Implementar draft saving en localStorage

#### ⚠️ Autenticación - Token Expira Durante Edición

**Riesgo**: Usuario pierde formulario completo si token expira

**Mitigación actual**:
- Verificación cada 5 minutos (implementado)
- Listener de 401 (implementado)

**Mejora propuesta**:
- Guardar draft en localStorage antes de cada acción
- Mostrar warning 5 minutos antes de expiración
- Implementar refresh token automático

### 4.3 SIGUIENTE PASOS RECOMENDADOS

#### Fase 1: Implementar Formato Decimal en Cilindrada (1-2 días)

**Día 1: Frontend**
1. Actualizar tipos en `src/types/vehicle.js`
2. Modificar input en `CarFormRHF.jsx`
3. Agregar validación con regex
4. Crear función `normalizeCilindrada` en utils
5. Actualizar formatters para visualización
6. Testing manual en formulario

**Día 2: Backend + Migración**
1. Coordinar con backend: cambiar schema de Number a String
2. Agregar validación en backend
3. Crear script de migración
4. Ejecutar migración en staging
5. Validar datos migrados
6. Deploy a producción
7. Monitorear logs

#### Fase 2: Mejoras en Sistema de Fotos (2-3 días)

**Día 1: Validaciones**
1. Implementar validación de tamaño máximo
2. Agregar feedback visual de errores
3. Testing con archivos grandes

**Día 2: Progress Bar**
1. Implementar componente de progress
2. Integrar con axios `onUploadProgress`
3. Testing con conexiones lentas

**Día 3: Comprensión**
1. Agregar `browser-image-compression`
2. Implementar comprensión antes de upload
3. Testing de calidad final

#### Fase 3: Documentación y Optimizaciones (1 día)

1. Crear guía de troubleshooting de auth
2. Documentar casos edge de fotos
3. Implementar confirmación antes de cerrar modal
4. Agregar logs adicionales

### 4.4 CHECKLIST DE VALIDACIÓN

#### ✅ Sistema de Autenticación
- [x] Login funciona correctamente
- [x] Token se valida en cada request protegido
- [x] 401 Unauthorized maneja logout automático
- [x] Verificación periódica cada 5 minutos
- [x] RequireAuth protege Dashboard
- [x] Interceptors funcionan correctamente
- [x] localStorage se limpia en logout

#### ⚠️ Sistema de Fotos
- [x] CREATE: Subir 2 principales + 5-8 extras
- [x] EDIT: Mantener fotos existentes
- [x] EDIT: Agregar fotos nuevas
- [x] EDIT: Eliminar fotos existentes
- [x] EDIT: Restaurar fotos marcadas
- [x] FormData se construye correctamente
- [ ] Validación de tamaño de archivo (pendiente)
- [ ] Progress bar de upload (pendiente)
- [ ] Comprensión antes de upload (pendiente)

#### 🔲 Campo Cilindrada
- [ ] Input acepta formato X.X
- [ ] Validación rechaza formato inválido
- [ ] Normalización funciona en CREATE
- [ ] Normalización funciona en EDIT
- [ ] Visualización muestra formato correcto
- [ ] Backend acepta nuevo formato
- [ ] Migración de datos completada
- [ ] Testing con datos reales

---

## APÉNDICE A: COMANDOS ÚTILES

### Desarrollo
```bash
# Iniciar frontend
npm run dev

# Build de producción
npm run build

# Preview de build
npm run preview

# Linter
npm run lint
```

### Testing Manual

#### Auth Flow
1. Navegar a `/admin/login`
2. Ingresar credenciales incorrectas → Ver error
3. Ingresar credenciales correctas → Redirigir a `/admin`
4. Cerrar sesión → Limpiar localStorage
5. Intentar acceder a `/admin` sin auth → Redirigir a login
6. Login exitoso → Verificar token en localStorage
7. Esperar 5 minutos → Verificar validación periódica

#### Foto Flow (CREATE)
1. Abrir modal "Nuevo Vehículo"
2. Completar campos de texto
3. Subir foto principal → Ver preview
4. Subir foto hover → Ver preview
5. Subir 5 fotos extras → Ver contador
6. Intentar submit sin fotos → Ver error
7. Submit completo → Verificar en lista

#### Foto Flow (EDIT)
1. Abrir modal "Editar Vehículo"
2. Ver fotos existentes cargadas
3. Eliminar foto extra → Ver marcada en rojo
4. Restaurar foto → Ver desmarcada
5. Agregar 2 fotos nuevas → Ver preview
6. Submit → Verificar cambios

#### Cilindrada (después de implementar)
1. CREATE: Ingresar "2.5" → Aceptar
2. CREATE: Ingresar "2" → Ver error o auto-completar
3. EDIT: Ver valor cargado como "2.0"
4. EDIT: Cambiar a "3.5" → Guardar
5. Detalle: Ver formato "3.5 L"

---

## APÉNDICE B: VARIABLES DE ENTORNO COMPLETAS

```env
# ===========================================
# VARIABLES DE ENTORNO - INDIANA USADOS
# ===========================================

# ========== API BACKEND ==========
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=15000

# ========== ENTORNO ==========
# Valores: development | staging | production
VITE_ENVIRONMENT=development

# ========== DEBUG ==========
VITE_DEBUG=true
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# ========== CLOUDINARY ==========
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn
VITE_IMG_PROGRESSIVE_JPEG=false
VITE_IMG_PLACEHOLDER_BLUR=false

# ========== CONTACTO ==========
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678

# ========== SEO ==========
VITE_SITE_URL=https://www.indianausados.com
```

---

## APÉNDICE C: ESTRUCTURA DE ARCHIVOS CLAVE

```
indiana-usados/
├── src/
│   ├── api/
│   │   ├── axiosInstance.js          ✅ Instancias de axios
│   │   └── index.js
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CarForm/
│   │   │   │   ├── CarFormRHF.jsx    ✅ Formulario principal
│   │   │   │   └── CarFormRHF.module.css
│   │   │   ├── hooks/
│   │   │   │   └── useImageReducer.js ✅ Hook de fotos
│   │   │   └── mappers/
│   │   │       └── normalizeForForm.js ✅ Normalizaciones
│   │   │
│   │   └── auth/
│   │       ├── RequireAuth.jsx       ✅ HOC de protección
│   │       └── AuthUnauthorizedListener.jsx ✅ Listener 401
│   │
│   ├── config/
│   │   ├── index.js                  ✅ Config centralizada
│   │   └── auth.js                   ✅ Config de auth
│   │
│   ├── hooks/
│   │   └── auth/
│   │       └── useAuth.js            ✅ Hook principal de auth
│   │
│   ├── routes/
│   │   ├── PublicRoutes.jsx          ✅ Rutas públicas
│   │   └── AdminRoutes.jsx           ✅ Rutas protegidas
│   │
│   ├── services/
│   │   ├── authService.js            ✅ Servicio de auth
│   │   ├── vehiclesApi.js            ✅ Servicio público
│   │   └── admin/
│   │       └── vehiclesAdminService.js ✅ Servicio protegido
│   │
│   ├── types/
│   │   └── vehicle.js                ⚠️ Actualizar cilindrada
│   │
│   ├── utils/
│   │   ├── formatters.js             ⚠️ Agregar formatCilindrada
│   │   └── logger.js
│   │
│   └── App.jsx                       ✅ Entry point
│
├── docs/
│   ├── ANALISIS_PROFUNDO_SISTEMA.md  ✅ Este documento
│   └── [otros documentos]
│
├── .env                              ⚠️ Verificar variables
└── package.json
```

---

**FIN DEL ANÁLISIS**

Este documento debe ser revisado y actualizado después de cada implementación.

