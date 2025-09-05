# 📊 AUDITORÍA TÉCNICA COMPLETA - Indiana Usados

**Fecha:** $(date)  
**Versión del proyecto:** 2.0.0  
**Analista:** Asistente Técnico  
**Objetivo:** Refactorización y optimización sin romper funcionalidad

---

## 1. 📸 SNAPSHOT DEL PROYECTO

### Stack Detectado
- **Framework:** React 18.2.0 + Vite 5.0.12
- **Routing:** React Router DOM 6.21.3
- **Estado:** React Query (@tanstack/react-query 5.79.0)
- **HTTP Client:** Axios 1.6.7
- **Formularios:** React Hook Form 7.59.0
- **UI:** Bootstrap 5.3.2 + CSS Modules
- **Testing:** Vitest 3.2.4 + Playwright 1.54.2
- **Lenguaje:** JavaScript (no TypeScript)

### Versiones Clave
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@tanstack/react-query": "^5.79.0",
  "react-router-dom": "^6.21.3",
  "axios": "^1.6.7",
  "vite": "^5.0.12",
  "vitest": "^3.2.4",
  "@playwright/test": "^1.54.2"
}
```

### Scripts Relevantes
- `dev`: `vite` (puerto 8080)
- `build`: `vite build` (target esnext, minify esbuild)
- `preview`: `vite preview --port 4173`
- `lint`: `eslint .`
- `test`: `vitest run`
- `test:e2e`: `playwright test`
- `e2e:smoke`: `playwright test -c playwright.smoke.config.ts`

### Variables de Entorno (VITE_*)
```javascript
// API
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=5000
VITE_ENVIRONMENT=development

// Features
VITE_DEBUG=true
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true
VITE_PREFETCH=true

// Imágenes
VITE_IMAGE_PLACEHOLDER=blur
VITE_IMAGE_LAZY_LOAD=true
VITE_IMAGE_QUALITY=80

// Performance
VITE_DEBOUNCE_DELAY=300
VITE_THROTTLE_DELAY=100
VITE_INTERSECTION_THRESHOLD=0.1
VITE_INTERSECTION_ROOT_MARGIN=100px

// Paginación
VITE_PAGE_SIZE=12
VITE_INFINITE_SCROLL=true

// Contacto
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678

