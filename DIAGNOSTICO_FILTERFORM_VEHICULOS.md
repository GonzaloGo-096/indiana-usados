# Diagnóstico Estructural y Performance
## FilterFormSimple.jsx + Vehiculos.jsx

---

## PARTE 1: FilterFormSimple.jsx

### 1.1. Cantidad Total de useState

**Total: 5 estados**

1. **`isVisibleDesktop`** (línea 39)
   - Tipo: `boolean`
   - Propósito: Controlar visibilidad del formulario en desktop

2. **`isDrawerOpen`** (línea 41)
   - Tipo: `boolean`
   - Propósito: Controlar apertura del drawer en mobile

3. **`isSubmitting`** (línea 42)
   - Tipo: `boolean`
   - Propósito: Estado de carga durante submit

4. **`showMobileActions`** (línea 43)
   - Tipo: `boolean`
   - Propósito: Mostrar/ocultar botones móviles según scroll

5. **`isSortDropdownOpen`** (línea 45)
   - Tipo: `boolean`
   - Propósito: Controlar apertura del dropdown de sorting

6. **`filters`** (línea 51)
   - Tipo: `object` (estado complejo)
   - Propósito: Estado local de todos los filtros
   - Estructura:
     ```javascript
     {
       marca: [],
       caja: [],
       combustible: [],
       año: [min, max],
       precio: [min, max],
       kilometraje: [min, max]
     }
     ```

**Nota:** `searchParams` (línea 60) es un hook de React Router (`useSearchParams`), no es `useState`, pero actúa como estado.

---

### 1.2. Cantidad Total de useEffect

**Total: 8 effects**

1. **Sincronización de estados al cambiar dispositivo** (líneas 64-72)
   - Dependencias: `[isMobile]`
   - Propósito: Cerrar drawer/visibilidad al cambiar entre mobile/desktop

2. **Bloqueo de scroll del body** (líneas 75-99)
   - Dependencias: `[isDrawerOpen]`
   - Propósito: Bloquear scroll cuando drawer está abierto
   - **Manipula DOM directamente:** `document.body.style`

3. **Sincronización con URL** (líneas 102-113)
   - Dependencias: `[searchParams]`
   - Propósito: Sincronizar estado local de filtros con URL
   - **Lógica de negocio:** `parseFilters(searchParams)`

4. **Detección de scroll para botones móviles** (líneas 116-124)
   - Dependencias: `[]` (sin dependencias)
   - Propósito: Mostrar/ocultar botones según posición de scroll
   - **Escucha:** `window.addEventListener('scroll')`

5. **Cerrar dropdown cuando cambia sort** (líneas 159-161)
   - Dependencias: `[selectedSort]`
   - Propósito: Cerrar dropdown cuando cambia el sort desde URL

6. **Click outside para cerrar dropdown** (líneas 164-177)
   - Dependencias: `[isSortDropdownOpen]`
   - Propósito: Cerrar dropdown al hacer click fuera
   - **Escucha:** `document.addEventListener('mousedown')`

7. **Cerrar drawer con Escape** (líneas 197-206)
   - Dependencias: `[isDrawerOpen]`
   - Propósito: Cerrar drawer con tecla Escape
   - **Escucha:** `document.addEventListener('keydown')`

8. **Devolver foco al trigger al cerrar** (líneas 209-213)
   - Dependencias: `[isDrawerOpen]`
   - Propósito: Devolver foco al botón trigger cuando se cierra el drawer
   - **Manipula DOM directamente:** `triggerRef.current.focus()`

9. **Cleanup de timeouts** (líneas 232-239)
   - Dependencias: `[]` (sin dependencias)
   - Propósito: Limpiar timeouts al desmontar

---

### 1.3. Estados que Parecen Derivados (Calculables)

#### A. `isFiltersVisible` (NO existe como estado, pero se calcula)

**Ubicación:** No está en FilterFormSimple, pero se usa en Vehiculos.jsx línea 71:
```javascript
const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
```

**Análisis:**
- Se calcula desde `useImperativeHandle` (línea 252)
- Valor derivado de: `isMobile ? isDrawerOpen : isVisibleDesktop`
- **Es derivado:** Se puede calcular desde `isDrawerOpen` y `isVisibleDesktop`

---

#### B. `activeFiltersCount` (líneas 264-271)

