# Análisis Técnico – Carrusel Mobile en CeroKilometroDetalle.jsx

## Resumen Ejecutivo

El carrusel mobile renderiza **3 versiones simultáneamente** (activa + 2 adyacentes) en cada cambio, causando renders innecesarios de componentes pesados. Aunque existe una optimización parcial (solo renderiza adyacentes), el problema persiste porque:

1. **VersionContent** se renderiza completo incluso para versiones no activas
2. Los componentes hijos (ColorSelector, ModeloSpecs, imágenes) se montan aunque no sean visibles
3. El scroll del carrusel dispara múltiples eventos que causan re-renders

---

## 1. Análisis de Renders Actuales

### 1.1. Componentes que se Renderizan por Cambio de Versión

**Ubicación:** `CeroKilometroDetalle.jsx` líneas 194-217

```194:217:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
{versiones.map((version, index) => {
  const isActive = version.id === versionActiva?.id
  return (
    <div key={version.id} className={styles.carouselSlide}>
      {/* Solo renderizar contenido completo si es la versión activa o adyacente */}
      {Math.abs(index - indiceVersionActiva) <= 1 ? (
        <VersionContent
          version={isActive ? versionActiva : version}
          modeloMarca={modelo.marca}
          modeloNombre={modelo.nombre}
          colorActivo={isActive ? colorActivo : null}
          coloresDisponibles={isActive ? coloresDisponibles : []}
          imagenActual={isActive ? imagenActual : null}
          onColorChange={cambiarColor}
          layout="mobile"
        />
      ) : (
        <div className={styles.carouselPlaceholder}>
          <span>{version.nombreCorto}</span>
        </div>
      )}
    </div>
  )
})}
```

**Problema identificado:**

- **Versión activa (index = indiceVersionActiva):**
  - ✅ Renderiza `VersionContent` completo con todas las props
  - ✅ Renderiza: imagen, ColorSelector, ModeloSpecs, botones PDF/WhatsApp

- **Versiones adyacentes (index = indiceVersionActiva ± 1):**
  - ⚠️ Renderiza `VersionContent` pero con props limitadas:
    - `colorActivo={null}`
    - `coloresDisponibles={[]}`
    - `imagenActual={null}`
  - ⚠️ Aunque recibe props limitadas, el componente se monta y ejecuta toda su lógica interna
  - ⚠️ Renderiza estructura DOM completa (divs, secciones, aunque vacías)

- **Versiones no adyacentes:**
  - ✅ Solo renderiza placeholder (óptimo)

### 1.2. ¿Se Renderizan VersionContent No Visibles?

**Sí, se renderizan 2 versiones no visibles:**

1. **Versión anterior (index - 1):** Renderiza `VersionContent` completo aunque esté fuera de viewport
2. **Versión siguiente (index + 1):** Renderiza `VersionContent` completo aunque esté fuera de viewport

**Evidencia:**
- El carrusel usa `scroll-snap-type: x mandatory` (CSS línea 143)
- Cada slide ocupa `100%` del ancho (CSS línea 155)
- Solo 1 versión es visible en viewport
- Las otras 2 versiones adyacentes están renderizadas pero fuera de vista

---

## 2. Por Qué Ocurren Estos Renders

### 2.1. Causa Raíz: Estado del Hook `useModeloSelector`

**Ubicación:** `useModeloSelector.js` líneas 46-90

Cuando cambia `versionActivaId`:

1. **Recalcula `versionActiva`** (línea 50-52)
2. **Recalcula `coloresDisponibles`** (línea 56-61)
3. **Recalcula `colorActivo`** (línea 64-66)
4. **Recalcula `imagenActual`** (línea 70-90)
5. **Recalcula `indiceVersionActiva`** (línea 93-95)

**Efecto en cascada:**
- Todos estos valores se pasan como props a `CeroKilometroDetalle`
- `CeroKilometroDetalle` re-renderiza
- El `map` de versiones se ejecuta nuevamente
- Las 3 versiones (activa + 2 adyacentes) se re-renderizan

### 2.2. Causa Secundaria: Scroll del Carrusel

**Ubicación:** `CeroKilometroDetalle.jsx` líneas 65-94

