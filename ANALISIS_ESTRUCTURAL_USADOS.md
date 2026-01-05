# Análisis Estructural – Página de Usados

## Resumen Ejecutivo

**Estado actual:** Página funcional con arquitectura compleja que mezcla responsabilidades de UI, negocio y DOM.

**Enfoque:** Mapear el terreno sin proponer soluciones, identificar riesgos reales y priorizar áreas de análisis.

---

## 1. Componentes Existentes y Responsabilidades

### 1.1. Página Principal: `Vehiculos.jsx`

**Ubicación:** `src/pages/Vehiculos/Vehiculos.jsx` (273 líneas)

**Responsabilidades actuales:**

#### A. Orquestación de Estado (Líneas 47-83)
- ✅ Gestión de URL state (filtros y sorting sincronizados con URL)
- ✅ Estado local de sorting (`selectedSort`, `isSortDropdownOpen`)
- ✅ Estado local de marca (`localMarca`) - **⚠️ PROBLEMÁTICO**
- ✅ Sincronización URL ↔ Estado local
- ✅ Detección de datos mock

**Lógica mezclada:**
- URL es fuente de verdad para fetch
- Estado local es fuente de verdad para sorting (frontend)
- Estado local de marca cuando formulario está abierto (lógica compleja)

#### B. Coordinación de Componentes (Líneas 96-158)
- ✅ Handlers para filtros (`onApply`, `onClear`)
- ✅ Handler para carrusel de marcas (`handleBrandSelect`) - **⚠️ LÓGICA COMPLEJA**
- ✅ Handlers para sorting (`handleSortClick`, `handleSortChange`)
- ✅ Comunicación con `FilterFormSimple` mediante refs

**Problema:** Lógica de sincronización entre carrusel, formulario y URL es compleja y frágil.

#### C. Layout y Renderizado (Líneas 160-270)
- ✅ Renderizado de título y banner
- ✅ Renderizado de carrusel de marcas
- ✅ Renderizado de formulario de filtros
- ✅ Renderizado de botones de acción
- ✅ Renderizado de grid de vehículos
- ✅ Renderizado de botón "Volver"

**Responsabilidad:** Orquestación correcta, pero mezcla lógica de negocio con UI.

---

### 1.2. Componente de Filtros: `FilterFormSimple.jsx`

**Ubicación:** `src/components/vehicles/Filters/FilterFormSimple.jsx` (455 líneas)

**Responsabilidades actuales:**

#### A. Gestión de Estado de Filtros (Líneas 50-113)
- ✅ Estado local de filtros (marca, caja, combustible, año, precio, kilometraje)
- ✅ Sincronización con URL (`parseFilters`)
- ✅ Conteo de filtros activos

#### B. Gestión de UI Mobile/Desktop (Líneas 38-99)
- ✅ Estado de visibilidad desktop (`isVisibleDesktop`)
- ✅ Estado de drawer mobile (`isDrawerOpen`)
- ✅ Bloqueo de scroll del body cuando drawer está abierto
- ✅ Sincronización de estados al cambiar dispositivo

**Problema:** Manejo directo del DOM (`document.body.style`) mezclado con lógica de React.

#### C. Event Listeners del DOM (Líneas 115-177)
- ✅ Listener de scroll para botones móviles
- ✅ Listener de click outside para dropdowns
- ✅ Listener de teclado (Escape)
- ✅ Focus management

**Problema:** Múltiples listeners del DOM mezclados con lógica de React.

#### D. API Imperativa mediante Refs (Líneas 241-261)
```javascript
React.useImperativeHandle(ref, () => ({
  toggleDrawer,
  closeDrawer,
  isDrawerOpen,
  toggleFilters,
  showFilters,
  hideFilters,
  isFiltersVisible,
  updateMarcaFilter, // ⚠️ Método para actualizar desde afuera
  getCurrentFilters, // ⚠️ Método para obtener estado desde afuera
}))
```

**Problema:** API imperativa compleja que expone estado interno, acoplamiento fuerte con el padre.