// Auth
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data
```

---

## 2. 🏗️ MAPA DE ARQUITECTURA

### Árbol de Carpetas (src/)
```
src/
├── api/                    # Cliente HTTP + endpoints
│   ├── axiosInstance.js   # Configuración Axios
│   ├── vehiclesApi.js     # API de vehículos
│   └── index.js
├── components/            # Componentes UI
│   ├── vehicles/          # Componentes específicos de vehículos
│   ├── ui/                # Componentes genéricos
│   ├── layout/            # Layout principal
│   ├── auth/              # Autenticación
│   ├── ErrorBoundary/     # Manejo de errores
│   └── skeletons/         # Loading states
├── hooks/                 # Hooks personalizados
│   ├── vehicles/          # Hooks de vehículos
│   ├── filters/           # Hooks de filtros
│   └── [otros hooks]
├── pages/                 # Páginas de la aplicación
│   ├── Home/
│   ├── Vehiculos/
│   ├── VehiculoDetalle/
│   ├── Nosotros/
│   └── admin/
├── routes/                 # Configuración de rutas
├── services/              # Servicios de negocio
├── config/                # Configuración centralizada
├── constants/             # Constantes de la app
├── utils/                 # Utilidades
├── styles/                # Estilos globales
├── assets/                # Recursos estáticos
├── types/                 # Tipos (JavaScript)
├── mappers/               # Transformación de datos
└── test/                  # Configuración de tests
```

### Propuesta de Agrupación por Features
**Estado actual:** Organización por tipo técnico (components/, hooks/, etc.)

**Recomendación:** Migrar a organización por features:
```
src/
├── features/
│   ├── vehicles/          # Todo lo relacionado con vehículos
│   ├── filters/           # Sistema de filtros
│   ├── auth/              # Autenticación
│   └── admin/             # Panel administrativo
├── shared/
│   ├── ui/                # Componentes genéricos
│   ├── hooks/             # Hooks compartidos
│   └── utils/             # Utilidades
├── app/                   # Configuración de la app
└── api/                   # Cliente HTTP
```

### Archivos "Núcleo"
- **Punto de entrada:** `src/main.jsx` (líneas 1-48)
- **App principal:** `src/App.jsx` (líneas 1-51)
- **Configuración:** `src/config/index.js` (líneas 1-142)
- **Providers:** QueryClientProvider, GlobalErrorBoundary
- **Rutas:** `src/routes/PublicRoutes.jsx`, `src/routes/AdminRoutes.jsx`

---

## 3. 🛣️ ROUTING

### Rutas Públicas (Lazy Loading ✅)
| Path | Componente | Lazy | Layout | Params |
|------|-----------|------|--------|--------|
| `/` | Home | ✅ | Nav + Footer | - |
| `/vehiculos` | Vehiculos | ✅ | Nav + Footer | - |
| `/vehiculo/:id` | VehiculoDetalle | ✅ | Nav + Footer | `id` |
| `/nosotros` | Nosotros | ✅ | Nav + Footer | - |

### Rutas Admin (Lazy Loading ✅)
| Path | Componente | Lazy | Layout | Auth | Params |
|------|-----------|------|--------|------|--------|
| `/admin/login` | Login | ✅ | Sin layout | ❌ | - |
| `/admin/` | Dashboard | ✅ | Sin layout | ✅ | - |
| `/admin/autos` | Lista Autos | ✅ | Sin layout | ✅ | - |
| `/admin/autos/:id/editar` | Editar Auto | ✅ | Sin layout | ✅ | `id` |

### Páginas Principales vs Secundarias
**Principales:**
- Home (`/`) - Landing page
- Vehiculos (`/vehiculos`) - Catálogo principal
- VehiculoDetalle (`/vehiculo/:id`) - Detalle de vehículo

**Secundarias:**
- Nosotros (`/nosotros`) - Información de la empresa
- Admin routes - Panel administrativo

---

## 4. 📡 CAPA DE DATOS (HTTP + React Query)

### Cliente Axios Detectado
**Archivo:** `src/api/axiosInstance.js` (líneas 1-115)

**Configuración:**
- **Base URL:** `http://localhost:3001` (configurable)
- **Timeout:** 5000ms (configurable)
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Instancias:** 3 separadas (principal, detalle, auth)

**Interceptores:**
- **Request:** Agregar token automáticamente (solo auth instance)
- **Response:** Manejo de 401 (limpiar localStorage, redirigir)

### Endpoints Utilizados
| Método | Ruta | Archivo | Línea | Propósito |
|--------|------|---------|-------|-----------|
| GET | `/photos/getallphotos` | `src/api/vehiclesApi.js` | 35 | Lista de vehículos |
| POST | `/photos/getallphotos` | `src/api/vehiclesApi.js` | 65 | Lista con filtros |
| GET | `/photos/getonephoto/:id` | `src/api/vehiclesApi.js` | 95 | Detalle de vehículo |

### React Query

#### Claves de Query
```javascript
// Lista de vehículos
['vehicles', JSON.stringify(filters)]

// Detalle de vehículo
['vehicle', id]
```

#### Configuración Detectada
- **staleTime:** 5 minutos (300000ms)
- **cacheTime:** 30 minutos (1800000ms)
- **retry:** 1-2 intentos
- **refetchOnWindowFocus:** false
- **enabled:** true (por defecto)

#### useInfiniteQuery
**Estado:** ❌ NO IMPLEMENTADO

**Análisis:** El proyecto usa `useQuery` simple en lugar de `useInfiniteQuery`. Los hooks `useVehiclesList.js` y `useVehiclesQuery.js` manejan paginación manual con botón "Cargar más".

**Oportunidad:** Migrar a `useInfiniteQuery` para mejor UX y performance.

#### Mutations
**Archivo:** `src/hooks/useCarMutation.js` (líneas 1-435)

**Mutations detectadas:**
- Crear vehículo
- Actualizar vehículo
- Eliminar vehículo
- Subir imágenes

**Invalidaciones:**
```javascript
// Invalidar lista de vehículos
queryClient.invalidateQueries(['vehicles'])

// Invalidar vehículo específico
queryClient.invalidateQueries(['vehicle', id])
```