```65:94:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
// Detectar swipe en mobile para cambiar versión
const handleCarouselScroll = useCallback(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  const slideWidth = carousel.offsetWidth
  const scrollPosition = carousel.scrollLeft
  const newIndex = Math.round(scrollPosition / slideWidth)
  
  if (newIndex !== indiceVersionActiva && newIndex >= 0 && newIndex < totalVersiones) {
    cambiarVersionPorIndice(newIndex)
  }
}, [indiceVersionActiva, totalVersiones, cambiarVersionPorIndice])

// Debounce del scroll para evitar múltiples cambios
useEffect(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  let scrollTimeout
  const handleScroll = () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(handleCarouselScroll, 100)
  }
  
  carousel.addEventListener('scroll', handleScroll)
  return () => {
    carousel.removeEventListener('scroll', handleScroll)
    clearTimeout(scrollTimeout)
  }
}, [handleCarouselScroll])
```

**Problema:**
- Durante un swipe, el evento `scroll` se dispara múltiples veces (10-20 eventos por segundo)
- Aunque hay debounce de 100ms, cada evento causa un re-render del componente
- El debounce solo evita llamar a `cambiarVersionPorIndice`, pero no evita los re-renders del scroll

### 2.3. VersionContent No Está Optimizado para Props Cambiantes

**Ubicación:** `VersionContent.jsx` línea 30

```30:39:src/components/ceroKm/VersionContent/VersionContent.jsx
export const VersionContent = memo(({
  version,
  modeloMarca = '',
  modeloNombre = '',
  colorActivo,
  coloresDisponibles,
  imagenActual,
  onColorChange,
  layout = 'mobile'
}) => {
```

**Problema:**
- Aunque está memoizado con `memo()`, las props cambian frecuentemente:
  - `version` cambia cuando cambia la versión activa
  - `colorActivo` cambia cuando cambia el color
  - `imagenActual` cambia cuando cambia versión o color
  - `coloresDisponibles` cambia cuando cambia la versión
- `memo()` solo previene re-renders si las props son referencialmente iguales
- Como los objetos se recrean en cada cambio, `memo()` no ayuda

---

## 3. ¿Es Evitable Sin Romper UX?

### 3.1. Render de Versiones Adyacentes

**Evitable:** ✅ Sí, con impacto mínimo en UX

**Justificación:**
- Las versiones adyacentes están fuera del viewport
- El usuario no las ve hasta que hace swipe
- Podemos renderizarlas solo cuando estén a punto de entrar al viewport (lazy loading)

**Riesgo:** Bajo
- Si el render es muy rápido, el usuario no notará diferencia
- Si el render es lento, puede causar un pequeño "lag" al hacer swipe rápido

### 3.2. Re-renders Durante Scroll

**Parcialmente evitable:** ⚠️ Sí, pero requiere optimización

**Justificación:**
- Podemos usar `useRef` para evitar re-renders durante scroll
- Solo actualizar estado cuando el scroll termine (usando `scrollend` o timeout más largo)

**Riesgo:** Muy bajo
- No afecta UX visible
- Solo mejora performance interna

### 3.3. VersionContent con Props Limitadas

**Evitable:** ✅ Sí, completamente

**Justificación:**
- Si una versión no es activa, no necesita renderizar contenido completo
- Podemos usar un placeholder más simple o renderizar solo estructura básica

**Riesgo:** Ninguno
- No afecta UX
- Solo reduce renders innecesarios

---

## 4. Impacto Real en Mobile

### 4.1. CPU

**Impacto:** Medio-Alto

**Evidencia:**
- Cada `VersionContent` renderiza:
  - 1 imagen (decodificación y renderizado)
  - ColorSelector con múltiples botones
  - ModeloSpecs con grid de especificaciones
  - Botones PDF/WhatsApp
- 3 versiones renderizadas = 3x el trabajo
- En dispositivos móviles de gama baja, esto puede causar:
  - Frame drops durante swipe
  - Calentamiento del dispositivo
  - Consumo de batería

**Medición estimada:**
- Render completo de `VersionContent`: ~5-10ms en móvil gama media
- 3 versiones: ~15-30ms por cambio
- Durante swipe rápido (5 cambios/segundo): ~75-150ms de trabajo CPU

### 4.2. Memoria

**Impacto:** Bajo-Medio

**Evidencia:**
- Cada `VersionContent` montado mantiene:
  - DOM nodes en memoria
  - Event listeners
  - Referencias a imágenes (aunque no visibles)
- 3 versiones = 3x el uso de memoria
- En dispositivos con poca RAM, esto puede causar:
  - Garbage collection más frecuente
  - Posible lag si el sistema necesita liberar memoria

**Medición estimada:**
- Memoria por `VersionContent`: ~50-100KB
- 3 versiones: ~150-300KB adicionales
- Impacto: Bajo en dispositivos modernos, medio en dispositivos antiguos

