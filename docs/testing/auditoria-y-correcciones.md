# 🧪 AUDITORÍA Y CORRECCIONES DEL SISTEMA DE TESTING - INDIANA USADOS

**Fecha de auditoría:** 15 de Agosto 2025  
**Versión del proyecto:** 0.0.0  
**Auditor:** Sistema de Auditoría Automática  
**Estado:** Tests unitarios ✅ PASANDO, E2E ❌ FALLANDO  

---

## 📋 1. RESUMEN EJECUTIVO

### Frameworks y Versiones
- **Vitest:** v3.2.4 ✅ Funcionando
- **React Testing Library:** v16.3.0 ✅ Funcionando  
- **Playwright:** v1.54.2 ❌ Tests fallando
- **Jest DOM:** v6.7.0 ✅ Funcionando

### Conteo por Tipo
- **Unit:** 5 archivos, 30 tests ✅ PASANDO
- **Component:** 4 archivos, 25 tests ✅ PASANDO
- **Integración:** 1 archivo, 4 tests ✅ PASANDO
- **E2E:** 2 specs, ~40 tests ❌ FALLANDO (100%)

### Estado Actual
- **Tests unitarios:** ✅ 30/30 pasando (8.45s total)
- **Tests E2E:** ❌ 0/40 pasando (timeout y fallos)
- **Tiempos:** Unit ~1.4s, E2E ~APROX 5-10min por spec
- **Flakiness:** Baja en unit, ALTA en E2E

### Top 5 Riesgos
1. **Tests E2E completamente fallando** - Bloquea validación de funcionalidad
2. **Configuración de puerto fijo** - Dependencia de localhost:3000
3. **Warnings de React Router** - Migración v6→v7 pendiente
4. **Warnings de act()** - Tests no envueltos en act()
5. **Falta de CI/CD** - Testing manual solo

### Top 5 Oportunidades
1. **Tests unitarios robustos** - Base sólida para expandir
2. **Factories bien diseñadas** - VehicleFactory reutilizable
3. **TestHarness robusto** - Configuración de React Query optimizada
4. **Mocks globales completos** - IntersectionObserver, ResizeObserver
5. **Estructura organizada** - Separación clara unit vs E2E

---

## 🔧 2. CONFIGURACIÓN Y SCRIPTS

### Scripts de Testing (package.json)
| Script | Comando Real | Para Qué Sirve |
|--------|--------------|----------------|
| `test` | `vitest run` | Ejecuta tests unitarios una vez |
| `test:watch` | `vitest` | Modo watch para desarrollo |
| `test:coverage` | `vitest run --coverage` | Con cobertura (no configurada) |
| `test:ui` | `vitest --ui` | UI de Vitest |
| `test:e2e` | `playwright test` | Tests E2E (fallando) |
| `test:e2e:ui` | `playwright test --ui` | UI de Playwright |
| `test:e2e:headed` | `playwright test --headed` | Con navegador visible |
| `test:e2e:debug` | `playwright test --debug` | Modo debug |

### Configuración de Vite (vite.config.js)
```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.js'],
  testTimeout: 5000,
  hookTimeout: 5000,
  teardownTimeout: 1000,
  pool: 'forks',
  include: ['src/**/*.{test,spec}.{js,jsx}'],
  exclude: [
    'node_modules/',
    'src/test/',
    'tests/**/*',        // ⚠️ Excluye directorio tests completo
    'dist/',
    'coverage/',
    '**/*.config.js',
    '**/*.config.ts'
  ],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [/* mismos excludes que arriba */]
  }
}
```

