# Análisis de Robustez – VersionCarousel

## Resumen Ejecutivo

**Estado actual:** Componente funcional con lógica de navegación correcta.

**Enfoque:** Identificar riesgos reales y proponer mejoras defensivas de bajo costo, sin sobre-ingeniería.

---

## 1. Análisis de Cálculo de slideWidth

### 1.1. Puntos Frágiles Identificados

**Ubicación:** Líneas 49 y 84 de `VersionCarousel.jsx`

```javascript
// Línea 49: Scroll programático
const slideWidth = carousel.offsetWidth

// Línea 84: Detección de swipe
const slideWidth = carousel.offsetWidth
```

**Problemas potenciales:**

#### A. offsetWidth puede ser 0 o incorrecto
**Escenario:**
- Componente se monta pero el DOM aún no está renderizado completamente
- CSS aún no se aplicó (estilos no cargados)
- Elemento está oculto (`display: none`) o tiene `width: 0`

**Probabilidad:** Media (puede ocurrir en carga inicial o con CSS dinámico)
**Impacto:** Alto (scroll se rompe, cálculos incorrectos)

**Evidencia:**
- `offsetWidth` retorna `0` si el elemento no está visible
- No hay validación de que `slideWidth > 0`

#### B. offsetWidth cambia en resize
**Escenario:**
- Usuario rota dispositivo (portrait → landscape)
- Usuario cambia tamaño de ventana (desktop)
- CSS responsive cambia el ancho

**Probabilidad:** Alta (común en mobile)
**Impacto:** Medio (scroll desincronizado temporalmente)

**Evidencia:**
- No hay listener de `resize`
- `slideWidth` se calcula solo cuando cambia `activeIndex` o en scroll
- Si el ancho cambia, los cálculos quedan obsoletos

#### C. offsetWidth incluye scrollbar (si existe)
**Escenario:**
- En algunos navegadores, `offsetWidth` puede incluir scrollbar
- CSS tiene `scrollbar-width: none` pero puede fallar en algunos casos

**Probabilidad:** Baja (scrollbar está oculta con CSS)
**Impacto:** Bajo (error mínimo, <1px)

**Evidencia:**
- CSS tiene `scrollbar-width: none` y `-ms-overflow-style: none`
- Pero no hay garantía 100% en todos los navegadores

### 1.2. Propuestas Defensivas

**Propuesta 1: Validación de slideWidth (BAJO COSTO, ALTO IMPACTO)**

```javascript
const slideWidth = carousel.offsetWidth
if (slideWidth <= 0) {
  // Elemento no está visible o no tiene ancho válido
  // No hacer scroll, esperar a que el elemento esté listo
  return
}
```

**Costo:** Muy bajo (1 línea de validación)
**Impacto:** Alto (previene crashes)
**Riesgo:** Ninguno
**Recomendación:** ✅ IMPLEMENTAR

---

**Propuesta 2: Listener de resize (COSTO MEDIO, IMPACTO MEDIO)**

```javascript
useEffect(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  const handleResize = () => {
    // Re-sincronizar scroll si el ancho cambió
    const newSlideWidth = carousel.offsetWidth
    if (newSlideWidth > 0 && activeIndex >= 0) {
      carousel.scrollTo({
        left: activeIndex * newSlideWidth,
        behavior: 'auto' // Sin animación para ser instantáneo
      })
    }
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [activeIndex])
```

**Costo:** Medio (nuevo useEffect, listener adicional)
**Impacto:** Medio (mejora sincronización en resize)
**Riesgo:** Bajo (puede causar scroll no deseado si se dispara frecuentemente)
**Recomendación:** ⚠️ OPCIONAL (solo si hay problemas reportados)

**Nota:** Podría usar debounce para evitar scrolls excesivos, pero aumenta complejidad.

---

**Propuesta 3: Usar clientWidth en vez de offsetWidth (BAJO COSTO, IMPACTO BAJO)**

```javascript
const slideWidth = carousel.clientWidth // Excluye scrollbar
```

**Costo:** Muy bajo (cambio de propiedad)
**Impacto:** Bajo (mejora mínima, scrollbar ya está oculta)
**Riesgo:** Ninguno
**Recomendación:** ⚠️ OPCIONAL (mejora teórica, impacto real mínimo)

---

## 2. Riesgos de Desincronización

### 2.1. Desincronización Scroll ↔ activeIndex

**Problema:** El scroll puede quedar desincronizado del `activeIndex` si:
- El usuario hace swipe muy rápido
- El `activeIndex` cambia externamente mientras hay scroll en progreso
- El timeout de 600ms no es suficiente para scrolls lentos

