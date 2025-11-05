# 📊 Coverage Baseline - Indiana Usados

**Fecha:** 4 de noviembre de 2025  
**Después de:** Corrección de 3 tests fallando (ETAPA 0)  
**Tests totales:** 77/77 (100% passing)

---

## 📈 MÉTRICAS GENERALES

```
╔════════════════════════════════════════╗
║   COVERAGE BASELINE - INICIAL          ║
╠════════════════════════════════════════╣
║  Statements:  23.11%  🔴               ║
║  Branches:    38.03%  🔴               ║
║  Functions:   11.17%  🔴               ║
║  Lines:       23.11%  🔴               ║
╚════════════════════════════════════════╝
```

**Objetivo:** Llevar a 70% en 4 semanas

---

## 🗂️ ANÁLISIS POR CATEGORÍA

### ✅ EXCELENTE (>80%)
```
constants/           100%    ✅ (filterOptions, forms, imageSizes, index)
config/auth.js       100%    ✅
config/reactQuery.js 100%    ✅
CardAuto.jsx         93.98%  ✅ (gracias a tests recién corregidos)
assets/index.js      90.9%   ✅
ui/icons/            88.63%  ✅ (CalendarIcon, GearboxIcon, RouteIcon)
utils/filters.js     84.26%  ✅
```

### 🟡 BUENO (60-80%)
```
mappers/vehicleMapper.js  70.31%  🟡 (mejora: líneas 164-191)
config/index.js           68.91%  🟡 (mejora: líneas 113-155)
config/                   67.37%  🟡 (promedio)
utils/                    61.62%  🟡 (promedio)
formatters.js             62.37%  🟡
imageUtils.js             59.83%  🟡
vehiclesApi.js            58.69%  🟡 (CRÍTICO - mejorar a 90%+)
```

### 🔴 BAJO (30-60%)
```
api/axiosInstance.js      48.81%  🔴 (líneas 83-143)
hooks/perf/               44.57%  🔴
services/                 37.5%   🔴 (CRÍTICO)
services/admin/           52.5%   🔴
```

### 🔴 MUY BAJO (<30%)
```
hooks/vehicles/           31.07%  🔴 (CRÍTICO)
  - useVehiclesList.js    26.47%
  - useVehicleDetail.js   25.77%

hooks/auth/useAuth.js      8.51%  🔴 (CRÍTICO SEGURIDAD)
hooks/admin/              14.74%  🔴 (CRÍTICO)
  - useCarMutation.js     14.83%

hooks/ui/                 11.22%  🔴
components/ (mayoría)      0-5%   🔴 (CRÍTICO)
pages/ (todas)             0%     🔴 (BAJO prioridad)
```

---

## 🎯 ARCHIVOS PRIORITARIOS PARA TESTING

### 🔴 PRIORIDAD URGENTE (Semana 1)

#### 1. Hooks de Vehículos
```javascript
✅ useVehiclesList.js     (26.47% → 85%+)
   Líneas sin coverage: 19-68
   Tests requeridos: 8
   Impacto: ALTO (lista principal)

✅ useVehicleDetail.js    (25.77% → 85%+)
   Líneas sin coverage: 33-109
   Tests requeridos: 6
   Impacto: ALTO (detalle individual)
```

#### 2. Hook de Autenticación
```javascript
⚠️ useAuth.js            (8.51% → 90%+)
   Líneas sin coverage: 24-211
   Tests requeridos: 8
   Impacto: CRÍTICO (seguridad)
```

#### 3. Hook Admin
```javascript
⚠️ useCarMutation.js     (14.83% → 85%+)
   Líneas sin coverage: 26-155
   Tests requeridos: 6
   Impacto: ALTO (CRUD admin)
```

### 🟡 PRIORIDAD ALTA (Semana 2)

#### 4. Services/API
```javascript
vehiclesApi.js           (58.69% → 90%+)
   Líneas sin coverage: 23-34, 41-47
   Tests requeridos: 12
   Impacto: CRÍTICO (backend)

authService.js           (26.89% → 90%+)
   Líneas sin coverage: 82-138
   Tests requeridos: 6
   Impacto: CRÍTICO (seguridad)

axiosInstance.js         (48.81% → 85%+)
   Líneas sin coverage: 83-143
   Tests requeridos: 8
   Impacto: ALTO (interceptors)
```

### 🟢 PRIORIDAD MEDIA (Semana 3)

#### 5. Componentes Críticos
```javascript
FilterFormSimplified.jsx (0% → 70%+)
   Tests requeridos: 10
   Impacto: ALTO (UX principal)

AutosGrid.jsx            (0% → 70%+)
   Tests requeridos: 8
   Impacto: ALTO (renderizado lista)

VehicleDetail.jsx        (0% → 70%+)
   Tests requeridos: 8
   Impacto: MEDIO (detalle)

ErrorBoundary.jsx        (0% → 80%+)
   Tests requeridos: 6
   Impacto: MEDIO (manejo errores)
```

---

## 📊 COBERTURA POR TIPO DE ARCHIVO

### Utils (61.62% - 🟡 Medio)
```
cloudinaryUrl.js      76.27%  🟢 (mejora: 126-155)
filters.js            84.26%  ✅ (mejora: 150-178)
formatters.js         62.37%  🟡 (mejora: 52, 81-101)
imageExtractors.js    69.54%  🟡 (mejora: 157-203)
imageNormalizerOpt.   51.89%  🔴 (mejora: 103-161)
imageUtils.js         59.83%  🟡 (mejora: 73-128)
logger.js             25.31%  🔴 (mejora: 104-113)
files.js               0%     🔴 (mejora: todo)
preload.js             0%     🔴 (mejora: todo)
```

