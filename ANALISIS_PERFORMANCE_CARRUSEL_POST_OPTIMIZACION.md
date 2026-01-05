# Análisis de Performance – Carrusel Mobile Post-Optimización

## Contexto

**Optimización aplicada:** Render condicional de `VersionContent` (solo versión activa)

**Estado actual:** 
- Solo 1 `VersionContent` montado (vs 3 anteriormente)
- Reducción teórica: ~66% menos renders

**Objetivo:** Medir y analizar el comportamiento real después de la optimización para determinar si se requieren optimizaciones adicionales.

---

## 1. Métricas a Medir

### 1.1. React DevTools Profiler

#### Configuración
1. Abrir React DevTools → Profiler
2. Activar "Record why each component rendered"
3. Grabar durante cada interacción

#### Métricas por Escenario

**A. Swipe Lento (1 versión por segundo)**
- **Duración:** 3-4 segundos (cambiar 3-4 versiones)
- **Medir:**
  - Total de renders de `CeroKilometroDetalle`
  - Total de renders de `VersionContent`
  - Total de mounts/unmounts de `VersionContent`
  - Tiempo de render promedio por cambio
  - Componentes que se re-renderizan sin cambios (false positives)

**B. Swipe Rápido (3-4 versiones por segundo)**
- **Duración:** 2-3 segundos (cambiar 5-6 versiones rápidamente)
- **Medir:**
  - Total de renders durante el swipe
  - Picos de renders simultáneos
  - Tiempo de render acumulado
  - Si hay renders que se cancelan (wasted renders)

**C. Cambio Directo por Tabs**
- **Duración:** 1 segundo (click en tab)
- **Medir:**
  - Renders causados por el click
  - Tiempo desde click hasta render completo
  - Si hay renders innecesarios en el proceso

#### Valores Esperados (Post-Optimización)

| Escenario | Renders CeroKilometroDetalle | Renders VersionContent | Mounts VersionContent |
|-----------|----------------------------|----------------------|---------------------|
| Swipe lento | 3-4 | 3-4 | 1 (solo mount inicial) |
| Swipe rápido | 5-6 | 5-6 | 1 (solo mount inicial) |
| Cambio por tabs | 1 | 1 | 0 (solo re-render) |

**⚠️ Señales de Problema:**
- Más de 1 `VersionContent` montado simultáneamente
- Renders de `VersionContent` sin cambios de props
- Más de 10 renders totales durante swipe rápido

---

### 1.2. Chrome DevTools Performance

#### Configuración
1. Abrir Chrome DevTools → Performance
2. Activar "Screenshots" y "Web Vitals"
3. CPU throttling: 4x slowdown (simular móvil)
4. Grabar durante cada interacción

#### Métricas por Escenario

**A. Swipe Lento**
- **Grabar:** Desde inicio de swipe hasta que se detiene
- **Medir:**
  - **Long Tasks (>50ms):** Cantidad y duración
  - **Scripting time:** Tiempo total de JS durante swipe
  - **Frame rate:** FPS promedio (objetivo: 60fps)
  - **Frame drops:** Frames que tardan >16.6ms
  - **Layout shifts:** Cambios de layout inesperados

**B. Swipe Rápido**
- **Grabar:** Durante swipe rápido completo
- **Medir:**
  - **Picos de scripting:** Momentos donde JS >16.6ms
  - **Accumulated scripting:** Tiempo total acumulado
  - **Main thread blocking:** Períodos donde el thread está bloqueado
  - **Frame rate:** FPS durante swipe (objetivo: mantener >30fps mínimo)

**C. Cambio Directo por Tabs**
- **Grabar:** Desde click hasta render completo
- **Medir:**
  - **Time to Interactive:** Tiempo hasta que la UI responde
  - **First Contentful Paint:** Tiempo hasta primer render
  - **Long Tasks:** Si hay tareas que bloquean

#### Valores Esperados (Post-Optimización)

| Escenario | Long Tasks (>50ms) | Scripting Time | Frame Rate | Frame Drops |
|-----------|------------------|----------------|------------|-------------|
| Swipe lento | 0-1 | <100ms | 55-60fps | 0-2 |
| Swipe rápido | 0-2 | <200ms | 45-60fps | 2-5 |
| Cambio por tabs | 0 | <50ms | 60fps | 0 |

**⚠️ Señales de Problema:**
- Más de 2 long tasks durante swipe
- Scripting time >200ms durante swipe rápido
- Frame rate <30fps durante swipe
- Frame drops >10 durante swipe rápido

---

## 2. Análisis del Código Actual

### 2.1. Puntos Críticos Identificados

#### A. Scroll Event Handler (Líneas 65-94)

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

**Análisis:**
- ✅ Debounce de 100ms reduce llamadas a `cambiarVersionPorIndice`
- ⚠️ El evento `scroll` se dispara ~10-20 veces por segundo durante swipe
- ⚠️ Cada evento ejecuta `handleScroll` (aunque no cambie estado)
- ⚠️ `handleCarouselScroll` tiene dependencias que pueden cambiar

