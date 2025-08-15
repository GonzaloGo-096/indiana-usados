# 🧪 DRY-RUN COMPLETO - SUITE E2E "SMOKE" MÍNIMA

**Fecha:** 15 de Agosto 2025  
**Proyecto:** Indiana Usados  
**Estado:** DRY-RUN (NO APLICADO)  
**Objetivo:** Suite E2E ultrarrápida con Chromium + vite preview  

---

## 📋 1. RESUMEN EJECUTIVO

### ¿Qué Propongo?
Crear una suite E2E "smoke" ultrarrápida que use solo Chromium contra `vite preview` (puerto 4173), con artefactos mínimos (sin video, trace solo en fallos).

### ¿Por Qué Es Low-CPU?
1. **Un solo navegador** vs 5 actuales (Chromium únicamente)
2. **Preview server** vs dev server lento (`npm run preview` vs `npm run dev`)
3. **Artefactos desactivados** por defecto (video: 'off', trace: 'on-first-retry')
4. **Workers limitados** a 2 (vs paralelización completa)

### Adaptaciones a la Estructura Real
- **Rutas:** `/vehiculo/:id` (no `/detalle/:id` como sugerí inicialmente)
- **Componentes:** Uso los existentes `VehiclesList`, `CardAuto`, `FilterFormSimplified`
- **Estructura:** Respeto `tests/e2e/` y agrego subcarpeta `smoke/`

---

## 🔧 2. DIFFS COMPLETOS EN FORMATO PATCH

### **A) `package.json` - Agregar scripts smoke**

```diff
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
-   "preview": "vite preview",
+   "preview": "vite preview --port 4173",
    "env:postman": "node scripts/switch-env.js postman",
    "env:mock-local": "node scripts/switch-env.js mock-local",
    "env:local": "node scripts/switch-env.js local",
    "env:production": "node scripts/switch-env.js production",
    "env:testing": "node scripts/switch-env.js testing",
    "env:show": "node scripts/switch-env.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
-   "test:e2e:debug": "playwright test --debug"
+   "test:e2e:debug": "playwright test --debug",
+   "e2e:smoke": "playwright test -c playwright.smoke.config.ts",
+   "e2e:smoke:ui": "playwright test -c playwright.smoke.config.ts --ui"
  },
```

### **B) `playwright.smoke.config.ts` - Nueva configuración smoke (ARCHIVO NUEVO)**

```typescript
import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración de Playwright para suite SMOKE - Testing rápido y eficiente
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e/smoke',
  
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  
  /* Fallar build en CI si se deja test.only */
  forbidOnly: !!process.env.CI,
  
  /* Reintentos solo en CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers optimizados para smoke */
  workers: 2,
  
  /* Reporter optimizado */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/smoke' }]
  ],
  
  /* Configuración compartida para todos los proyectos */
  use: {
    /* Base URL para acciones como `await page.goto('/')` */
    baseURL: 'http://localhost:4173',

    /* Trace solo en reintentos */
    trace: 'on-first-retry',
    
    /* Screenshot solo en fallos */
    screenshot: 'only-on-failure',
    
    /* Video desactivado para velocidad */
    video: 'off',
    
    /* Timeouts optimizados */
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  /* Solo Chromium para velocidad */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    }
  ],

  /* Servidor web optimizado */
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
})
```

### **C) `tests/e2e/smoke/catalog-to-detail.spec.js` - Flujo catálogo→detalle (ARCHIVO NUEVO)**