#### E. Renderizado Condicional Mobile/Desktop (Líneas 435-445)
- ✅ Renderizado diferente según `isMobile`
- ✅ Mismo contenido, diferente contenedor

**Responsabilidad:** Presentación correcta, pero lógica de UI mezclada con lógica de negocio.

---

### 1.3. Componente de Grid: `AutosGrid.jsx`

**Ubicación:** `src/components/vehicles/List/ListAutos/AutosGrid.jsx` (145 líneas)

**Responsabilidades actuales:**

#### A. Renderizado del Grid (Líneas 72-89)
- ✅ Memoización de grid de vehículos
- ✅ Keys estables basadas en ID
- ✅ Wrapper memoizado para cada card

#### B. Estados de UI (Líneas 91-116)
- ✅ Estado de carga inicial (`ListAutosSkeleton`)
- ✅ Estado de error (`ErrorMessage`)
- ✅ Estado vacío (sin vehículos)

#### C. Paginación Infinita (Líneas 125-136)
- ✅ Botón "Cargar más"
- ✅ Estados de loading (`isLoadingMore`)

**Responsabilidad:** Presentación correcta, bien separada de lógica de negocio.

**Fortaleza:** Componente limpio, solo renderiza.

---

### 1.4. Componente de Card: `CardAuto.jsx`

**Ubicación:** `src/components/vehicles/Card/CardAuto/CardAuto.jsx` (213 líneas)

**Responsabilidades actuales:**

#### A. Renderizado de Card (Líneas 118-208)
- ✅ Imagen principal con CloudinaryImage
- ✅ Logo de marca
- ✅ Datos formateados (precio, km, año, caja)
- ✅ Navegación al detalle

#### B. Memoización y Performance (Líneas 82-116)
- ✅ Memoización de datos formateados
- ✅ Memoización de logo
- ✅ Memoización de alt text
- ✅ Preload de imágenes (mediante hook)

#### C. Accesibilidad (Líneas 124-132)
- ✅ `role="button"`
- ✅ `tabIndex={0}`
- ✅ Navegación por teclado (Enter/Space)
- ✅ `aria-label`

**Responsabilidad:** Presentación correcta, bien optimizado.

**Fortaleza:** Componente limpio, bien memoizado, accesible.

---

### 1.5. Componente de Carrusel de Marcas: `BrandsCarousel.jsx`

**Ubicación:** `src/components/vehicles/BrandsCarousel/BrandsCarousel.jsx` (155 líneas)

**Responsabilidades actuales:**

#### A. Scroll Horizontal (Líneas 27-69)
- ✅ Refs del contenedor (`scrollContainerRef`)
- ✅ Estado de scrollability (`canScrollLeft`, `canScrollRight`)
- ✅ Listeners de scroll y resize
- ✅ Funciones de scroll programático (`scrollLeft`, `scrollRight`)

**Problema:** Lógica de scroll mezclada con lógica de presentación.

#### B. Selección de Marcas (Líneas 71-87)
- ✅ Verificación de marca seleccionada (`isBrandSelected`)
- ✅ Handler de click (`handleBrandClick`)
- ✅ Callback al padre (`onBrandSelect`)

**Responsabilidad:** Presentación correcta, pero lógica de scroll debería estar encapsulada.

---

### 1.6. Componente de Dropdown: `SortDropdown.jsx`

**Ubicación:** `src/components/vehicles/Filters/SortDropdown.jsx` (210 líneas)

**Responsabilidades actuales:**

#### A. Gestión de Estado de Apertura (Líneas 28-60)
- ✅ Listener de Escape
- ✅ Listener de click outside
- ✅ Posicionamiento absoluto

#### B. Renderizado de Opciones (Líneas 110-175)
- ✅ Opciones de sorting
- ✅ Estado seleccionado visual
- ✅ Estilos inline (⚠️ PROBLEMÁTICO)

**Problema:** Estilos inline mezclados con lógica, deberían estar en CSS module.

---

### 1.7. Página de Detalle: `VehiculoDetalle.jsx`

**Ubicación:** `src/pages/VehiculoDetalle/VehiculoDetalle.jsx` (105 líneas)

**Responsabilidades actuales:**