### Mappers (74.66% - 🟢 Bueno)
```
vehicleMapper.js      70.31%  🟢 (mejora: 164-191)
toAdminListItem.js    33.33%  🔴 (mejora: 17-48)
```

### Config (67.37% - 🟡 Medio)
```
auth.js              100%     ✅
reactQuery.js        100%     ✅
index.js              68.91%  🟡 (mejora: 113-155)
images.js              0%     🔴 (mejora: todo)
```

### Constants (100% - ✅ Perfecto)
```
filterOptions.js     100%     ✅
forms.js             100%     ✅
imageSizes.js        100%     ✅
index.js             100%     ✅
```

### Hooks (Promedio: ~25% - 🔴 Crítico)
```
auth/useAuth.js        8.51%  🔴 CRÍTICO
admin/useCarMutation  14.83%  🔴 CRÍTICO
vehicles/useVehList   26.47%  🔴 CRÍTICO
vehicles/useVehDetail 25.77%  🔴 CRÍTICO
perf/usePreloadImages 63.47%  🟡
perf/usePreloadRoute   4.93%  🔴
ui/useDeviceDetect    21.42%  🔴
ui/useScrollPosition   4.31%  🔴
images/useImageOpt    75%     🟢
```

### Services (37.5% - 🔴 Bajo)
```
vehiclesApi.js        58.69%  🔴 CRÍTICO
authService.js        26.89%  🔴 CRÍTICO
admin/vehiclesAdm     52.5%   🔴
```

### Components (Promedio: ~5% - 🔴 Muy Bajo)
```
CardAuto.jsx          93.98%  ✅ ← ¡Único con tests!
CloudinaryImage.jsx   54.3%   🔴
ui/icons/             88.63%  ✅
Resto                  0%     🔴 CRÍTICO
```

### Pages (0% - 🔴 Sin Coverage)
```
Todas las páginas      0%     🔴 (baja prioridad)
```

---

## 🎯 PLAN DE MEJORA POR ETAPA

### ETAPA 2: Hooks (Semana 1)
**Objetivo:** 25% → 75% en hooks críticos

```
Tests a escribir:
- useVehiclesList:    8 tests  →  85% coverage
- useVehicleDetail:   6 tests  →  85% coverage
- useCarMutation:     6 tests  →  85% coverage
- useAuth:            8 tests  →  90% coverage
Total: 28 tests nuevos
Impacto: +38 puntos de coverage en hooks
```

### ETAPA 3: Services (Semana 2)
**Objetivo:** 37.5% → 85% en services

```
Tests a escribir:
- vehiclesApi:       12 tests  →  90% coverage
- axiosInstance:      8 tests  →  85% coverage
- authService:        6 tests  →  90% coverage
Total: 26 tests nuevos
Impacto: +47 puntos de coverage en services
```

### ETAPA 4: Components (Semana 3)
**Objetivo:** 5% → 60% en components críticos

```
Tests a escribir:
- FilterFormSimpl:   10 tests  →  70% coverage
- AutosGrid:          8 tests  →  70% coverage
- VehicleDetail:      8 tests  →  70% coverage
- ErrorBoundary:      6 tests  →  80% coverage
Total: 32 tests nuevos
Impacto: +55 puntos de coverage en components
```

---

## 📈 PROYECCIÓN DE COVERAGE

```
ACTUAL (4 nov 2025):
├── Statements:  23.11%
├── Branches:    38.03%
├── Functions:   11.17%
└── Lines:       23.11%

DESPUÉS ETAPA 2 (11 nov):
├── Statements:  ~40%
├── Branches:    ~50%
├── Functions:   ~35%
└── Lines:       ~40%

DESPUÉS ETAPA 3 (18 nov):
├── Statements:  ~55%
├── Branches:    ~60%
├── Functions:   ~50%
└── Lines:       ~55%

DESPUÉS ETAPA 4 (25 nov):
├── Statements:  ~70%  ✅ OBJETIVO
├── Branches:    ~65%
├── Functions:   ~65%
└── Lines:       ~70%  ✅ OBJETIVO
```

---

## 🔍 ARCHIVOS QUE NECESITAN MEJORA URGENTE

### Top 10 Archivos Críticos Sin Coverage

1. **useAuth.js** (8.51%) - Autenticación/Seguridad
2. **useCarMutation.js** (14.83%) - Mutaciones Admin
3. **useVehiclesList.js** (26.47%) - Lista Principal
4. **useVehicleDetail.js** (25.77%) - Detalle
5. **authService.js** (26.89%) - API Auth
6. **logger.js** (25.31%) - Logging
7. **axiosInstance.js** (48.81%) - HTTP Client
8. **toAdminListItem.js** (33.33%) - Mapeo Admin
9. **FilterFormSimplified** (0%) - Formulario Principal
10. **AutosGrid** (0%) - Renderizado Lista

---

## 📝 NOTAS

### Archivos que NO necesitan tests (correctamente al 0%):
- `index.js` (exporters)
- `*.module.css` (estilos)
- Páginas de contenido estático (baja prioridad)

### Archivos con coverage engañoso:
- **CloudinaryImage** (54%): Parece medio pero faltan tests de errores
- **vehiclesApi** (58%): Parece medio pero es CRÍTICO, necesita 90%+

### Warnings a ignorar:
- React Router Future Flags (no afectan tests)

---

## 🎯 SIGUIENTE ACCIÓN

**AHORA:** Continuar con ETAPA 1 (Paso 2-4)
**LUEGO:** Empezar ETAPA 2 - Tests de Hooks

**Comando para re-generar este reporte:**
```bash
npm run test:coverage
open coverage/index.html  # Ver reporte HTML visual
```

---

*Documento generado: 4 de noviembre de 2025, 19:38*  
*Próxima actualización: Después de ETAPA 2 (11 nov 2025)*