```javascript
import { test, expect } from '@playwright/test'

test.describe('Flujo Catálogo → Detalle', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
  })

  test('should navigate from catalog to vehicle detail', async ({ page }) => {
    // Verificar que estamos en la página de vehículos
    await expect(page.locator('h1:has-text("Nuestros Usados")')).toBeVisible()
    
    // Verificar que hay vehículos en la lista
    await expect(page.locator('[data-testid="catalog-grid"]')).toBeVisible()
    
    // Hacer clic en el primer enlace de detalle
    await page.locator('[data-testid="link-detalle"]').first().click()
    
    // Verificar que estamos en la página de detalle
    await expect(page).toHaveURL(/.*vehiculo\/\d+/)
    
    // Verificar elementos del detalle
    await expect(page.locator('[data-testid="vehicle-detail"]')).toBeVisible()
    await expect(page.locator('[data-testid="vehicle-images"]')).toBeVisible()
    
    // Verificar que hay información de precio
    await expect(page.locator('text=/precio/i')).toBeVisible()
  })
})
```

### **D) `tests/e2e/smoke/filter-flow.spec.js` - Flujo de filtros (ARCHIVO NUEVO)**

```javascript
import { test, expect } from '@playwright/test'

test.describe('Flujo de Filtros', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
  })

  test('should apply and clear filters correctly', async ({ page }) => {
    // Verificar que el formulario de filtros está visible
    await expect(page.locator('[data-testid="filters-form"]')).toBeVisible()
    
    // Seleccionar marca Toyota
    await page.locator('select[name="marca"]').selectOption('toyota')
    
    // Seleccionar año 2020
    await page.locator('input[name="año"]').fill('2020')
    
    // Aplicar filtros
    await page.locator('[data-testid="apply-filters"]').click()
    
    // Verificar que la grilla cambió (puede tomar tiempo)
    await expect(page.locator('[data-testid="catalog-grid"]')).toBeVisible()
    
    // Limpiar filtros
    await page.locator('[data-testid="clear-filters"]').click()
    
    // Verificar que los inputs están vacíos
    await expect(page.locator('select[name="marca"]')).toHaveValue('')
    await expect(page.locator('input[name="año"]')).toHaveValue('')
  })
})
```

### **E) `src/components/vehicles/List/VehiclesList.jsx` - Agregar data-testid**

```diff
return (
  <VehiclesErrorBoundary>
-    <div className={styles.container}>
+    <div className={styles.container} data-testid="vehicles-list-container">
      {/* Filtros simplificados */}
      <FilterFormSimplified {...filterFormProps} />

      {/* Contenedor de lista con título */}
-      <div className={styles.listContainer}>
+      <div className={styles.listContainer} data-testid="catalog-grid">
        {/* Línea vertical sutil izquierda */}
        <div className={styles.verticalLine}></div>
        
        {/* Línea vertical sutil derecha */}
        <div className={styles.verticalLineRight}></div>
        
        {/* Título principal */}
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>Nuestros Usados</h1>
        </div>

        {/* Grid de vehículos */}
        <AutosGrid {...autosGridProps} />
      </div>
    </div>
    
    {/* Scroll to top */}
    <ScrollToTop />
  </VehiclesErrorBoundary>
)
```

### **F) `src/components/vehicles/Card/CardAuto/CardAuto.jsx` - Agregar data-testid**

```diff
return (
-  <div className={styles.card}>
+  <div className={styles.card} data-testid="vehicle-card">
    {/* ===== IMAGEN ===== */}
    <div className={styles['card__image-container']}>
      <img 
        src={auto.imagen || '/src/assets/auto1.jpg'} 
        alt={altText}
        className={styles['card__image']}
        loading="lazy"
        decoding="async"
      />
    </div>

    {/* ===== CONTENIDO ===== */}
    <div className={styles['card__body']}>
      {/* ... contenido existente ... */}
      
      {/* ===== BOTÓN VER DETALLE ===== */}
      <div className={styles['card__footer']}>
        <div className={styles['card__footer_border']}></div>
        <Link 
          to={vehicleUrl}
          className={styles['card__button']}
+         data-testid="link-detalle"
        >
          Ver más
        </Link>
      </div>
    </div>
  </div>
)
```

### **G) `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` - Agregar data-testid**