#### A. Preservación de Scroll (Líneas 21-30)
- ✅ Hook `useScrollPosition`
- ✅ Scroll hacia arriba al cargar
- ✅ Navegación preservando scroll

**Problema:** Conflicto potencial: scroll hacia arriba al cargar vs preservación de scroll.

#### B. Gestión de Estados (Líneas 32-82)
- ✅ Estado de carga (`DetalleSkeleton`)
- ✅ Estado de error (`ErrorState`)
- ✅ Estado de vehículo no encontrado

**Responsabilidad:** Orquestación correcta, pero conflicto en lógica de scroll.

---

### 1.8. Componente de Detalle: `CardDetalle.jsx`

**Ubicación:** `src/components/vehicles/Detail/CardDetalle/CardDetalle.jsx`

**Responsabilidades actuales:**

#### A. Renderizado de Detalle (Líneas 131-277)
- ✅ Carrusel de imágenes (`ImageCarousel`)
- ✅ Datos principales (año, km, caja)
- ✅ Información adicional
- ✅ Botones de acción (WhatsApp)

#### B. Gestión de Modal de Galería (Líneas 33-109)
- ✅ Estado de modal (`isModalOpen`, `activeIndex`)
- ✅ Handlers de apertura/cierre
- ✅ Cambio de índice

**Responsabilidad:** Presentación correcta, bien separada.

---

## 2. Lógica Mezclada (UI + Negocio + DOM)

### 2.1. Mezcla en `Vehiculos.jsx`

**Problema 1: Estado Local de Marca (Líneas 58-75)**
```javascript
const [localMarca, setLocalMarca] = useState(null)
const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
const currentMarca = isFiltersVisible && localMarca !== null ? localMarca : (urlFilters.marca || [])
```

**Análisis:**
- ⚠️ Estado local duplicado de URL
- ⚠️ Lógica condicional compleja (si formulario abierto → estado local, si cerrado → URL)
- ⚠️ Sincronización frágil entre 3 fuentes: URL, estado local, estado del formulario

**Riesgo:** Desincronización entre URL y estado visual.

---

**Problema 2: Handler de Selección de Marca (Líneas 112-143)**
```javascript
const handleBrandSelect = (brandName) => {
  const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
  
  if (isFiltersVisible) {
    // Lógica compleja para cuando formulario está abierto
    const currentFilters = filterFormRef.current?.getCurrentFilters?.() || { marca: [] }
    // ... más lógica
    setLocalMarca(newMarca)
    filterFormRef.current?.updateMarcaFilter(newMarca)
  } else {
    // Lógica diferente para cuando formulario está cerrado
    const newFilters = { ...urlFilters, marca: newMarca }
    setSp(serializeFilters(newFilters), { replace: false })
  }
}
```

**Análisis:**
- ⚠️ Dos flujos diferentes según estado del formulario
- ⚠️ Acceso a estado interno del formulario mediante refs
- ⚠️ Lógica de negocio mezclada con lógica de UI

**Riesgo:** Bugs difíciles de detectar, comportamiento inconsistente.

---

### 2.2. Mezcla en `FilterFormSimple.jsx`

**Problema 1: Manipulación Directa del DOM (Líneas 74-99)**
```javascript
useEffect(() => {
  if (!isDrawerOpen) return
  
  const scrollY = window.scrollY
  const body = document.body
  
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.overflow = 'hidden'
  
  return () => {
    body.style.position = ''
    // ... restaurar estilos
    window.scrollTo(0, scrollY)
  }
}, [isDrawerOpen])
```

**Análisis:**
- ⚠️ Manipulación directa de `document.body`
- ⚠️ Guardado/restauración manual de scroll
- ⚠️ Lógica de UI mezclada con manipulación de DOM

**Riesgo:** Conflictos con otros componentes que también manipulan el body, problemas en iOS.

---

**Problema 2: Múltiples Listeners del DOM (Líneas 115-177)**
```javascript
// Listener de scroll
useEffect(() => {
  const handleScroll = () => {
    setShowMobileActions(window.scrollY > 100)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Listener de click outside
useEffect(() => {
  const handleClickOutside = (e) => {
    // ... lógica
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [isSortDropdownOpen])
```

