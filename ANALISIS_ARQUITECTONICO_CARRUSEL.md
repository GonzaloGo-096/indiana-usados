# Análisis Arquitectónico – Carrusel Mobile: Claridad Semántica y Mantenibilidad

## Contexto

**Componente:** `CeroKilometroDetalle.jsx` - Carrusel mobile con cambio de versión

**Dos flujos de cambio de versión:**
1. **Interacción del usuario:** Swipe (scroll manual)
2. **Acción programática:** Click en tabs → `scrollTo` automático

**Problema central:** Ambos flujos confluyen en el mismo evento `scroll`, creando ambigüedad semántica.

---

## 1. Análisis del Diseño Actual

### 1.1. Flujo 1: Swipe del Usuario

```
Usuario hace swipe
  ↓
Evento 'scroll' se dispara (~10-20 veces/seg)
  ↓
handleScroll (debounce 100ms)
  ↓
handleCarouselScroll
  ↓
Calcula newIndex desde scrollLeft
  ↓
Si newIndex !== indiceVersionActiva → cambiarVersionPorIndice(newIndex)
  ↓
Hook useModeloSelector actualiza estado
  ↓
indiceVersionActiva cambia
  ↓
useEffect detecta cambio → scrollTo (pero ya estamos en esa posición, no hace nada)
```

**Código relevante:**
```65:76:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
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
```

### 1.2. Flujo 2: Cambio por Tabs

```
Usuario click en tab
  ↓
onVersionChange(versionId) → cambiarVersion(versionId)
  ↓
Hook useModeloSelector actualiza versionActivaId
  ↓
indiceVersionActiva se recalcula (useMemo)
  ↓
useEffect detecta cambio de indiceVersionActiva
  ↓
scrollTo({ left: indiceVersionActiva * slideWidth, behavior: 'smooth' })
  ↓
scrollTo dispara evento 'scroll' (1-2 veces)
  ↓
handleScroll captura el evento
  ↓
handleCarouselScroll se ejecuta (después de debounce)
  ↓
Calcula newIndex (ya es igual a indiceVersionActiva)
  ↓
Condición newIndex !== indiceVersionActiva es false → NO hace nada
```

**Código relevante:**
```52:62:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
// Scroll del carrusel mobile al cambiar versión por tabs
useEffect(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  const slideWidth = carousel.offsetWidth
  carousel.scrollTo({
    left: indiceVersionActiva * slideWidth,
    behavior: 'smooth'
  })
}, [indiceVersionActiva])
```

### 1.3. Punto de Confluencia

**Ambos flujos usan el mismo listener:**
```78:94:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
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

---

## 2. Problemas Semánticos Identificados

### 2.1. Ambigüedad de Intención

**Problema:** El evento `scroll` no distingue entre:
- "El usuario está haciendo swipe" (intención: cambiar versión)
- "El sistema está sincronizando la posición" (intención: mantener consistencia)

**Impacto:**
- Código difícil de entender: ¿por qué el scroll programático dispara el mismo handler?
- Lógica defensiva necesaria: condición `newIndex !== indiceVersionActiva` para prevenir loops
- Mantenibilidad: si alguien modifica el código, puede romper la mitigación

### 2.2. Dependencia Circular Potencial

**Flujo problemático (mitigado pero frágil):**
```
scrollTo (programático)
  ↓
dispara evento 'scroll'
  ↓
handleCarouselScroll
  ↓
cambiarVersionPorIndice
  ↓
indiceVersionActiva cambia
  ↓
useEffect detecta cambio
  ↓
