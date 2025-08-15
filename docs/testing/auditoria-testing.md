# 🧪 AUDITORÍA DEL SISTEMA DE TESTING - INDIANA USADOS

**Fecha de auditoría:** 15 de Agosto 2025  
**Versión del proyecto:** 0.0.0  
**Auditor:** Sistema de Auditoría Automática  

---

## 📋 1. RESUMEN EJECUTIVO

### Frameworks y Runners Utilizados
- **Vitest:** v3.2.4 (runner principal para unit/integración)
- **React Testing Library:** v16.3.0 (testing de componentes)
- **Playwright:** v1.54.2 (testing E2E)
- **Jest DOM:** v6.7.0 (matchers adicionales)

### Suites Existentes y Conteo
- **Unit/Integración:** 1 test (VehiclesIntegration.test.jsx)
- **E2E/Playwright:** 2 specs (navigation.spec.js, vehicles-flow.spec.js)
- **Total de tests:** 3 archivos de test

### Estado Actual
- **Tests unitarios:** 1 test configurado pero no ejecutado recientemente
- **Tests E2E:** 40+ tests fallando consistentemente en todos los navegadores
- **Cobertura:** No configurada ni ejecutada
- **Tiempos:** Unit tests ~APROX 1-2s, E2E ~APROX 2-5min por spec

### Riesgos Principales (Alta Prioridad)
1. **Tests E2E completamente fallando** - 100% de fallos en última ejecución
2. **Falta de tests unitarios** - Solo 1 test de integración
3. **Configuración de Playwright frágil** - Dependencia de puerto 3000 fijo
4. **Mocks globales no utilizados** - Setup complejo sin tests que lo usen
5. **Falta de CI/CD para testing** - No hay workflows configurados

### Fortalezas Principales
1. **Stack moderno** - Vitest + RTL + Playwright bien configurados
2. **Estructura organizada** - Separación clara entre unit y E2E
3. **Factories bien diseñadas** - VehicleFactory con datos consistentes
4. **TestHarness robusto** - Configuración de React Query para tests
5. **Mocks globales completos** - IntersectionObserver, ResizeObserver, etc.

---

## 🔧 2. STACK Y CONFIGURACIÓN

### Scripts de Testing (package.json)
```json
{
  "test": "vitest run",                    // Ejecuta tests unitarios una vez
  "test:watch": "vitest",                  // Modo watch para desarrollo
  "test:coverage": "vitest run --coverage", // Con cobertura (no configurada)
  "test:ui": "vitest --ui",               // UI de Vitest
  "test:e2e": "playwright test",          // Tests E2E
  "test:e2e:ui": "playwright test --ui",  // UI de Playwright
  "test:e2e:headed": "playwright test --headed", // Con navegador visible
  "test:e2e:debug": "playwright test --debug"   // Modo debug
}
```

### Versiones de Dependencias
- **Node:** No especificado en package.json
- **React:** ^18.2.0
- **Vite:** ^5.0.12
- **Vitest:** ^3.2.4
- **React Testing Library:** ^16.3.0
- **Playwright:** ^1.54.2
- **React Query:** ^5.79.0
- **Axios:** ^1.6.7
- **TypeScript:** No configurado (solo JS)

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
    'chromium', 'firefox', 'webkit',
    'Mobile Chrome', 'Mobile Safari'
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000', // ⚠️ Mismo puerto fijo
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

### Configuración de ESLint (eslint.config.js)
```javascript
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn', 
        { allowConstantExport: true }
      ]
    }
  }
]
```

### Alias y Paths
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

## 📁 3. ESTRUCTURA DE CARPETAS DE TESTING

### Árbol de Directorios
```
src/
├── components/
│   └── __tests__/
│       └── VehiclesIntegration.test.jsx    # 1 test de integración
├── test/
│   ├── setup.js                            # Configuración global
│   ├── index.js                            # Exportaciones centralizadas
│   ├── factories/
│   │   └── vehicleFactory.js               # Factories de datos
│   ├── harness/
│   │   └── TestHarness.jsx                 # Wrapper de testing
│   └── mocks/
│       └── intersectionObserverMock.js     # Mock de IntersectionObserver

tests/
└── e2e/
    ├── navigation.spec.js                   # Tests de navegación
    └── vehicles-flow.spec.js                # Tests de flujo de vehículos

test-results/                                # Reportes de Playwright
├── .last-run.json                          # Estado de última ejecución
├── e2e-results.json                        # Resultados en JSON
└── e2e-results.xml                         # Resultados en JUnit XML
```