**Análisis:**
- ⚠️ Múltiples listeners del DOM
- ⚠️ Lógica de detección mezclada con lógica de negocio
- ⚠️ Posibles memory leaks si cleanup falla

**Riesgo:** Performance, memory leaks, conflictos con otros listeners.

---

**Problema 3: API Imperativa Compleja (Líneas 241-261)**
```javascript
React.useImperativeHandle(ref, () => ({
  toggleDrawer,
  closeDrawer,
  isDrawerOpen,
  toggleFilters,
  showFilters,
  hideFilters,
  isFiltersVisible,
  updateMarcaFilter: (marcaArray) => {
    setFilters(prev => ({ ...prev, marca: marcaArray }))
  },
  getCurrentFilters: () => filters,
}))
```

**Análisis:**
- ⚠️ Exposición de estado interno
- ⚠️ Acoplamiento fuerte con el padre
- ⚠️ Violación de principios React (flujo unidireccional)

**Riesgo:** Difícil de mantener, acoplamiento fuerte, bugs difíciles de detectar.

---

### 2.3. Mezcla en `BrandsCarousel.jsx`

**Problema: Lógica de Scroll Mezclada (Líneas 27-69)**
```javascript
const checkScrollability = () => {
  if (!scrollContainerRef.current) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
  setCanScrollLeft(scrollLeft > 0)
  setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
}

useEffect(() => {
  checkScrollability()
  const container = scrollContainerRef.current
  if (container) {
    container.addEventListener('scroll', checkScrollability)
    window.addEventListener('resize', checkScrollability)
    // ...
  }
}, [])
```

**Análisis:**
- ⚠️ Lógica de scroll mezclada con lógica de presentación
- ⚠️ Listeners de DOM en componente presentacional
- ⚠️ Cálculo de scrollability en cada scroll (puede ser costoso)

**Riesgo:** Performance en scroll rápido, código difícil de reutilizar.

---

### 2.4. Mezcla en `VehiculoDetalle.jsx`

**Problema: Conflicto de Scroll (Líneas 21-30)**
```javascript
const { navigateWithScroll } = useScrollPosition({
  key: 'vehicles-list',
  enabled: true
})

useEffect(() => {
  window.scrollTo(0, 0); // ⚠️ Siempre scroll hacia arriba
}, []);
```

**Análisis:**
- ⚠️ Hook de preservación de scroll habilitado
- ⚠️ Pero `useEffect` siempre hace scroll hacia arriba
- ⚠️ Conflicto: ¿preservar o resetear?

**Riesgo:** Comportamiento inconsistente, scroll no se preserva correctamente.

---

## 3. Patrones que se Repiten Respecto a 0km

### 3.1. Patrón: Scroll Programático + Detección de Scroll

**En 0km:**
- `scrollTo` programático cuando cambia `activeIndex`
- Detección de scroll del usuario para cambiar versión
- Flag para distinguir scroll programático vs usuario

**En Usados:**
- `BrandsCarousel`: Scroll programático con flechas
- `FilterFormSimple`: Scroll del body bloqueado/restaurado
- `useScrollPosition`: Scroll guardado/restaurado

**Diferencia:** En 0km está encapsulado en componente, en Usados está disperso.

---

### 3.2. Patrón: Estado Duplicado (URL + Estado Local)

**En 0km:**
- Estado de versión en hook (`useModeloSelector`)
- URL no se usa para estado

**En Usados:**
- Estado de filtros en URL (fuente de verdad)
- Estado local de marca cuando formulario abierto (duplicado)
- Estado local de sorting (duplicado de URL)

**Problema:** Más complejo en Usados, más fuentes de verdad.

---

### 3.3. Patrón: Comunicación mediante Refs

**En 0km:**
- Refs solo para DOM (`carouselRef`)
- Comunicación mediante props y callbacks

**En Usados:**
- Refs para DOM (`filterFormRef`, `sortButtonRef`)
- Refs para API imperativa (`filterFormRef.current.toggleFilters()`)
- Refs para obtener estado (`filterFormRef.current.getCurrentFilters()`)