---

## 5. 🔄 ESTADO Y HOOKS

### useReducer de Filtros
**Archivo:** `src/hooks/filters/useFilterReducer.js` (líneas 1-188)

**Estado inicial:**
```javascript
{
  isSubmitting: false,
  isDrawerOpen: false,
  currentFilters: {},
  pendingFilters: {},
  isLoading: false,
  isError: false,
  error: null
}
```

**Acciones principales:**
- `SET_PENDING_FILTERS` - Establecer filtros pendientes
- `APPLY_FILTERS` - Aplicar filtros (mueve pending → current)
- `CLEAR_FILTERS` - Limpiar todos los filtros
- `SET_LOADING` - Estado de carga
- `SET_ERROR` - Manejo de errores

**Dónde se dispara "APLICAR":**
- `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` (línea ~288)
- `src/components/vehicles/List/VehiclesList.jsx` (línea ~45)

**Reseteo de paginación:** ✅ SÍ - Al aplicar filtros se resetea

### Contexts Presentes
**GlobalErrorBoundary:** `src/components/ErrorBoundary/GlobalErrorBoundary.jsx`
- **Proveedor:** `src/main.jsx` (línea 35)
- **Consumidores:** Toda la aplicación

**QueryClientProvider:** `src/main.jsx` (línea 36)
- **Proveedor:** QueryClient con configuración global
- **Consumidores:** Todos los hooks de React Query

### Hooks Personalizados
| Hook | Propósito | Archivos que lo usan |
|------|-----------|---------------------|
| `useVehiclesList` | Lista de vehículos | `VehiclesList.jsx`, `AutosGrid.jsx` |
| `useVehicleDetail` | Detalle de vehículo | `VehiculoDetalle.jsx` |
| `useFilterReducer` | Estado de filtros | `FilterFormSimplified.jsx` |
| `useErrorHandler` | Manejo de errores | `VehiclesList.jsx`, `VehiculoDetalle.jsx` |
| `useImageOptimization` | Optimización de imágenes | `CardAuto.jsx`, `OptimizedImage.jsx` |
| `useAuth` | Autenticación | `RequireAuth.jsx`, `LoginForm.jsx` |
| `useScrollPosition` | Posición de scroll | `ScrollToTop.jsx` |
| `usePreloadRoute` | Preload de rutas | `CardAuto.jsx` |

---

## 6. 🎨 COMPONENTES Y UI

### Inventario de Componentes (Top 20 por LOC)

| Componente | LOC Aprox | Responsabilidad | Archivo |
|------------|-----------|-----------------|---------|
| `useCarMutation` | 435 | Mutaciones CRUD | `src/hooks/useCarMutation.js` |
| `ErrorBoundary` | 330 | Manejo de errores | `src/components/ErrorBoundary/ErrorBoundary.jsx` |
| `AdminActions` | 341 | Acciones admin | `src/components/vehicles/AdminActions.jsx` |
| `useAdminMutations` | 195 | Mutaciones admin | `src/hooks/useAdminMutations.js` |
| `useErrorHandler` | 199 | Hook de errores | `src/hooks/useErrorHandler.js` |
| `GlobalErrorBoundary` | 149 | Error boundary global | `src/components/ErrorBoundary/GlobalErrorBoundary.jsx` |
| `useFilterReducer` | 188 | Estado de filtros | `src/hooks/filters/useFilterReducer.js` |
| `useVehicleData` | 135 | Datos de vehículos | `src/hooks/useVehicleData.js` |
| `useScrollPosition` | 126 | Posición de scroll | `src/hooks/useScrollPosition.js` |
| `useAuth` | 125 | Autenticación | `src/hooks/useAuth.js` |
| `FilterFormSimplified` | 177 | Formulario de filtros | `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` |
| `VehiclesList` | 72 | Lista principal | `src/components/vehicles/List/VehiclesList.jsx` |
| `AutosGrid` | 72 | Grid de vehículos | `src/components/vehicles/List/ListAutos/AutosGrid.jsx` |
| `OptimizedImage` | 186 | Imagen optimizada | `src/components/ui/OptimizedImage/OptimizedImage.jsx` |
| `ImageCarousel` | 195 | Carrusel de imágenes | `src/components/ui/ImageCarousel/ImageCarousel.jsx` |
| `MultiSelect` | 178 | Select múltiple | `src/components/ui/MultiSelect/MultiSelect.jsx` |
| `RangeSlider` | 173 | Slider de rango | `src/components/ui/RangeSlider/RangeSlider.jsx` |
| `CardAuto` | ~150 | Tarjeta de vehículo | `src/components/vehicles/Card/CardAuto.jsx` |
| `CardDetalle` | ~150 | Detalle de vehículo | `src/components/vehicles/Detail/CardDetalle/CardDetalle.jsx` |
| `ScrollToTop` | 71 | Scroll to top | `src/components/ui/ScrollToTop/ScrollToTop.jsx` |

