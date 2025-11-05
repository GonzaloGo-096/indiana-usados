# 🎯 Plan de Testing Paso a Paso - Indiana Usados

**Fecha inicio:** 4 de noviembre de 2025  
**Objetivo:** Llevar el coverage de 15% a 70% en 4 semanas  
**Enfoque:** Priorizar código crítico del negocio

---

## 📅 RESUMEN EJECUTIVO

### Distribución de Tiempo (4 semanas)

| Etapa | Duración | Objetivo | Prioridad |
|-------|----------|----------|-----------|
| **Etapa 0** | 30 min | Corrección de tests fallando | 🔴 URGENTE |
| **Etapa 1** | 1 hora | Setup y validación | 🔴 ALTA |
| **Etapa 2** | 8-10 horas | Hooks críticos | 🔴 ALTA |
| **Etapa 3** | 6-8 horas | Services/API | 🔴 ALTA |
| **Etapa 4** | 8-10 horas | Componentes críticos | 🟡 MEDIA |
| **Etapa 5** | 6-8 horas | E2E Tests | 🟡 MEDIA |
| **Etapa 6** | 2-3 horas | CI/CD y automatización | 🟢 BAJA |

**Total:** ~32-40 horas (1 mes trabajando 2h/día)

---

## 🚀 ETAPA 0: Corrección Inmediata
**Duración:** 30 minutos  
**Cuándo:** HOY MISMO  
**Prioridad:** 🔴 URGENTE

### Objetivo
Hacer que el 100% de tests pasen correctamente.

### Paso 1: Corregir tests de CardAuto (20 min)

**Ubicación:** `src/components/vehicles/Card/CardAuto/__tests__/CardAuto.test.jsx`

#### Cambios a realizar:

```javascript
// ❌ ANTES (línea 54):
expect(screen.getByText('Toyota')).toBeInTheDocument()

// ✅ DESPUÉS:
expect(screen.getByText(/Toyota/)).toBeInTheDocument()
```

```javascript
// ❌ ANTES (línea 55):
expect(screen.getByText('Corolla')).toBeInTheDocument()

// ✅ DESPUÉS:
expect(screen.getByText(/Corolla/)).toBeInTheDocument()
```

```javascript
// ❌ ANTES (línea 66):
expect(image.src).toContain('/src/assets/auto1.jpg')

// ✅ DESPUÉS:
expect(image.src).toContain('auto1.jpg')
```

```javascript
// ❌ ANTES (línea 120):
expect(screen.getByText('Toyota')).toBeInTheDocument()

// ✅ DESPUÉS:
expect(screen.getByText(/Toyota/)).toBeInTheDocument()
```

```javascript
// ❌ ANTES (línea 121):
expect(screen.getByText('Corolla')).toBeInTheDocument()

// ✅ DESPUÉS:
expect(screen.getByText(/Corolla/)).toBeInTheDocument()
```

### Paso 2: Verificar corrección (5 min)

```bash
# Ejecutar solo los tests de CardAuto
npm run test src/components/vehicles/Card/CardAuto/__tests__/CardAuto.test.jsx

# Resultado esperado:
# ✓ src/components/vehicles/Card/CardAuto/__tests__/CardAuto.test.jsx (7)
#   ✓ CardAuto > Renderizado básico > should render vehicle information correctly
#   ✓ CardAuto > Renderizado básico > should display vehicle image
#   [... 5 más]
# Test Files  1 passed (1)
# Tests  7 passed (7)
```

### Paso 3: Ejecutar todos los tests (5 min)

```bash
npm run test

# Resultado esperado:
# Test Files  5 passed (5)
# Tests  77 passed (77)  ← 100% de éxito!
```

### ✅ Criterio de éxito
- [ ] 77/77 tests pasando (100%)
- [ ] Sin errores en consola
- [ ] Tiempo de ejecución < 3 segundos

---

## 📊 ETAPA 1: Setup y Validación
**Duración:** 1 hora  
**Cuándo:** Después de Etapa 0  
**Prioridad:** 🔴 ALTA

### Objetivo
Establecer baseline de coverage y preparar ambiente de desarrollo de tests.

### Paso 1: Generar reporte de coverage inicial (10 min)

```bash
# Generar coverage completo
npm run test:coverage

# Se generará en: coverage/index.html
# Abrir en navegador para ver el reporte visual
```

**Analizar y documentar:**
```
Coverage actual:
- Statements: ___%
- Branches: ___%
- Functions: ___%
- Lines: ___%

Archivos con 0% coverage:
- Lista aquí los archivos críticos sin coverage
```

### Paso 2: Configurar VS Code para testing (15 min)

Instalar extensiones recomendadas:

```json
// .vscode/extensions.json (crear si no existe)
{
  "recommendations": [
    "vitest.explorer",           // Explorador de tests
    "firsttris.vscode-jest-runner", // Ejecutar tests individuales
    "orta.vscode-jest"           // Syntax highlighting
  ]
}
```

### Paso 3: Crear estructura de carpetas para tests pendientes (10 min)

```bash
# Crear carpetas para los tests que vamos a escribir

# Hooks
mkdir -p src/hooks/vehicles/__tests__
mkdir -p src/hooks/filters/__tests__
mkdir -p src/hooks/admin/__tests__

# Services
mkdir -p src/services/__tests__

# Components
mkdir -p src/components/vehicles/List/__tests__
mkdir -p src/components/vehicles/Detail/__tests__
mkdir -p src/components/vehicles/Filters/__tests__

# E2E
mkdir -p tests/e2e
```

### Paso 4: Crear checklist de tests pendientes (15 min)

```bash
# Crear archivo de tracking
touch docs/TESTING_CHECKLIST.md
```

Contenido inicial:

```markdown
# Testing Checklist - Indiana Usados

## Hooks
- [ ] useVehiclesList.js (8 tests estimados)
- [ ] useVehicleDetail.js (6 tests estimados)
- [ ] useFilterReducer.js (10 tests estimados)
- [ ] useCarMutation.js (6 tests estimados)
- [ ] useAuth.js (8 tests estimados)

## Services
- [ ] vehiclesApi.js (12 tests estimados)
- [ ] axiosInstance.js (8 tests estimados)
- [ ] authService.js (6 tests estimados)

## Components
- [ ] FilterFormSimplified.jsx (10 tests estimados)
- [ ] AutosGrid.jsx (8 tests estimados)
- [ ] VehicleDetail.jsx (8 tests estimados)
- [ ] ErrorBoundary.jsx (6 tests estimados)

## E2E
- [ ] Navegación básica (3 tests)
- [ ] Flujo de filtros (5 tests)
- [ ] Detalle de vehículo (3 tests)
```

### Paso 5: Configurar modo watch para desarrollo (10 min)

```bash
# En una terminal separada, mantener siempre corriendo:
npm run test:watch

# Esto ejecutará automáticamente los tests cuando edites archivos
```

### ✅ Criterio de éxito
- [ ] Reporte de coverage generado y analizado
- [ ] VS Code configurado con extensiones
- [ ] Estructura de carpetas creada
- [ ] Checklist documentado
- [ ] Test watch corriendo

---

## 🎣 ETAPA 2: Tests de Hooks (CRÍTICO)
**Duración:** 8-10 horas  
**Cuándo:** Semana 1  
**Prioridad:** 🔴 ALTA

### Objetivo
Testear todos los hooks críticos que contienen lógica de negocio.

---

### 📝 Test 1: useVehiclesList (2 horas)

**Ubicación:** `src/hooks/vehicles/__tests__/useVehiclesList.test.js`

**Crear archivo:**

```javascript
/**
 * Tests para useVehiclesList.js
 * Hook crítico: Maneja listado, paginación y filtros de vehículos
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TestHarness } from '@test'
import { useVehiclesList } from '../useVehiclesList'

// Mock del service
vi.mock('@services', () => ({
  vehiclesApi: {
    getVehicles: vi.fn()
  }
}))

describe('useVehiclesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ TEST 1: Carga inicial de vehículos
  it('should load vehicles on mount', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    // Inicialmente debe estar cargando
    expect(result.current.isLoading).toBe(true)

    // Esperar a que termine de cargar
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Debe tener vehículos
    expect(result.current.vehicles).toBeDefined()
    expect(Array.isArray(result.current.vehicles)).toBe(true)
  })

  // ✅ TEST 2: Manejo de errores
  it('should handle errors correctly', async () => {
    // Forzar error en el service
    const { vehiclesApi } = await import('@services')
    vehiclesApi.getVehicles.mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })

  // ✅ TEST 3: Aplicar filtros
  it('should apply filters correctly', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Aplicar filtros
    const filters = { marca: ['Toyota'] }
    result.current.applyFilters(filters)

    await waitFor(() => {
      expect(result.current.filters).toEqual(filters)
    })
  })

  // ✅ TEST 4: Paginación (cargar más)
  it('should load more vehicles on pagination', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialCount = result.current.vehicles.length

    // Cargar más
    result.current.loadMore()

    await waitFor(() => {
      expect(result.current.vehicles.length).toBeGreaterThan(initialCount)
    })
  })

  // ✅ TEST 5: Invalidar caché
  it('should invalidate cache and refetch', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const { vehiclesApi } = await import('@services')
    const initialCallCount = vehiclesApi.getVehicles.mock.calls.length

    // Invalidar caché
    result.current.invalidateCache()

    await waitFor(() => {
      expect(vehiclesApi.getVehicles.mock.calls.length).toBeGreaterThan(
        initialCallCount
      )
    })
  })

  // ✅ TEST 6: hasNextPage
  it('should handle hasNextPage correctly', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.hasNextPage).toBe('boolean')
  })

  // ✅ TEST 7: isLoadingMore
  it('should set isLoadingMore when loading next page', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Activar carga de más
    result.current.loadMore()

    // Debe estar en estado isLoadingMore
    expect(result.current.isLoadingMore).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false)
    })
  })

  // ✅ TEST 8: Limpiar filtros
  it('should clear filters and reload', async () => {
    const { result } = renderHook(() => useVehiclesList(), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Aplicar filtros
    result.current.applyFilters({ marca: ['Toyota'] })

    // Limpiar filtros
    result.current.clearFilters()

    await waitFor(() => {
      expect(result.current.filters).toEqual({})
    })
  })
})
```

**Ejecutar:**
```bash
npm run test src/hooks/vehicles/__tests__/useVehiclesList.test.js
```

**✅ Criterio de éxito:**
- [ ] 8/8 tests pasando
- [ ] Coverage de useVehiclesList > 80%

---

### 📝 Test 2: useVehicleDetail (1.5 horas)

**Ubicación:** `src/hooks/vehicles/__tests__/useVehicleDetail.test.js`