### 4.3. Fluidez del Swipe

**Impacto:** Medio

**Evidencia:**
- Durante swipe, el navegador debe:
  - Renderizar frames de animación (60fps = 16.6ms por frame)
  - Ejecutar JavaScript (handlers de scroll)
  - Actualizar DOM si hay cambios de estado
- Si los renders bloquean el thread principal, el swipe se siente "trabado"

**Síntomas observables:**
- Swipe no fluido (frames perdidos)
- Retraso en la actualización de la versión activa
- Posible "stuttering" en dispositivos de gama baja

**Medición estimada:**
- Frame budget: 16.6ms por frame
- Render de 3 versiones: ~15-30ms
- **Resultado:** Posible pérdida de 1-2 frames durante swipe

---

## 5. Solución Propuesta

### 5.1. Estrategia General

**Principio:** Renderizar solo la versión visible + precargar la siguiente cuando esté cerca

**Cambios:**
1. **Render condicional mejorado:** Solo renderizar `VersionContent` completo para la versión activa
2. **Lazy loading de adyacentes:** Renderizar versiones adyacentes solo cuando estén a punto de entrar al viewport
3. **Optimización de scroll:** Usar `useRef` para evitar re-renders durante scroll
4. **Memoización mejorada:** Usar `useMemo` para estabilizar props de `VersionContent`

### 5.2. Implementación Concreta

#### Cambio 1: Render Condicional Mejorado

**Archivo:** `CeroKilometroDetalle.jsx`

**Antes:**
```jsx
{Math.abs(index - indiceVersionActiva) <= 1 ? (
  <VersionContent ... />
) : (
  <div className={styles.carouselPlaceholder}>...</div>
)}
```

**Después:**
```jsx
{index === indiceVersionActiva ? (
  <VersionContent
    version={versionActiva}
    modeloMarca={modelo.marca}
    modeloNombre={modelo.nombre}
    colorActivo={colorActivo}
    coloresDisponibles={coloresDisponibles}
    imagenActual={imagenActual}
    onColorChange={cambiarColor}
    layout="mobile"
  />
) : (
  <div className={styles.carouselPlaceholder}>
    <span>{version.nombreCorto}</span>
  </div>
)}
```

**Beneficio:**
- Reduce renders de 3 a 1 por cambio de versión
- Elimina renders de versiones adyacentes no visibles

#### Cambio 2: Optimización de Scroll

**Archivo:** `CeroKilometroDetalle.jsx`

**Antes:**
```jsx
const handleCarouselScroll = useCallback(() => {
  // ... lógica que causa re-renders
}, [indiceVersionActiva, totalVersiones, cambiarVersionPorIndice])
```

**Después:**
```jsx
const scrollTimeoutRef = useRef(null)
const isScrollingRef = useRef(false)

const handleCarouselScroll = useCallback(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  isScrollingRef.current = true
  
  clearTimeout(scrollTimeoutRef.current)
  scrollTimeoutRef.current = setTimeout(() => {
    const slideWidth = carousel.offsetWidth
    const scrollPosition = carousel.scrollLeft
    const newIndex = Math.round(scrollPosition / slideWidth)
    
    if (newIndex !== indiceVersionActiva && newIndex >= 0 && newIndex < totalVersiones) {
      cambiarVersionPorIndice(newIndex)
    }
    
    isScrollingRef.current = false
  }, 150) // Aumentado a 150ms para mejor debounce
}, [indiceVersionActiva, totalVersiones, cambiarVersionPorIndice])
```

**Beneficio:**
- Evita re-renders durante scroll activo
- Solo actualiza estado cuando el scroll termina

#### Cambio 3: Memoización de Props

**Archivo:** `CeroKilometroDetalle.jsx`

**Agregar:**
```jsx
const versionContentProps = useMemo(() => ({
  version: versionActiva,
  modeloMarca: modelo.marca,
  modeloNombre: modelo.nombre,
  colorActivo,
  coloresDisponibles,
  imagenActual,
  onColorChange: cambiarColor,
  layout: 'mobile'
}), [versionActiva, modelo.marca, modelo.nombre, colorActivo, coloresDisponibles, imagenActual, cambiarColor])
```

**Uso:**
```jsx
<VersionContent {...versionContentProps} />
```

**Beneficio:**
- Estabiliza referencias de props
- Permite que `memo()` en `VersionContent` funcione correctamente

### 5.3. Consideraciones de UX