**Escenario 1: Swipe rápido seguido de cambio programático**
```
1. Usuario hace swipe rápido → scrollLeft cambia
2. handleCarouselScroll calcula newIndex = 2
3. onChangeIndex(2) se llama
4. activeIndex cambia a 2
5. useEffect de scroll programático se dispara
6. scrollTo se ejecuta mientras el swipe aún está en progreso
7. Conflicto: scroll del usuario vs scroll programático
```

**Probabilidad:** Media (puede ocurrir con swipes muy rápidos)
**Impacto:** Medio (scroll puede "saltar" o quedar en posición incorrecta)

**Mitigación actual:**
- Flag `isScrollingProgrammaticallyRef` previene loops
- Debounce de 100ms reduce cambios múltiples
- Timeout de 600ms para resetear flag

**Efectividad:** Buena, pero no perfecta

---

**Escenario 2: activeIndex cambia mientras scroll programático está en progreso**
```
1. activeIndex = 0, scrollTo(0) se ejecuta (smooth, ~500ms)
2. Mientras scroll está en progreso, activeIndex cambia a 1
3. useEffect se dispara nuevamente
4. scrollTo(1) se ejecuta, cancelando el scroll anterior
5. Resultado: scroll puede "saltar" o quedar inconsistente
```

**Probabilidad:** Baja (requiere cambio externo muy rápido)
**Impacto:** Medio (UX confusa)

**Mitigación actual:**
- Cleanup del useEffect cancela timeout anterior
- Pero no cancela el scrollTo en progreso

**Efectividad:** Parcial

---

**Propuesta Defensiva: Cancelar scroll anterior (COSTO MEDIO, IMPACTO MEDIO)**

```javascript
useEffect(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  // Cancelar scroll anterior si está en progreso
  // scrollTo con 'smooth' no se puede cancelar directamente,
  // pero podemos forzar scroll instantáneo y luego hacer el nuevo
  carousel.scrollTo({
    left: carousel.scrollLeft, // Forzar posición actual (sin cambio)
    behavior: 'auto' // Instantáneo, cancela smooth anterior
  })
  
  // Pequeño delay para asegurar que el scroll anterior se canceló
  const cancelTimeout = setTimeout(() => {
    isScrollingProgrammaticallyRef.current = true
    
    const slideWidth = carousel.offsetWidth
    if (slideWidth <= 0) return
    
    carousel.scrollTo({
      left: activeIndex * slideWidth,
      behavior: 'smooth'
    })
    
    const resetTimeout = setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false
    }, 600)
    
    return () => {
      clearTimeout(cancelTimeout)
      clearTimeout(resetTimeout)
      isScrollingProgrammaticallyRef.current = false
    }
  }, 10) // Delay mínimo para cancelar scroll anterior
  
  return () => {
    clearTimeout(cancelTimeout)
  }
}, [activeIndex])
```

**Costo:** Medio (lógica adicional, más compleja)
**Impacto:** Medio (mejora sincronización)
**Riesgo:** Bajo (puede causar "parpadeo" si hay muchos cambios rápidos)
**Recomendación:** ⚠️ OPCIONAL (solo si hay problemas reportados)

**Nota:** Esta solución es más compleja y puede no ser necesaria si el comportamiento actual es aceptable.

---

### 2.2. Race Condition en handleCarouselScroll

**Problema:** Si `onChangeIndex` es asíncrono o causa re-renders lentos, puede haber race conditions.

**Escenario:**
```
1. Usuario hace swipe → scrollLeft = 500px
2. handleCarouselScroll calcula newIndex = 1
3. onChangeIndex(1) se llama
4. Mientras el estado se actualiza, usuario hace otro swipe
5. scrollLeft = 1000px
6. handleCarouselScroll calcula newIndex = 2
7. onChangeIndex(2) se llama
8. activeIndex puede quedar en 1 o 2 dependiendo del timing
```

**Probabilidad:** Baja (requiere swipes muy rápidos y re-renders lentos)
**Impacto:** Medio (índice incorrecto)

**Mitigación actual:**
- Debounce de 100ms reduce llamadas múltiples
- Validación `newIndex !== activeIndex` previene cambios innecesarios

**Efectividad:** Buena

**Propuesta:** ✅ NO TOCAR (mitigación actual es suficiente)

---

## 3. Dependencias Implícitas del Layout

### 3.1. Breakpoints y Responsive

**Problema:** El componente asume que siempre está en mobile (100% width por slide).

**Evidencia:**
- CSS: `flex: 0 0 100%` y `min-width: 100%`
- No hay lógica para detectar si está en mobile o desktop
- Si se usa en desktop por error, el cálculo de `slideWidth` será incorrecto