```javascript
/**
 * Tests para useVehicleDetail.js
 * Hook: Maneja detalle de un vehículo específico
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TestHarness } from '@test'
import { useVehicleDetail } from '../useVehicleDetail'

vi.mock('@services', () => ({
  vehiclesApi: {
    getVehicleById: vi.fn()
  }
}))

describe('useVehicleDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ TEST 1: Cargar detalle por ID
  it('should load vehicle detail by id', async () => {
    const vehicleId = '123'
    const { result } = renderHook(() => useVehicleDetail(vehicleId), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.vehicle).toBeDefined()
    expect(result.current.vehicle.id).toBe(vehicleId)
  })

  // ✅ TEST 2: Manejo de vehículo no encontrado
  it('should handle vehicle not found', async () => {
    const { vehiclesApi } = await import('@services')
    vehiclesApi.getVehicleById.mockRejectedValueOnce(
      new Error('Vehicle not found')
    )

    const { result } = renderHook(() => useVehicleDetail('999'), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  // ✅ TEST 3: Caché de vehículo
  it('should use cached data when available', async () => {
    const vehicleId = '123'
    
    // Primera llamada
    const { unmount } = renderHook(() => useVehicleDetail(vehicleId), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    unmount()

    const { vehiclesApi } = await import('@services')
    const initialCallCount = vehiclesApi.getVehicleById.mock.calls.length

    // Segunda llamada (debe usar caché)
    renderHook(() => useVehicleDetail(vehicleId), {
      wrapper: TestHarness
    })

    // No debe hacer llamada adicional
    expect(vehiclesApi.getVehicleById.mock.calls.length).toBe(initialCallCount)
  })

  // ✅ TEST 4: Refetch manual
  it('should refetch when requested', async () => {
    const { result } = renderHook(() => useVehicleDetail('123'), {
      wrapper: TestHarness
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const { vehiclesApi } = await import('@services')
    const initialCallCount = vehiclesApi.getVehicleById.mock.calls.length

    // Forzar refetch
    result.current.refetch()

    await waitFor(() => {
      expect(vehiclesApi.getVehicleById.mock.calls.length).toBeGreaterThan(
        initialCallCount
      )
    })
  })

  // ✅ TEST 5: ID inválido o vacío
  it('should not fetch when id is invalid', () => {
    const { result } = renderHook(() => useVehicleDetail(null), {
      wrapper: TestHarness
    })

    expect(result.current.vehicle).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  // ✅ TEST 6: Estado de carga
  it('should show loading state correctly', async () => {
    const { result } = renderHook(() => useVehicleDetail('123'), {
      wrapper: TestHarness
    })

    // Inicialmente debe estar cargando
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})
```

**Ejecutar:**
```bash
npm run test src/hooks/vehicles/__tests__/useVehicleDetail.test.js
```

**✅ Criterio de éxito:**
- [ ] 6/6 tests pasando
- [ ] Coverage de useVehicleDetail > 80%

---

### 📝 Test 3: useFilterReducer (2.5 horas)

**Ubicación:** `src/hooks/filters/__tests__/useFilterReducer.test.js`

```javascript
/**
 * Tests para useFilterReducer.js
 * Hook CRÍTICO: State management de filtros
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterReducer } from '../useFilterReducer'
import { FILTER_DEFAULTS } from '@constants'

describe('useFilterReducer', () => {
  // ✅ TEST 1: Estado inicial
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFilterReducer())

    expect(result.current.state).toMatchObject({
      marca: [],
      caja: [],
      combustible: [],
      año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
      precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
      kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
    })
  })

  // ✅ TEST 2: SET_MARCA action
  it('should update marca filter', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({
        type: 'SET_MARCA',
        payload: ['Toyota', 'Ford']
      })
    })

    expect(result.current.state.marca).toEqual(['Toyota', 'Ford'])
  })

  // ✅ TEST 3: SET_CAJA action
  it('should update caja filter', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({
        type: 'SET_CAJA',
        payload: ['Automática']
      })
    })

    expect(result.current.state.caja).toEqual(['Automática'])
  })

  // ✅ TEST 4: SET_COMBUSTIBLE action
  it('should update combustible filter', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({
        type: 'SET_COMBUSTIBLE',
        payload: ['Nafta', 'Diesel']
      })
    })

    expect(result.current.state.combustible).toEqual(['Nafta', 'Diesel'])
  })

  // ✅ TEST 5: SET_AÑO action
  it('should update año range', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({
        type: 'SET_AÑO',
        payload: [2015, 2022]
      })
    })

    expect(result.current.state.año).toEqual([2015, 2022])
  })

  // ✅ TEST 6: SET_PRECIO action
  it('should update precio range', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({
        type: 'SET_PRECIO',
        payload: [10000000, 50000000]
      })
    })

    expect(result.current.state.precio).toEqual([10000000, 50000000])
  })

  // ✅ TEST 7: SET_KILOMETRAJE action
  it('should update kilometraje range', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({
        type: 'SET_KILOMETRAJE',
        payload: [0, 100000]
      })
    })

    expect(result.current.state.kilometraje).toEqual([0, 100000])
  })

  // ✅ TEST 8: RESET action
  it('should reset all filters to defaults', () => {
    const { result } = renderHook(() => useFilterReducer())

    // Aplicar algunos filtros
    act(() => {
      result.current.dispatch({ type: 'SET_MARCA', payload: ['Toyota'] })
      result.current.dispatch({ type: 'SET_AÑO', payload: [2015, 2022] })
    })

    // Resetear
    act(() => {
      result.current.dispatch({ type: 'RESET' })
    })

    expect(result.current.state.marca).toEqual([])
    expect(result.current.state.año).toEqual([
      FILTER_DEFAULTS.AÑO.min,
      FILTER_DEFAULTS.AÑO.max
    ])
  })

  // ✅ TEST 9: SET_ALL action
  it('should set all filters at once', () => {
    const { result } = renderHook(() => useFilterReducer())

    const newFilters = {
      marca: ['Toyota'],
      caja: ['Automática'],
      año: [2015, 2022]
    }

    act(() => {
      result.current.dispatch({
        type: 'SET_ALL',
        payload: newFilters
      })
    })

    expect(result.current.state).toMatchObject(newFilters)
  })

  // ✅ TEST 10: Múltiples dispatches seguidos
  it('should handle multiple dispatches correctly', () => {
    const { result } = renderHook(() => useFilterReducer())

    act(() => {
      result.current.dispatch({ type: 'SET_MARCA', payload: ['Toyota'] })
      result.current.dispatch({ type: 'SET_CAJA', payload: ['Manual'] })
      result.current.dispatch({ type: 'SET_AÑO', payload: [2010, 2020] })
    })

    expect(result.current.state.marca).toEqual(['Toyota'])
    expect(result.current.state.caja).toEqual(['Manual'])
    expect(result.current.state.año).toEqual([2010, 2020])
  })
})
```

