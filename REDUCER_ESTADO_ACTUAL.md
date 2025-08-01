# Estado Actual del Reducer Expandido - Indiana Usados

## 🎯 Descripción
Documentación actualizada del `useFilterReducer` después de la expansión para manejar estados complejos y relacionados. El reducer ahora actúa como el "cerebro centralizado" del sistema de filtros.

---

## 📊 Estado Actual del Reducer

### **Estado Inicial Completo**
```javascript
const initialState = {
  // Estados UI
  isSubmitting: false,      // Formulario en proceso de envío
  isDrawerOpen: false,      // Drawer móvil abierto/cerrado
  
  // Estados de Filtros
  currentFilters: {},       // Filtros actualmente aplicados
  pendingFilters: {},       // Filtros pendientes de aplicar
  
  // Estados de Operación
  isLoading: false,         // Cargando datos
  isError: false,           // Error en operación
  error: null              // Mensaje de error específico
}
```

### **Acciones Disponibles**
```javascript
const ACTIONS = {
  // Estados UI
  SET_SUBMITTING: 'SET_SUBMITTING',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  
  // Estados de Filtros
  SET_PENDING_FILTERS: 'SET_PENDING_FILTERS',
  APPLY_FILTERS: 'APPLY_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  
  // Estados de Operación
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}
```

---

## 🔄 Flujo de Datos Actualizado

### **1. Aplicación de Filtros**
```javascript
// Usuario interactúa con el formulario
setPendingFilters({ marca: ['Toyota'], precioDesde: 5000000 })

// Usuario hace submit
applyFilters() // Mueve pendingFilters → currentFilters

// Resultado:
// currentFilters: { marca: ['Toyota'], precioDesde: 5000000 }
// pendingFilters: {}
// isSubmitting: false
```

### **2. Manejo de Errores**
```javascript
// Error en la aplicación de filtros
setError('Error al conectar con el servidor')

// Limpiar error
clearError()

// Resultado:
// isError: false
// error: null
```

### **3. Estados de Carga**
```javascript
// Iniciar carga
setLoading(true)

// Finalizar carga
setLoading(false)

// Resultado:
// isLoading: false
```

---

## 🎛️ Uso en Componentes

### **En FilterFormSimplified**
```javascript
const {
  // Estados
  isSubmitting,
  isDrawerOpen,
  isError,
  error,
  
  // Acciones
  setSubmitting,
  toggleDrawer,
  closeDrawer
} = useFilterReducer()

// Mostrar error si existe
{isError && error && (
  <div className={styles.errorMessage}>
    Error: {error}
  </div>
)}

// Deshabilitar botón durante submit
<button disabled={isSubmitting}>
  {isSubmitting ? 'Aplicando...' : 'Aplicar'}
</button>
```

### **En useFilterSystem**
```javascript
const {
  // Estados de filtros
  currentFilters,
  pendingFilters,
  isLoading,
  isError,
  error,
  
  // Acciones
  setPendingFilters,
  applyFilters,
  clearFilters,
  setLoading,
  setError,
  clearError
} = useFilterReducer()

// Aplicar filtros con manejo de errores
const applyFiltersMutation = useMutation({
  mutationFn: async (filters) => {
    setLoading(true)
    clearError()
    
    try {
      await autoService.applyFilters(filters)
      applyFilters() // Mueve pendingFilters → currentFilters
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }
})
```

---

## 🏗️ Arquitectura Híbrida Actual

### **Separación de Responsabilidades**

1. **useFilterReducer** (Estado Complejo)
   - Estados relacionados y dependientes
   - Transiciones de estado complejas
   - UI states y filter states

2. **useState** (Estado Simple)
   - Estados independientes y simples
   - No relacionados entre sí

3. **React Query** (Estado del Servidor)
   - Cache de datos del servidor
   - Estados de fetching
   - Sincronización con backend

### **Ejemplo de Arquitectura Híbrida**
```javascript
// useFilterSystem.js
const ListAutos = () => {
  // Reducer para estados complejos
  const {
    currentFilters,
    pendingFilters,
    isLoading: isFilterLoading,
    isError: isFilterError,
    error: filterError
  } = useFilterReducer()
  
  // useState para estados simples
  const [isFiltering, setIsFiltering] = useState(false)
  
  // React Query para datos del servidor
  const {
    data: cars,
    isLoading: isDataLoading,
    error: dataError
  } = useGetCars(currentFilters)
  
  // Estados combinados
  const isLoading = isFilterLoading || isDataLoading
  const isError = isFilterError || dataError
}
```

---

## 🎨 Ventajas del Estado Actual

### **1. Centralización**
- Todos los estados relacionados en un lugar
- Fácil debugging y testing
- Transiciones predecibles

### **2. Separación Clara**
- UI states separados de business logic
- Estados simples vs complejos bien definidos
- Responsabilidades claras

### **3. Performance**
- Re-renders optimizados
- Memoización automática de acciones
- Estados inmutables

### **4. Mantenibilidad**
- Código más limpio y organizado
- Fácil agregar nuevos estados
- Testing más sencillo

---

## 🔧 Funciones Disponibles

### **Acciones de UI**
```javascript
setSubmitting(true/false)     // Controlar estado de submit
toggleDrawer()                // Abrir/cerrar drawer
closeDrawer()                 // Cerrar drawer
```

### **Acciones de Filtros**
```javascript
setPendingFilters(filters)    // Establecer filtros pendientes
applyFilters()               // Aplicar filtros pendientes
clearFilters()               // Limpiar todos los filtros
```

### **Acciones de Operación**
```javascript
setLoading(true/false)        // Controlar estado de carga
setError(message)            // Establecer error
clearError()                 // Limpiar error
```

---

## 🧪 Testing del Reducer

### **Test de Estado Inicial**
```javascript
const { result } = renderHook(() => useFilterReducer())
expect(result.current.currentFilters).toEqual({})
expect(result.current.pendingFilters).toEqual({})
expect(result.current.isLoading).toBe(false)
expect(result.current.isError).toBe(false)
```

### **Test de Aplicación de Filtros**
```javascript
act(() => {
  result.current.setPendingFilters({ marca: ['Toyota'] })
  result.current.applyFilters()
})

expect(result.current.currentFilters).toEqual({ marca: ['Toyota'] })
expect(result.current.pendingFilters).toEqual({})
```

---

## 🚀 Próximos Pasos

1. **Agregar más estados** según necesidad
2. **Optimizar performance** con useMemo/useCallback
3. **Implementar persistencia** de filtros en localStorage
4. **Agregar analytics** de uso de filtros
5. **Testing completo** del reducer

---

*Este reducer expandido proporciona una base sólida y escalable para el manejo de estados complejos en el sistema de filtros.* 