scrollTo (otra vez)
```

**Mitigación actual:**
- Condición `newIndex !== indiceVersionActiva` previene el loop
- Debounce de 100ms ayuda pero no es suficiente

**Riesgo:**
- Si alguien cambia la lógica de cálculo de `newIndex`, puede romper la condición
- Si el debounce cambia, puede haber race conditions
- Si `scrollTo` no es instantáneo, puede haber desincronización temporal

### 2.3. Acoplamiento Implícito

**Problema:** El `useEffect` de scroll y el handler de scroll están acoplados implícitamente:
- El `useEffect` asume que `scrollTo` no causará problemas
- El handler asume que solo debe responder a scrolls del usuario
- No hay comunicación explícita entre ambos

**Impacto:**
- Difícil de testear: ¿cómo se testea que no hay loops?
- Difícil de debuggear: si hay un problema, ¿es del useEffect o del handler?
- Difícil de extender: si se agrega otra fuente de scroll, puede romper

### 2.4. Falta de Separación de Responsabilidades

**Problema:** Un solo handler maneja dos intenciones diferentes:
1. Detectar cambio de versión por swipe
2. Ignorar scrolls programáticos

**Impacto:**
- Violación del principio de responsabilidad única
- Lógica condicional compleja (`newIndex !== indiceVersionActiva`)
- Código difícil de mantener

---

## 3. Riesgos Futuros

### 3.1. Riesgo de Loops Infinitos

**Escenario:** Alguien modifica la lógica de cálculo de `newIndex` o la condición de comparación.

**Probabilidad:** Media
**Impacto:** Alto (página se congela)

**Ejemplo:**
```javascript
// Si alguien cambia esto:
const newIndex = Math.round(scrollPosition / slideWidth)

// Por esto (sin pensar en las consecuencias):
const newIndex = Math.floor(scrollPosition / slideWidth)