**Ejecutar:**
```bash
npm run test src/hooks/filters/__tests__/useFilterReducer.test.js
```

**✅ Criterio de éxito:**
- [ ] 10/10 tests pasando
- [ ] Coverage de useFilterReducer > 95%

---

### 📝 Tests adicionales de hooks (2-3 horas)

**Prioridad:**
1. `useCarMutation.js` (admin) - 6 tests
2. `useAuth.js` (autenticación) - 8 tests

**Template similar a los anteriores.**

### ✅ Criterio de éxito ETAPA 2
- [ ] useVehiclesList: 8/8 tests ✅
- [ ] useVehicleDetail: 6/6 tests ✅
- [ ] useFilterReducer: 10/10 tests ✅
- [ ] useCarMutation: 6/6 tests ✅
- [ ] useAuth: 8/8 tests ✅
- [ ] **Total: 38 nuevos tests**
- [ ] Coverage hooks > 75%

---

## 🌐 ETAPA 3: Tests de Services/API
**Duración:** 6-8 horas  
**Cuándo:** Semana 2  
**Prioridad:** 🔴 ALTA

### Objetivo
Validar todas las llamadas al backend y manejo de errores.

### 📝 Test 1: vehiclesApi.js (3 horas)

**Ubicación:** `src/services/__tests__/vehiclesApi.test.js`

```javascript
/**
 * Tests para vehiclesApi.js
 * Service crítico: Todas las llamadas de vehículos al backend
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vehiclesApi } from '../vehiclesApi'
import axiosInstance from '@api/axiosInstance'

// Mock axios
vi.mock('@api/axiosInstance')

describe('vehiclesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ TEST 1: getVehicles sin filtros
  it('should fetch vehicles without filters', async () => {
    const mockResponse = {
      data: {
        allPhotos: {
          docs: [{ _id: 1, marca: 'Toyota' }],
          totalDocs: 100
        }
      }
    }

    axiosInstance.get.mockResolvedValueOnce(mockResponse)

    const result = await vehiclesApi.getVehicles()

    expect(axiosInstance.get).toHaveBeenCalledWith('/allPhotos', {
      params: expect.any(URLSearchParams)
    })
    expect(result.vehicles).toHaveLength(1)
  })

  // ✅ TEST 2: getVehicles con filtros
  it('should fetch vehicles with filters', async () => {
    const filters = {
      marca: ['Toyota'],
      año: [2015, 2022]
    }

    axiosInstance.get.mockResolvedValueOnce({
      data: { allPhotos: { docs: [], totalDocs: 0 } }
    })

    await vehiclesApi.getVehicles(filters)

    expect(axiosInstance.get).toHaveBeenCalled()
    const callParams = axiosInstance.get.mock.calls[0][1].params
    expect(callParams.get('marca')).toBe('Toyota')
    expect(callParams.get('anio')).toBe('2015,2022')
  })

  // ✅ TEST 3: getVehicles con paginación
  it('should fetch vehicles with pagination', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { allPhotos: { docs: [], totalDocs: 0 } }
    })

    await vehiclesApi.getVehicles({}, 2)

    const callParams = axiosInstance.get.mock.calls[0][1].params
    expect(callParams.get('page')).toBe('2')
  })

  // ✅ TEST 4: getVehicleById
  it('should fetch vehicle by id', async () => {
    const mockVehicle = { _id: '123', marca: 'Toyota' }
    axiosInstance.get.mockResolvedValueOnce({
      data: mockVehicle
    })

    const result = await vehiclesApi.getVehicleById('123')

    expect(axiosInstance.get).toHaveBeenCalledWith('/allPhotos/123')
    expect(result.id).toBe('123')
  })

  // ✅ TEST 5: Error 404 en getVehicleById
  it('should throw error when vehicle not found', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: { status: 404 }
    })

    await expect(vehiclesApi.getVehicleById('999')).rejects.toThrow()
  })

  // ✅ TEST 6: Error de red
  it('should handle network errors', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'))

    await expect(vehiclesApi.getVehicles()).rejects.toThrow('Network error')
  })

  // ✅ TEST 7: Respuesta vacía
  it('should handle empty response', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { allPhotos: { docs: [], totalDocs: 0 } }
    })

    const result = await vehiclesApi.getVehicles()

    expect(result.vehicles).toEqual([])
    expect(result.total).toBe(0)
  })

  // ✅ TEST 8: Transformación de datos
  it('should transform backend data to frontend format', async () => {
    const mockBackendVehicle = {
      _id: '123',
      marca: 'Toyota',
      modelo: 'Corolla',
      fotoPrincipal: { url: 'https://example.com/img.jpg' }
    }

    axiosInstance.get.mockResolvedValueOnce({
      data: { allPhotos: { docs: [mockBackendVehicle], totalDocs: 1 } }
    })

    const result = await vehiclesApi.getVehicles()

    // Debe tener 'id' en lugar de '_id'
    expect(result.vehicles[0].id).toBe('123')
    // Debe tener 'fotoPrincipal' extraída
    expect(result.vehicles[0].fotoPrincipal).toBeDefined()
  })

  // ✅ TEST 9: Timeout
  it('should handle timeout errors', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded'
    })

    await expect(vehiclesApi.getVehicles()).rejects.toThrow()
  })

  // ✅ TEST 10: Múltiples páginas
  it('should handle multiple page requests', async () => {
    // Página 1
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        allPhotos: {
          docs: [{ _id: 1 }],
          hasNextPage: true,
          nextPage: 2
        }
      }
    })

    const page1 = await vehiclesApi.getVehicles()
    expect(page1.hasNextPage).toBe(true)

    // Página 2
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        allPhotos: {
          docs: [{ _id: 2 }],
          hasNextPage: false,
          nextPage: null
        }
      }
    })

    const page2 = await vehiclesApi.getVehicles({}, 2)
    expect(page2.hasNextPage).toBe(false)
  })

  // ✅ TEST 11: Cancelación de request
  it('should allow request cancellation', async () => {
    const controller = new AbortController()
    
    axiosInstance.get.mockRejectedValueOnce({
      name: 'CanceledError'
    })

    controller.abort()

    await expect(
      vehiclesApi.getVehicles({}, 1, { signal: controller.signal })
    ).rejects.toThrow()
  })

  // ✅ TEST 12: Rate limiting
  it('should handle rate limiting errors', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: {
        status: 429,
        data: { message: 'Too many requests' }
      }
    })

    await expect(vehiclesApi.getVehicles()).rejects.toThrow()
  })
})
```