### Contenedores vs Presentacionales
**Contenedores (Smart Components):**
- `VehiclesList` - Maneja estado y lógica de negocio
- `FilterFormSimplified` - Maneja estado de filtros
- `VehiclesErrorBoundary` - Maneja errores específicos

**Presentacionales (Dumb Components):**
- `CardAuto` - Solo renderiza datos
- `AutosGrid` - Solo renderiza grid
- `OptimizedImage` - Solo maneja imagen
- `Button` - Componente genérico

### "Hotspots" de Re-render
**Archivo + Línea Aproximada:**

1. **Props muy grandes:** `src/components/vehicles/List/VehiclesList.jsx:45`
   - `filterFormProps` y `autosGridProps` se recrean en cada render
   - **Solución:** Ya usa `useMemo` ✅

2. **Funciones inline:** `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx:240`
   - `onSubmit` se recrea en cada render
   - **Solución:** Usar `useCallback` ✅

3. **Dependencias sospechosas:** `src/hooks/vehicles/useVehiclesList.js:15`
   - `queryKey` incluye `JSON.stringify(filters)` - puede causar re-renders innecesarios
   - **Riesgo:** Medio

### Manejo de Imágenes
**Dónde se usa `<img>`:**
- `src/components/ui/OptimizedImage/OptimizedImage.jsx:150`
- `src/components/ui/ImageCarousel/ImageCarousel.jsx:115`

**Optimizaciones aplicadas:**
- ✅ `loading="lazy"` - Implementado
- ✅ `decoding="async"` - Implementado
- ✅ `width/height` - No detectado (usar aspect-ratio CSS)
- ✅ `alt` - Implementado
- ✅ `srcSet` - Implementado para responsive

---

## 7. ⚡ RENDIMIENTO Y BUNDLE

### Tamaño del Build
**Estado:** No medido

**Para obtener métricas:**
```bash
npm run build
# Revisar dist/ para tamaños de chunks
```

### Módulos Pesados (Heurística Estática)
| Módulo | LOC Aprox | Razón del peso | Impacto |
|--------|-----------|----------------|---------|
| `useCarMutation.js` | 435 | Lógica CRUD compleja | Alto |
| `AdminActions.jsx` | 341 | Componente admin pesado | Medio |
| `ErrorBoundary.jsx` | 330 | Manejo de errores robusto | Medio |
| `OptimizedImage.jsx` | 186 | Optimización de imágenes | Medio |
| `ImageCarousel.jsx` | 195 | Carrusel interactivo | Medio |

### Rutas Candidatas a Code Splitting
**Ya implementado:**
- ✅ Páginas principales (lazy loading)
- ✅ Componentes admin (lazy loading)

**Oportunidades adicionales:**
- `OptimizedImage` - Solo usado en detalle
- `ImageCarousel` - Solo usado en detalle
- `AdminActions` - Solo usado en admin
- `useCarMutation` - Solo usado en admin

---

## 8. ❌ ERRORES, VACÍOS Y ESTADOS

### ErrorBoundary
**✅ Existe:** `src/components/ErrorBoundary/GlobalErrorBoundary.jsx`

**Ubicación:** Envolviendo toda la app en `src/main.jsx:35`

**Características:**
- Captura errores de JavaScript
- UI de error amigable
- Logging de errores
- Recuperación automática
- Reporte a monitoreo (futuro)