### Propósito de Cada Carpeta
- **`src/components/__tests__/`**: Tests unitarios de componentes
- **`src/test/`**: Utilidades, factories y configuración de testing
- **`tests/e2e/`**: Tests end-to-end con Playwright
- **`test-results/`**: Artefactos generados por Playwright

---

## 🎭 4. ESTRATEGIA DE MOCKS Y UTILIDADES

### Borde de Mock Principal
- **React Query:** Mockeado globalmente en `setup.js` pero sobrescrito por componente
- **React Router:** Mockeado globalmente pero sobrescrito por componente
- **Axios:** Mockeado globalmente pero sobrescrito por componente
- **APIs:** Mockeadas a nivel de hook (`useVehiclesQuery`, `useErrorHandler`)

### Utilidades de Render
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
```

### React Query para Testing
```javascript
// src/test/harness/TestHarness.jsx
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

### Mock de IntersectionObserver
```javascript
// src/test/setup.js
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))
```

### Factories y Fixtures
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

## 📊 5. INVENTARIO DE SUITES Y CASOS

### Unit/Hook Tests
| Archivo | Sujeto Probado | Qué Valida | Dependencias Mockeadas |
|---------|----------------|------------|------------------------|
| `VehiclesIntegration.test.jsx` | Integración de componentes de vehículos | Flujo de filtros, renderizado de grid, navegación | `useVehiclesQuery`, `useErrorHandler`, `useFilterReducer`, componentes de UI |

### Component/Integración
| Archivo | Estados Cubiertos | Dependencias |
|---------|------------------|--------------|
| `VehiclesIntegration.test.jsx` | ✅ Loading, ✅ Error, ✅ Vacío, ✅ Filtros, ✅ Paginación | React Query, React Router, Componentes UI |

### E2E/Playwright
| Spec | Flujo Cubierto | Etiquetas | Intercepta Red |
|------|----------------|-----------|----------------|
| `navigation.spec.js` | Navegación principal, enlaces, rutas | `@navigation`, `@smoke` | ❌ No |
| `vehicles-flow.spec.js` | Lista de vehículos, filtros, detalle, paginación | `@vehicles`, `@e2e` | ❌ No |

### Tests Skip/Todo
- **No hay tests marcados como `skip` o `todo`**
- **Todos los tests E2E están fallando** (40+ fallos en última ejecución)

---

## 🎯 6. SELECTORES Y ACCESIBILIDAD

### Data-Testid Existentes
```javascript
// En tests E2E
'[data-testid="filter-form"]'           // ✅ Formulario de filtros
'[data-testid="vehicles-grid"]'         // ✅ Grid de vehículos
'[data-testid="vehicle-detail"]'        // ✅ Detalle de vehículo
'[data-testid="vehicle-images"]'        // ✅ Imágenes del vehículo
'[data-testid="load-more-btn"]'         // ✅ Botón de cargar más
```

### Data-Testid Faltantes
```javascript
// No encontrados en tests
'[data-testid="catalog-grid"]'          // ❌ Grid del catálogo
'[data-testid="vehicle-card"]'          // ❌ Tarjeta individual de vehículo
'[data-testid="link-detalle"]'          // ❌ Enlace al detalle
'[data-testid="filters-form"]'          // ❌ Formulario de filtros (duplicado)
'[data-testid="apply-filters"]'         // ❌ Botón aplicar filtros
'[data-testid="clear-filters"]'         // ❌ Botón limpiar filtros
```

### Uso de Roles/Labels de Accesibilidad
- **Navegación:** `<nav>`, enlaces con `href` específicos
- **Formularios:** `select[name="marca"]`, `button[type="submit"]`
- **Contenido:** `h1`, `h2`, `h3` para jerarquía
- **Interactivos:** Botones y enlaces con texto descriptivo

---

## ⏱️ 7. TIEMPOS Y ESTABILIDAD

### Tiempos por Suite (APROX)
- **Vitest (Unit/Integración):** ~1-2 segundos total
- **Playwright (E2E):** ~2-5 minutos por spec
  - `navigation.spec.js`: ~2-3 minutos
  - `vehicles-flow.spec.js`: ~3-5 minutos

### Top 5 Tests Más Lentos (APROX)
1. **`should load more vehicles`** - ~30-45 segundos (scroll + carga)
2. **`should navigate to vehicle detail`** - ~20-30 segundos (navegación + render)
3. **`should apply filters correctly`** - ~15-25 segundos (formulario + API)
4. **`should display vehicles list`** - ~10-20 segundos (carga inicial)
5. **`should handle search functionality`** - ~10-15 segundos (input + búsqueda)