**Ejecutar:**
```bash
npm run test src/services/__tests__/vehiclesApi.test.js
```

### 📝 Test 2: axiosInstance.js (2-3 horas)

```javascript
/**
 * Tests para axiosInstance.js
 * Config crítica: Interceptors, retries, error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../axiosInstance'
import axios from 'axios'

vi.mock('axios')

describe('axiosInstance', () => {
  // ✅ TEST 1: Configuración base
  it('should have correct base configuration', () => {
    expect(axiosInstance.defaults.baseURL).toBeDefined()
    expect(axiosInstance.defaults.timeout).toBe(5000)
  })

  // ✅ TEST 2: Request interceptor agrega headers
  it('should add auth headers in request interceptor', async () => {
    // Simular token en localStorage
    localStorage.setItem('token', 'fake-token')

    const config = { headers: {} }
    const result = axiosInstance.interceptors.request.handlers[0].fulfilled(config)

    expect(result.headers.Authorization).toBe('Bearer fake-token')
  })

  // ✅ TEST 3: Response interceptor maneja 401
  it('should handle 401 unauthorized in response interceptor', async () => {
    const error = {
      response: { status: 401 }
    }

    await expect(
      axiosInstance.interceptors.response.handlers[0].rejected(error)
    ).rejects.toMatchObject({ response: { status: 401 } })

    // Debe limpiar token
    expect(localStorage.getItem('token')).toBeNull()
  })

  // ✅ TEST 4: Retry logic en errores de red
  it('should retry on network errors', async () => {
    // Mock axios con retry
    const mockRetry = vi.fn()
    axios.isAxiosError.mockReturnValue(true)

    // Simular 2 fallos + 1 éxito
    axiosInstance.get
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ data: 'success' })

    const result = await axiosInstance.get('/test')
    
    expect(result.data).toBe('success')
    expect(axiosInstance.get).toHaveBeenCalledTimes(3)
  })

  // ✅ TEST 5: NO retry en errores 4xx
  it('should not retry on 4xx errors', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: { status: 400 }
    })

    await expect(axiosInstance.get('/test')).rejects.toMatchObject({
      response: { status: 400 }
    })

    expect(axiosInstance.get).toHaveBeenCalledTimes(1)
  })

  // ✅ TEST 6: Timeout handling
  it('should handle timeout errors', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      code: 'ECONNABORTED',
      message: 'timeout exceeded'
    })

    await expect(axiosInstance.get('/test')).rejects.toMatchObject({
      code: 'ECONNABORTED'
    })
  })

  // ✅ TEST 7: Content-Type header
  it('should set correct content-type for JSON', () => {
    expect(axiosInstance.defaults.headers['Content-Type']).toBe(
      'application/json'
    )
  })

  // ✅ TEST 8: CORS handling
  it('should handle CORS errors', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      message: 'Network Error',
      config: {}
    })

    await expect(axiosInstance.get('/test')).rejects.toThrow()
  })
})
```

### ✅ Criterio de éxito ETAPA 3
- [ ] vehiclesApi.js: 12/12 tests ✅
- [ ] axiosInstance.js: 8/8 tests ✅
- [ ] authService.js: 6/6 tests ✅
- [ ] **Total: 26 nuevos tests**
- [ ] Coverage services > 80%

---

## 🎨 ETAPA 4: Tests de Componentes
**Duración:** 8-10 horas  
**Cuándo:** Semana 3  
**Prioridad:** 🟡 MEDIA

### Objetivo
Testear componentes críticos de UI.

### 📝 Test 1: FilterFormSimplified (3 horas)

**Ubicación:** `src/components/vehicles/Filters/__tests__/FilterFormSimplified.test.jsx`