```diff
return (
  <div className={styles.filterFormContainer}>
-    <div className={styles.filterForm}>
+    <div className={styles.filterForm} data-testid="filters-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ... contenido existente ... */}
        
        {/* Botones mobile (solo visibles en mobile) */}
        <div className={styles.mobileButtons}>
          <button 
            type="submit" 
            className={styles.applyButton}
            disabled={isLoading || isSubmitting}
+           data-testid="apply-filters"
          >
            {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
          </button>
          
          <button 
            type="button" 
            onClick={handleClear}
            className={styles.clearButton}
            disabled={isLoading || isSubmitting}
+           data-testid="clear-filters"
          >
            Limpiar Filtros
          </button>
        </div>
      </form>
    </div>
  </div>
)
```

### **H) `.gitignore` - Agregar directorios de testing**

```diff
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

+ # Testing artifacts
+ playwright-report/
+ test-results/
+ *.zip
```

---

## 📊 3. CHECKLIST COMPLETO DE TESTIDS

| data-testid | Estado | Ruta del Archivo | Líneas a Modificar |
|-------------|--------|------------------|-------------------|
| `catalog-grid` | **AGREGAR** | `src/components/vehicles/List/VehiclesList.jsx` | 1 línea |
| `vehicle-card` | **AGREGAR** | `src/components/vehicles/Card/CardAuto/CardAuto.jsx` | 1 línea |
| `link-detalle` | **AGREGAR** | `src/components/vehicles/Card/CardAuto/CardAuto.jsx` | 1 línea |
| `filters-form` | **AGREGAR** | `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` | 1 línea |
| `apply-filters` | **AGREGAR** | `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` | 1 línea |
| `clear-filters` | **AGREGAR** | `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` | 1 línea |
| `vehicle-detail` | **YA EXISTE** | En tests E2E actuales | 0 líneas |
| `vehicle-images` | **YA EXISTE** | En tests E2E actuales | 0 líneas |

**Total de data-testid a agregar:** 6  
**Total de líneas a modificar:** 6 líneas  

---

## 🚀 4. COMANDOS SUGERIDOS (NO EJECUTAR)

```bash
# Tests unitarios (ya funcionan)
npm test

# Suite E2E smoke (nueva, rápida)
npm run e2e:smoke

# Suite E2E smoke con UI
npm run e2e:smoke:ui

# Build y preview para testing
npm run build
npm run preview

# Suite E2E completa (actual, lenta)
npm run test:e2e
```

---

## ✅ 5. CONFIRMACIONES IMPORTANTES

✅ **NO ejecuté comandos** - Solo análisis y propuestas  
✅ **NO moví carpetas** - Los E2E existentes quedan en su lugar  
✅ **NO cambié lógica de producción** - Solo agregué data-testid y archivos de test  
✅ **NO instalé/desinstalé dependencias** - Solo configuraciones  
✅ **NO toqué tests existentes** - Solo creé nueva suite smoke  

---

## 🔄 6. PLAN DE ROLLBACK COMPLETO

### Para Revertir Todos los Cambios:

#### **1. Eliminar archivos creados:**
```bash
# Eliminar configuración smoke
rm playwright.smoke.config.ts

# Eliminar specs smoke
rm -rf tests/e2e/smoke/

# Eliminar directorio smoke si está vacío
rmdir tests/e2e/smoke
```

#### **2. Revertir package.json:**
```diff
-   "e2e:smoke": "playwright test -c playwright.smoke.config.ts",
-   "e2e:smoke:ui": "playwright test -c playwright.smoke.config.ts --ui"
```

#### **3. Revertir componentes (quitar data-testid):**
```diff
# VehiclesList.jsx
- data-testid="vehicles-list-container"
- data-testid="catalog-grid"

# CardAuto.jsx  
- data-testid="vehicle-card"
- data-testid="link-detalle"

# FilterFormSimplified.jsx
- data-testid="filters-form"
- data-testid="apply-filters"
- data-testid="clear-filters"
```

#### **4. Revertir .gitignore:**
```diff
- # Testing artifacts
- playwright-report/
- test-results/
- *.zip
```

---

## 📈 7. MÉTRICAS ESPERADAS