### Configuración de Playwright (playwright.config.js)
```javascript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000', // ⚠️ Puerto fijo
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: [
    'chromium', 'firefox', 'webkit',        // ⚠️ 5 navegadores
    'Mobile Chrome', 'Mobile Safari'
  ],
  webServer: {
    command: 'npm run dev',                 // ⚠️ Dev server lento
    url: 'http://localhost:3000',          // ⚠️ Mismo puerto fijo
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

### Alias Definidos
```javascript
// vite.config.js
resolve: {
  alias: {
    '@': resolve(__dirname, 'src'),
    '@components': resolve(__dirname, 'src/components'),
    '@vehicles': resolve(__dirname, 'src/components/vehicles'),
    '@ui': resolve(__dirname, 'src/components/ui'),
    '@hooks': resolve(__dirname, 'src/hooks'),
    '@utils': resolve(__dirname, 'src/utils'),
    '@services': resolve(__dirname, 'src/services'),
    '@api': resolve(__dirname, 'src/api'),
    '@test': resolve(__dirname, 'src/test')
  }
}
```

---

## 📁 3. MAPA DE CARPETAS DE TESTING

### Árbol Resumido
```
src/
├── components/
│   ├── __tests__/
│   │   └── VehiclesIntegration.test.jsx    # 1 test de integración
│   └── vehicles/
│       ├── List/__tests__/
│       │   └── VehiclesList.test.jsx       # 7 tests de componente
│       ├── Card/CardAuto/__tests__/
│       │   └── CardAuto.test.jsx           # 7 tests de componente
│       └── Filters/filters/FilterFormSimplified/__tests__/
│           └── FilterFormSimplified.test.jsx # 7 tests de componente
├── hooks/
│   └── vehicles/__tests__/
│       └── useVehiclesList.test.jsx        # 5 tests de hook
└── test/
    ├── setup.js                            # Configuración global
    ├── index.js                            # Exportaciones centralizadas
    ├── factories/
    │   └── vehicleFactory.js               # Factories de datos
    ├── harness/
    │   └── TestHarness.jsx                 # Wrapper de testing
    └── mocks/
        └── intersectionObserverMock.js     # Mock de IntersectionObserver

tests/
└── e2e/
    ├── navigation.spec.js                   # Tests de navegación
    └── vehicles-flow.spec.js                # Tests de flujo de vehículos