```javascript
/**
 * Tests para FilterFormSimplified.jsx
 * Componente crítico: Formulario principal de filtros
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TestHarness } from '@test'
import FilterFormSimplified from '../FilterFormSimplified'

describe('FilterFormSimplified', () => {
  const mockOnApplyFilters = vi.fn()
  const mockOnClear = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ TEST 1: Renderizado inicial
  it('should render all filter controls', () => {
    render(
      <TestHarness>
        <FilterFormSimplified 
          onApplyFilters={mockOnApplyFilters}
          onClear={mockOnClear}
        />
      </TestHarness>
    )

    expect(screen.getByLabelText(/marca/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/caja/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/combustible/i)).toBeInTheDocument()
    expect(screen.getByText(/aplicar filtros/i)).toBeInTheDocument()
  })

  // ✅ TEST 2: Seleccionar marca
  it('should select marca filter', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified onApplyFilters={mockOnApplyFilters} />
      </TestHarness>
    )

    const marcaSelect = screen.getByLabelText(/marca/i)
    fireEvent.change(marcaSelect, { target: { value: 'Toyota' } })

    await waitFor(() => {
      expect(marcaSelect.value).toBe('Toyota')
    })
  })

  // ✅ TEST 3: Ajustar rango de año
  it('should adjust año range', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified onApplyFilters={mockOnApplyFilters} />
      </TestHarness>
    )

    const añoSlider = screen.getByTestId('año-range-slider')
    
    fireEvent.change(añoSlider, {
      target: { value: [2015, 2022] }
    })

    await waitFor(() => {
      expect(screen.getByText(/2015/)).toBeInTheDocument()
      expect(screen.getByText(/2022/)).toBeInTheDocument()
    })
  })

  // ✅ TEST 4: Aplicar filtros
  it('should call onApplyFilters when form is submitted', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified onApplyFilters={mockOnApplyFilters} />
      </TestHarness>
    )

    const submitButton = screen.getByText(/aplicar filtros/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnApplyFilters).toHaveBeenCalledTimes(1)
    })
  })

  // ✅ TEST 5: Limpiar filtros
  it('should call onClear when clear button is clicked', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified 
          onApplyFilters={mockOnApplyFilters}
          onClear={mockOnClear}
        />
      </TestHarness>
    )

    const clearButton = screen.getByText(/limpiar/i)
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(mockOnClear).toHaveBeenCalledTimes(1)
    })
  })

  // ✅ TEST 6: Contador de filtros activos
  it('should show active filters count', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified 
          onApplyFilters={mockOnApplyFilters}
          activeFiltersCount={3}
        />
      </TestHarness>
    )

    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  // ✅ TEST 7: Estado de carga (disabled)
  it('should disable form when loading', () => {
    render(
      <TestHarness>
        <FilterFormSimplified 
          onApplyFilters={mockOnApplyFilters}
          isLoading={true}
        />
      </TestHarness>
    )

    const submitButton = screen.getByText(/aplicar filtros/i)
    expect(submitButton).toBeDisabled()
  })

  // ✅ TEST 8: Valores iniciales
  it('should populate form with initial values', () => {
    const initialValues = {
      marca: ['Toyota'],
      año: [2015, 2022]
    }

    render(
      <TestHarness>
        <FilterFormSimplified 
          onApplyFilters={mockOnApplyFilters}
          initialValues={initialValues}
        />
      </TestHarness>
    )

    const marcaSelect = screen.getByLabelText(/marca/i)
    expect(marcaSelect.value).toBe('Toyota')
  })

  // ✅ TEST 9: Validación de rangos
  it('should validate año range (min < max)', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified onApplyFilters={mockOnApplyFilters} />
      </TestHarness>
    )

    // Intentar poner min > max (debería corregir automáticamente)
    const añoSlider = screen.getByTestId('año-range-slider')
    fireEvent.change(añoSlider, { target: { value: [2022, 2015] } })

    await waitFor(() => {
      // Debe corregir a [2015, 2022]
      expect(screen.getByText(/2015/)).toBeInTheDocument()
    })
  })

  // ✅ TEST 10: Múltiples selecciones
  it('should allow multiple marca selections', async () => {
    render(
      <TestHarness>
        <FilterFormSimplified onApplyFilters={mockOnApplyFilters} />
      </TestHarness>
    )

    const marcaSelect = screen.getByLabelText(/marca/i)
    
    // Seleccionar Toyota
    fireEvent.change(marcaSelect, { target: { value: 'Toyota' } })
    // Agregar Ford (con Ctrl)
    fireEvent.change(marcaSelect, { 
      target: { value: 'Ford' },
      ctrlKey: true 
    })

    await waitFor(() => {
      const selectedOptions = Array.from(marcaSelect.selectedOptions)
        .map(opt => opt.value)
      expect(selectedOptions).toContain('Toyota')
      expect(selectedOptions).toContain('Ford')
    })
  })
})
```

### 📝 Tests adicionales de componentes (5-7 horas)

1. **AutosGrid** (2 horas) - 8 tests
2. **VehicleDetail** (3 horas) - 8 tests
3. **ErrorBoundary** (2 horas) - 6 tests

### ✅ Criterio de éxito ETAPA 4
- [ ] FilterFormSimplified: 10/10 tests ✅
- [ ] AutosGrid: 8/8 tests ✅
- [ ] VehicleDetail: 8/8 tests ✅
- [ ] ErrorBoundary: 6/6 tests ✅
- [ ] **Total: 32 nuevos tests**
- [ ] Coverage components > 60%

---

## 🎭 ETAPA 5: Tests E2E con Playwright
**Duración:** 6-8 horas  
**Cuándo:** Semana 3-4  
**Prioridad:** 🟡 MEDIA

### Objetivo
Validar flujos completos de usuario.

### Paso 1: Crear estructura E2E (30 min)

```bash
# Crear archivos base
mkdir -p tests/e2e
touch tests/e2e/smoke.spec.ts
touch tests/e2e/filters.spec.ts
touch tests/e2e/vehicle-detail.spec.ts
```

### Paso 2: Tests de Smoke (1 hora)

**Ubicación:** `tests/e2e/smoke.spec.ts`

```typescript
/**
 * E2E Smoke Tests - Flujos básicos críticos
 * Deben pasar SIEMPRE antes de deploy
 */

import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  // ✅ TEST 1: Homepage carga correctamente
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Indiana Usados/)
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('h1')).toContainText(/Indiana/)
  })

  // ✅ TEST 2: Página de vehículos carga
  test('should load vehicles page', async ({ page }) => {
    await page.goto('/vehiculos')
    
    await expect(page.locator('.card')).toHaveCount(12) // Primera página
    await expect(page.locator('[data-testid="filter-button"]')).toBeVisible()
  })

  // ✅ TEST 3: Navegación funciona
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')
    
    // Click en "Vehículos"
    await page.click('text=Vehículos')
    await expect(page).toHaveURL(/\/vehiculos/)
    
    // Click en "Inicio"
    await page.click('text=Inicio')
    await expect(page).toHaveURL(/\/$/)
  })
})
```

**Ejecutar:**
```bash
npm run e2e:smoke
```

### Paso 3: Tests de Filtros (2-3 horas)

**Ubicación:** `tests/e2e/filters.spec.ts`