**Impacto esperado:**
- Durante swipe rápido: ~20-30 eventos `scroll`
- Solo 1-2 llamadas a `cambiarVersionPorIndice` (gracias al debounce)
- Pero `handleScroll` se ejecuta en cada evento (overhead mínimo)

#### B. useEffect de Scroll (Líneas 53-62)

```53:62:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
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

**Análisis:**
- ✅ Solo se ejecuta cuando cambia `indiceVersionActiva`
- ⚠️ `carousel.scrollTo()` puede disparar eventos `scroll`
- ⚠️ Esto puede causar un ciclo: scroll → `handleCarouselScroll` → cambio de versión → `useEffect` → scroll

**Impacto esperado:**
- Durante cambio por tabs: 1 ejecución del `useEffect`
- Puede disparar 1-2 eventos `scroll` adicionales
- El debounce previene cambios de versión innecesarios

#### C. Render Condicional (Líneas 194-216)

```194:216:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
{versiones.map((version, index) => {
  return (
    <div key={version.id} className={styles.carouselSlide}>
      {/* Solo renderizar contenido completo si es la versión activa */}
      {index === indiceVersionActiva ? (
        <VersionContent
          version={version}
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
    </div>
  )
})}
```

**Análisis:**
- ✅ Solo 1 `VersionContent` montado
- ✅ Placeholders son livianos (solo texto)
- ⚠️ El `map` se ejecuta en cada render de `CeroKilometroDetalle`
- ⚠️ Cada placeholder se re-renderiza aunque no cambie

**Impacto esperado:**
- Durante cambio de versión: 1 mount/unmount de `VersionContent`
- Todos los placeholders se re-renderizan (overhead mínimo, solo texto)

#### D. Hook useModeloSelector

**Análisis basado en código:**
- Calcula `versionActiva`, `colorActivo`, `coloresDisponibles`, `imagenActual` con `useMemo`
- Cuando cambia `versionActivaId`, recalcula todos los valores
- Esto causa re-render de `CeroKilometroDetalle`

**Impacto esperado:**
- 1 re-render por cambio de versión
- Los `useMemo` previenen cálculos innecesarios

---

## 3. Escenarios de Prueba

### 3.1. Swipe Lento

**Procedimiento:**
1. Abrir página en mobile view (Chrome DevTools)
2. Iniciar grabación (React DevTools + Performance)
3. Hacer swipe lento de versión 0 → 1 → 2 → 3
4. Detener grabación después de 3-4 segundos

**Qué observar:**
- ✅ Solo 1 `VersionContent` montado en todo momento
- ✅ 3-4 renders de `CeroKilometroDetalle` (uno por cambio)
- ✅ Frame rate estable (55-60fps)
- ⚠️ Si hay más de 1 `VersionContent` montado → problema
- ⚠️ Si frame rate <50fps → problema

### 3.2. Swipe Rápido

**Procedimiento:**
1. Abrir página en mobile view
2. Iniciar grabación
3. Hacer swipe rápido de versión 0 → 5 (rápido, sin detenerse)
4. Detener grabación después de 2-3 segundos

**Qué observar:**
- ✅ Frame rate se mantiene >30fps durante swipe
- ✅ Solo 1 `VersionContent` montado
- ✅ Long tasks <2 durante todo el swipe
- ⚠️ Si frame rate cae <30fps → problema
- ⚠️ Si hay >3 long tasks → problema

### 3.3. Cambio Directo por Tabs

**Procedimiento:**
1. Abrir página en mobile view
2. Iniciar grabación
3. Click en tab de versión diferente
4. Detener grabación después de 1 segundo

**Qué observar:**
- ✅ 1 render de `CeroKilometroDetalle`
- ✅ 1 render de `VersionContent` (re-render, no mount)
- ✅ Time to Interactive <100ms
- ⚠️ Si hay más de 2 renders → problema
- ⚠️ Si Time to Interactive >200ms → problema

---

## 4. Interpretación de Resultados

### 4.1. Si Todo Está Dentro de Parámetros

**Indicadores:**
- ✅ Solo 1 `VersionContent` montado
- ✅ Frame rate >45fps durante swipe rápido
- ✅ Long tasks <2 durante swipe
- ✅ Scripting time <200ms durante swipe rápido
- ✅ Renders esperados según tabla

**Conclusión:**
El sistema está dentro de parámetros normales. La optimización fue exitosa.

**Recomendación:**
**NO TOCAR NADA** - El sistema funciona correctamente y no requiere optimizaciones adicionales.

---

### 4.2. Si Hay Problemas Menores

**Indicadores:**
- ⚠️ Frame rate 30-45fps durante swipe rápido (aceptable pero mejorable)
- ⚠️ 2-3 long tasks durante swipe (aceptable pero mejorable)
- ⚠️ Scripting time 200-300ms durante swipe rápido (aceptable pero mejorable)
- ✅ Solo 1 `VersionContent` montado (correcto)

**Conclusión:**
El sistema funciona pero hay margen de mejora. Los problemas son menores y no afectan significativamente la UX.

**Recomendación:**
**OPCIONAL - Fase 3 (Optimización de Scroll):**
- Implementar `useRef` para evitar re-renders durante scroll activo
- Aumentar debounce a 150ms
- Usar `scrollend` event si está disponible

**Riesgo:** Bajo
**Esfuerzo:** 1 hora
**Impacto:** Mejora marginal (frame rate +5-10fps)

---

### 4.3. Si Hay Problemas Graves

**Indicadores:**
- ❌ Frame rate <30fps durante swipe rápido
- ❌ >3 long tasks durante swipe
- ❌ Scripting time >300ms durante swipe rápido
- ❌ Más de 1 `VersionContent` montado simultáneamente
- ❌ Frame drops >10 durante swipe

**Conclusión:**
Hay problemas de performance que requieren atención. Puede ser:
1. Problema con la optimización (múltiples `VersionContent` montados)
2. Problema con el scroll handler (demasiado overhead)
3. Problema con `VersionContent` (render muy pesado)

**Recomendación:**
**HABILITAR FASE 3 (Optimización de Scroll) + Investigación:**
1. Verificar que solo 1 `VersionContent` esté montado (React DevTools)
2. Si hay múltiples montados → bug en la optimización
3. Si solo 1 montado pero performance mala → optimizar scroll handler
4. Si `VersionContent` es muy pesado → optimizar componente

**Riesgo:** Medio (requiere testing exhaustivo)
**Esfuerzo:** 2-3 horas
**Impacto:** Alto (mejora significativa de performance)

---

## 5. Checklist de Validación

### 5.1. React DevTools

- [ ] Solo 1 `VersionContent` montado en todo momento
- [ ] Renders esperados según escenario (ver tabla)
- [ ] No hay renders innecesarios (false positives)
- [ ] Tiempo de render <10ms por cambio

### 5.2. Chrome DevTools Performance

- [ ] Frame rate >45fps durante swipe rápido
- [ ] Long tasks <2 durante swipe
- [ ] Scripting time <200ms durante swipe rápido
- [ ] No hay frame drops significativos (>5)

### 5.3. Funcionalidad

- [ ] Swipe funcional (cambia versión correctamente)
- [ ] Cambio por tabs funciona
- [ ] Sin errores en consola
- [ ] Sin warnings de React

---

## 6. Conclusión y Recomendación Final

### 6.1. Proceso de Decisión

1. **Ejecutar las 3 pruebas** (swipe lento, rápido, cambio por tabs)
2. **Registrar métricas** en React DevTools y Chrome Performance
3. **Comparar con valores esperados** (tablas en sección 1)
4. **Clasificar resultado:**
   - Todo OK → **NO TOCAR NADA**
   - Problemas menores → **OPCIONAL - Fase 3**
   - Problemas graves → **HABILITAR Fase 3 + Investigación**

### 6.2. Recomendación por Defecto

**Si no se pueden ejecutar las pruebas ahora:**

Basado en el análisis del código:
- ✅ La optimización de render condicional está correcta
- ⚠️ El scroll handler tiene overhead pero está mitigado con debounce
- ⚠️ Puede haber mejoras menores con optimización de scroll

**Recomendación conservadora:**
**NO TOCAR NADA** hasta tener métricas reales. El código actual debería funcionar correctamente.

**Si se detectan problemas:**
**HABILITAR Fase 3** (optimización de scroll) como siguiente paso.

---

## 7. Métricas de Referencia (Benchmarks)

### 7.1. Antes de la Optimización (Teórico)

- 3 `VersionContent` montados
- ~15-30ms de render por cambio
- Frame rate: 40-50fps durante swipe rápido
- Long tasks: 2-4 durante swipe

### 7.2. Después de la Optimización (Esperado)

- 1 `VersionContent` montado
- ~5-10ms de render por cambio
- Frame rate: 50-60fps durante swipe rápido
- Long tasks: 0-2 durante swipe

### 7.3. Mejora Esperada

- **Reducción de renders:** ~66%
- **Mejora de frame rate:** +10-15fps
- **Reducción de long tasks:** 50%
- **Mejora de tiempo de render:** 50-66%

---

## 8. Notas Técnicas

### 8.1. Limitaciones del Análisis

- No se pueden medir métricas reales sin ejecutar las herramientas
- Los valores esperados son estimaciones basadas en análisis de código
- Performance real depende de:
  - Dispositivo/hardware
  - Navegador y versión
  - Carga de la página
  - Complejidad de `VersionContent`

### 8.2. Próximos Pasos

1. **Ejecutar pruebas** con React DevTools y Chrome Performance
2. **Registrar métricas** en este documento
3. **Comparar con valores esperados**
4. **Tomar decisión** basada en resultados reales

---

**Documento creado para guiar el análisis de performance post-optimización.**
**Actualizar con métricas reales después de ejecutar las pruebas.**

