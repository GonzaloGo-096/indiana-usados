# Guía de Uso y Modificación del Sistema Actual - Indiana Usados

## 🎯 Descripción
Guía práctica para usar, entender y modificar el sistema actual con el reducer expandido. Incluye ejemplos prácticos y mejores prácticas.

---

## 🚀 Cómo Usar el Sistema Actual

### **1. Importar y Usar el Reducer**
```javascript
import { useFilterReducer } from '../hooks/filters/useFilterReducer'

const MiComponente = () => {
  const {
    // Estados
    currentFilters,
    pendingFilters,
    isLoading,
    isError,
    error,
    isSubmitting,
    isDrawerOpen,
    
    // Acciones
    setPendingFilters,
    applyFilters,
    clearFilters,
    setLoading,
    setError,
    clearError,
    setSubmitting,
    toggleDrawer,
    closeDrawer
  } = useFilterReducer()
  
  // Usar los estados y acciones...
}
```

### **2. Aplicar Filtros**
```javascript
const handleApplyFilters = async (filters) => {
  // 1. Establecer filtros pendientes
  setPendingFilters(filters)
  
  // 2. Mostrar loading
  setLoading(true)
  clearError()
  
  try {
    // 3. Llamar al servicio
    await autoService.applyFilters(filters)
    
    // 4. Aplicar filtros (mover pending → current)
    applyFilters()
    
  } catch (error) {
    // 5. Manejar error
    setError(error.message)
  } finally {
    // 6. Ocultar loading
    setLoading(false)
  }
}
```

### **3. Mostrar Estados en UI**
```javascript
return (
  <div>
    {/* Mostrar loading */}
    {isLoading && <div>Cargando...</div>}
    
    {/* Mostrar error */}
    {isError && error && (
      <div className="error">
        Error: {error}
        <button onClick={clearError}>Cerrar</button>
      </div>
    )}
    
    {/* Botón con estado de submit */}
    <button 
      disabled={isSubmitting || isLoading}
      onClick={handleApplyFilters}
    >
      {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
    </button>
    
    {/* Mostrar filtros actuales */}
    <div>
      Filtros aplicados: {JSON.stringify(currentFilters)}
    </div>
  </div>
)
```

---

## 🔧 Cómo Modificar el Sistema

### **1. Agregar Nuevos Estados**

#### **Paso 1: Actualizar Estado Inicial**
```javascript
// En useFilterReducer.js
const initialState = {
  // Estados existentes...
  isSubmitting: false,
  isDrawerOpen: false,
  currentFilters: {},
  pendingFilters: {},
  isLoading: false,
  isError: false,
  error: null,
  
  // NUEVO: Agregar estado
  isRefreshing: false,        // Nuevo estado
  lastUpdate: null           // Nuevo estado
}
```

#### **Paso 2: Agregar Nueva Acción**
```javascript
const ACTIONS = {
  // Acciones existentes...
  SET_SUBMITTING: 'SET_SUBMITTING',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  
  // NUEVA: Agregar acción
  SET_REFRESHING: 'SET_REFRESHING',
  SET_LAST_UPDATE: 'SET_LAST_UPDATE'
}
```

#### **Paso 3: Actualizar Reducer**
```javascript
const filterReducer = (state, action) => {
  switch (action.type) {
    // Casos existentes...
    
    // NUEVO: Agregar caso
    case ACTIONS.SET_REFRESHING:
      return {
        ...state,
        isRefreshing: action.payload
      }
      
    case ACTIONS.SET_LAST_UPDATE:
      return {
        ...state,
        lastUpdate: action.payload
      }
      
    default:
      return state
  }
}
```

#### **Paso 4: Agregar Action Creator**
```javascript
const setRefreshing = useCallback((isRefreshing) => {
  dispatch({ type: ACTIONS.SET_REFRESHING, payload: isRefreshing })
}, [dispatch])

const setLastUpdate = useCallback((timestamp) => {
  dispatch({ type: ACTIONS.SET_LAST_UPDATE, payload: timestamp })
}, [dispatch])
```

#### **Paso 5: Exportar en Hook**
```javascript
return {
  // Estados existentes...
  isRefreshing,
  lastUpdate,
  
  // Acciones existentes...
  setRefreshing,
  setLastUpdate
}
```

### **2. Agregar Nuevas Funcionalidades**