// Puede causar que newIndex !== indiceVersionActiva siempre sea true
// → Loop infinito
```

### 3.2. Riesgo de Desincronización

**Escenario:** El `scrollTo` no completa antes de que se dispare otro evento.

**Probabilidad:** Baja (pero aumenta con más complejidad)
**Impacto:** Medio (UI inconsistente temporalmente)

**Ejemplo:**
- Usuario hace swipe rápido
- Mientras tanto, click en tab
- Ambos eventos compiten
- Estado puede quedar inconsistente

### 3.3. Riesgo de Deuda Técnica

**Escenario:** El código funciona pero es difícil de entender y mantener.

**Probabilidad:** Alta (ya está presente)
**Impacto:** Medio (lento desarrollo futuro)

**Síntomas:**
- Nuevos desarrolladores no entienden por qué hay una condición defensiva
- Cambios pequeños requieren mucho cuidado
- Tests son difíciles de escribir

### 3.4. Riesgo de Bugs al Extender

**Escenario:** Se agrega otra fuente de cambio de versión (ej: URL, botones de navegación).

**Probabilidad:** Media
**Impacto:** Alto (puede romper funcionalidad existente)

**Ejemplo:**
- Si se agrega navegación por URL
- URL cambia → versión cambia → scrollTo
- Puede entrar en conflicto con swipe o tabs

---

## 4. Alternativas Conceptuales

### 4.1. Alternativa A: Flag de Origen (Source Flag)

**Concepto:** Agregar un flag que indique el origen del cambio.

**Diseño:**
- Estado: `isScrollingProgrammatically: boolean`
- Cuando `scrollTo` se ejecuta: `isScrollingProgrammatically = true`
- En `handleCarouselScroll`: si flag es true, ignorar
- Después de scroll: resetear flag

**Ventajas:**
- ✅ Separación clara de intenciones
- ✅ Fácil de entender
- ✅ Bajo riesgo de loops

**Desventajas:**
- ⚠️ Requiere sincronización temporal (cuándo resetear el flag)
- ⚠️ Puede haber race conditions si no se maneja bien
- ⚠️ Agrega un estado adicional

**Claridad:** ⭐⭐⭐⭐ (4/5)
**Riesgo:** ⭐⭐ (2/5 - bajo con cuidado)
**Esfuerzo:** ⭐⭐ (2/5 - bajo)
**Alineación React:** ⭐⭐⭐ (3/5 - estado adicional no ideal)

---

### 4.2. Alternativa B: Separación de Handlers

**Concepto:** Dos handlers separados: uno para scroll del usuario, otro para sincronización.

**Diseño:**
- Handler 1: `handleUserScroll` - solo responde a scrolls del usuario
- Handler 2: `syncScrollPosition` - solo sincroniza posición cuando cambia versión
- Usar `passive: false` para detectar scrolls del usuario
- Usar flag o ref para ignorar scrolls programáticos

**Ventajas:**
- ✅ Separación clara de responsabilidades
- ✅ Cada handler tiene una sola responsabilidad
- ✅ Fácil de testear

**Desventajas:**
- ⚠️ Requiere detectar origen del scroll (complejidad técnica)
- ⚠️ Puede no ser posible distinguir scroll del usuario vs programático en todos los casos

**Claridad:** ⭐⭐⭐⭐⭐ (5/5)
**Riesgo:** ⭐⭐⭐ (3/5 - medio, depende de implementación)
**Esfuerzo:** ⭐⭐⭐ (3/5 - medio)
**Alineación React:** ⭐⭐⭐⭐ (4/5 - handlers separados es buena práctica)

---

### 4.3. Alternativa C: Canal de Comunicación Explícito

**Concepto:** Usar un ref o contexto para comunicación explícita entre efectos.

**Diseño:**
- Ref: `isInternalScroll = useRef(false)`
- Antes de `scrollTo`: `isInternalScroll.current = true`
- En handler: si `isInternalScroll.current`, ignorar y resetear
- Después de timeout: `isInternalScroll.current = false`

**Ventajas:**
- ✅ Comunicación explícita
- ✅ No depende de comparaciones de estado
- ✅ Fácil de entender el flujo

**Desventajas:**
- ⚠️ Requiere manejo de timeouts (cuándo resetear)
- ⚠️ Puede ser frágil si hay múltiples scrolls rápidos

**Claridad:** ⭐⭐⭐⭐ (4/5)
**Riesgo:** ⭐⭐ (2/5 - bajo con cuidado)
**Esfuerzo:** ⭐⭐ (2/5 - bajo)
**Alineación React:** ⭐⭐⭐⭐ (4/5 - refs para flags es común)

---

### 4.4. Alternativa D: Estado Unidireccional Explícito

**Concepto:** Separar completamente el estado de "versión activa" del estado de "posición del scroll".

**Diseño:**
- Estado 1: `versionActiva` (fuente de verdad)
- Estado 2: `scrollPosition` (derivado, solo para UI)
- `scrollTo` solo actualiza posición visual, no dispara cambios de versión
- Handler de scroll solo actualiza versión, no modifica scroll directamente
- Sincronización: cuando versión cambia → actualizar scroll (unidireccional)

**Ventajas:**
- ✅ Flujo unidireccional claro (React best practice)
- ✅ Separación completa de responsabilidades
- ✅ Sin riesgo de loops
- ✅ Fácil de entender y mantener

**Desventajas:**
- ⚠️ Requiere refactor más grande
- ⚠️ Puede requerir manejo adicional de sincronización

**Claridad:** ⭐⭐⭐⭐⭐ (5/5)
**Riesgo:** ⭐ (1/5 - muy bajo)
**Esfuerzo:** ⭐⭐⭐⭐ (4/5 - medio-alto, requiere refactor)
**Alineación React:** ⭐⭐⭐⭐⭐ (5/5 - patrón unidireccional es ideal)

---

### 4.5. Alternativa E: Evento Personalizado (Custom Event)

**Concepto:** Usar eventos personalizados para distinguir origen.

**Diseño:**
- Al hacer `scrollTo`: disparar evento personalizado `'programmatic-scroll'`
- Handler de scroll: escuchar evento `'scroll'` normal (solo del usuario)
- Handler separado: escuchar `'programmatic-scroll'` para sincronización

**Ventajas:**
- ✅ Separación completa de eventos
- ✅ Fácil de extender (agregar más tipos de eventos)

**Desventajas:**
- ⚠️ Complejidad adicional (eventos personalizados)
- ⚠️ Puede ser over-engineering para este caso
- ⚠️ No es patrón común en React

**Claridad:** ⭐⭐⭐ (3/5)
**Riesgo:** ⭐⭐⭐ (3/5 - medio)
**Esfuerzo:** ⭐⭐⭐⭐ (4/5 - medio-alto)
**Alineación React:** ⭐⭐ (2/5 - eventos personalizados no son comunes en React)

---

## 5. Comparación de Alternativas

| Alternativa | Claridad | Riesgo | Esfuerzo | Alineación React | Score Total |
|-------------|----------|--------|----------|------------------|-------------|
| **A: Flag de Origen** | 4/5 | 2/5 | 2/5 | 3/5 | **11/20** |
| **B: Separación de Handlers** | 5/5 | 3/5 | 3/5 | 4/5 | **15/20** |
| **C: Canal Explícito (Ref)** | 4/5 | 2/5 | 2/5 | 4/5 | **12/20** |
| **D: Estado Unidireccional** | 5/5 | 1/5 | 4/5 | 5/5 | **15/20** |
| **E: Evento Personalizado** | 3/5 | 3/5 | 4/5 | 2/5 | **12/20** |

**Nota:** Score Total = suma simple (no ponderado). Alternativas B y D empatan en score, pero tienen diferentes trade-offs.

---

## 6. Recomendación Principal

### 6.1. Alternativa Recomendada: **D - Estado Unidireccional Explícito**

**Justificación técnica:**

1. **Alineación con React Best Practices:**
   - Flujo unidireccional de datos es el patrón fundamental de React
   - Separación clara entre estado (fuente de verdad) y UI (derivado)
   - Fácil de entender para cualquier desarrollador React

2. **Claridad Semántica:**
   - Intención explícita: "versión activa" es la fuente de verdad
   - Scroll es solo una representación visual de ese estado
   - No hay ambigüedad sobre qué causa qué

3. **Robustez a Largo Plazo:**
   - Sin riesgo de loops (imposible por diseño)
   - Fácil de extender (agregar más fuentes de cambio de versión)
   - Fácil de testear (flujo lineal)

4. **Mantenibilidad:**
   - Código auto-documentado (el flujo es obvio)
   - Nuevos desarrolladores entienden rápidamente
   - Cambios futuros son seguros

**Trade-off aceptado:**
- Requiere refactor más grande (esfuerzo medio-alto)
- Pero el beneficio a largo plazo justifica la inversión

### 6.2. Alternativa Secundaria: **C - Canal Explícito (Ref)**

**Cuándo elegir esta alternativa:**
- Si el refactor completo (Alternativa D) es demasiado esfuerzo ahora
- Si se necesita una solución rápida que mejore la claridad
- Como paso intermedio hacia la Alternativa D

**Justificación:**
- Mejora la claridad sin requerir refactor grande
- Bajo riesgo si se implementa correctamente
- Puede evolucionar hacia Alternativa D más tarde

---

## 7. Diseño Conceptual de la Alternativa D

### 7.1. Arquitectura Propuesta

```
┌─────────────────────────────────────────┐
│         Fuente de Verdad                │
│    (useModeloSelector hook)            │
│  - versionActiva                        │
│  - indiceVersionActiva                  │
└──────────────┬──────────────────────────┘
               │
               │ (unidireccional)
               ↓