**Probabilidad:** Baja (el componente solo se usa en mobile según el diseño)
**Impacto:** Alto (si se usa en desktop, no funciona)

**Propuesta:** ✅ NO TOCAR (asumir que solo se usa en mobile es correcto)

**Razón:** El componente está diseñado específicamente para mobile. Si se necesita desktop, crear otro componente.

---

### 3.2. Resize del Viewport

**Problema:** Si el viewport cambia de tamaño, `slideWidth` queda obsoleto.

**Escenario:**
- Usuario rota dispositivo (portrait → landscape)
- Ancho cambia de 375px a 667px (ejemplo iPhone)
- `slideWidth` calculado con 375px ya no es válido
- Scroll queda desincronizado

**Probabilidad:** Alta (rotación de dispositivo es común)
**Impacto:** Medio (scroll desincronizado hasta próximo cambio)

**Propuesta:** Ver Propuesta 2 en sección 1.1 (Listener de resize)

---

### 3.3. CSS No Cargado

**Problema:** Si los estilos CSS no se cargan o se cargan tarde, el layout puede estar roto.

**Escenario:**
- CSS se carga después del JS
- `offsetWidth` se calcula antes de que CSS se aplique
- Slide puede tener ancho incorrecto

**Probabilidad:** Muy baja (CSS normalmente se carga antes)
**Impacto:** Alto (componente no funciona)

**Propuesta:** ✅ NO TOCAR (problema de infraestructura, no del componente)

**Razón:** Si CSS no se carga, hay un problema más grande en la aplicación.

---

## 4. Casos Límite

### 4.1. versions Vacío

**Código actual:**
```javascript
{versions.map((version, index) => {
  // ...
})}
```

**Comportamiento:** Si `versions = []`, no se renderiza nada.

**Probabilidad:** Baja (el padre valida que hay versiones)
**Impacto:** Bajo (no hay nada que mostrar, comportamiento correcto)

**Propuesta:** ⚠️ OPCIONAL - Early return defensivo

```javascript
if (!versions || versions.length === 0) {
  return null // O un mensaje de "No hay versiones"
}
```

**Costo:** Muy bajo (1 línea)
**Impacto:** Bajo (mejora robustez pero no es crítico)
**Recomendación:** ⚠️ OPCIONAL (solo si hay riesgo de versions vacío)

---

### 4.2. 1 Solo Item

**Comportamiento:** Si `versions.length === 1`, el carrusel tiene un solo slide.

**Problemas potenciales:**
- Navegación por teclado no tiene sentido (no hay dónde navegar)
- Scroll no tiene sentido (ya está en la única posición)

**Probabilidad:** Media (puede haber modelos con 1 sola versión)
**Impacto:** Bajo (funciona, solo que la navegación no tiene efecto)

**Propuesta:** ✅ NO TOCAR (comportamiento actual es correcto)

**Razón:** El componente funciona correctamente con 1 item. Deshabilitar navegación agregaría complejidad sin beneficio claro.

---

### 4.3. activeIndex Inválido

**Escenarios:**
- `activeIndex < 0`
- `activeIndex >= versions.length`
- `activeIndex = NaN` o `undefined`

**Código actual:**
```javascript
// Línea 88: Validación en handleCarouselScroll
if (newIndex !== activeIndex && newIndex >= 0 && newIndex < versions.length) {
  onChangeIndex(newIndex)
}

// Línea 50: Scroll programático
carousel.scrollTo({
  left: activeIndex * slideWidth, // No valida si activeIndex es válido
  behavior: 'smooth'
})
```

**Problema:** El scroll programático no valida que `activeIndex` sea válido.

**Probabilidad:** Baja (el padre controla `activeIndex`)
**Impacto:** Medio (scroll puede ir a posición incorrecta)

**Propuesta Defensiva: Validar activeIndex (BAJO COSTO, ALTO IMPACTO)**

```javascript
// En useEffect de scroll programático
if (activeIndex < 0 || activeIndex >= versions.length) {
  return // No hacer scroll si el índice es inválido
}

const slideWidth = carousel.offsetWidth
if (slideWidth <= 0) return

carousel.scrollTo({
  left: activeIndex * slideWidth,
  behavior: 'smooth'
})
```

**Costo:** Muy bajo (2 líneas de validación)
**Impacto:** Alto (previene crashes y comportamientos incorrectos)
**Riesgo:** Ninguno
**Recomendación:** ✅ IMPLEMENTAR

---

### 4.4. onChangeIndex No Definido

**Código actual:**
```javascript
onChangeIndex(newIndex) // Línea 89, 134
```

**Problema:** Si `onChangeIndex` es `undefined` o `null`, se produce error.