**Problema:** Más acoplamiento en Usados, violación de principios React.

---

### 3.4. Patrón: Listeners del DOM

**En 0km:**
- Listener de scroll en carrusel (encapsulado)
- Listener de teclado (encapsulado)

**En Usados:**
- Múltiples listeners: scroll, resize, click outside, keyboard
- Listeners en múltiples componentes
- Listeners globales (`window`, `document`)

**Problema:** Más disperso en Usados, más difícil de mantener.

---

## 4. Riesgos Identificados

### 4.1. Layout

#### A. Bloqueo de Scroll del Body (FilterFormSimple)

**Ubicación:** `FilterFormSimple.jsx` líneas 74-99

**Riesgo:**
- Si otro componente también manipula `document.body`, puede haber conflictos
- En iOS, el bloqueo de scroll puede causar problemas
- Si el componente se desmonta durante animación, el scroll puede quedar bloqueado

**Probabilidad:** Media
**Impacto:** Alto (página inusable)

**Evidencia:**
- Manipulación directa de `document.body.style`
- No hay validación de que otro componente no esté manipulando el body
- Cleanup puede fallar si hay errores

---

#### B. Posicionamiento Absoluto de Dropdowns

**Ubicación:** `SortDropdown.jsx` líneas 89-106

**Riesgo:**
- Estilos inline pueden no respetar z-index del contexto
- Posicionamiento puede fallar si el contenedor tiene `position: relative`
- No hay validación de que el dropdown quepa en viewport

**Probabilidad:** Baja
**Impacto:** Medio (dropdown puede quedar oculto)

---

### 4.2. Scroll

#### A. Conflicto de Preservación de Scroll

**Ubicación:** `VehiculoDetalle.jsx` líneas 21-30

**Riesgo:**
- Hook de preservación habilitado pero `useEffect` siempre hace scroll hacia arriba
- Comportamiento inconsistente: a veces preserva, a veces no

**Probabilidad:** Alta (siempre ocurre)
**Impacto:** Medio (UX confusa)

**Evidencia:**
```javascript
// Hook preserva scroll
const { navigateWithScroll } = useScrollPosition({ enabled: true })

// Pero siempre hace scroll hacia arriba
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
```

---

#### B. Scroll del Body Bloqueado

**Ubicación:** `FilterFormSimple.jsx` líneas 74-99

**Riesgo:**
- Si el componente se desmonta durante animación, el scroll puede quedar bloqueado
- Si hay errores en el cleanup, el body queda con estilos incorrectos
- En iOS, puede causar problemas de scroll

**Probabilidad:** Media
**Impacto:** Alto (página inusable)

---

#### C. Múltiples Listeners de Scroll

**Ubicación:** 
- `FilterFormSimple.jsx` línea 122 (scroll para botones móviles)
- `useScrollPosition.js` línea 87 (scroll para preservación)
- `BrandsCarousel.jsx` línea 44 (scroll para scrollability)

**Riesgo:**
- Múltiples listeners pueden causar overhead
- Si no se limpian correctamente, memory leaks
- Posibles conflictos si varios componentes escuchan scroll

**Probabilidad:** Baja (pero presente)
**Impacto:** Medio (performance)

---

### 4.3. Performance

#### A. Re-renders en `Vehiculos.jsx`

**Ubicación:** `Vehiculos.jsx` líneas 67-83

**Riesgo:**
- `parseFilters(sp)` se ejecuta en cada render (no memoizado)
- `hasAnyFilter(urlFilters)` se ejecuta en cada render
- `sortVehicles(vehicles, selectedSort)` está memoizado, pero `vehicles` cambia frecuentemente

**Probabilidad:** Media
**Impacto:** Medio (re-renders innecesarios)

**Evidencia:**
```javascript
const urlFilters = parseFilters(sp) // ⚠️ Se ejecuta en cada render
const isFiltered = hasAnyFilter(urlFilters) // ⚠️ Se ejecuta en cada render
const sortedVehicles = useMemo(() => {
  return sortVehicles(vehicles, selectedSort) // ✅ Memoizado, pero vehicles cambia
}, [vehicles, selectedSort])
```