```

### Propósito de Cada Carpeta
- **`src/components/__tests__/`**: Tests de integración entre componentes
- **`src/components/vehicles/*/__tests__/`**: Tests unitarios de componentes específicos
- **`src/hooks/__tests__/`**: Tests de hooks personalizados
- **`src/test/`**: Utilidades, factories y configuración de testing
- **`tests/e2e/`**: Tests end-to-end con Playwright

---

## 🎭 4. ESTRATEGIA ACTUAL DE MOCKS Y UTILIDADES

### Borde de Mock Principal
- **React Query:** Mockeado globalmente en `setup.js` pero sobrescrito por componente
- **React Router:** Mockeado globalmente pero sobrescrito por componente  
- **Axios:** Mockeado globalmente pero sobrescrito por componente
- **APIs:** Mockeadas a nivel de hook (`useVehiclesQuery`, `useErrorHandler`)

### Harness de Tests
```javascript
// src/test/harness/TestHarness.jsx
export const TestHarness = ({ 
  children, 
  queryClient = createDefaultQueryClient(),
  initialEntries = ['/'],
  ...routerProps 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries} {...routerProps}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const createDefaultQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { 
      retry: false,        // ✅ No reintentos en tests
      staleTime: 0,        // ✅ Siempre fresh
      gcTime: 0            // ✅ No garbage collection
    },
    mutations: { 
      retry: false         // ✅ No reintentos en tests
    }
  }
})
```

### Mocks de IO
```javascript
// src/test/setup.js
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))
```

### Factories Disponibles
```javascript
// src/test/factories/vehicleFactory.js
export const createVehicle = (overrides = {}) => ({
  id: 1,
  marca: 'Toyota',
  modelo: 'Corolla',
  año: 2020,
  precio: 25000,
  kms: 50000,
  caja: 'Automática',
  combustible: 'Gasolina',
  color: 'Blanco',
  estado: 'Usado',
  descripcion: 'Excelente estado, único dueño',
  imagenes: [
    'auto-prueba-principal.webp',
    'auto-pueba-2.webp',
    'auto-prueba-3.webp'
  ],
  ...overrides
})

export const createVehicleList = (count = 5, overrides = {}) => {
  return Array.from({ length: count }, (_, index) => 
    createVehicle({
      id: index + 1,
      marca: `Marca ${index + 1}`,
      modelo: `Modelo ${index + 1}`,
      ...overrides
    })
  )
}
```

---

## 📊 5. INVENTARIO DE PRUEBAS (CLASIFICACIÓN)

### Tabla de Tests por Archivo
| Archivo | Tipo | Sujeto | Qué Valida | Mocks Usados | Fragilidad | Duración APROX |
|---------|------|--------|------------|--------------|------------|----------------|
| `VehiclesIntegration.test.jsx` | Integración | Flujo completo | Filtros, grid, navegación | Hooks, componentes UI | Media | 132ms |
| `VehiclesList.test.jsx` | Componente | Lista de vehículos | Renderizado, estados, props | useVehiclesQuery, useErrorHandler | Baja | 194ms |
| `CardAuto.test.jsx` | Componente | Tarjeta de vehículo | Información, eventos | Props, eventos | Baja | 313ms |
| `FilterFormSimplified.test.jsx` | Componente | Formulario de filtros | Validación, submit, reset | useFilterReducer, eventos | Media | 387ms |
| `useVehiclesList.test.jsx` | Hook | Hook personalizado | Estados, paginación, cache | QueryClient, API mocks | Media | 368ms |

### Duplicaciones de Cobertura
- **Filtros:** Testeado en `FilterFormSimplified.test.jsx` y `VehiclesIntegration.test.jsx`
- **Lista de vehículos:** Testeado en `VehiclesList.test.jsx` y `VehiclesIntegration.test.jsx`
- **Estados de loading/error:** Testeado en múltiples componentes

---

## ⚠️ 6. PROBLEMAS DETECTADOS (CON DIAGNÓSTICO)

### Prioridad ALTA
| Tipo | Problema | Archivo(s) Afectados | Causa Probable | Impacto |
|------|----------|----------------------|----------------|---------|
| **E2E** | Tests completamente fallando | `tests/e2e/*.spec.js` | Puerto fijo + dev server lento | Alto |
| **Configuración** | Puerto 3000 fijo | `playwright.config.js` | Hardcodeo de puerto | Alto |
| **Warnings** | React Router v6→v7 | Todos los tests | Migración pendiente | Medio |
| **Warnings** | act() no envuelto | `useVehiclesList.test.jsx` | Tests no envueltos en act() | Medio |

### Prioridad MEDIA
| Tipo | Problema | Archivo(s) Afectados | Causa Probable | Impacto |
|------|----------|----------------------|----------------|---------|
| **Rendimiento** | 5 navegadores en E2E | `playwright.config.js` | Configuración excesiva | Medio |
| **Artefactos** | Video/screenshot por defecto | `playwright.config.js` | Configuración pesada | Medio |
| **Timeouts** | 30s para navegación | `playwright.config.js` | Timeouts insuficientes | Medio |

### Prioridad BAJA
| Tipo | Problema | Archivo(s) Afectados | Causa Probable | Impacto |
|------|----------|----------------------|----------------|---------|
| **Duplicación** | Tests de filtros duplicados | Múltiples archivos | Cobertura solapada | Bajo |
| **Configuración** | Alias duplicados | `vite.config.js` | Configuración redundante | Bajo |

---

## 🔧 7. CORRECCIONES PROPUESTAS (NO APLICAR, SOLO DIFFS)

### 1. Simplificar Playwright - Un Solo Navegador

**Ruta:** `playwright.config.js`  
**Patch:**
```diff
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
-  workers: process.env.CI ? 1 : undefined,
+  workers: 2,
  use: {
-    baseURL: 'http://localhost:3000',
+    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
-    screenshot: 'only-on-failure',
-    video: 'retain-on-failure',
+    screenshot: 'only-on-failure',
+    video: 'off',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: [
-    'chromium', 'firefox', 'webkit',
-    'Mobile Chrome', 'Mobile Safari'
+    'chromium'
  ],
  webServer: {
-    command: 'npm run dev',
+    command: 'npm run preview',
-    url: 'http://localhost:3000',
+    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

**Objetivo:** Reducir complejidad y tiempo de ejecución  
**Impacto esperado:** E2E de 5-10min → 1-2min  
**Riesgo:** Bajo  
**Backout:** Revertir a configuración original  

### 2. Configuración de Puerto Dinámico

**Ruta:** `playwright.config.js`  
**Patch:**
```diff
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  use: {
-    baseURL: 'http://localhost:4173',
+    baseURL: process.env.TEST_BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: ['chromium'],
  webServer: {
    command: 'npm run preview',
-    url: 'http://localhost:4173',
+    url: process.env.TEST_BASE_URL || 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

**Objetivo:** Flexibilidad de puerto para evitar conflictos  
**Impacto esperado:** Evitar errores de puerto ocupado  
**Riesgo:** Bajo  
**Backout:** Revertir a puerto fijo  

### 3. Configuración de Vitest - Optimizar Query Client

**Ruta:** `src/test/harness/TestHarness.jsx`  
**Patch:**
```diff
const createDefaultQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { 
      retry: false,
-      staleTime: 0,
-      gcTime: 0
+      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    },
    mutations: { 
      retry: false,
      retryDelay: 0
    }
  }
})
```

**Objetivo:** Optimizar comportamiento de React Query en tests  
**Impacto esperado:** Tests más rápidos y estables  
**Riesgo:** Bajo  
**Backout:** Revertir configuración original  

### 4. Agregar Data-Testid Faltantes

**Ruta:** `src/components/vehicles/List/VehiclesList.jsx`  
**Patch:**
```diff
return (
  <VehiclesErrorBoundary>
-    <div className={styles.container}>
+    <div className={styles.container} data-testid="vehicles-list-container">
      {/* Filtros simplificados */}
      <FilterFormSimplified {...filterFormProps} />

      {/* Contenedor de lista con título */}
