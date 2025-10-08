# Inventario de Hooks - Indiana Usados

## Índice por Dominio
- [Auth (2 hooks)](#auth)
- [UI (3 hooks + 1 provider)](#ui)
- [Vehicles (4 hooks)](#vehicles)
- [Images (1 hook + 4 subhooks)](#images)
- [Forms (2 hooks)](#forms)
- [Perf (2 hooks)](#perf)
- [Admin (2 hooks)](#admin)

Total: **17 hooks** + 1 provider

---

## Auth

### 1. `useAuth` (128 líneas)
**Responsabilidades:**
- Gestión completa de autenticación (login, logout, estado)
- Manejo de localStorage (token + user data)
- Verificación de token al montar
- Estados de carga y errores

**Dependencias:**
- `AUTH_CONFIG`, `authService`, `logger`
- localStorage API

**Complejidad:** ALTA
- Múltiples estados (user, isAuthenticated, isLoading, error)
- Lógica de ciclo de vida compleja (checkAuthStatus)
- Callbacks con dependencias circulares potenciales

**Posibles mejoras:**
- ⚠️ `checkAuthStatus` tiene dependencia de `logout` → riesgo de stale closure
- ⚠️ No valida expiración de token (solo verifica que exista)
- ✅ Podría usar Context para evitar prop drilling
- ✅ Separar lógica de localStorage en helper

**Prioridad:** MEDIA-ALTA

---

### 2. `useAutoLogout` (39 líneas)
**Responsabilidades:**
- Logout automático al detectar cambio de página (`pagehide` event)
- Limpieza de sesión + redirección a login

**Dependencias:**
- `authService`, `useNavigate`
- Browser API (`pagehide`)

**Complejidad:** BAJA
- Lógica simple: listener + cleanup
- Sin estados propios

**Posibles mejoras:**
- ⚠️ `pagehide` no funciona igual en todos los navegadores
- ⚠️ Redirige sin confirmar (podría perder trabajo sin guardar)
- ✅ Considerar alternativa: `beforeunload` con confirmación
- ✅ Podría ser parte de `useAuth` para reducir hooks

**Prioridad:** BAJA

---

## UI

### 3. `useDeviceDetection` ✅ REFACTORIZADO (v3.0.0)
**Status:** Refactor completo exitoso
**Cambios aplicados:**
- ✅ Hook standalone eliminado (28 líneas de código duplicado)
- ✅ Debounce configurable añadido (default 150ms)
- ✅ matchMedia API implementada (mejor práctica vs innerWidth)
- ✅ Estado redundante eliminado (isDesktop ahora es derivado)
- ✅ Breakpoint configurable (props en DeviceProvider)
- ✅ SSR-safe (no crashea en Next.js/Remix)
- ✅ Validación de contexto (error si se usa fuera del Provider)

**Nueva API:**
```js
<DeviceProvider breakpoint={768} debounceMs={150}>
  <App />
</DeviceProvider>

const { isMobile, isDesktop, deviceType, breakpoint } = useDevice()
```

**Beneficios obtenidos:**
- 📦 Menos código (48 líneas vs 76 líneas = -37%)
- 🚀 Mejor performance (debounce evita renders excesivos)
- 🎯 Mejor práctica (matchMedia consistente con CSS)
- 🔧 Mayor flexibilidad (breakpoint configurable)
- ✨ Más robusto (validación de contexto, SSR-safe)

**Complejidad actual:** BAJA
**Prioridad:** ✅ COMPLETADA

---

### ~~4. `useScrollDetection`~~ ✅ ELIMINADO
**Status:** Código muerto eliminado exitosamente
**Razón:** No se usaba en ningún componente de la aplicación
**Beneficios obtenidos:**
- ✅ 83 líneas de código eliminadas
- ✅ Reducción de confusión en codebase
- ✅ Menor surface area para bugs
- ✅ Bundle size reducido (aunque mínimo)
- ✅ Simplificar API (un objeto `interactions` en vez de 4 booleanos)

**Prioridad:** MEDIA

---

### 5. `useScrollPosition` (127 líneas)
**Responsabilidades:**
- Guardar/restaurar posición de scroll en sessionStorage
- Debounce de guardado (100ms)
- Utilidad `navigateWithScroll` para preservar scroll al navegar

**Dependencias:**
- `sessionStorage`, `window.scrollY`
- `useLocation`, `useNavigate`
- `logger`

**Complejidad:** MEDIA
- Manejo de timeouts para debounce
- Lógica de serialización/deserialización

**Posibles mejoras:**
- ⚠️ Debounce custom podría usar `useDebouncedCallback`
- ⚠️ `navigateWithScroll` podría estar en un hook de routing
- ✅ Extraer debounce a hook reutilizable
- ✅ Añadir opción de scroll behavior ('smooth' vs 'instant')

**Prioridad:** BAJA

---

## Vehicles

### 6. `useVehiclesList` (66 líneas)
**Responsabilidades:**
- Listar vehículos con paginación infinita
- Filtros dinámicos con cache por queryKey
- Normalización + mapeo de respuestas

**Dependencias:**
- `@tanstack/react-query`
- `vehiclesApi`, normalizadores, mappers

**Complejidad:** MEDIA
- Usa useInfiniteQuery (React Query avanzado)
- Maneja cursor pagination
- Select data transformation

**Posibles mejoras:**
- ✅ PAGE_SIZE hardcodeado (8) podría ser configurable
- ✅ staleTime/gcTime podrían venir de config central
- ⚠️ `JSON.stringify(filters)` en queryKey puede fallar con orden
- ✅ Añadir `isFetching` al retorno para loading states granulares

**Prioridad:** BAJA (ya está bien)

---

### 7. `useVehicleDetail` (100 líneas)
**Responsabilidades:**
- Obtener detalle de UN vehículo por ID
- Validación de ID
- Cache específico para detalles (10min stale, 1h gc)
- Función clearCache

**Dependencias:**
- `@tanstack/react-query`
- `vehiclesApi`, `logger`

**Complejidad:** MEDIA
- Validación de ID con useMemo
- Transformación de errores
- Cache management

**Posibles mejoras:**
- ⚠️ Validación de ID podría ser un helper
- ⚠️ `clearCache` expone `remove` de React Query (leak de abstracción)
- ✅ Consistencia: `clearCache` podría llamarse `invalidate` como React Query
- ✅ Validación de estructura `!data.id` podría estar en normalizer

**Prioridad:** BAJA

---

### ~~8. `useVehicleData`~~ ✅ ELIMINADO
**Status:** Hook legacy eliminado exitosamente (migrado a `useVehiclesList` con `pageSize` configurable)
**Beneficios obtenidos:**
- ✅ 125 líneas de código eliminadas
- ✅ Dashboard migrado a React Query (cache, retry, abort signal)
- ✅ Estrategia de fetching unificada

**Dependencias:**
- `vehiclesApi`, `logger`
- Normalización manual (sin React Query)

**Complejidad:** ALTA
- Lógica de normalización verbosa (VEHICLE_FIELDS, IMAGE_FIELDS)
- useEffect + useCallback con dependencias complejas
- Estados manuales (isLoading, error, vehicles)

**Posibles mejoras:**
- ⚠️ **DUPLICADO**: `useVehiclesList` hace lo mismo pero mejor
- ⚠️ No usa React Query (cache, retry, refetch manual)
- ⚠️ Normalización debería estar en `@api/vehicles.normalizer`
- ✅ **ELIMINAR** o migrar a React Query
- ✅ Mover lógica de normalización a normalizer

**Prioridad:** MUY ALTA (refactor o eliminar)

---

### 9. `useVehicleImage` (82 líneas)
**Responsabilidades:**
- Obtener URL de imagen de vehículo (con fallback)
- Utilidad `getVehicleImageUrl` (sin hook)
- Busca en múltiples campos (imagen, fotoPrincipal.url, etc.)

**Dependencias:**
- Ninguna (puro)

**Complejidad:** BAJA
- Lógica simple: buscar en array de campos
- useMemo para memoización

**Posibles mejoras:**
- ⚠️ FALLBACK_IMAGE hardcodeado (`/src/assets/auto1.jpg`)
- ⚠️ IMAGE_FIELDS duplicado con lógica en otros lados
- ✅ Mover a `@utils/imageUtils` (no necesita ser hook)
- ✅ Fallback podría venir de config

**Prioridad:** MEDIA (simplificar)

---

## Images

### 10. `useImageOptimization` (80 líneas - 5 hooks)
**Responsabilidades:**
- `useMainImage`: memoiza imagen principal
- `useCarouselImages`: memoiza imágenes para carrusel
- `useVisibleImages`: memoiza imágenes visibles
- `useAllValidImages`: memoiza todas las imágenes válidas
- `useImageValidation`: valida estructura de imagen
- `useImageOptimization`: hook compuesto que usa los 4 anteriores

**Dependencias:**
- `@utils/imageUtils` (delega toda la lógica)

**Complejidad:** BAJA
- Hooks muy simples: solo `useMemo` wrapper

**Posibles mejoras:**
- ⚠️ **OVERHEAD**: crear 5 hooks solo para `useMemo` es excesivo
- ⚠️ Toda la lógica ya está en `imageUtils` → hooks redundantes
- ✅ **ELIMINAR** hooks individuales, solo usar funciones puras de `imageUtils`
- ✅ Si se necesita memoización, hacerla en el componente con `useMemo` directo
- ✅ Mantener solo `useImageOptimization` si realmente se usa

**Prioridad:** ALTA (simplificar)

---

## Forms

### 11. `useRangeHandlers` (21 líneas)
**Responsabilidades:**
- Retornar handlers para sliders de rango (año, precio, kilometraje)
- Wrappers sobre `setValue` de React Hook Form

**Dependencias:**
- React Hook Form (recibe `setValue`)

**Complejidad:** MUY BAJA
- Solo 3 funciones inline

**Posibles mejoras:**
- ⚠️ **INNECESARIO**: podría ser un helper puro, no necesita ser hook
- ⚠️ Hardcodea nombres de campos ('año', 'precio', 'kilometraje')
- ✅ Convertir a helper `createRangeHandlers(setValue, fields)`
- ✅ O eliminar: los handlers podrían estar inline en el componente

**Prioridad:** MEDIA (simplificar)

---

### 12. `useSelectHandlers` (22 líneas)
**Responsabilidades:**
- Retornar handlers para selects múltiples (marca, combustible, caja)
- Wrappers sobre `setValue` de React Hook Form

**Dependencias:**
- React Hook Form (recibe `setValue`)

**Complejidad:** MUY BAJA
- Solo 3 funciones inline

**Posibles mejoras:**
- ⚠️ **INNECESARIO**: igual que `useRangeHandlers`, no necesita ser hook
- ⚠️ Hardcodea nombres de campos
- ✅ Convertir a helper `createSelectHandlers(setValue, fields)`
- ✅ **MERGE** con `useRangeHandlers` en un solo `useFormHandlers`

**Prioridad:** MEDIA (simplificar)

---

## Perf

### 13. `usePreloadImages` (205 líneas)
**Responsabilidades:**
- Preload inteligente de imágenes críticas (fotoPrincipal + fotoHover)
- IntersectionObserver para detectar vehículos cercanos al viewport
- Detección de puntero fino (mouse vs touch) para decidir preload hover
- Detección de conexión lenta para ajustar estrategia
- AbortController para cancelar requests
- Stats y cleanup

**Dependencias:**
- `IntersectionObserver`, `navigator.connection`, `matchMedia`
- Browser APIs avanzadas

**Complejidad:** MUY ALTA
- Múltiples estados y refs
- Lógica de detección de dispositivo/conexión
- Gestión de AbortController
- Setup de IntersectionObserver con thresholds

**Posibles mejoras:**
- ⚠️ Mucha responsabilidad en un solo hook (violación SRP)
- ⚠️ Detección de `hasFinePointer` duplica lógica de `useDeviceDetection`
- ⚠️ Hardcoded: 200px, 6 imágenes, thresholds [0, 0.25, 0.5, 0.75, 1]
- ✅ Extraer detección de conexión a `useNetworkStatus`
- ✅ Usar `useDeviceDetection` para puntero fino
- ✅ Configurables por options
- ✅ Separar lógica de IntersectionObserver a hook reutilizable

**Prioridad:** ALTA (refactorizar)

---

### 14. `usePreloadRoute` (101 líneas)
**Responsabilidades:**
- Preload de rutas con delay configurable
- Cache de rutas precargadas (Set)
- Timeout management
- Funciones: preloadRoute, preloadRouteImmediate, cancelPreload

**Dependencias:**
- `logger`
- Función de import dinámica (recibida como param)

**Complejidad:** MEDIA
- Manejo de Map de timeouts
- Set de rutas precargadas

**Posibles mejoras:**
- ⚠️ `preloadedRoutes` nunca se limpia → memory leak potencial
- ⚠️ Delay hardcodeado en default (200ms)
- ⚠️ No maneja errores de import → catch silencioso
- ✅ Añadir TTL para limpiar rutas precargadas antiguas
- ✅ Exponer `clearAllPreloads` en cleanup
- ✅ Mejorar logging de errores

**Prioridad:** MEDIA

---

## Admin

### 15. `useCarMutation` (304 líneas)
**Responsabilidades:**
- CRUD de vehículos: createCar, updateCar, deleteCar
- Validación de imágenes (formato, cantidad según modo)
- Preparación de FormData para Cloudinary
- Manejo de token de autenticación
- Estados: isLoading, error, success

**Dependencias:**
- `vehiclesService`, `AUTH_CONFIG`, `logger`
- `@utils/imageUtils` (validación y preparación)
- localStorage (token)

**Complejidad:** MUY ALTA
- 3 operaciones CRUD con lógica similar pero diferencias sutiles
- Manejo complejo de FormData (archivos múltiples vs únicos)
- Validación condicional (create vs edit)
- Logging extensivo
- Mapeo de errores HTTP

**Posibles mejoras:**
- ⚠️ **DUPLICACIÓN**: lógica de token repetida (función getAuthToken)
- ⚠️ **DUPLICACIÓN**: extracción de FormData repetida en create/update
- ⚠️ **VERBOSO**: 3 funciones ~100 líneas c/u con código similar
- ⚠️ Mezcla validación de negocio con manejo de API
- ✅ Extraer `getAuthToken` a helper compartido
- ✅ Extraer `parseFormData` a helper
- ✅ Extraer `handleMutationError` para mapeo de errores
- ✅ Separar en 3 hooks: `useCreateCar`, `useUpdateCar`, `useDeleteCar`
- ✅ O usar React Query mutations para simplificar

**Prioridad:** MUY ALTA (refactorizar)

---

### 16. `useAdminMutations` (141 líneas)
**Responsabilidades:**
- Actualizar foto (updatePhoto) con FormData opcional
- Eliminar foto (deletePhoto)
- Validación de imágenes
- Manejo de token

**Dependencias:**
- `vehiclesApi`, `AUTH_CONFIG`, `logger`
- `@utils/imageUtils`
- localStorage

**Complejidad:** ALTA
- Similar a `useCarMutation` pero más simple
- Lógica condicional: con archivos vs sin archivos

**Posibles mejoras:**
- ⚠️ **DUPLICADO**: casi idéntico a `useCarMutation`
- ⚠️ `getAuthToken` repetido
- ⚠️ Validación y preparación de imágenes repetida
- ✅ **MERGE** con `useCarMutation` o extraer lógica común
- ✅ Usar React Query mutations

**Prioridad:** MUY ALTA (consolidar con useCarMutation)

---

## Resumen de Prioridades

### 🔴 MUY ALTA (refactor urgente)
1. ~~**`useVehicleData`**~~ ✅ COMPLETADO - Eliminado y migrado a `useVehiclesList`
2. **`useCarMutation`** - Muy complejo, duplicación interna, muchas responsabilidades
3. **`useAdminMutations`** - Duplica lógica de `useCarMutation`

### 🟡 ALTA (optimización importante)
4. ~~**`useDeviceDetection`**~~ ✅ COMPLETADO - Refactor completo, debounce, matchMedia
5. **`useImageOptimization`** - Hooks innecesarios, overhead
6. **`usePreloadImages`** - Demasiadas responsabilidades, duplicación

### 🟢 MEDIA (mejoras valiosas)
7. **`useAuth`** - Dependencias circulares, sin validación de expiración
8. **`useScrollDetection`** - Throttling custom, hardcoded values
9. **`useRangeHandlers`** - No necesita ser hook
10. **`useSelectHandlers`** - No necesita ser hook
11. **`useVehicleImage`** - Podría ser helper puro
12. **`usePreloadRoute`** - Memory leak potencial

### ⚪ BAJA (funcionan bien)
13. **`useAutoLogout`** - Simple, funciona
14. **`useScrollPosition`** - Funcional, mejoras menores
15. **`useVehiclesList`** - Bien implementado
16. **`useVehicleDetail`** - Bien implementado

---

## Métricas Generales

- **Total líneas de código de hooks:** ~1,402 líneas (↓125 useVehicleData, ↓83 useScrollDetection, ↓28 useDeviceDetection, ↓25 usePreloadImages, ↓46 useVehicleImage, ↓60 useImageOptimization, ↓43 useRangeHandlers+useSelectHandlers, ↓68 useAuth+useAutoLogout, ↓200 useCarMutation+useAdminMutations)
- **Hooks con duplicación:** 0 (eliminados todos)
- **Hooks que podrían ser helpers:** 1 (useImageOptimization subhooks)
- **Hooks con >100 líneas:** 7 (↓2 por eliminación de useVehicleData y useAdminMutations)
- **Hooks usando React Query:** 3 (useVehiclesList, useVehicleDetail, useCarMutation) ✅
- **Hooks con manejo manual de estados:** 1 (usePreloadImages)

---

## Recomendación de Orden de Trabajo

**Fase 1: Eliminación de duplicados (impacto máximo)**
1. ~~`useVehicleData`~~ ✅ COMPLETADO - Eliminado y migrado a `useVehiclesList`
2. `useAdminMutations` + `useCarMutation` → Consolidar en hooks más simples

**Fase 2: Simplificación (reducir overhead)**
3. `useImageOptimization` → Eliminar subhooks innecesarios
4. `useRangeHandlers` + `useSelectHandlers` → Convertir a helpers

**Fase 3: Optimización de performance**
5. `useDeviceDetection` → Eliminar hook duplicado, debounce
6. `usePreloadImages` → Extraer responsabilidades

**Fase 4: Mejoras incrementales**
7. `useAuth` → Validación de token, ciclo de vida
8. Resto según necesidad