#### **Ejemplo: Persistencia en localStorage**
```javascript
// En useFilterReducer.js
const useFilterReducer = () => {
  const [state, dispatch] = useReducer(filterReducer, initialState, () => {
    // Intentar cargar desde localStorage
    const saved = localStorage.getItem('filterState')
    return saved ? JSON.parse(saved) : initialState
  })
  
  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('filterState', JSON.stringify(state))
  }, [state])
  
  // ... resto del hook
}
```

#### **Ejemplo: Analytics de Uso**
```javascript
const applyFilters = useCallback(() => {
  dispatch({ type: ACTIONS.APPLY_FILTERS })
  
  // NUEVO: Analytics
  analytics.track('filters_applied', {
    filters: state.pendingFilters,
    timestamp: Date.now()
  })
}, [dispatch, state.pendingFilters])
```

---

## 🎨 Patrones de Uso Recomendados

### **1. Separación de Responsabilidades**
```javascript
// ✅ BIEN: Separar lógica
const useFilterLogic = () => {
  const filterState = useFilterReducer()
  const { data, isLoading } = useGetCars(filterState.currentFilters)
  
  return {
    ...filterState,
    cars: data,
    isDataLoading: isLoading
  }
}

// ❌ MAL: Todo mezclado
const useFilterLogic = () => {
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // ... más useState mezclados
}
```

### **2. Manejo de Errores**
```javascript
// ✅ BIEN: Manejo centralizado
const handleError = (error) => {
  setError(error.message)
  console.error('Filter error:', error)
  // Opcional: enviar a servicio de monitoreo
  errorReporting.captureException(error)
}

// ❌ MAL: Manejo disperso
const handleError = (error) => {
  console.log(error) // Solo log
}
```

### **3. Optimización de Performance**
```javascript
// ✅ BIEN: Memoización
const memoizedFilters = useMemo(() => {
  return processFilters(currentFilters)
}, [currentFilters])

// ✅ BIEN: Callbacks memoizados
const handleFilterChange = useCallback((newFilters) => {
  setPendingFilters(newFilters)
}, [setPendingFilters])

// ❌ MAL: Sin memoización
const handleFilterChange = (newFilters) => {
  setPendingFilters(newFilters) // Se recrea en cada render
}
```

---

## 🧪 Testing del Sistema

### **1. Test del Reducer**
```javascript
import { renderHook, act } from '@testing-library/react'
import { useFilterReducer } from './useFilterReducer'

describe('useFilterReducer', () => {
  test('estado inicial correcto', () => {
    const { result } = renderHook(() => useFilterReducer())
    
    expect(result.current.currentFilters).toEqual({})
    expect(result.current.pendingFilters).toEqual({})
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })
  
  test('aplicar filtros', () => {
    const { result } = renderHook(() => useFilterReducer())
    
    act(() => {
      result.current.setPendingFilters({ marca: ['Toyota'] })
      result.current.applyFilters()
    })
    
    expect(result.current.currentFilters).toEqual({ marca: ['Toyota'] })
    expect(result.current.pendingFilters).toEqual({})
  })
})
```

### **2. Test de Integración**
```javascript
test('flujo completo de filtros', async () => {
  const { result } = renderHook(() => useFilterLogic())
  
  // Simular aplicación de filtros
  await act(async () => {
    await result.current.handleApplyFilters({ marca: ['Toyota'] })
  })
  
  expect(result.current.currentFilters).toEqual({ marca: ['Toyota'] })
  expect(result.current.isLoading).toBe(false)
})
```

---

## 🚀 Mejoras Futuras

### **1. Persistencia Avanzada**
- Guardar filtros en localStorage
- Sincronizar entre pestañas
- Restaurar estado al recargar

### **2. Analytics y Monitoreo**
- Trackear uso de filtros
- Medir performance
- Detectar errores

### **3. Optimizaciones**
- Debounce en cambios de filtros
- Cache inteligente
- Lazy loading de opciones

### **4. UX Mejoras**
- Filtros favoritos
- Historial de búsquedas
- Sugerencias inteligentes

---

## 📋 Checklist de Implementación

### **Para Nuevas Funcionalidades:**
- [ ] Actualizar estado inicial
- [ ] Agregar acciones
- [ ] Implementar reducer
- [ ] Crear action creators
- [ ] Exportar en hook
- [ ] Actualizar documentación
- [ ] Escribir tests
- [ ] Probar integración

### **Para Modificaciones:**
- [ ] Verificar compatibilidad
- [ ] Actualizar dependencias
- [ ] Migrar datos si es necesario
- [ ] Actualizar tests
- [ ] Documentar cambios

---

*Esta guía te permite usar y modificar el sistema de manera eficiente y mantenible.* 