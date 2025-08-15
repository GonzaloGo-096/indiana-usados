# 📋 ANÁLISIS FUNCIONAMIENTO APLICACIÓN INDIANA USADOS

## 🏗️ ARQUITECTURA GENERAL

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PÁGINAS      │    │   COMPONENTES   │    │     HOOKS       │
│                 │    │                 │    │                 │
│ • Vehiculos    │───▶│ • VehiclesList  │───▶│ • useVehicles   │
│ • VehiculoDet  │    │ • FilterForm    │    │ • useFilters    │
│ • Home         │    │ • AutosGrid     │    │ • useError      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   SERVICIOS     │    │   UTILIDADES    │
                       │                 │    │                 │
                       │ • vehiclesApi   │    │ • formatters    │
                       │ • axiosInstance │    │ • mappers       │
                       │ • mockData      │    │ • validators    │
                       └─────────────────┘    └─────────────────┘
```

## 🚨 **LO QUE SE ROMPE (CRÍTICO)**

### 1. **FILTROS NO FUNCIONAN** ❌
- **Problema**: `FilterFormSimplified` no está conectado al hook de datos
- **Causa**: `VehiclesList.applyFilters()` solo llama `invalidateCache()` pero no pasa filtros
- **Resultado**: Los filtros se aplican en UI pero no en la API

### 2. **PAGINACIÓN ROTA** ❌
- **Problema**: `useVehiclesList` no pasa `page` ni `limit` a la API
- **Causa**: `queryFn: () => vehiclesApi.getVehicles(filters)` omite paginación
- **Resultado**: "Cargar más" siempre trae página 1, acumula duplicados

### 3. **DESINCRONIZACIÓN DE ESTADO** ❌
- **Problema**: 3 fuentes de verdad para filtros
- **Causa**: `useFilterReducer` (UI) + `react-hook-form` (form) + `useFiltersWithURL` (URL)
- **Resultado**: Estados inconsistentes, filtros no persisten

## 🔄 FLUJO PRINCIPAL (LISTADO)

```
1. Usuario navega a /vehiculos
   ↓
2. Vehiculos.jsx monta VehiclesList
   ↓
3. VehiclesList usa useVehiclesQuery()
   ↓
4. useVehiclesQuery delega a useVehiclesList
   ↓
5. useVehiclesList hace useQuery con:
    - queryKey: ['vehicles-list', filtersHash, currentPage]
    - queryFn: vehiclesApi.getVehicles(filters) ← ❌ SIN PAGINACIÓN
   ↓
6. vehiclesApi.getVehicles() decide GET vs POST:
    - Sin filtros: GET /api/vehicles?limit=6&page=1
    - Con filtros: POST /api/vehicles {filters, pagination}
   ↓
7. Mock local (getMockVehicles) aplica filtros y paginación
   ↓
8. Resultado se acumula en accumulatedVehicles[]
   ↓
9. AutosGrid renderiza tarjetas + botón "Cargar más"
```

## 🔄 FLUJO DE FILTROS (ROTO)

```
1. Usuario interactúa con FilterFormSimplified
   ↓
2. React Hook Form valida y genera objeto de filtros
   ↓
3. onSubmit() llama onApplyFilters(validData)
   ↓
4. VehiclesList.applyFilters() solo hace:
    - setIsFiltering(true)
    - invalidateCache() ← ❌ NO PASA FILTROS
    - setIsFiltering(false)
   ↓
5. invalidateCache() limpia caché pero no actualiza filtros
   ↓
6. useVehiclesList sigue con filtros anteriores
   ↓
7. API recibe filtros vacíos, devuelve todos los vehículos
```

## 📊 ESTRUCTURA DE DATOS

### **Filtros del Formulario** (español)
```javascript
{
  marca: ['Toyota', 'Honda'],
  añoDesde: 2015,
  añoHasta: 2024,
  precioDesde: 5000000,
  precioHasta: 15000000,
  combustible: ['Gasolina'],
  caja: ['Automática']
}
```

### **Filtros de la API** (inglés)
```javascript
{
  brand: ['Toyota', 'Honda'],
  yearMin: 2015,
  yearMax: 2024,
  priceMin: 5000000,
  priceMax: 15000000,
  fuel: ['Gasolina'],
  caja: ['Automática']
}
```

### **Respuesta de la API**
```javascript
{
  data: [/* array de vehículos */],
  total: 45,
  currentPage: 1,
  hasNextPage: true,
  nextPage: 2
}
```

## 🛠️ **SOLUCIONES INMEDIATAS**

### **1. Conectar Filtros al Hook**
```javascript
// En VehiclesList.jsx
const [activeFilters, setActiveFilters] = useState({})

const applyFilters = useCallback(async (filters) => {
  setActiveFilters(filters) // ✅ ACTUALIZAR ESTADO
  invalidateCache()
}, [invalidateCache])

// Pasar filtros al hook
const vehiclesData = useVehiclesQuery(activeFilters)
```

### **2. Corregir Paginación**
```javascript
// En useVehiclesList.js
const query = useQuery({
  queryKey: ['vehicles-list', filtersHash, currentPage],
  queryFn: () => vehiclesApi.getVehicles({ 
    filters,           // ✅ PASAR FILTROS
    page: currentPage, // ✅ PASAR PÁGINA
    limit: 6          // ✅ PASAR LÍMITE
  }),
  // ... resto de opciones
})
```

### **3. Unificar Estado de Filtros**
```javascript
// Usar solo useFiltersWithURL como fuente de verdad
const { filters, updateFilters } = useFiltersWithURL()

// En FilterFormSimplified
const onSubmit = async (data) => {
  const normalizedFilters = normalizeFilters(data) // español → inglés
  updateFilters(normalizedFilters)
  onApplyFilters(normalizedFilters)
}
```

## 📈 **PUNTOS FUERTES**

✅ **Arquitectura modular** - Separación clara de responsabilidades  
✅ **React Query bien implementado** - Caching, retry, error handling  
✅ **Mock local funcional** - Desarrollo sin backend  
✅ **Componentes optimizados** - memo, useMemo, useCallback  
✅ **Error boundaries** - Manejo robusto de errores  
✅ **Lazy loading** - Code splitting automático  

## ⚠️ **ADVERTENCIAS**

- **Cache agresivo**: `removeQueries` puede generar parpadeos
- **Event listeners**: Scroll throttling en filtros móviles puede acumularse
- **Validación**: No hay validación de esquemas de filtros
- **Testing**: Falta cobertura de tests de integración

## 🎯 **PRIORIDADES DE REPARACIÓN**

1. **ALTA**: Conectar filtros al hook de datos
2. **ALTA**: Corregir paginación en API calls
3. **MEDIA**: Unificar estado de filtros
4. **MEDIA**: Normalizar esquema de filtros
5. **BAJA**: Migrar a useInfiniteQuery

## 🔧 **ESTADO ACTUAL**

- **Listado básico**: ✅ FUNCIONA
- **Filtros UI**: ✅ FUNCIONA
- **Filtros API**: ❌ NO FUNCIONA
- **Paginación**: ❌ NO FUNCIONA
- **Cache**: ✅ FUNCIONA
- **Error handling**: ✅ FUNCIONA
- **Mock data**: ✅ FUNCIONA

---

**Conclusión**: La aplicación tiene una base sólida pero los filtros y paginación están desconectados. Con las 3 correcciones principales, funcionará completamente. 