### Vistas Estándar
**Loading:**
- `LoadingSpinner` - `src/components/ui/LoadingSpinner/`
- `ListAutosSkeleton` - `src/components/skeletons/ListAutosSkeleton/`
- `DetalleSkeleton` - `src/components/skeletons/DetalleSkeleton/`

**Empty:**
- No detectado componente específico
- Se maneja en `AutosGrid.jsx` con mensaje condicional

**Error:**
- `ErrorState` - `src/components/ui/ErrorState/`
- `Alert` - `src/components/ui/Alert/`
- `ErrorMessage` - Componente inline en `AutosGrid.jsx`

### Manejo de Errores HTTP
**Archivo:** `src/api/axiosInstance.js` (líneas 60-75)

**Mapeo de errores:**
- **401:** Limpiar localStorage, redirigir a login
- **Otros:** Promise.reject para manejo en componentes

**UI de errores:**
- Componentes específicos de error
- Toast notifications (react-hot-toast)
- Error boundaries para captura

---

## 9. ♿ ACCESIBILIDAD (A11y) Y SEO BASE

### Imágenes sin Alt
**Archivo:** `src/components/ui/ImageCarousel/ImageCarousel.jsx:115`
- ✅ Alt implementado: `${altText} ${currentIndex + 1} de ${allImages.length}`

**Archivo:** `src/components/ui/OptimizedImage/OptimizedImage.jsx:150`
- ✅ Alt implementado: `alt={alt}`

### Inputs sin Label/Aria
**Archivo:** `src/components/ui/MultiSelect/MultiSelect.jsx:80`
- ✅ Label implementado: `{label && <label className={styles.label}>{label}</label>}`
- ✅ Aria implementado: `aria-expanded`, `aria-haspopup`, `aria-label`

**Archivo:** `src/components/ui/FormInput/FormInput.jsx:15`
- ✅ Label implementado: `htmlFor={name}`

### Encabezados Semánticos
**Archivo:** `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx:270`
- ✅ `<h2>Filtrar Vehículos</h2>`
- ✅ `<h3>Filtros de Búsqueda</h3>`

### Metadatos por Página
**Estado:** No detectado

**Recomendación:** Implementar React Helmet o similar para:
- Títulos dinámicos
- Meta descriptions
- Open Graph tags
- Twitter Cards

---

## 10. 🎯 RIESGOS Y QUICK WINS

### TOP 10 Oportunidades

| # | Oportunidad | Descripción | Impacto | Esfuerzo | Riesgo |
|---|-------------|-------------|---------|----------|--------|
| 1 | Migrar a useInfiniteQuery | Reemplazar paginación manual por infinite scroll | Alto | Medio | Bajo |
| 2 | Optimizar queryKey de filtros | Evitar JSON.stringify en queryKey | Alto | Bajo | Bajo |
| 3 | Implementar React.memo en componentes pesados | Reducir re-renders innecesarios | Medio | Bajo | Bajo |
| 4 | Agregar width/height a imágenes | Mejorar CLS (Cumulative Layout Shift) | Medio | Bajo | Bajo |
| 5 | Migrar a organización por features | Mejorar mantenibilidad | Medio | Alto | Medio |
| 6 | Implementar metadatos dinámicos | Mejorar SEO | Medio | Medio | Bajo |
| 7 | Optimizar bundle con code splitting | Reducir tamaño inicial | Medio | Medio | Bajo |
| 8 | Agregar tests de integración | Mejorar cobertura | Medio | Alto | Bajo |
| 9 | Implementar error boundaries específicos | Mejorar UX de errores | Bajo | Medio | Bajo |
| 10 | Optimizar imports | Reducir bundle size | Bajo | Bajo | Bajo |

### Refactors Seguros (Sin Cambio de Comportamiento)

1. **Ordenar imports** - Mejorar legibilidad
2. **Mover a features** - Reorganizar estructura
3. **Adaptadores de datos** - Centralizar transformaciones
4. **Lazy en rutas secundarias** - Mejorar performance
5. **Mejorar imágenes** - Agregar dimensiones
6. **Optimizar queryKeys** - Evitar serialización innecesaria
7. **Memoizar callbacks** - Reducir re-renders
8. **Centralizar configuración** - Ya implementado ✅
9. **Mejorar error handling** - Más específico
10. **Optimizar CSS** - Eliminar estilos no usados