```typescript
/**
 * E2E Tests - Flujo de Filtros
 */

import { test, expect } from '@playwright/test'

test.describe('Filters Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vehiculos')
  })

  // ✅ TEST 1: Abrir panel de filtros
  test('should open filters panel', async ({ page }) => {
    await page.click('[data-testid="filter-button"]')
    
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible()
  })

  // ✅ TEST 2: Filtrar por marca
  test('should filter by marca', async ({ page }) => {
    await page.click('[data-testid="filter-button"]')
    
    // Seleccionar Toyota
    await page.click('input[name="marca"][value="Toyota"]')
    
    // Aplicar filtros
    await page.click('button:has-text("Aplicar")')
    
    // Esperar a que se actualicen los resultados
    await page.waitForLoadState('networkidle')
    
    // Verificar que solo hay Toyotas
    const cards = await page.locator('.card h3').allTextContents()
    cards.forEach(title => {
      expect(title).toContain('Toyota')
    })
  })

  // ✅ TEST 3: Filtrar por rango de año
  test('should filter by año range', async ({ page }) => {
    await page.click('[data-testid="filter-button"]')
    
    // Ajustar slider de año
    const slider = page.locator('[data-testid="año-slider"]')
    await slider.fill('2015,2022')
    
    await page.click('button:has-text("Aplicar")')
    
    await page.waitForLoadState('networkidle')
    
    // Verificar que los años estén en rango
    const years = await page.locator('[data-testid="vehicle-year"]').allTextContents()
    years.forEach(year => {
      const yearNum = parseInt(year)
      expect(yearNum).toBeGreaterThanOrEqual(2015)
      expect(yearNum).toBeLessThanOrEqual(2022)
    })
  })

  // ✅ TEST 4: Limpiar filtros
  test('should clear filters', async ({ page }) => {
    await page.click('[data-testid="filter-button"]')
    
    // Aplicar filtros
    await page.click('input[name="marca"][value="Toyota"]')
    await page.click('button:has-text("Aplicar")')
    
    // Limpiar
    await page.click('[data-testid="filter-button"]')
    await page.click('button:has-text("Limpiar")')
    
    // Verificar que se muestran todos los vehículos
    await expect(page.locator('.card')).toHaveCount(12)
  })

  // ✅ TEST 5: Múltiples filtros combinados
  test('should apply multiple filters', async ({ page }) => {
    await page.click('[data-testid="filter-button"]')
    
    // Marca + Caja
    await page.click('input[name="marca"][value="Toyota"]')
    await page.click('input[name="caja"][value="Automática"]')
    
    await page.click('button:has-text("Aplicar")')
    
    await page.waitForLoadState('networkidle')
    
    // Verificar resultados
    const cards = page.locator('.card')
    await expect(cards).toHaveCount.toBeGreaterThan(0)
  })
})
```

### Paso 4: Tests de Detalle (2 horas)

**Ubicación:** `tests/e2e/vehicle-detail.spec.ts`

```typescript
/**
 * E2E Tests - Detalle de Vehículo
 */

import { test, expect } from '@playwright/test'

test.describe('Vehicle Detail', () => {
  // ✅ TEST 1: Ver detalle de vehículo
  test('should open vehicle detail', async ({ page }) => {
    await page.goto('/vehiculos')
    
    // Click en primer vehículo
    await page.locator('.card').first().click()
    
    // Debe estar en página de detalle
    await expect(page).toHaveURL(/\/vehiculos\/\d+/)
    
    // Debe mostrar información completa
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="vehicle-price"]')).toBeVisible()
    await expect(page.locator('[data-testid="vehicle-description"]')).toBeVisible()
  })

  // ✅ TEST 2: Galería de imágenes
  test('should show image gallery', async ({ page }) => {
    await page.goto('/vehiculos')
    await page.locator('.card').first().click()
    
    const gallery = page.locator('[data-testid="image-gallery"]')
    await expect(gallery).toBeVisible()
    
    // Click en siguiente imagen
    await page.click('[data-testid="next-image"]')
    
    // Debe cambiar imagen
    await expect(page.locator('[data-testid="main-image"]')).toHaveAttribute(
      'src',
      /.*\.(jpg|jpeg|png|webp)/
    )
  })

  // ✅ TEST 3: Botón de contacto WhatsApp
  test('should show WhatsApp contact button', async ({ page }) => {
    await page.goto('/vehiculos')
    await page.locator('.card').first().click()
    
    const whatsappBtn = page.locator('[data-testid="whatsapp-button"]')
    await expect(whatsappBtn).toBeVisible()
    
    // Click debe abrir WhatsApp (nueva ventana)
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      whatsappBtn.click()
    ])
    
    await expect(popup).toHaveURL(/wa.me/)
  })
})
```

### Paso 5: Configurar Playwright para CI (1 hora)

**Crear:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] }
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI
  }
})
```

### ✅ Criterio de éxito ETAPA 5
- [ ] Smoke tests: 3/3 ✅
- [ ] Filter tests: 5/5 ✅
- [ ] Detail tests: 3/3 ✅
- [ ] **Total: 11 tests E2E**
- [ ] Tests pasan en Chrome, Firefox, Safari
- [ ] Tests pasan en mobile

---

## 🤖 ETAPA 6: CI/CD y Automatización
**Duración:** 2-3 horas  
**Cuándo:** Semana 4  
**Prioridad:** 🟢 BAJA

### Objetivo
Automatizar tests en pipeline de CI/CD.

### Paso 1: GitHub Actions para tests (1 hora)

**Crear:** `.github/workflows/tests.yml`

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test
      
      - name: Generate coverage
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
  
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Paso 2: Pre-commit hooks (30 min)

```bash
# Instalar husky
npm install --save-dev husky

# Inicializar
npx husky install

