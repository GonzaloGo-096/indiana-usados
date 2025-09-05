# ANÁLISIS COMPLETO: SISTEMA DE NAVEGACIÓN, PAGINACIÓN Y FLUJO PRINCIPAL
## Aplicación Indiana Usados - React + Vite

---

## 📋 TABLA DE CONTENIDOS

1. [ARQUITECTURA GENERAL](#arquitectura-general)
2. [SISTEMA DE RUTAS](#sistema-de-rutas)
3. [FLUJO PRINCIPAL DE NAVEGACIÓN](#flujo-principal-de-navegación)
4. [SISTEMA DE PAGINACIÓN](#sistema-de-paginación)
5. [GESTIÓN DE ESTADO Y CACHE](#gestión-de-estado-y-cache)
6. [COMPONENTES CLAVE](#componentes-clave)
7. [HOOKS PERSONALIZADOS](#hooks-personalizados)
8. [API Y COMUNICACIÓN BACKEND](#api-y-comunicación-backend)
9. [OPTIMIZACIONES DE PERFORMANCE](#optimizaciones-de-performance)
10. [FLUJO COMPLETO DE USUARIO](#flujo-completo-de-usuario)

---

## 🏗️ ARQUITECTURA GENERAL

### Estructura de la Aplicación
```
App.jsx (Componente Raíz)
├── Router (React Router v6)
├── PublicRoutes (Rutas Públicas)
│   ├── Home (/)
│   ├── Vehiculos (/vehiculos)
│   ├── VehiculoDetalle (/vehiculo/:id)
│   └── Nosotros (/nosotros)
└── AdminRoutes (Rutas Administrativas)
    └── /admin/*
```

### Tecnologías Principales
- **React 18** con Hooks y Suspense
- **React Router v6** para navegación
- **TanStack Query** para gestión de estado del servidor
- **CSS Modules** para estilos
- **Axios** para comunicación HTTP
- **Vite** como bundler

---

## 🛣️ SISTEMA DE RUTAS

### Configuración Principal (App.jsx)
```jsx
<Router future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true
}}>
    <Routes>
        {/* Rutas públicas con lazy loading */}
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Rutas administrativas protegidas */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
</Router>
```

### Rutas Públicas (PublicRoutes.jsx)
```jsx
const PublicRoutes = () => (
    <>
        <Nav />
        <main className="main-content">
            <Suspense fallback={<PageLoading />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vehiculos" element={<Vehiculos />} />
                    <Route path="/vehiculo/:id" element={<VehiculoDetalle />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                </Routes>
            </Suspense>
        </main>
        <Footer />
    </>
)
```

**Características:**
- ✅ **Lazy Loading** implementado con Suspense
- ✅ **Layout consistente** (Nav + Footer)
- ✅ **Fallback de carga** para mejor UX
- ✅ **Rutas parametrizadas** para IDs dinámicos

---

## 🔄 FLUJO PRINCIPAL DE NAVEGACIÓN

### 1. Navegación a Lista de Vehículos
```
Usuario → /vehiculos → Vehiculos.jsx → VehiclesList → AutosGrid → CardAuto
```

**Componentes involucrados:**
- `Vehiculos.jsx` - Página contenedora
- `VehiclesList.jsx` - Lista principal con filtros
- `AutosGrid.jsx` - Grid responsivo de vehículos
- `CardAuto.jsx` - Tarjeta individual de vehículo

### 2. Navegación a Detalle de Vehículo
```
CardAuto → handleVerMas() → API Call → navigate() → VehiculoDetalle
```

**Flujo detallado:**
```jsx
const handleVerMas = useCallback(async () => {
    // 1. Obtener ID del vehículo
    const vehicleId = auto.id || auto._id
    
    // 2. Hacer API call para obtener datos completos
    const response = await axiosInstance.get(`/photos/getonephoto/${vehicleId}`)
    
    // 3. Extraer datos de la respuesta
    let vehicleData = response.data
    if (response.data?.getOnePhoto) {
        vehicleData = response.data.getOnePhoto
    }
    
    // 4. Navegar con datos en el state
    navigate(`/vehiculo/${vehicleId}`, { 
        state: { vehicleData: vehicleData }
    })
}, [auto, navigate])
```

### 3. Navegación de Retorno
```
VehiculoDetalle → handleBack() → navigateWithScroll() → /vehiculos
```

**Preservación de scroll:**
```jsx
const { navigateWithScroll } = useScrollPosition({
    key: 'vehicles-list',
    enabled: true
})

const handleBack = () => {
    navigateWithScroll('/vehiculos')
}
```

---

## 📄 SISTEMA DE PAGINACIÓN

### Arquitectura de Paginación

#### 1. **Paginación por Cursor (Backend)**
```jsx
// Parámetros de paginación
{
    limit: 50,           // Vehículos por página
    cursor: "lastId",    // ID del último vehículo de la página anterior
    filters: {}          // Filtros aplicados
}
```

#### 2. **Hook Unificado (useVehiclesList.js)**
```jsx
export const useVehiclesList = (filters = {}, options = {}) => {
    // Estado local para acumular vehículos
    const [accumulatedVehicles, setAccumulatedVehicles] = useState([])
    const [currentCursor, setCurrentCursor] = useState(null)
    const [hasMoreData, setHasMoreData] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    
    // Query principal con React Query
    const query = useQuery({
        queryKey: ['vehicles-list', filtersHash, currentCursor],
        queryFn: () => vehiclesApi.getVehicles({ 
            ...filters, 
            cursor: currentCursor, 
            limit: 50 
        }),
        // ... configuración adicional
    })
}
```

#### 3. **Mecanismo de "Cargar Más"**
```jsx
const loadMore = useCallback(async () => {
    if (!hasMoreData || isLoadingMore || query.isFetching) {
        return
    }

    setIsLoadingMore(true)
    try {
        // Obtener cursor del último vehículo
        const lastVehicle = accumulatedVehicles[accumulatedVehicles.length - 1]
        const nextCursor = lastVehicle?._id || lastVehicle?.id || null
        
        if (nextCursor) {
            setCurrentCursor(nextCursor)
            // La query se ejecuta automáticamente con nuevo cursor
            await query.refetch()
        }
    } catch (error) {
        console.error('Error al cargar más vehículos:', error)
        setCurrentCursor(null)
    } finally {
        setIsLoadingMore(false)
    }
}, [hasMoreData, isLoadingMore, query.isFetching, accumulatedVehicles, query.refetch])
```

#### 4. **Acumulación de Datos**
```jsx
React.useEffect(() => {
    if (!query.data) return
    
    if (query.data?.allPhotos?.docs && Array.isArray(query.data.allPhotos.docs)) {
        const backendData = query.data.allPhotos
        
        if (!currentCursor) {
            // Primera carga: reemplazar lista
            setAccumulatedVehicles(backendData.docs)
            setHasMoreData(backendData.hasNextPage || false)
        } else {
            // Cargar más: acumular vehículos
            setAccumulatedVehicles(prev => [...prev, ...backendData.docs])
            setHasMoreData(backendData.hasNextPage || false)
        }
    }
}, [query.data])
```

### Implementación en la UI (AutosGrid.jsx)
```jsx
{/* Botón "Cargar más" */}
{hasNextPage && (
    <div className={styles.loadMoreSection}>
        <button 
            className={styles.loadMoreButton}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
        >
            {isLoadingMore ? 'Cargando...' : 'Cargar más vehículos'}
        </button>
    </div>
)}
```

---

## 🗄️ GESTIÓN DE ESTADO Y CACHE

### 1. **React Query (TanStack Query)**
```jsx
// Configuración del hook
const query = useQuery({
    queryKey: ['vehicles-list', filtersHash, currentCursor],
    queryFn: () => vehiclesApi.getVehicles({ ...filters, cursor: currentCursor, limit: 50 }),
    enabled,
    staleTime: hasActiveFilters ? 1000 * 60 * 2 : 1000 * 60 * 10, // Cache inteligente
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
})
```

### 2. **Cache Invalidation para Filtros**
```jsx
const invalidateCache = useCallback(() => {
    // Limpiar cache anterior
    queryClient.removeQueries(['vehicles-list'])
    // Resetear estado local
    setAccumulatedVehicles([])
    setCurrentCursor(null)
    setIsLoadingMore(false)
    // Forzar nueva query
    query.refetch()
}, [queryClient, query.refetch])
```

### 3. **Hash de Filtros para Cache Consistente**
```jsx
const filtersHash = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) {
        return 'no-filters'
    }
    return JSON.stringify(filters, Object.keys(filters).sort())
}, [filters])
```

---

## 🧩 COMPONENTES CLAVE

### 1. **VehiclesList.jsx** - Orquestador Principal
```jsx
const VehiclesList = memo(() => {
    // Hook unificado para datos
    const {
        vehicles,
        isLoading,
        isError,
        error,
        hasNextPage,
        isLoadingMore,
        loadMore,
        refetch,
        invalidateCache
    } = useVehiclesQuery()
    
    // Manejo de filtros
    const applyFilters = useCallback(async (filters) => {
        setIsFiltering(true)
        clearError()
        try {
            invalidateCache()
        } catch (error) {
            handleError(error, 'apply-filters')
            throw error
        } finally {
            setIsFiltering(false)
        }
    }, [invalidateCache, handleError, clearError])
    
    return (
        <VehiclesErrorBoundary>
            <FilterFormSimplified {...filterFormProps} />
            <AutosGrid {...autosGridProps} />
            <ScrollToTop />
        </VehiclesErrorBoundary>
    )
})
```

### 2. **AutosGrid.jsx** - Grid Responsivo
```jsx
const AutosGrid = memo(({ 
    vehicles, 
    isLoading, 
    isError, 
    error, 
    onRetry,
    hasNextPage = false,
    isLoadingMore = false,
    onLoadMore = null
}) => {
    // Memoización del grid para performance
    const vehiclesGrid = useMemo(() => {
        if (!vehicles || vehicles.length === 0) return null
        
        return vehicles.map((vehicle, index) => {
            const stableKey = vehicle.id ? `vehicle-${vehicle.id}` : `vehicle-index-${index}`
            return (
                <MemoizedCardAuto 
                    key={stableKey}
                    vehicle={vehicle}
                />
            )
        })
    }, [vehicles])
    
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {vehiclesGrid}
            </div>
            {hasNextPage && (
                <div className={styles.loadMoreSection}>
                    <button onClick={handleLoadMore} disabled={isLoadingMore}>
                        {isLoadingMore ? 'Cargando...' : 'Cargar más vehículos'}
                    </button>
                </div>
            )}
        </div>
    )
})
```

### 3. **CardAuto.jsx** - Tarjeta Individual
```jsx
export const CardAuto = memo(({ auto }) => {
    const navigate = useNavigate()
    
    // Función de navegación optimizada
    const handleVerMas = useCallback(async () => {
        try {
            const vehicleId = auto.id || auto._id
            const response = await axiosInstance.get(`/photos/getonephoto/${vehicleId}`)
            
            let vehicleData = response.data
            if (response.data?.getOnePhoto) {
                vehicleData = response.data.getOnePhoto
            }
            
            navigate(`/vehiculo/${vehicleId}`, { 
                state: { vehicleData: vehicleData }
            })
        } catch (error) {
            // Fallback: navegar con datos básicos
            const vehicleId = auto.id || auto._id
            navigate(`/vehiculo/${vehicleId}`, { 
                state: { vehicleData: auto }
            })
        }
    }, [auto, navigate])
    
    return (
        <div className={styles.card} data-testid="vehicle-card">
            {/* Imagen con lazy loading */}
            <img 
                src={auto.imagen || auto.fotoFrontal?.url || '/src/assets/auto1.jpg'} 
                alt={altText}
                loading="lazy"
                decoding="async"
            />
            
            {/* Contenido de la tarjeta */}
            <div className={styles['card__body']}>
                {/* Header con marca, modelo y precio */}
                {/* Detalles del vehículo */}
                {/* Botón de navegación */}
            </div>
        </div>
    )
})
```

---

## 🪝 HOOKS PERSONALIZADOS

### 1. **useVehiclesQuery.js** - Hook Unificador
```jsx
export const useVehiclesQuery = (filters = {}, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 5,
        gcTime = 1000 * 60 * 30,
        retry = 2,
        refetchOnWindowFocus = false,
        maxPages = 3,
        useInfiniteScroll = true,
        id = null
    } = options

    // Si se proporciona ID, usar hook de detalle
    if (id) {
        return useVehicleDetail(id, { enabled, staleTime, gcTime, retry, refetchOnWindowFocus })
    }

    // Usar hook unificado para listas
    return useVehiclesList(filters, { enabled, staleTime, gcTime, retry, refetchOnWindowFocus })
}
```

### 2. **useVehiclesList.js** - Hook de Lista
```jsx
export const useVehiclesList = (filters = {}, options = {}) => {
    // Estado local para acumulación
    const [accumulatedVehicles, setAccumulatedVehicles] = useState([])
    const [currentCursor, setCurrentCursor] = useState(null)
    const [hasMoreData, setHasMoreData] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    
    // Query principal con React Query
    const query = useQuery({
        queryKey: ['vehicles-list', filtersHash, currentCursor],
        queryFn: () => vehiclesApi.getVehicles({ ...filters, cursor: currentCursor, limit: 50 }),
        // ... configuración
    })
    
    // Funciones de paginación
    const loadMore = useCallback(async () => { /* ... */ })
    const invalidateCache = useCallback(() => { /* ... */ })
    const resetToFirstPage = useCallback(() => { /* ... */ })
    
    return {
        vehicles: accumulatedVehicles,
        total: query.data?.total || 0,
        currentCursor,
        hasNextPage: hasMoreData,
        isLoading: query.isLoading && !currentCursor,
        isLoadingMore,
        isError: query.isError,
        error: query.error,
        loadMore,
        clearCache,
        invalidateCache,
        resetToFirstPage
    }
}
```

### 3. **useScrollPosition.js** - Preservación de Scroll
```jsx
export const useScrollPosition = ({ key, enabled = true }) => {
    const navigateWithScroll = useCallback((to) => {
        // Guardar posición actual
        const currentPosition = window.scrollY
        sessionStorage.setItem(`scroll-${key}`, currentPosition.toString())
        
        // Navegar
        navigate(to)
    }, [key, navigate])
    
    const restoreScrollPosition = useCallback(() => {
        const savedPosition = sessionStorage.getItem(`scroll-${key}`)
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition))
        }
    }, [key])
    
    return { navigateWithScroll, restoreScrollPosition }
}
```

---

## 🌐 API Y COMUNICACIÓN BACKEND

### 1. **Configuración de Axios**
```jsx
// axiosInstance.js
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})
```

### 2. **Endpoints Principales**
```jsx
// vehiclesApi.js
class VehiclesApiService {
    // Obtener vehículos principales (sin filtros)
    async getVehiclesMain({ limit = 6, cursor = null } = {}) {
        const response = await axiosInstance.get('/photos/getallphotos', {
            params: { limit, ...(cursor && { cursor }) }
        })
        return response.data
    }
    
    // Obtener vehículos con filtros
    async getVehiclesWithFilters({ limit = 6, cursor = null, filters = {} } = {}) {
        const response = await axiosInstance.post('/photos/getallphotos', {
            filters,
            pagination: { limit, ...(cursor && { cursor }) }
        })
        return response.data
    }
    
    // Obtener vehículo por ID
    async getVehicleById(id) {
        const response = await detailAxiosInstance.get(`/photos/getonephoto/${id}`)
        return response.data
    }
    
    // Método unificado
    async getVehicles({ limit = 6, cursor = null, filters = {} } = {}) {
        if (Object.keys(filters).length === 0) {
            return this.getVehiclesMain({ limit, cursor })
        } else {
            return this.getVehiclesWithFilters({ limit, cursor, filters })
        }
    }
}
```

### 3. **Estructura de Respuesta del Backend**
```json
{
    "allPhotos": {
        "docs": [
            {
                "_id": "vehicle_id",
                "marca": "Toyota",
                "modelo": "Corolla",
                "precio": 25000,
                "anio": 2020,
                "kilometraje": 50000,
                "caja": "Automática",
                "fotoFrontal": { "url": "image_url" }
            }
        ],
        "hasNextPage": true,
        "totalDocs": 150
    }
}
```

---

## ⚡ OPTIMIZACIONES DE PERFORMANCE

### 1. **Memoización de Componentes**
```jsx
// Componentes memoizados para evitar re-renders innecesarios
export const CardAuto = memo(({ auto }) => { /* ... */ })
export const AutosGrid = memo(({ vehicles, ... }) => { /* ... */ })
export const VehiclesList = memo(() => { /* ... */ })
```

### 2. **Memoización de Funciones y Datos**
```jsx
// Callbacks memoizados
const handleVerMas = useCallback(async () => { /* ... */ }, [auto, navigate])
const applyFilters = useCallback(async (filters) => { /* ... */ }, [invalidateCache, handleError, clearError])

// Datos memoizados
const formattedData = useMemo(() => ({
    price: formatPrice(auto.precio),
    kilometers: formatKilometraje(auto.kilometraje || auto.kms),
    year: formatYear(auto.anio || auto.año),
    caja: formatCaja(auto.caja),
    brandModel: formatBrandModel(auto.marca, auto.modelo)
}), [auto.precio, auto.kilometraje, auto.kms, auto.anio, auto.año, auto.caja, auto.marca, auto.modelo])
```

### 3. **Lazy Loading de Imágenes**
```jsx
<img 
    src={auto.imagen || auto.fotoFrontal?.url || '/src/assets/auto1.jpg'} 
    alt={altText}
    loading="lazy"
    decoding="async"
/>
```

### 4. **Code Splitting con Suspense**
```jsx
// Lazy loading de páginas
const Home = lazy(() => import('../pages/Home/Home'))
const Vehiculos = lazy(() => import('../pages/Vehiculos'))
const VehiculoDetalle = lazy(() => import('../pages/VehiculoDetalle'))
const Nosotros = lazy(() => import('../pages/Nosotros'))

// Suspense wrapper
<Suspense fallback={<PageLoading />}>
    <Routes>
        {/* ... rutas */}
    </Routes>
</Suspense>
```

---

## 🔄 FLUJO COMPLETO DE USUARIO

### Escenario 1: Navegación Completa
```
1. Usuario accede a /vehiculos
   ↓
2. Vehiculos.jsx se monta
   ↓
3. VehiclesList se renderiza
   ↓
4. useVehiclesQuery se ejecuta
   ↓
5. API call a /photos/getallphotos
   ↓
6. Datos se almacenan en accumulatedVehicles
   ↓
7. AutosGrid renderiza CardAuto components
   ↓
8. Usuario hace scroll y ve botón "Cargar más"
   ↓
9. Click en "Cargar más" → loadMore()
   ↓
10. Se obtiene cursor del último vehículo
   ↓
11. Nueva API call con cursor
   ↓
12. Nuevos vehículos se acumulan a la lista
   ↓
13. UI se actualiza automáticamente
```

### Escenario 2: Navegación a Detalle
```
1. Usuario hace click en "Ver más" en CardAuto
   ↓
2. handleVerMas() se ejecuta
   ↓
3. API call a /photos/getonephoto/{id}
   ↓
4. Datos completos se obtienen del backend
   ↓
5. navigate() se ejecuta con datos en state
   ↓
6. VehiculoDetalle se monta
   ↓
7. Datos del state se usan (evita API call adicional)
   ↓
8. Usuario ve información completa del vehículo
   ↓
9. Usuario hace click en "Atrás"
   ↓
10. navigateWithScroll() preserva posición de scroll
   ↓
11. Usuario regresa a /vehiculos en la misma posición
```

### Escenario 3: Aplicación de Filtros
```
1. Usuario modifica filtros en FilterFormSimplified
   ↓
2. applyFilters() se ejecuta
   ↓
3. invalidateCache() limpia cache anterior
   ↓
4. Estado local se resetea (accumulatedVehicles = [])
   ↓
5. Nueva query se ejecuta con filtros
   ↓
6. Backend procesa filtros y retorna resultados
   ↓
7. Datos filtrados se almacenan en accumulatedVehicles
   ↓
8. UI se actualiza mostrando solo vehículos filtrados
   ↓
9. Paginación se reinicia (cursor = null)
```

---

## 🔧 CONFIGURACIÓN Y VARIABLES DE ENTORNO

### Variables de Entorno
```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_DETAIL_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

### Configuración de Desarrollo vs Producción
```jsx
const IS_DEVELOPMENT = import.meta.env.DEV

if (IS_DEVELOPMENT) {
    console.log('🔧 CONFIGURACIÓN VEHICLES API:', {
        environment: import.meta.env.MODE
    })
}
```

---

## 📊 MÉTRICAS Y MONITOREO

### Logging de Debug
```jsx
// En desarrollo, logging detallado para debugging
console.log('🔍 HOOK DEBUG - query.data recibido:', query.data)
console.log('🔍 HOOK DEBUG - Respuesta del backend detectada:', {
    totalDocs: backendData.docs.length,
    firstVehicle: backendData.docs[0],
    hasNextPage: backendData.hasNextPage,
    fuente: 'BACKEND REAL - MongoDB',
    timestamp: new Date().toISOString()
})
```

### Estados de Carga
```jsx
// Estados disponibles para UI
{
    isLoading: query.isLoading && !currentCursor,    // Solo loading inicial
    isLoadingMore,                                   // Loading de paginación
    isError: query.isError,                          // Error general
    isFetching: query.isFetching,                    // Fetching en progreso
    hasNextPage: hasMoreData                         // Si hay más páginas
}
```

---

## 🚀 CONSIDERACIONES PARA IMPLEMENTACIÓN FUTURA

### 1. **Optimizaciones Adicionales**
- Implementar virtualización para listas muy largas
- Agregar prefetch de datos para navegación
- Implementar service worker para cache offline

### 2. **Escalabilidad**
- El sistema de cursor permite manejar millones de registros
- La acumulación local está limitada a 3 páginas por defecto
- Los filtros se aplican en el backend para mejor performance

### 3. **Mantenibilidad**
- Hooks separados por responsabilidad
- Componentes memoizados para performance
- Error boundaries robustos
- Logging detallado para debugging

---

## 📝 RESUMEN TÉCNICO

### **Arquitectura de Navegación:**
- React Router v6 con lazy loading
- Rutas anidadas y parametrizadas
- Preservación de estado entre navegaciones

### **Sistema de Paginación:**
- Paginación por cursor (backend-driven)
- Acumulación local de datos
- Botón "Cargar más" con estados de loading
- Cache inteligente con React Query

### **Flujo de Datos:**
- Hooks unificados para gestión de estado
- API calls optimizados con fallbacks
- Preservación de scroll entre navegaciones
- Manejo robusto de errores

### **Performance:**
- Componentes memoizados
- Lazy loading de imágenes y páginas
- Code splitting automático
- Cache inteligente por filtros

---

## 🎯 USO PARA PROMPTEAR IA

Este documento proporciona una comprensión completa de:

1. **Arquitectura del sistema** - Para análisis estructural
2. **Flujos de navegación** - Para entender el comportamiento
3. **Implementación técnica** - Para debugging y mejoras
4. **Patrones de diseño** - Para replicar en otros proyectos
5. **Optimizaciones** - Para mejorar performance

**Puedes usar este documento para:**
- Analizar problemas de navegación
- Optimizar el sistema de paginación
- Implementar nuevas funcionalidades
- Debugging de issues
- Refactoring del código
- Análisis de performance
- Planificación de features

---

*Documento generado para análisis técnico de la aplicación Indiana Usados*
*Versión: 1.0.0 | Fecha: 2024*