---

#### B. Cálculo de Scrollability en Cada Scroll

**Ubicación:** `BrandsCarousel.jsx` líneas 32-51

**Riesgo:**
- `checkScrollability` se ejecuta en cada evento de scroll
- Acceso a DOM (`scrollLeft`, `scrollWidth`, `clientWidth`) en cada scroll
- Puede causar jank en scroll rápido

**Probabilidad:** Media
**Impacto:** Bajo-Medio (jank en scroll rápido)

---

#### C. Estado Local Duplicado

**Ubicación:** `Vehiculos.jsx` líneas 58-75

**Riesgo:**
- Estado local de marca duplicado de URL
- Re-renders cuando cambia estado local
- Sincronización compleja puede causar renders extra

**Probabilidad:** Media
**Impacto:** Medio (re-renders innecesarios)

---

### 4.4. Accesibilidad

#### A. Falta de ARIA en Filtros

**Ubicación:** `FilterFormSimple.jsx`

**Riesgo:**
- Drawer mobile no tiene `role="dialog"` o `role="region"`
- No tiene `aria-label` o `aria-labelledby`
- No tiene `aria-modal="true"` cuando está abierto
- Focus trap no implementado

**Probabilidad:** Alta (falta completamente)
**Impacto:** Alto (inaccesible para screen readers)

---

#### B. Falta de ARIA en Carrusel de Marcas

**Ubicación:** `BrandsCarousel.jsx`

**Riesgo:**
- No tiene `role="region"` o `role="group"`
- No tiene `aria-label`
- Botones de flechas tienen `aria-label` pero el contenedor no
- No hay indicadores de posición

**Probabilidad:** Alta (falta completamente)
**Impacto:** Medio (navegación confusa para screen readers)

---

#### C. Falta de Navegación por Teclado en Filtros

**Ubicación:** `FilterFormSimple.jsx`

**Riesgo:**
- Drawer no se puede abrir/cerrar con teclado (solo con botón)
- No hay focus trap cuando drawer está abierto
- Focus puede escapar del drawer

**Probabilidad:** Alta (falta completamente)
**Impacto:** Alto (inaccesible para usuarios de teclado)

---

### 4.5. Estado Implícito

#### A. Estado de Marca Duplicado

**Ubicación:** `Vehiculos.jsx` líneas 58-75

**Riesgo:**
- Estado local `localMarca` solo existe cuando formulario está abierto
- Lógica condicional compleja para decidir qué fuente usar
- Si el formulario se cierra sin aplicar, el estado local se pierde

**Probabilidad:** Media
**Impacto:** Medio (comportamiento inconsistente)

**Evidencia:**
```javascript
const currentMarca = isFiltersVisible && localMarca !== null 
  ? localMarca 
  : (urlFilters.marca || [])
```

**Problema:** Estado implícito, no está claro cuándo se usa cada fuente.

---

#### B. Estado de Visibilidad del Formulario

**Ubicación:** `Vehiculos.jsx` línea 71

**Riesgo:**
- Estado de visibilidad se obtiene mediante ref (`filterFormRef.current?.isFiltersVisible`)
- No es reactivo, puede estar desactualizado
- Depende de que el ref esté disponible

**Probabilidad:** Media
**Impacto:** Medio (comportamiento inconsistente)

**Evidencia:**
```javascript
const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
```

**Problema:** Estado implícito, no reactivo.

---

#### C. Estado de Scroll Preservado

**Ubicación:** `useScrollPosition.js` + `VehiculoDetalle.jsx`

**Riesgo:**
- Estado de scroll en `sessionStorage` (fuera de React)
- Puede estar desincronizado con el estado real
- Si hay múltiples pestañas, puede haber conflictos

**Probabilidad:** Baja
**Impacto:** Bajo (solo afecta UX de scroll)

---

## 5. Comparación con 0km

### 5.1. Similitudes