### Flakiness Conocida
- **100% de fallos en tests E2E** en última ejecución
- **Problemas de puerto:** Dependencia de puerto 3000 fijo
- **Timeouts:** Navegación y acciones exceden timeouts configurados
- **Selectores frágiles:** Dependencia de `data-testid` que pueden no existir

---

## 🚀 8. CI/CD RELACIONADO CON TESTING

### Workflows de GitHub
- **No hay workflows configurados** en `.github/workflows/`
- **No hay CI/CD para testing** configurado

### E2E en CI
- **No corre en CI** actualmente
- **Navegadores:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **No usa Grid** - ejecución local solo

### Artefactos Configurados
- **Trace:** `on-first-retry` (solo en fallos)
- **Screenshots:** `only-on-failure` (solo en fallos)
- **Videos:** `retain-on-failure` (solo en fallos)
- **Peso aproximado:** ~50-100MB por ejecución completa

---

## ⚠️ 9. GAPS, RIESGOS Y DEUDA

### Prioridad ALTA
1. **Tests E2E completamente fallando** - Bloquea validación de funcionalidad
2. **Falta de tests unitarios** - Solo 1 test de integración
3. **Configuración de puerto fijo** - Dependencia de localhost:3000
4. **No hay CI/CD** - Testing manual solo

### Prioridad MEDIA
1. **Mocks globales no utilizados** - Setup complejo sin uso
2. **Selectores frágiles** - Dependencia de `data-testid` específicos
3. **Timeouts insuficientes** - Navegación excede 30 segundos
4. **Falta de cobertura** - No hay métricas de cobertura

### Prioridad BAJA
1. **Duplicación de configuración** - Alias duplicados en Vite y Vitest
2. **Factories no utilizadas** - VehicleFactory bien diseñada pero poco usada
3. **Reportes no analizados** - Playwright genera reportes pero no se revisan

### Oportunidades de Simplificación
1. **Mover tests E2E a integración** - Reducir dependencias externas
2. **Consolidar mocks** - Unificar estrategia de mocking
3. **Simplificar configuración** - Eliminar duplicaciones entre Vite y Vitest
4. **Reducir navegadores** - Enfocarse en Chromium + Mobile Chrome

---

## 🎮 10. COMANDOS DE EJECUCIÓN

### Unit/Integración
```bash
# Ejecutar tests una vez
npm run test

# Modo watch (desarrollo)
npm run test:watch

# Con cobertura
npm run test:coverage

# UI de Vitest
npm run test:ui
```

### E2E/Playwright
```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# UI de Playwright
npm run test:e2e:ui

# Con navegador visible
npm run test:e2e:headed

# Modo debug
npm run test:e2e:debug
```

### Requisitos Previos
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. En otra terminal, ejecutar tests
npm run test:e2e
```

---

## 📎 11. ANEXOS

### Versiones de Herramientas
```bash
# Vitest
npx vitest --version
# v3.2.4

# Playwright
npx playwright --version
# v1.54.2
```

### Errores Conocidos
- **Tests E2E fallando:** 40+ fallos en última ejecución
- **Puerto 3000 ocupado:** Conflicto con otros servicios
- **Timeouts excedidos:** Navegación lenta en algunos navegadores
- **Selectores no encontrados:** `data-testid` faltantes en componentes

### Métricas de Última Ejecución
- **Fecha:** Basado en timestamps de archivos
- **Estado:** FAILED
- **Tests ejecutados:** ~40 tests E2E
- **Tests fallando:** 100% (todos fallaron)
- **Navegadores:** 5 (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)

---

## 📝 RESUMEN DE CAMBIOS

### Archivo Creado
- ✅ `docs/testing/auditoria-testing.md` - Documento completo de auditoría

### Secciones Completadas
- ✅ Resumen ejecutivo
- ✅ Stack y configuración
- ✅ Estructura de carpetas
- ✅ Estrategia de mocks
- ✅ Inventario de suites
- ✅ Selectores y accesibilidad
- ✅ Tiempos y estabilidad
- ✅ CI/CD relacionado
- ✅ Gaps y riesgos
- ✅ Comandos de ejecución
- ✅ Anexos

### Próximos Pasos Recomendados
1. **Resolver fallos E2E** - Investigar causas raíz
2. **Aumentar tests unitarios** - Cobertura mínima del 70%
3. **Configurar CI/CD** - GitHub Actions para testing
4. **Simplificar configuración** - Eliminar duplicaciones
5. **Revisar selectores** - Asegurar `data-testid` consistentes 