---

## 11. ✅ CHECKLIST DE SMOKE TEST

### Pasos Mínimos para Verificar Funcionalidad

1. **Navegación Principal**
   - [ ] Ir a `/` → Home se carga
   - [ ] Ir a `/vehiculos` → Lista se carga
   - [ ] Ir a `/nosotros` → Página se carga

2. **Listado de Vehículos**
   - [ ] Grid de vehículos visible
   - [ ] Tarjetas con imágenes cargan
   - [ ] Botón "Cargar más" funciona

3. **Filtros**
   - [ ] Formulario de filtros visible
   - [ ] Seleccionar marca → Filtros se aplican
   - [ ] Botón "Limpiar filtros" funciona

4. **Detalle de Vehículo**
   - [ ] Click en "Ver más" → Navega a detalle
   - [ ] Imágenes del carrusel cargan
   - [ ] Información del vehículo visible

5. **Scroll y Navegación**
   - [ ] Scroll to top funciona
   - [ ] Navegación entre páginas fluida
   - [ ] Botón "Volver" funciona

### Rutas y Componentes Implicados
- **Rutas:** `/`, `/vehiculos`, `/vehiculo/:id`, `/nosotros`
- **Componentes:** `VehiclesList`, `AutosGrid`, `CardAuto`, `FilterFormSimplified`, `VehiculoDetalle`
- **Hooks:** `useVehiclesList`, `useFilterReducer`, `useVehicleDetail`

---

## 12. ⚠️ MAPA DE "ARCHIVOS DELICADOS"

### Archivos con Efectos Amplios

| Archivo | Razón | Impacto |
|---------|-------|---------|
| `src/config/index.js` | Configuración centralizada | Alto - Toda la app |
| `src/api/axiosInstance.js` | Cliente HTTP global | Alto - Todas las llamadas API |
| `src/hooks/vehicles/useVehiclesList.js` | Hook principal de datos | Alto - Listado de vehículos |
| `src/hooks/filters/useFilterReducer.js` | Estado de filtros | Alto - Sistema de filtros |
| `src/components/ErrorBoundary/GlobalErrorBoundary.jsx` | Manejo global de errores | Alto - Toda la app |
| `src/routes/PublicRoutes.jsx` | Rutas públicas | Alto - Navegación |
| `src/main.jsx` | Punto de entrada | Alto - Inicialización |
| `src/App.jsx` | Componente raíz | Alto - Estructura de la app |
| `src/api/vehiclesApi.js` | API de vehículos | Medio - Datos de vehículos |
| `src/hooks/useErrorHandler.js` | Hook de errores | Medio - Manejo de errores |

### Recomendaciones para Cambios
1. **Siempre testear** después de cambios en archivos delicados
2. **Cambios incrementales** en lugar de refactors grandes
3. **Mantener compatibilidad** con APIs existentes
4. **Documentar cambios** en estos archivos específicamente

---

## 📋 RESUMEN EJECUTIVO

### Estado Actual
- ✅ **Base sólida:** React + Vite + React Query bien configurado
- ✅ **Arquitectura modular:** Separación clara de responsabilidades
- ✅ **Lazy loading:** Implementado en rutas principales
- ✅ **Error handling:** Error boundaries robustos
- ⚠️ **Filtros desconectados:** UI funciona pero no se aplican a API
- ⚠️ **Paginación manual:** No usa useInfiniteQuery
- ⚠️ **Performance:** Oportunidades de optimización

### Prioridades de Refactorización
1. **Alta:** Conectar filtros a API
2. **Alta:** Migrar a useInfiniteQuery
3. **Media:** Optimizar re-renders
4. **Media:** Mejorar SEO y a11y
5. **Baja:** Reorganizar estructura

### Riesgo de Refactorización
- **Bajo:** La mayoría de cambios son optimizaciones seguras
- **Medio:** Migración a features requiere planificación
- **Alto:** Cambios en API requieren testing exhaustivo

---

**Nota:** Este informe se basa en análisis estático del código. Para métricas de performance reales, ejecutar `npm run build` y revisar el output de Vite.