| Aspecto | 0km | Usados |
|---------|-----|--------|
| Scroll programático | ✅ Encapsulado | ⚠️ Disperso |
| Detección de scroll | ✅ En componente | ⚠️ En múltiples lugares |
| Estado duplicado | ❌ No tiene | ⚠️ Sí tiene (marca) |
| Comunicación con refs | ✅ Solo DOM | ⚠️ API imperativa |
| Listeners del DOM | ✅ Encapsulados | ⚠️ Dispersos |
| Accesibilidad | ✅ Implementada | ❌ Falta |

### 5.2. Diferencias Clave

**0km:**
- Estado centralizado en hook
- Componentes presentacionales
- Scroll encapsulado en componente
- Accesibilidad implementada

**Usados:**
- Estado disperso (URL + local + refs)
- Componentes con lógica mezclada
- Scroll en múltiples lugares
- Accesibilidad falta completamente

---

## 6. Resumen Estructural

### 6.1. Arquitectura Actual

```
Vehiculos.jsx (Página)
├── Orquestación de estado (URL + local)
├── Coordinación de componentes
└── Renderizado
    ├── BrandsCarousel
    │   ├── Scroll horizontal
    │   └── Selección de marcas
    ├── FilterFormSimple (ref)
    │   ├── Estado de filtros
    │   ├── UI mobile/desktop
    │   ├── Manipulación DOM (body)
    │   └── API imperativa
    ├── SortDropdown
    │   └── Dropdown de sorting
    └── AutosGrid
        └── Grid de cards
            └── CardAuto
                └── Card individual
```

### 6.2. Flujo de Datos

```
URL (filtros)
  ↓
parseFilters
  ↓
useVehiclesList (fetch)
  ↓
vehicles
  ↓
sortVehicles (frontend)
  ↓
sortedVehicles
  ↓
AutosGrid
  ↓
CardAuto
```

**Problema:** Flujo interrumpido por estado local de marca y sorting.

---

### 6.3. Puntos de Acoplamiento

1. **Vehiculos ↔ FilterFormSimple:**
   - Comunicación mediante refs (API imperativa)
   - Estado compartido implícito (`isFiltersVisible`)
   - Lógica de sincronización compleja

2. **Vehiculos ↔ BrandsCarousel:**
   - Estado de marca duplicado
   - Lógica condicional según estado del formulario

3. **FilterFormSimple ↔ DOM:**
   - Manipulación directa de `document.body`
   - Múltiples listeners globales

---

## 7. Lista Corta de Riesgos Potenciales

### 7.1. 🔴 CRÍTICO

1. **Bloqueo de scroll del body (FilterFormSimple)**
   - Si cleanup falla, página inusable
   - Probabilidad: Media, Impacto: Alto

2. **Falta de accesibilidad completa**
   - Filtros, carrusel, dropdowns no accesibles
   - Probabilidad: Alta, Impacto: Alto

3. **Estado de marca desincronizado**
   - URL vs estado local vs estado del formulario
   - Probabilidad: Media, Impacto: Medio-Alto

---

### 7.2. 🟡 IMPORTANTE

4. **Conflicto de preservación de scroll**
   - Hook preserva pero useEffect resetea
   - Probabilidad: Alta, Impacto: Medio

5. **Re-renders innecesarios**
   - `parseFilters` y `hasAnyFilter` en cada render
   - Probabilidad: Alta, Impacto: Medio

6. **API imperativa compleja**
   - Acoplamiento fuerte mediante refs
   - Probabilidad: Media, Impacto: Medio

---

### 7.3. 🟢 MEJORABLE

7. **Múltiples listeners de scroll**
   - Overhead en performance
   - Probabilidad: Baja, Impacto: Bajo-Medio

8. **Cálculo de scrollability en cada scroll**
   - Jank en scroll rápido
   - Probabilidad: Media, Impacto: Bajo

9. **Estilos inline en SortDropdown**
   - Deberían estar en CSS module
   - Probabilidad: Baja, Impacto: Bajo

---

## 8. Qué Parte Merece ser Analizada Primero

### 8.1. Priorización por Impacto/Beneficio

#### 🥇 PRIORIDAD 1: FilterFormSimple (Accesibilidad + Bloqueo de Scroll)