┌─────────────────────────────────────────┐
│      Componente Principal              │
│  (CeroKilometroDetalle)                │
│                                        │
│  Flujo 1: Usuario → Versión           │
│  - Swipe detectado                    │
│  - Cambiar versión directamente       │
│  - Scroll se sincroniza automáticamente│
│                                        │
│  Flujo 2: Tabs → Versión              │
│  - Click en tab                       │
│  - Cambiar versión directamente       │
│  - Scroll se sincroniza automáticamente│
└──────────────┬──────────────────────────┘
               │
               │ (derivado, solo UI)
               ↓
┌─────────────────────────────────────────┐
│      Sincronización Visual             │
│  (useEffect de scroll)                 │
│  - Lee indiceVersionActiva            │
│  - Actualiza scrollPosition (UI)       │
│  - NO dispara cambios de versión      │
└─────────────────────────────────────────┘
```

### 7.2. Principios Clave

1. **Versión activa es la fuente de verdad:**
   - Todas las fuentes (swipe, tabs, URL, etc.) actualizan la versión activa
   - El scroll es solo una representación visual

2. **Flujo unidireccional:**
   - Estado → UI (nunca al revés)
   - Scroll nunca causa cambio de versión directamente
   - Solo el usuario (swipe) o el sistema (tabs) causan cambio de versión

3. **Separación de responsabilidades:**
   - Handler de swipe: detecta intención del usuario, cambia versión
   - Handler de tabs: cambia versión directamente
   - useEffect de scroll: solo sincroniza posición visual

### 7.3. Cambios Conceptuales Requeridos

**Antes (actual):**
```
Scroll → Detecta posición → Cambia versión
Tabs → Cambia versión → Scroll sincroniza → Scroll dispara handler → (mitigado)
```

**Después (propuesto):**
```
Swipe → Detecta intención → Cambia versión → Scroll sincroniza
Tabs → Cambia versión → Scroll sincroniza
```

**Diferencia clave:**
- El scroll ya no es el mecanismo de detección de cambio
- El swipe detecta la intención del usuario directamente
- El scroll es solo visualización

---

## 8. Implementación Conceptual (Alto Nivel)

### 8.1. Detección de Swipe Mejorada

**Concepto:** Detectar swipe como gesto, no como scroll.

**Enfoque:**
- Usar eventos `touchstart`, `touchmove`, `touchend`
- Calcular dirección y distancia del swipe
- Si es swipe válido → cambiar versión directamente
- No depender del evento `scroll`

**Ventajas:**
- Separación clara: swipe es intención, scroll es visualización
- Más preciso (detecta gesto, no posición)
- No depende de eventos de scroll

### 8.2. Sincronización de Scroll Simplificada

**Concepto:** Scroll solo sincroniza, nunca causa cambios.

**Enfoque:**
- `useEffect` que solo lee `indiceVersionActiva`
- Actualiza `scrollPosition` cuando versión cambia
- No tiene listeners de scroll
- No puede causar loops (solo lee, nunca escribe estado)

**Ventajas:**
- Imposible tener loops
- Responsabilidad única: sincronizar UI
- Fácil de entender y mantener

### 8.3. Eliminación de Handler de Scroll

**Concepto:** Ya no se necesita handler que detecte cambios desde scroll.

**Enfoque:**
- Eliminar `handleCarouselScroll`
- Eliminar listener de evento `scroll`
- Swipe se detecta directamente con eventos touch

**Ventajas:**
- Código más simple
- Sin ambigüedad
- Sin riesgo de loops

---

## 9. Comparación: Antes vs Después

### 9.1. Complejidad

| Aspecto | Antes | Después (Alt. D) |
|---------|-------|------------------|
| Handlers de eventos | 2 (scroll + tabs) | 2 (swipe + tabs) |
| Listeners | 1 (scroll) | 0 (solo touch events) |
| Condiciones defensivas | 1 (`newIndex !== indiceVersionActiva`) | 0 |
| Riesgo de loops | Medio (mitigado) | Ninguno (imposible) |
| Líneas de código | ~40 | ~35 (más simple) |

### 9.2. Claridad

| Aspecto | Antes | Después (Alt. D) |
|---------|-------|------------------|
| Intención del código | Ambigua | Explícita |
| Flujo de datos | Bidireccional | Unidireccional |
| Fuente de verdad | Implícita | Explícita |
| Separación de responsabilidades | Parcial | Completa |

### 9.3. Mantenibilidad

| Aspecto | Antes | Después (Alt. D) |
|---------|-------|------------------|
| Facilidad de entender | Media | Alta |
| Facilidad de testear | Baja | Alta |
| Facilidad de extender | Baja | Alta |
| Riesgo de bugs | Medio | Bajo |

---

## 10. Conclusión

### 10.1. Problema Actual

El diseño actual tiene **ambigüedad semántica** entre interacciones del usuario y acciones programáticas. Ambos confluyen en el evento `scroll`, requiriendo lógica defensiva para prevenir loops.

### 10.2. Riesgos Identificados

1. **Riesgo de loops infinitos** (mitigado pero frágil)
2. **Riesgo de desincronización** (bajo pero presente)
3. **Riesgo de deuda técnica** (ya presente)
4. **Riesgo de bugs al extender** (medio)

### 10.3. Recomendación

**Implementar Alternativa D: Estado Unidireccional Explícito**

**Justificación:**
- ✅ Máxima claridad semántica
- ✅ Sin riesgo de loops (imposible por diseño)
- ✅ Alineado con React best practices
- ✅ Fácil de mantener y extender
- ✅ Robusto a largo plazo

**Trade-off:**
- Requiere refactor más grande (esfuerzo medio-alto)
- Pero el beneficio a largo plazo justifica la inversión

### 10.4. Alternativa de Transición

Si el refactor completo no es viable ahora, implementar **Alternativa C (Canal Explícito con Ref)** como solución intermedia que mejora la claridad sin requerir refactor grande.

---

**Documento creado para guiar el rediseño arquitectónico del carrusel mobile.**
**Enfoque: claridad semántica y mantenibilidad a largo plazo.**