**Riesgo de lag al hacer swipe rápido:**
- **Mitigación:** El render de `VersionContent` es rápido (~5-10ms)
- **Fallback:** Si el render es lento, el placeholder ya está visible, dando feedback inmediato
- **Testing:** Probar en dispositivos de gama baja para validar

**Precarga de versiones adyacentes:**
- **Opción avanzada:** Usar `IntersectionObserver` para precargar cuando estén cerca
- **Complejidad:** Media-Alta
- **Beneficio:** Mejora UX sin sacrificar performance
- **Recomendación:** Implementar solo si hay problemas de lag después del cambio 1

---

## 6. Esfuerzo, Riesgo y Efectos Colaterales

### 6.1. Esfuerzo Estimado

**Cambio 1 (Render condicional):** ⭐ Bajo (30 min)
- Modificar condición en `map`
- Testing manual en mobile

**Cambio 2 (Optimización scroll):** ⭐⭐ Medio (1 hora)
- Refactorizar `handleCarouselScroll`
- Agregar `useRef` para estado de scroll
- Testing de edge cases (swipe rápido, múltiples swipes)

**Cambio 3 (Memoización props):** ⭐ Bajo (20 min)
- Agregar `useMemo` para props
- Testing de renders (React DevTools)

**Total:** ~2 horas

### 6.2. Riesgo

**Riesgo general:** 🟢 Bajo

**Riesgos específicos:**

1. **Lag al hacer swipe rápido:**
   - **Probabilidad:** Baja
   - **Impacto:** Medio (afecta UX)
   - **Mitigación:** Testing en dispositivos de gama baja, fallback con placeholder

2. **Versión no se actualiza correctamente:**
   - **Probabilidad:** Muy baja
   - **Impacto:** Alto (bug funcional)
   - **Mitigación:** Testing exhaustivo de navegación por tabs y swipe

3. **Regresión en desktop:**
   - **Probabilidad:** Muy baja
   - **Impacto:** Bajo (cambios solo afectan mobile)
   - **Mitigación:** Cambios están aislados en `mobileContent`

### 6.3. Efectos Colaterales Positivos

✅ **Reducción de memoria:** Menos componentes montados = menos memoria usada

✅ **Mejor performance general:** Menos trabajo del thread principal = mejor responsividad

✅ **Mejor experiencia en dispositivos de gama baja:** Menos frame drops durante swipe

### 6.4. Efectos Colaterales Negativos

⚠️ **Posible lag al hacer swipe muy rápido:**
- Si el render de `VersionContent` es lento, puede haber un pequeño delay
- **Mitigación:** El placeholder ya está visible, dando feedback inmediato

⚠️ **Cambio en comportamiento de scroll:**
- El debounce de 150ms puede hacer que la actualización se sienta ligeramente más lenta
- **Mitigación:** 150ms es imperceptible para el usuario (umbral de percepción: ~100ms)

---

## 7. Recomendación Final

### 7.1. Prioridad

**Alta** - El problema afecta performance en mobile, especialmente en dispositivos de gama baja.

### 7.2. Enfoque Recomendado

**Implementar en fases:**

1. **Fase 1 (Inmediata):** Cambio 1 (Render condicional)
   - Impacto: Alto
   - Esfuerzo: Bajo
   - Riesgo: Muy bajo

2. **Fase 2 (Si es necesario):** Cambio 2 (Optimización scroll)
   - Impacto: Medio
   - Esfuerzo: Medio
   - Riesgo: Bajo

3. **Fase 3 (Opcional):** Cambio 3 (Memoización props)
   - Impacto: Bajo-Medio
   - Esfuerzo: Bajo
   - Riesgo: Muy bajo

### 7.3. Validación

**Métricas a medir:**
- Frame rate durante swipe (objetivo: 60fps)
- Tiempo de render de `VersionContent` (objetivo: <10ms)
- Memoria usada (objetivo: reducción del 30-40%)

**Testing:**
- Dispositivos de gama baja (Android antiguo, iPhone 8)
- Swipe rápido (múltiples versiones en <1 segundo)
- Navegación por tabs (debe funcionar igual que antes)

---

## 8. Conclusión

El carrusel mobile tiene un problema de performance real pero solucionable. La solución propuesta es **simple, de bajo riesgo y alto impacto**, alineada con los principios del proyecto (evitar sobre-ingeniería, priorizar impacto real).

**Recomendación:** Implementar Fase 1 primero, medir resultados, y decidir si Fase 2 y 3 son necesarias.