**Ubicación:** Línea 264-271

**Código:**
```javascript
const activeFiltersCount = [
  filters.marca?.length > 0,
  filters.caja?.length > 0,
  filters.combustible?.length > 0,
  filters.año[0] !== FILTER_DEFAULTS.AÑO.min || filters.año[1] !== FILTER_DEFAULTS.AÑO.max,
  filters.precio[0] !== FILTER_DEFAULTS.PRECIO.min || filters.precio[1] !== FILTER_DEFAULTS.PRECIO.max,
  filters.kilometraje[0] !== FILTER_DEFAULTS.KILOMETRAJE.min || filters.kilometraje[1] !== FILTER_DEFAULTS.KILOMETRAJE.max
].filter(Boolean).length
```

**Análisis:**
- ✅ **Es derivado:** Se calcula desde `filters`
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de constantes:** `FILTER_DEFAULTS` (pero son constantes, no cambian)

**Recomendación implícita:** Podría memoizarse con `useMemo` dependiendo de `filters`.

---

#### C. `selectedSort` (línea 61)

**Ubicación:** Línea 61

**Código:**
```javascript
const selectedSort = searchParams.get('sort')
```

**Análisis:**
- ✅ **Es derivado:** Se calcula desde `searchParams`
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `searchParams` (objeto que puede cambiar referencia)

**Recomendación implícita:** Podría memoizarse con `useMemo` dependiendo de `searchParams`.

---

#### D. `formContent` (línea 274)

**Ubicación:** Línea 274

**Código:**
```javascript
const formContent = (
  <div className={`${styles.filterContainer} ${isDrawerOpen ? styles.open : ''}`}>
    {/* ... JSX completo ... */}
  </div>
)
```

**Análisis:**
- ✅ **Es derivado:** Se calcula desde múltiples estados y props
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `isDrawerOpen`, `showMobileActions`, `selectedSort`, `isSortDropdownOpen`, `filters`, `isLoading`, `isSubmitting`, `isError`, `error`, `onRetry`, handlers, etc.

**Recomendación implícita:** Podría memoizarse con `useMemo`, pero es JSX complejo.

---

### 1.4. Effects que Escuchan Scroll / Resize / Document / Window

#### A. Scroll