# Crear hook pre-commit
npx husky add .husky/pre-commit "npm run test"
```

**Configurar en `package.json`:**

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Paso 3: Coverage mínimo (30 min)

**En `vite.config.js`:**

```javascript
test: {
  // ... config existente
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    
    // ✅ THRESHOLDS (coverage mínimo requerido)
    thresholds: {
      lines: 70,
      functions: 70,
      branches: 60,
      statements: 70
    },
    
    // Excluir archivos no críticos
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.config.js',
      '**/*.spec.{js,jsx}',
      '**/*.test.{js,jsx}'
    ]
  }
}
```

### Paso 4: Badge de coverage (15 min)

**En `README.md`:**

```markdown
# Indiana Usados

![Tests](https://github.com/usuario/indiana-usados/actions/workflows/tests.yml/badge.svg)
![Coverage](https://img.shields.io/codecov/c/github/usuario/indiana-usados)

...
```

### ✅ Criterio de éxito ETAPA 6
- [ ] CI/CD pipeline configurado ✅
- [ ] Tests corren en cada PR ✅
- [ ] Pre-commit hooks activos ✅
- [ ] Coverage mínimo enforced ✅
- [ ] Badges en README ✅

---

## 📊 CHECKLIST FINAL

### Por Etapa

- [ ] **ETAPA 0** (30 min)
  - [ ] 3 tests de CardAuto corregidos
  - [ ] 100% tests pasando (77/77)

- [ ] **ETAPA 1** (1 hora)
  - [ ] Coverage report generado
  - [ ] VS Code configurado
  - [ ] Estructura de carpetas creada
  - [ ] Test watch corriendo

- [ ] **ETAPA 2** (8-10 horas)
  - [ ] useVehiclesList: 8 tests ✅
  - [ ] useVehicleDetail: 6 tests ✅
  - [ ] useFilterReducer: 10 tests ✅
  - [ ] useCarMutation: 6 tests ✅
  - [ ] useAuth: 8 tests ✅
  - [ ] **38 nuevos tests**

- [ ] **ETAPA 3** (6-8 horas)
  - [ ] vehiclesApi: 12 tests ✅
  - [ ] axiosInstance: 8 tests ✅
  - [ ] authService: 6 tests ✅
  - [ ] **26 nuevos tests**

- [ ] **ETAPA 4** (8-10 horas)
  - [ ] FilterFormSimplified: 10 tests ✅
  - [ ] AutosGrid: 8 tests ✅
  - [ ] VehicleDetail: 8 tests ✅
  - [ ] ErrorBoundary: 6 tests ✅
  - [ ] **32 nuevos tests**

- [ ] **ETAPA 5** (6-8 horas)
  - [ ] Smoke tests: 3 tests ✅
  - [ ] Filter E2E: 5 tests ✅
  - [ ] Detail E2E: 3 tests ✅
  - [ ] **11 tests E2E**

- [ ] **ETAPA 6** (2-3 horas)
  - [ ] CI/CD configurado ✅
  - [ ] Pre-commit hooks ✅
  - [ ] Coverage thresholds ✅

### Métricas Objetivo Final

| Métrica | Inicio | Objetivo | Al Completar Plan |
|---------|--------|----------|-------------------|
| **Tests totales** | 77 | 180+ | 184+ tests ✅ |
| **Tests pasando** | 74 (96%) | 100% | 184 (100%) ✅ |
| **Coverage líneas** | ~15% | 70% | 70-75% ✅ |
| **Coverage branches** | ~20% | 60% | 60-65% ✅ |
| **Hooks testeados** | 0% | 80% | 80%+ ✅ |
| **Services testeados** | 0% | 90% | 90%+ ✅ |
| **E2E tests** | 0 | 10+ | 11 ✅ |

---

## ⏱️ CALENDARIO SUGERIDO

### Semana 1 (10 horas)
- **Lunes:** Etapa 0 + Etapa 1 (1.5h)
- **Martes:** useVehiclesList (2h)
- **Miércoles:** useVehicleDetail (1.5h)
- **Jueves:** useFilterReducer (2.5h)
- **Viernes:** useCarMutation + useAuth (2.5h)

### Semana 2 (8 horas)
- **Lunes:** vehiclesApi (3h)
- **Martes:** axiosInstance (2-3h)
- **Miércoles:** authService (2h)
- **Jueves:** Revisión y ajustes (1h)

### Semana 3 (10 horas)
- **Lunes:** FilterFormSimplified (3h)
- **Martes:** AutosGrid (2h)
- **Miércoles:** VehicleDetail (3h)
- **Jueves:** ErrorBoundary (2h)

### Semana 4 (8 horas)
- **Lunes:** E2E Smoke + Setup (2h)
- **Martes:** E2E Filters (3h)
- **Miércoles:** E2E Detail (2h)
- **Jueves:** CI/CD + Documentación (1h)

**Total: 36 horas en 4 semanas**

---

## 🎯 COMANDOS RÁPIDOS

```bash
# Testing
npm run test                    # Todos los tests unitarios
npm run test:watch             # Watch mode
npm run test:coverage          # Con coverage
npm run test:ui                # UI interactiva

# E2E
npm run test:e2e               # Todos los E2E
npm run test:e2e:ui            # Con UI
npm run e2e:smoke              # Solo smoke tests

# Específicos
npm run test src/hooks/        # Solo hooks
npm run test src/services/     # Solo services
npm run test src/components/   # Solo components

# CI
npm run test && npm run test:e2e  # Full test suite
```

---

## 📞 SOPORTE

Si te trabas en alguna etapa:

1. **Revisar ejemplos:** Los tests existentes son excelentes referencias
2. **Documentación:** Vitest.dev, testing-library.com
3. **Logs detallados:** `npm run test -- --reporter=verbose`
4. **Debug mode:** `npm run test:ui` para inspeccionar visualmente

---

**¡EMPECEMOS! 🚀**

Primera acción: Ejecuta `npm run test` y luego corrige los 3 tests fallando.

---

*Documento creado: 4 de noviembre de 2025*  
*Actualizar después de cada etapa completada*