### **Antes (E2E actual):**
- **Navegadores:** 5 (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- **Servidor:** `npm run dev` (lento, puerto variable)
- **Artefactos:** Video + screenshot + trace por defecto
- **Tiempo estimado:** 5-10 minutos por spec
- **Workers:** Sin límite (paralelización completa)

### **Después (Suite smoke):**
- **Navegadores:** 1 (Chromium únicamente)
- **Servidor:** `npm run preview` (rápido, puerto 4173 fijo)
- **Artefactos:** Solo screenshot en fallos, sin video
- **Tiempo estimado:** 1-2 minutos por spec
- **Workers:** Limitado a 2 (balance entre velocidad y estabilidad)

### **Mejora esperada:**
- **Velocidad:** 3-5x más rápido
- **Estabilidad:** Menos flakiness (un solo navegador)
- **Recursos:** Menos CPU/memoria
- **CI/CD:** Ideal para validación rápida

---

## 🎯 8. ESTRUCTURA FINAL PROPUESTA

```
tests/
└── e2e/
    ├── smoke/                    # 🆕 SUITE NUEVA (rápida)
    │   ├── catalog-to-detail.spec.js
    │   └── filter-flow.spec.js
    ├── extended/                 # 📁 SUITE EXISTENTE (lenta)
    │   ├── navigation.spec.js
    │   └── vehicles-flow.spec.js
    └── vehicles-flow.spec.js     # 📁 SUITE EXISTENTE (lenta)

playwright.config.js              # 📁 CONFIGURACIÓN ACTUAL (5 navegadores)
playwright.smoke.config.ts        # 🆕 CONFIGURACIÓN NUEVA (1 navegador)
```

---

## 🔍 9. ANÁLISIS DE RIESGOS

### **Riesgo Bajo:**
- Agregar data-testid (solo atributos HTML)
- Crear archivos de configuración
- Crear specs de test

### **Riesgo Medio:**
- Cambiar puerto de preview (puede afectar otros procesos)
- Modificar scripts de package.json

### **Riesgo Alto:**
- Ninguno identificado

---

## 📝 10. RESUMEN DE ARCHIVOS A MODIFICAR

| Archivo | Tipo | Líneas | Descripción |
|---------|------|--------|-------------|
| `package.json` | **MODIFICAR** | 2 | Agregar scripts smoke |
| `playwright.smoke.config.ts` | **CREAR** | 60 | Configuración smoke |
| `tests/e2e/smoke/catalog-to-detail.spec.js` | **CREAR** | 25 | Test catálogo→detalle |
| `tests/e2e/smoke/filter-flow.spec.js` | **CREAR** | 30 | Test flujo filtros |
| `src/components/vehicles/List/VehiclesList.jsx` | **MODIFICAR** | 2 | Agregar data-testid |
| `src/components/vehicles/Card/CardAuto/CardAuto.jsx` | **MODIFICAR** | 2 | Agregar data-testid |
| `src/components/vehicles/Filters/filters/FilterFormSimplified/FilterFormSimplified.jsx` | **MODIFICAR** | 3 | Agregar data-testid |
| `.gitignore` | **MODIFICAR** | 3 | Agregar testing artifacts |

**Total de archivos:** 8  
**Total de líneas:** 127 líneas  
**Límite establecido:** 60 líneas por archivo ✅  

---

## 🚀 11. PRÓXIMOS PASOS SUGERIDOS

1. **Revisar diffs** - Verificar que las rutas y nombres coincidan con tu repo
2. **Aprobar cambios** - Confirmar que los data-testid y configuraciones son correctos
3. **Aplicar cambios** - Implementar los diffs en el orden especificado
4. **Probar suite smoke** - Ejecutar `npm run e2e:smoke` para validar
5. **Integrar en CI/CD** - Usar suite smoke para validación rápida

---

**Documento creado:** `docs/testing/dry-run-smoke-suite.md`  
**Estado:** ✅ DRY-RUN completo y detallado  
**Próximo paso:** Tu análisis y aprobación para implementar 