**Effect 1: Detección de scroll para botones móviles** (líneas 116-124)
```javascript
useEffect(() => {
  const handleScroll = () => {
    setShowMobileActions(window.scrollY > 100)
  }
  handleScroll() // Inicializar
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

**Análisis:**
- ✅ Escucha: `window.addEventListener('scroll')`
- ⚠️ **Sin debounce:** Se ejecuta en cada evento de scroll
- ⚠️ **Sin dependencias:** El effect no se re-ejecuta, pero el handler no está memoizado
- ⚠️ **Posible problema de performance:** En scroll rápido, puede causar muchos re-renders

---

#### B. Resize

**Ningún effect escucha `resize` directamente en FilterFormSimple.**

**Nota:** `BrandsCarousel` (componente hijo) sí escucha resize, pero no está en este archivo.

---

#### C. Document

**Effect 1: Click outside para cerrar dropdown** (líneas 164-177)
```javascript
useEffect(() => {
  if (!isSortDropdownOpen) return
  const handleClickOutside = (e) => {
    const isClickOnDropdown = sortDropdownRef.current?.contains(e.target)
    const isClickOnButton = sortButtonRef.current?.contains(e.target)
    if (!isClickOnDropdown && !isClickOnButton) {
      setIsSortDropdownOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [isSortDropdownOpen])
```

**Análisis:**
- ✅ Escucha: `document.addEventListener('mousedown')`
- ✅ **Condicional:** Solo se ejecuta si `isSortDropdownOpen` es true
- ✅ **Cleanup correcto:** Se remueve el listener al desmontar o cambiar estado

---

**Effect 2: Cerrar drawer con Escape** (líneas 197-206)
```javascript
useEffect(() => {
  if (!isDrawerOpen) return
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDrawerOpen(false)
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isDrawerOpen])
```

**Análisis:**
- ✅ Escucha: `document.addEventListener('keydown')`
- ✅ **Condicional:** Solo se ejecuta si `isDrawerOpen` es true
- ✅ **Cleanup correcto:** Se remueve el listener al desmontar o cambiar estado

---

#### D. Window

**Effect 1: Detección de scroll** (líneas 116-124)
- Ya documentado arriba en "Scroll"

**Effect 2: Bloqueo de scroll del body** (líneas 75-99)
```javascript
useEffect(() => {
  if (!isDrawerOpen) return
  
  const scrollY = window.scrollY // ⚠️ Lee de window
  // ... manipula document.body ...
  
  return () => {
    // ...
    window.scrollTo(0, scrollY) // ⚠️ Escribe a window
  }
}, [isDrawerOpen])
```

**Análisis:**
- ✅ Lee: `window.scrollY`
- ✅ Escribe: `window.scrollTo(0, scrollY)`
- ⚠️ **No escucha eventos:** Solo lee/escribe, no escucha
- ⚠️ **Manipulación directa:** No usa React state para scroll

---

### 1.5. Lógica que NO es Puramente de UI

#### A. Parsing de Filtros (Líneas 102-113)

**Ubicación:** Effect de sincronización con URL (líneas 102-113)

**Código:**
```javascript
useEffect(() => {
  const urlFilters = parseFilters(searchParams) // ⚠️ LÓGICA DE NEGOCIO
  setFilters(prevFilters => ({
    marca: urlFilters.marca || [],
    caja: urlFilters.caja || [],
    combustible: urlFilters.combustible || [],
    año: urlFilters.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
    precio: urlFilters.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
    kilometraje: urlFilters.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  }))
}, [searchParams])
```

**Análisis:**
- ⚠️ **Lógica de negocio:** `parseFilters` es una función de parsing/transformación
- ⚠️ **Lógica de sincronización:** Sincroniza estado local con URL
- ⚠️ **Lógica de defaults:** Aplica valores por defecto si no existen en URL
- ⚠️ **No es UI pura:** Es lógica de transformación de datos

---

#### B. Serialización de Filtros (Línea 193)

**Ubicación:** Handler `handleClear` (línea 184-194)

**Código:**
```javascript
const handleClear = useCallback(() => {
  setFilters({
    marca: [],
    caja: [],
    combustible: [],
    año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
    precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
    kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  })
  setSearchParams({}) // ⚠️ LÓGICA DE NEGOCIO: Limpia URL
}, [setSearchParams])
```

**Análisis:**
- ⚠️ **Lógica de negocio:** Limpia URL (serialización)
- ⚠️ **Lógica de defaults:** Restablece valores por defecto
- ⚠️ **No es UI pura:** Es lógica de transformación de datos

---

#### C. Serialización de Sort (Líneas 147-156)

**Ubicación:** Handler `handleSortChange` (líneas 147-156)

**Código:**
```javascript
const handleSortChange = useCallback((sortOption) => {
  setIsSortDropdownOpen(false)
  const newParams = new URLSearchParams(searchParams) // ⚠️ LÓGICA DE NEGOCIO
  if (sortOption) {
    newParams.set('sort', sortOption) // ⚠️ LÓGICA DE NEGOCIO
  } else {
    newParams.delete('sort') // ⚠️ LÓGICA DE NEGOCIO
  }
  setSearchParams(newParams) // ⚠️ LÓGICA DE NEGOCIO
}, [searchParams, setSearchParams])
```

**Análisis:**
- ⚠️ **Lógica de negocio:** Manipula URL (serialización)
- ⚠️ **Lógica de sincronización:** Sincroniza estado local con URL
- ⚠️ **No es UI pura:** Es lógica de transformación de datos

---

#### D. Lógica de Sincronización Estado Local ↔ URL

**Ubicación:** Múltiples lugares

**Análisis:**
- **Effect de sincronización URL → Estado local** (líneas 102-113)
- **Handler de clear** (línea 193): Estado local → URL
- **Handler de sort change** (líneas 147-156): Estado local → URL
- **Handler de submit** (línea 223): Estado local → URL (mediante `onApplyFilters`)

**Problema:** Lógica de sincronización bidireccional compleja mezclada con lógica de UI.

---

#### E. Lógica de Bloqueo de Scroll

**Ubicación:** Effect de bloqueo de scroll (líneas 75-99)

**Código:**
```javascript
useEffect(() => {
  if (!isDrawerOpen) return
  
  const scrollY = window.scrollY // ⚠️ LÓGICA DE DOM
  const body = document.body
  
  body.style.position = 'fixed' // ⚠️ MANIPULACIÓN DIRECTA DEL DOM
  body.style.top = `-${scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.overflow = 'hidden'
  
  return () => {
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.overflow = ''
    window.scrollTo(0, scrollY) // ⚠️ MANIPULACIÓN DIRECTA DEL DOM
  }
}, [isDrawerOpen])
```

**Análisis:**
- ⚠️ **Lógica de DOM:** Manipulación directa de `document.body`
- ⚠️ **Lógica de scroll:** Guarda/restaura posición de scroll manualmente
- ⚠️ **No es UI pura:** Es lógica de manipulación del DOM
- ⚠️ **Riesgo:** Puede entrar en conflicto con otros componentes que también manipulan el body

---

#### F. Lógica de Focus Management

**Ubicación:** Effect de devolver foco (líneas 209-213)

**Código:**
```javascript
useEffect(() => {
  if (!isDrawerOpen && triggerRef.current) {
    try { triggerRef.current.focus() } catch (_) {} // ⚠️ MANIPULACIÓN DIRECTA DEL DOM
  }
}, [isDrawerOpen])
```

**Análisis:**
- ⚠️ **Lógica de DOM:** Manipulación directa del focus
- ⚠️ **No es UI pura:** Es lógica de accesibilidad/DOM
- ⚠️ **Riesgo:** Puede fallar si el elemento no es focusable

---

## PARTE 2: Vehiculos.jsx

### 2.1. Estados que se Recalculan en Cada Render

#### A. `urlFilters` (línea 67)

**Código:**
```javascript
const urlFilters = parseFilters(sp)
```

**Análisis:**
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `sp` (objeto `URLSearchParams` que puede cambiar referencia)
- ⚠️ **Costo:** `parseFilters` es una función que parsea el querystring
- ⚠️ **Impacto:** Si `sp` cambia referencia sin cambiar contenido, se recalcula innecesariamente

**Recomendación implícita:** Podría memoizarse con `useMemo` dependiendo de `sp.toString()` o similar.

---

#### B. `isFiltered` (línea 68)

**Código:**
```javascript
const isFiltered = hasAnyFilter(urlFilters)
```

**Análisis:**
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `urlFilters` (que también se recalcula en cada render)
- ⚠️ **Costo:** `hasAnyFilter` es una función que itera sobre los filtros
- ⚠️ **Impacto:** Se recalcula incluso si `urlFilters` no cambió contenido

**Recomendación implícita:** Podría memoizarse con `useMemo` dependiendo de `urlFilters`.

---

#### C. `isFiltersVisible` (línea 71)

**Código:**
```javascript
const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
```

**Análisis:**
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `filterFormRef.current` (ref que puede cambiar)
- ⚠️ **Problema:** Acceso a propiedad de ref en cada render
- ⚠️ **No es reactivo:** Si el valor cambia dentro de `FilterFormSimple`, no dispara re-render en `Vehiculos`

**Recomendación implícita:** Este valor debería venir como prop o estado, no desde ref.

---

#### D. `currentMarca` (línea 74)

**Código:**
```javascript
const currentMarca = isFiltersVisible && localMarca !== null ? localMarca : (urlFilters.marca || [])
```

**Análisis:**
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `isFiltersVisible`, `localMarca`, `urlFilters.marca`
- ⚠️ **Lógica condicional compleja:** Decide qué fuente usar según estado del formulario
- ⚠️ **Impacto:** Se recalcula incluso si ninguna de las dependencias cambió

**Recomendación implícita:** Podría memoizarse con `useMemo` dependiendo de `isFiltersVisible`, `localMarca`, `urlFilters.marca`.

---

#### E. `filters` (línea 75)

**Código:**
```javascript
const filters = { ...urlFilters, marca: currentMarca }
```

**Análisis:**
- ⚠️ **Se recalcula en cada render:** No está memoizado
- ⚠️ **Depende de:** `urlFilters` (objeto que se recrea en cada render) y `currentMarca`
- ⚠️ **Costo:** Crea un nuevo objeto en cada render
- ⚠️ **Impacto:** Se pasa a `useVehiclesList` (línea 78), puede causar re-fetch innecesario si cambia referencia

**Recomendación implícita:** Podría memoizarse con `useMemo` dependiendo de `urlFilters` y `currentMarca`.

---

#### F. `selectedSort` (línea 55)

**Análisis:**
- ✅ **NO se recalcula:** Es estado (`useState`)
- ✅ **Se actualiza solo cuando cambia:** Mediante effect (líneas 62-64)

**Nota:** El valor inicial se lee de `sp.get('sort')` en el effect, no en cada render.

---

### 2.2. Callbacks que se Recrean en Cada Render

#### A. `onApply` (líneas 97-100)

**Código:**
```javascript
const onApply = (newFilters) => {
  setSp(serializeFilters(newFilters), { replace: false })
}
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Depende de:** `setSp` (función de React Router, estable)
- ⚠️ **Impacto:** Se pasa a `FilterFormSimple` (línea 194), puede causar re-renders innecesarios

**Recomendación implícita:** Podría memoizarse con `useCallback` dependiendo de `setSp`.

---

#### B. `onClear` (líneas 101-103)

**Código:**
```javascript
const onClear = () => {
  setSp(new URLSearchParams(), { replace: false })
}
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Depende de:** `setSp` (función de React Router, estable)
- ⚠️ **Impacto:** Se pasa a `FilterFormSimple` (implícitamente, no se ve en el código mostrado)

**Recomendación implícita:** Podría memoizarse con `useCallback` dependiendo de `setSp`.

---

#### C. `handleFilterClick` (líneas 106-110)

**Código:**
```javascript
const handleFilterClick = () => {
  if (filterFormRef.current) {
    filterFormRef.current.toggleFilters()
  }
}
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Depende de:** `filterFormRef.current` (ref, estable)
- ⚠️ **Impacto:** Se pasa como `onClick` (línea 205), puede causar re-renders innecesarios del botón

**Recomendación implícita:** Podría memoizarse con `useCallback` sin dependencias (ref es estable).

---

#### D. `handleBrandSelect` (líneas 113-143)

**Código:**
```javascript
const handleBrandSelect = (brandName) => {
  const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
  
  if (isFiltersVisible) {
    // ... lógica compleja ...
    const currentFilters = filterFormRef.current?.getCurrentFilters?.() || { marca: [] }
    // ... más lógica ...
    setLocalMarca(newMarca)
    if (filterFormRef.current?.updateMarcaFilter) {
      filterFormRef.current.updateMarcaFilter(newMarca)
    }
  } else {
    // ... lógica diferente ...
    const newFilters = { ...urlFilters, marca: newMarca }
    setSp(serializeFilters(newFilters), { replace: false })
  }
}
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Depende de:** `filterFormRef.current`, `urlFilters`, `setSp`, `setLocalMarca`
- ⚠️ **Lógica compleja:** Accede a refs, lee `urlFilters` (que se recalcula), llama a múltiples setters
- ⚠️ **Impacto:** Se pasa a `BrandsCarousel` (línea 186), puede causar re-renders innecesarios

**Recomendación implícita:** Podría memoizarse con `useCallback`, pero las dependencias son complejas (`urlFilters` cambia referencia).

---

#### E. `handleSortClick` (línea 146)

**Código:**
```javascript
const handleSortClick = () => setIsSortDropdownOpen(!isSortDropdownOpen)
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Depende de:** `isSortDropdownOpen` (estado)
- ⚠️ **Impacto:** Se pasa como `onClick` (línea 217), puede causar re-renders innecesarios del botón

**Recomendación implícita:** Podría memoizarse con `useCallback` dependiendo de `isSortDropdownOpen`.

---

#### F. `handleSortChange` (líneas 147-157)

**Código:**
```javascript
const handleSortChange = (sortOption) => {
  setSelectedSort(sortOption)
  setIsSortDropdownOpen(false)
  const newParams = new URLSearchParams(sp)
  if (sortOption) {
    newParams.set('sort', sortOption)
  } else {
    newParams.delete('sort')
  }
  setSp(newParams, { replace: true })
}
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Depende de:** `sp`, `setSp`
- ⚠️ **Impacto:** Se pasa a `SortDropdown` (línea 231), puede causar re-renders innecesarios

**Recomendación implícita:** Podría memoizarse con `useCallback` dependiendo de `sp` y `setSp`.

---

#### G. `handleCloseSortDropdown` (línea 158)

**Código:**
```javascript
const handleCloseSortDropdown = () => setIsSortDropdownOpen(false)
```

**Análisis:**
- ⚠️ **Se recrea en cada render:** No está memoizado con `useCallback`
- ⚠️ **Sin dependencias:** Solo llama a setter
- ⚠️ **Impacto:** Se pasa a `SortDropdown` (línea 232), puede causar re-renders innecesarios

**Recomendación implícita:** Podría memoizarse con `useCallback` sin dependencias.

---

### 2.3. Dependencias Frágiles entre Componentes

#### A. Vehiculos ↔ FilterFormSimple (Mediante Refs)

**Ubicación:** Múltiples lugares

**Dependencias:**

1. **`filterFormRef.current.isFiltersVisible`** (línea 71)
   - Leído en cada render de `Vehiculos`
   - Escrito en `FilterFormSimple` mediante `useImperativeHandle` (línea 252)
   - ⚠️ **No es reactivo:** Cambios en `FilterFormSimple` no disparan re-render en `Vehiculos`

2. **`filterFormRef.current.toggleFilters()`** (línea 108)
   - Llamado desde `handleFilterClick`
   - Definido en `FilterFormSimple` mediante `useImperativeHandle` (línea 249)
   - ⚠️ **API imperativa:** Violación de principios React

3. **`filterFormRef.current.getCurrentFilters()`** (línea 118)
   - Llamado desde `handleBrandSelect`
   - Definido en `FilterFormSimple` mediante `useImperativeHandle` (línea 260)
   - ⚠️ **Acceso a estado interno:** Expone estado interno del componente hijo

4. **`filterFormRef.current.updateMarcaFilter()`** (línea 130)
   - Llamado desde `handleBrandSelect`
   - Definido en `FilterFormSimple` mediante `useImperativeHandle` (línea 255)
   - ⚠️ **Modificación de estado interno:** Modifica estado interno del componente hijo

**Análisis:**
- ⚠️ **Acoplamiento fuerte:** `Vehiculos` depende de implementación interna de `FilterFormSimple`
- ⚠️ **No es reactivo:** Cambios en `FilterFormSimple` no se propagan automáticamente
- ⚠️ **Frágil:** Si `FilterFormSimple` cambia su API, `Vehiculos` puede romperse
- ⚠️ **Difícil de testear:** Dependencias implícitas mediante refs

---

#### B. Vehiculos ↔ BrandsCarousel (Mediante Props y Estado)

**Ubicación:** Líneas 184-188

**Dependencias:**

1. **`selectedBrands={currentMarca}`** (línea 185)
   - `currentMarca` se recalcula en cada render (línea 74)
   - Depende de `isFiltersVisible` (que viene de ref) y `localMarca` (estado local)
   - ⚠️ **Lógica condicional compleja:** Decide qué fuente usar según estado del formulario

2. **`onBrandSelect={handleBrandSelect}`** (línea 186)
   - `handleBrandSelect` se recrea en cada render
   - Accede a `filterFormRef.current` (ref imperativo)
   - ⚠️ **Lógica compleja:** Dos flujos diferentes según estado del formulario

3. **`isFiltersVisible={isFiltersVisible}`** (línea 187)
   - `isFiltersVisible` se recalcula en cada render desde ref
   - ⚠️ **No es reactivo:** Cambios en `FilterFormSimple` no se propagan

**Análisis:**
- ⚠️ **Dependencia indirecta:** `BrandsCarousel` depende de estado de `FilterFormSimple` a través de `Vehiculos`
- ⚠️ **Lógica condicional:** Comportamiento diferente según estado del formulario
- ⚠️ **No es declarativo:** Lógica de sincronización compleja mezclada con UI

---

#### C. Vehiculos ↔ SortDropdown (Mediante Props)

**Ubicación:** Líneas 228-235

**Dependencias:**

1. **`selectedSort={selectedSort}`** (línea 230)
   - Estado local sincronizado con URL
   - ✅ **Estable:** Solo cambia cuando cambia URL

2. **`onSortChange={handleSortChange}`** (línea 231)
   - `handleSortChange` se recrea en cada render
   - Depende de `sp` y `setSp`
   - ⚠️ **Se recrea innecesariamente:** Si `sp` cambia referencia sin cambiar contenido

3. **`triggerRef={sortButtonRef}`** (línea 234)
   - Ref estable
   - ✅ **No es problema:** Refs son estables

**Análisis:**
- ✅ **Menos frágil:** Dependencias más claras
- ⚠️ **Callback se recrea:** Puede causar re-renders innecesarios

---

### 2.4. Lógica que Depende de Refs Imperativos

#### A. `isFiltersVisible` (línea 71)

**Código:**
```javascript
const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false
```

**Análisis:**
- ⚠️ **Depende de ref imperativo:** `filterFormRef.current.isFiltersVisible`
- ⚠️ **Se lee en cada render:** No es reactivo
- ⚠️ **Valor calculado:** `isMobile ? isDrawerOpen : isVisibleDesktop` (desde `FilterFormSimple`)
- ⚠️ **Usado en:** Cálculo de `currentMarca` (línea 74)

**Problema:** Si `FilterFormSimple` cambia su estado interno, `Vehiculos` no se entera hasta el siguiente render (y solo si hay otro trigger de re-render).

---

#### B. `handleFilterClick` (líneas 106-110)

**Código:**
```javascript
const handleFilterClick = () => {
  if (filterFormRef.current) {
    filterFormRef.current.toggleFilters() // ⚠️ LLAMADA IMPERATIVA
  }
}
```

**Análisis:**
- ⚠️ **Depende de ref imperativo:** `filterFormRef.current.toggleFilters()`
- ⚠️ **API imperativa:** Llama a método del componente hijo
- ⚠️ **No es declarativo:** No usa props/callbacks

**Problema:** Violación de principios React (flujo unidireccional).

---

#### C. `handleBrandSelect` (líneas 113-143)

**Código:**
```javascript
const handleBrandSelect = (brandName) => {
  const isFiltersVisible = filterFormRef.current?.isFiltersVisible || false // ⚠️ LEE DE REF
  
  if (isFiltersVisible) {
    const currentFilters = filterFormRef.current?.getCurrentFilters?.() || { marca: [] } // ⚠️ LEE DE REF
    // ...
    if (filterFormRef.current?.updateMarcaFilter) {
      filterFormRef.current.updateMarcaFilter(newMarca) // ⚠️ ESCRIBE EN REF
    }
  } else {
    // ...
  }
}
```

**Análisis:**
- ⚠️ **Depende de múltiples refs imperativos:**
  - `filterFormRef.current.isFiltersVisible` (lectura)
  - `filterFormRef.current.getCurrentFilters()` (lectura de estado interno)
  - `filterFormRef.current.updateMarcaFilter()` (escritura de estado interno)
- ⚠️ **Lógica condicional compleja:** Dos flujos diferentes según estado del formulario
- ⚠️ **Acceso a estado interno:** Lee y modifica estado interno del componente hijo

**Problema:** 
- Acoplamiento fuerte con implementación interna de `FilterFormSimple`
- Lógica de sincronización compleja mezclada con lógica de UI
- Difícil de mantener y testear

---

## RESUMEN DIAGNÓSTICO

### FilterFormSimple.jsx

**Estados:** 5 + 1 hook (`searchParams`)
**Effects:** 8 effects
**Estados derivados:** 3 (`activeFiltersCount`, `selectedSort`, `formContent`)
**Listeners:** 3 (scroll, mousedown, keydown)
**Lógica no-UI:** Parsing, serialización, sincronización URL, manipulación DOM

### Vehiculos.jsx

**Recálculos por render:** 5 (`urlFilters`, `isFiltered`, `isFiltersVisible`, `currentMarca`, `filters`)
**Callbacks sin memoizar:** 7 (`onApply`, `onClear`, `handleFilterClick`, `handleBrandSelect`, `handleSortClick`, `handleSortChange`, `handleCloseSortDropdown`)
**Dependencias frágiles:** 3 (Vehiculos ↔ FilterFormSimple, Vehiculos ↔ BrandsCarousel, Vehiculos ↔ SortDropdown)
**Lógica con refs:** 3 (`isFiltersVisible`, `handleFilterClick`, `handleBrandSelect`)

---

**Documento de diagnóstico estructural y de performance.**
**Sin propuestas de solución, solo identificación de problemas.**