**Razones:**
- **Impacto:** Alto (bloquea usuarios con discapacidades, puede romper página)
- **Beneficio:** Alto (mejora accesibilidad y robustez)
- **Esfuerzo:** Medio (2-3 horas)
- **Riesgo:** Bajo (cambios defensivos)

**Análisis requerido:**
- Implementar accesibilidad completa (ARIA, teclado, focus trap)
- Mejorar robustez del bloqueo de scroll
- Evaluar si se puede eliminar manipulación directa del DOM

---

#### 🥈 PRIORIDAD 2: Estado de Marca Duplicado (Vehiculos.jsx)

**Razones:**
- **Impacto:** Medio-Alto (comportamiento inconsistente)
- **Beneficio:** Alto (simplifica lógica, reduce bugs)
- **Esfuerzo:** Medio-Alto (3-4 horas, requiere refactor)
- **Riesgo:** Medio (cambios en lógica de negocio)

**Análisis requerido:**
- Evaluar si se puede eliminar estado local de marca
- Simplificar lógica de sincronización
- Evaluar si se puede usar solo URL como fuente de verdad

---

#### 🥉 PRIORIDAD 3: Conflicto de Preservación de Scroll (VehiculoDetalle.jsx)

**Razones:**
- **Impacto:** Medio (UX confusa)
- **Beneficio:** Medio (mejora UX)
- **Esfuerzo:** Bajo (30 min, solo eliminar conflicto)
- **Riesgo:** Muy bajo (cambio simple)

**Análisis requerido:**
- Decidir: ¿preservar scroll o siempre resetear?
- Eliminar conflicto entre hook y useEffect

---

#### 4. PRIORIDAD 4: Re-renders Innecesarios (Vehiculos.jsx)

**Razones:**
- **Impacto:** Medio (performance)
- **Beneficio:** Medio (mejora performance)
- **Esfuerzo:** Bajo (1 hora, memoización)
- **Riesgo:** Muy bajo (optimización)

**Análisis requerido:**
- Memoizar `parseFilters` y `hasAnyFilter`
- Evaluar si hay otros cálculos que se pueden memoizar

---

#### 5. PRIORIDAD 5: BrandsCarousel (Scroll + Accesibilidad)

**Razones:**
- **Impacto:** Bajo-Medio (performance y accesibilidad)
- **Beneficio:** Medio (mejora performance y accesibilidad)
- **Esfuerzo:** Medio (2 horas)
- **Riesgo:** Bajo (mejoras incrementales)

**Análisis requerido:**
- Optimizar cálculo de scrollability (debounce)
- Implementar accesibilidad básica

---

## 9. Conclusión

### 9.1. Estado Actual

**Fortalezas:**
- ✅ Componentes bien separados (AutosGrid, CardAuto)
- ✅ Hook de datos bien encapsulado (useVehiclesList)
- ✅ Performance optimizada en cards (memoización)

**Debilidades:**
- ❌ Lógica mezclada (UI + negocio + DOM)
- ❌ Estado duplicado (URL + local)
- ❌ Comunicación mediante refs (API imperativa)
- ❌ Accesibilidad falta completamente
- ❌ Múltiples manipulaciones del DOM

### 9.2. Comparación con 0km

**0km está mejor estructurado:**
- Estado centralizado en hook
- Scroll encapsulado en componente
- Accesibilidad implementada
- Menos acoplamiento

**Usados tiene más complejidad:**
- Más fuentes de estado
- Más acoplamiento
- Más manipulación del DOM
- Falta de accesibilidad

### 9.3. Recomendación de Análisis

**Empezar con FilterFormSimple porque:**
1. Es el componente más complejo y problemático
2. Tiene riesgos críticos (bloqueo de scroll, falta de accesibilidad)
3. Mejoras tienen alto impacto
4. Es el punto de mayor acoplamiento

**Luego continuar con:**
- Estado de marca duplicado (simplificar lógica)
- Conflicto de scroll (fix rápido)
- Re-renders innecesarios (optimización)

---

**Documento creado para mapear el terreno de la página de Usados.**
**Enfoque: identificar riesgos reales sin proponer soluciones aún.**