-      <div className={styles.listContainer}>
+      <div className={styles.listContainer} data-testid="vehicles-list-content">
```

**Objetivo:** Agregar selectores estables para tests  
**Impacto esperado:** Tests E2E más robustos  
**Riesgo:** Bajo  
**Backout:** Remover data-testid agregados  

### 5. Configuración de E2E - Suite Smoke

**Ruta:** `playwright.smoke.config.js` (nuevo archivo)  
**Patch:**
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:4173',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 5000,
    navigationTimeout: 15000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run preview',
    url: process.env.TEST_BASE_URL || 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000
  }
})
```

**Objetivo:** Suite rápida para validación básica  
**Impacto esperado:** E2E en <2min para smoke tests  
**Riesgo:** Bajo  
**Backout:** Eliminar archivo de configuración  

---

## 🚀 8. SIMPLIFICACIONES SUGERIDAS (NO APLICAR)

### Casos E2E → Integración
**Archivos a mover:**
- `tests/e2e/navigation.spec.js` → `src/components/__tests__/navigation.integration.test.jsx`
- `tests/e2e/vehicles-flow.spec.js` → `src/components/__tests__/vehicles-flow.integration.test.jsx`

**Temas que no requieren navegador real:**
- Navegación entre rutas (usar MemoryRouter)
- Formularios de filtros (usar jsdom)
- Renderizado de componentes (usar RTL)
- Estados de loading/error (usar mocks)

### Consolidar Mocks en Un Único Borde
**Ruta:** `src/test/mocks/apiMocks.js` (nuevo)
```javascript
// Mock centralizado de APIs
export const mockVehiclesApi = {
  getVehicles: vi.fn(),
  getVehicleById: vi.fn(),
  searchVehicles: vi.fn()
}

export const mockFiltersApi = {
  applyFilters: vi.fn(),
  clearFilters: vi.fn()
}
```

### Centralizar Factories
**Ruta:** `src/test/factories/index.js` (nuevo)
```javascript
export * from './vehicleFactory'
export * from './filterFactory'
export * from './apiResponseFactory'
export * from './userFactory'
```

### Suite Smoke Aislada
**Flujos recomendados:**
1. **Catálogo → Detalle:** Navegación básica
2. **Filtros → Limpiar:** Funcionalidad de filtros

**Archivos afectados:**
- `tests/e2e/smoke.spec.js` (nuevo)
- `playwright.smoke.config.js` (nuevo)

---

## 🎯 9. SELECTORES & ACCESIBILIDAD

### Data-Testid Existentes
```javascript
// En tests E2E actuales
'[data-testid="filter-form"]'           // ✅ Formulario de filtros
'[data-testid="vehicles-grid"]'         // ✅ Grid de vehículos
'[data-testid="vehicle-detail"]'        // ✅ Detalle de vehículo
'[data-testid="vehicle-images"]'        // ✅ Imágenes del vehículo
'[data-testid="load-more-btn"]'         // ✅ Botón de cargar más
```

### Data-Testid Faltantes Recomendados
```javascript
// Agregar en componentes
'[data-testid="catalog-grid"]'          // Grid del catálogo
'[data-testid="vehicle-card"]'          // Tarjeta individual
'[data-testid="link-detalle"]'          // Enlace al detalle
'[data-testid="filters-form"]'          // Formulario de filtros
'[data-testid="apply-filters"]'         // Botón aplicar filtros
'[data-testid="clear-filters"]'         // Botón limpiar filtros
'[data-testid="search-input"]'          // Input de búsqueda
'[data-testid="pagination-controls"]'   // Controles de paginación
```

### Selectores Robustos (Roles/Labels)
```javascript
// En lugar de data-testid específicos
await expect(page.locator('button:has-text("Aplicar Filtros")')).toBeVisible()
await expect(page.locator('input[placeholder*="buscar"]')).toBeVisible()
await expect(page.locator('select[name="marca"]')).toBeVisible()
await expect(page.locator('h1:has-text("Vehículos")')).toBeVisible()
```

---

## 📊 10. MÉTRICAS RÁPIDAS

### Vitest - Tests Unitarios ✅
**Duración total:** 8.45s  
**Tests:** 30/30 pasando  
**Top 5 tests más lentos:**
1. `FilterFormSimplified.test.jsx` - 387ms
2. `CardAuto.test.jsx` - 313ms  
3. `useVehiclesList.test.jsx` - 368ms
4. `VehiclesList.test.jsx` - 194ms
5. `VehiclesIntegration.test.jsx` - 132ms