**Probabilidad:** Muy baja (el padre siempre pasa la función)
**Impacto:** Alto (crash de la aplicación)

**Propuesta Defensiva: Validar onChangeIndex (BAJO COSTO, ALTO IMPACTO)**

```javascript
if (typeof onChangeIndex !== 'function') {
  console.warn('VersionCarousel: onChangeIndex debe ser una función')
  return
}

onChangeIndex(newIndex)
```

**Costo:** Muy bajo (validación simple)
**Impacto:** Alto (previene crashes)
**Riesgo:** Ninguno
**Recomendación:** ✅ IMPLEMENTAR

---

## 5. Mejoras Defensivas de Bajo Costo

### 5.1. Priorización

#### 🔴 ALTA PRIORIDAD (Implementar)

1. **Validar slideWidth > 0** (Sección 1.1, Propuesta 1)
   - Costo: Muy bajo
   - Impacto: Alto
   - Riesgo: Ninguno

2. **Validar activeIndex válido** (Sección 4.3)
   - Costo: Muy bajo
   - Impacto: Alto
   - Riesgo: Ninguno

3. **Validar onChangeIndex es función** (Sección 4.4)
   - Costo: Muy bajo
   - Impacto: Alto
   - Riesgo: Ninguno

#### 🟡 MEDIA PRIORIDAD (Opcional, solo si hay problemas)

4. **Listener de resize** (Sección 1.1, Propuesta 2)
   - Costo: Medio
   - Impacto: Medio
   - Riesgo: Bajo

5. **Early return para versions vacío** (Sección 4.1)
   - Costo: Muy bajo
   - Impacto: Bajo
   - Riesgo: Ninguno

#### 🟢 BAJA PRIORIDAD (No implementar)

6. **Cancelar scroll anterior** (Sección 2.1)
   - Costo: Medio-Alto
   - Impacto: Medio
   - Riesgo: Medio (puede causar parpadeo)

7. **Usar clientWidth en vez de offsetWidth** (Sección 1.1, Propuesta 3)
   - Costo: Muy bajo
   - Impacto: Muy bajo (mejora teórica)

---

## 6. Resumen de Riesgos

### 6.1. Riesgos Reales (Alta Probabilidad o Alto Impacto)

| Riesgo | Probabilidad | Impacto | Mitigación Actual | Propuesta |
|--------|--------------|---------|-------------------|-----------|
| slideWidth = 0 | Media | Alto | Ninguna | ✅ Validar > 0 |
| activeIndex inválido | Baja | Alto | Parcial | ✅ Validar rango |
| onChangeIndex undefined | Muy baja | Alto | Ninguna | ✅ Validar función |
| Resize desincroniza | Alta | Medio | Ninguna | ⚠️ Listener opcional |
| Race condition en swipe | Baja | Medio | Debounce | ✅ No tocar |

### 6.2. Riesgos Teóricos (Baja Probabilidad y Bajo Impacto)

| Riesgo | Probabilidad | Impacto | Acción |
|--------|--------------|---------|--------|
| CSS no cargado | Muy baja | Alto | ✅ No tocar (problema infraestructura) |
| 1 solo item | Media | Bajo | ✅ No tocar (funciona correctamente) |
| versions vacío | Baja | Bajo | ⚠️ Opcional (early return) |

---

## 7. Recomendaciones Finales

### 7.1. Implementar Inmediatamente

**Tres validaciones defensivas de bajo costo:**

1. Validar `slideWidth > 0` antes de usar
2. Validar `activeIndex` está en rango válido
3. Validar `onChangeIndex` es función

**Costo total:** ~5 líneas de código
**Impacto:** Previene crashes y comportamientos incorrectos
**Riesgo:** Ninguno

### 7.2. Monitorear (No Implementar Aún)

**Listener de resize:**
- Solo implementar si hay reportes de problemas en rotación de dispositivo
- Agregar debounce si se implementa

### 7.3. No Tocar

**Cancelar scroll anterior:**
- Complejidad alta, beneficio marginal
- Comportamiento actual es aceptable

**Detección de mobile/desktop:**
- Componente está diseñado para mobile
- Si se necesita desktop, crear componente separado

---

## 8. Conclusión

**Estado actual:** Componente funcional con buena arquitectura.

**Mejoras recomendadas:** 3 validaciones defensivas de bajo costo que previenen crashes.

**No tocar:** Lógica compleja que no agrega valor suficiente.

**Enfoque:** Pragmático, solo mejoras que previenen problemas reales sin agregar complejidad innecesaria.

---

**Documento creado para guiar mejoras de robustez del componente.**
**Enfoque: bajo costo, alto impacto, sin sobre-ingeniería.**