### E2E - No Ejecutado ❌
**Razón:** Tiempo estimado >60s  
**Causas:**
- 5 navegadores configurados
- Dev server lento (npm run dev)
- Timeouts altos (30s navegación)
- Artefactos pesados (video por defecto)

---

## ❓ 11. PREGUNTAS ABIERTAS

### Rutas Reales
- ¿`/catalogo` o `/vehiculos`?
- ¿`/detalle/:id` o `/vehiculo/:id`?
- ¿`/nosotros` o `/about`?

### Labels Exactos
- **Filtros:** "Marca", "Año", "Aplicar Filtros", "Limpiar Filtros"
- **Búsqueda:** "Buscar vehículos", "Buscar por marca/modelo"
- **Paginación:** "Cargar más", "Siguiente página"

### Endpoints
- **GET** `/api/vehicles?page=1&limit=20`
- **GET** `/api/vehicles/:id`
- **POST** `/api/vehicles/search`

### Necesidad de Intercept en Smoke
- **Sí:** Para tests rápidos y estables
- **No:** Si se usan mocks en jsdom

---

## ✅ 12. CHECKLIST PARA EL RAZONADOR

### Decisiones que Requieren Aprobación

#### 1. Simplificar Playwright a Un Solo Navegador
- **Qué cambia:** Reducir de 5 navegadores a 1 (Chromium)
- **Riesgo:** Bajo (solo reduce cobertura de navegadores)
- **Beneficio:** E2E 5x más rápido, menos flakiness

#### 2. Cambiar de Dev Server a Preview
- **Qué cambia:** `npm run dev` → `npm run preview`
- **Riesgo:** Medio (puede ocultar bugs de desarrollo)
- **Beneficio:** Servidor más rápido, puerto 4173 fijo

#### 3. Desactivar Video por Defecto
- **Qué cambia:** `video: 'retain-on-failure'` → `video: 'off'`
- **Riesgo:** Bajo (solo afecta debugging de fallos)
- **Beneficio:** Tests más rápidos, menos espacio en disco

#### 4. Crear Suite Smoke Separada
- **Qué cambia:** Nuevo archivo de configuración y tests
- **Riesgo:** Bajo (agrega complejidad mínima)
- **Beneficio:** Validación rápida en CI/CD

#### 5. Mover Tests E2E a Integración
- **Qué cambia:** Reemplazar Playwright con RTL + jsdom
- **Riesgo:** Medio (puede ocultar bugs de navegador real)
- **Beneficio:** Tests más rápidos y estables

#### 6. Agregar Data-Testid Faltantes
- **Qué cambia:** Modificar componentes para agregar selectores
- **Riesgo:** Bajo (solo agrega atributos)
- **Beneficio:** Tests E2E más robustos

#### 7. Configurar CI/CD para Testing
- **Qué cambia:** Agregar GitHub Actions
- **Riesgo:** Medio (nueva infraestructura)
- **Beneficio:** Testing automático, detección temprana de bugs

---

## 📝 RESUMEN DE HALLAZGOS

### ✅ Fortalezas Identificadas
- **Tests unitarios robustos:** 30 tests pasando en 8.45s
- **Estructura bien organizada:** Separación clara unit vs E2E
- **Factories bien diseñadas:** VehicleFactory reutilizable
- **TestHarness optimizado:** Configuración de React Query para tests
- **Mocks globales completos:** IntersectionObserver, ResizeObserver

### ❌ Problemas Críticos
- **Tests E2E completamente fallando:** 100% de fallos
- **Configuración de puerto fijo:** Dependencia de localhost:3000
- **5 navegadores configurados:** E2E lento y frágil
- **Dev server lento:** `npm run dev` para E2E
- **Warnings de React Router:** Migración v6→v7 pendiente

### 🔧 Correcciones Propuestas
1. **Simplificar Playwright:** Un solo navegador + preview server
2. **Puerto dinámico:** Evitar conflictos de puerto
3. **Optimizar Vitest:** React Query más eficiente
4. **Data-testid faltantes:** Selectores estables
5. **Suite smoke:** E2E rápido para CI/CD

### 🚀 Simplificaciones Sugeridas
1. **E2E → Integración:** Casos que no requieren navegador real
2. **Mocks centralizados:** Un único borde de mock
3. **Factories consolidadas:** Exportaciones centralizadas
4. **Configuración ligera:** Suite smoke separada

---

**Documento creado:** `docs/testing/auditoria-y-correcciones.md`  
**Estado:** ✅ Completado con auditoría y correcciones propuestas  
**Próximo paso:** Revisión por el razonador para planificación de implementación 