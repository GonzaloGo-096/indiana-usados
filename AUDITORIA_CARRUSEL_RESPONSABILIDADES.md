# Auditoría de Responsabilidades y Calidad – Carrusel Mobile

## Resumen Ejecutivo

**Estado actual:** El carrusel está embebido directamente en `CeroKilometroDetalle.jsx` sin separación de responsabilidades clara.

**Problemas críticos identificados:**
1. 🔴 **Accesibilidad:** Falta completamente (ARIA, teclado, screen readers)
2. 🟡 **Separación de responsabilidades:** Lógica del carrusel mezclada con lógica de página
3. 🟡 **Naming:** Nombres genéricos que no expresan intención
4. 🟢 **Estados:** Bien manejados pero falta documentación
5. 🟢 **UX:** Funcional pero mejorable

---

## 1. Análisis de Responsabilidades

### 1.1. Qué Vive en el "Carrusel" (Actual)

**Ubicación:** Líneas 218-249 de `CeroKilometroDetalle.jsx`

```218:249:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
{/* Contenido Mobile: Carrusel */}
<div className={styles.mobileContent}>
  <div 
    ref={carouselRef}
    className={styles.carousel}
  >
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
  </div>
</div>
```

**Responsabilidades actuales del carrusel:**
- ✅ Renderizar slides (versiones)
- ✅ Renderizar contenido activo vs placeholder
- ❌ **NO maneja su propio scroll** (lo maneja el padre)
- ❌ **NO tiene lógica de navegación** (lo maneja el padre)
- ❌ **NO tiene accesibilidad** (falta completamente)

**Problema:** El carrusel es solo un contenedor visual, toda la lógica vive en el padre.

---

### 1.2. Qué Vive en el Padre (CeroKilometroDetalle)

**Responsabilidades del padre:**

#### A. Gestión de Estado de Versión (Líneas 40-53)
```40:53:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
// Hook para manejar estado de versión y color
const {
  modelo,
  versiones,
  versionActiva,
  colorActivo,
  coloresDisponibles,
  imagenActual,
  indiceVersionActiva,
  totalVersiones,
  cambiarVersion,
  cambiarVersionPorIndice,
  cambiarColor
} = useModeloSelector(autoSlug)
```

**✅ Correcto:** El padre debe orquestar el estado de versión (es lógica de dominio).

#### B. Sincronización Scroll → Versión (Líneas 55-81)
```55:81:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
// Scroll del carrusel mobile al cambiar versión por tabs
// Marca explícitamente que el scroll es programático antes de ejecutarlo
useEffect(() => {
  const carousel = carouselRef.current
  if (!carousel) return
  
  // Marcar que el scroll es iniciado por el sistema (no por el usuario)
  isScrollingProgrammaticallyRef.current = true
  
  const slideWidth = carousel.offsetWidth
  carousel.scrollTo({
    left: indiceVersionActiva * slideWidth,
    behavior: 'smooth'
  })
  
  // Resetear el flag después de que el scroll termine
  // scrollTo con 'smooth' toma ~300-500ms, usar timeout seguro para resetear
  const resetTimeout = setTimeout(() => {
    isScrollingProgrammaticallyRef.current = false
  }, 600) // Tiempo suficiente para que termine cualquier scroll smooth
  
  return () => {
    clearTimeout(resetTimeout)
    // Asegurar reset en cleanup por si el componente se desmonta
    isScrollingProgrammaticallyRef.current = false
  }
}, [indiceVersionActiva])
```

**⚠️ Problemático:** El padre maneja directamente el scroll del carrusel. Esto es lógica de UI que debería estar en el carrusel.

#### C. Detección de Swipe (Líneas 83-106)
```83:106:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
// Detectar swipe en mobile para cambiar versión
// Solo procesa scrolls iniciados por el usuario, ignora scrolls programáticos
const handleCarouselScroll = useCallback(() => {
  // Si el scroll fue iniciado por el sistema (scrollTo), ignorarlo
  // Esto previene loops y ambigüedad semántica
  if (isScrollingProgrammaticallyRef.current) {
    // Resetear el flag después de ignorar (el scroll programático ya terminó)
    // Esto permite que futuros scrolls del usuario sean procesados correctamente
    isScrollingProgrammaticallyRef.current = false
    return
  }
  
  // Scroll iniciado por el usuario (swipe) - procesar normalmente
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

**⚠️ Problemático:** El padre detecta swipe y calcula índices. Esto es lógica de UI del carrusel.

#### D. Listener de Scroll (Líneas 108-124)
```108:124:src/pages/CeroKilometros/CeroKilometroDetalle.jsx
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

**⚠️ Problemático:** El padre maneja eventos del DOM del carrusel. Esto debería estar encapsulado.

#### E. Formateo de Nombre de Versión (Líneas 131-168)
```131:168:src/pages/CeroKilometroDetalle.jsx
// Formatear nombre de versión: GT en rojo, siglas en mayúsculas, resto capitalizado
const renderVersionName = () => {
  // ... lógica de formateo compleja
}
```

**✅ Correcto:** El padre formatea datos para presentación (lógica de dominio/presentación).

---

### 1.3. Qué NO Debería Vivir en el Padre

**Lógica de UI del carrusel que debería estar encapsulada:**

1. ❌ **Manejo directo del scroll** (`scrollTo`, cálculo de `slideWidth`)
2. ❌ **Detección de swipe** (cálculo de `newIndex` desde `scrollLeft`)
3. ❌ **Listener de eventos del DOM** (`addEventListener('scroll')`)
4. ❌ **Debounce del scroll** (lógica de optimización de UI)
5. ❌ **Refs del carrusel** (`carouselRef`, `isScrollingProgrammaticallyRef`)

**Esto debería estar en un componente `VersionCarousel` que:**
- Encapsula la lógica de scroll/swipe
- Expone una API simple: `onSlideChange(index)`
- Maneja su propia accesibilidad
- Es reutilizable

---

## 2. Problemas de Accesibilidad (🔴 CRÍTICO)

### 2.1. Problemas Identificados

#### A. Falta de ARIA Labels
```jsx
<div 
  ref={carouselRef}
  className={styles.carousel}
>
```

**Problema:**
- ❌ No tiene `role="region"` o `role="group"`
- ❌ No tiene `aria-label` o `aria-labelledby`
- ❌ No tiene `aria-live` para anunciar cambios
- ❌ No tiene `aria-atomic` para controlar qué se anuncia

**Impacto:** Screen readers no pueden identificar ni navegar el carrusel.

#### B. Falta de Navegación por Teclado
**Problema:**
- ❌ No hay handlers para `ArrowLeft` / `ArrowRight`
- ❌ No hay handlers para `Home` / `End`
- ❌ No hay `tabIndex` en slides
- ❌ No hay focus management

**Impacto:** Usuarios de teclado no pueden navegar el carrusel.

#### C. Falta de Indicadores de Estado
**Problema:**
- ❌ No hay indicadores visuales de posición (dots, contador)
- ❌ No hay `aria-current` en el slide activo
- ❌ No hay `aria-setsize` y `aria-posinset` en slides

**Impacto:** Usuarios no saben en qué posición están ni cuántas versiones hay.

#### D. Falta de Anuncios para Screen Readers
**Problema:**
- ❌ No hay región `aria-live` que anuncie cambios
- ❌ No hay texto descriptivo de la versión actual

**Impacto:** Screen readers no anuncian cuando cambia la versión.

### 2.2. Solución Requerida

**Mínimo viable:**
```jsx
<div 
  ref={carouselRef}
  className={styles.carousel}
  role="region"
  aria-label="Versiones del modelo"
  aria-live="polite"
  onKeyDown={handleKeyDown}
  tabIndex={0}
>
  {versiones.map((version, index) => (
    <div 
      key={version.id} 
      className={styles.carouselSlide}
      role="group"
      aria-label={`Versión ${version.nombreCorto}`}
      aria-current={index === indiceVersionActiva ? 'true' : undefined}
      aria-posinset={index + 1}
      aria-setsize={totalVersiones}
      tabIndex={index === indiceVersionActiva ? 0 : -1}
    >
      {/* ... */}
    </div>
  ))}
</div>
```

**Handlers de teclado:**
```jsx
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      cambiarVersionPorIndice(Math.max(0, indiceVersionActiva - 1))
      break
    case 'ArrowRight':
      e.preventDefault()
      cambiarVersionPorIndice(Math.min(totalVersiones - 1, indiceVersionActiva + 1))
      break
    case 'Home':
      e.preventDefault()
      cambiarVersionPorIndice(0)
      break
    case 'End':
      e.preventDefault()
      cambiarVersionPorIndice(totalVersiones - 1)
      break
  }
}
```

---

## 3. Problemas de Naming (🟡 IMPORTANTE)

### 3.1. Nombres Genéricos que No Expresan Intención

#### A. `carouselRef`
**Problema:** No indica qué tipo de carrusel es.

**Mejor:**
- `versionCarouselRef` (específico)
- `mobileVersionCarouselRef` (más específico)

#### B. `handleCarouselScroll`
**Problema:** No indica que detecta swipe del usuario.

**Mejor:**
- `handleUserSwipe` (expresa intención)
- `handleVersionSwipe` (más específico)

#### C. `isScrollingProgrammaticallyRef`
**Problema:** Muy largo, pero expresa intención. ✅ Está bien.

**Alternativa más corta:**
- `isSystemScrollRef` (más corto, igual de claro)

#### D. `mobileContent` / `desktopContent`
**Problema:** Nombres de layout, no de contenido.

**Mejor:**
- `mobileVersionCarousel` / `desktopVersionLayout`
- O mantener pero agregar comentario explicativo

#### E. `carouselSlide`
**Problema:** Genérico, no indica que es una versión.

**Mejor:**
- `versionSlide` (más específico)
- `versionCarouselItem` (más descriptivo)

### 3.2. Funciones que Mezclan Responsabilidades

#### A. `renderVersionName()`
**Problema:** Es una función de render, pero está en el componente principal.

**Mejor:**
- Extraer a utilidad: `formatVersionName(nombre)`
- O mover a componente: `<VersionName version={versionActiva} />`

---

## 4. Diseño de Estados (🟢 BIEN MANEJADO)

### 4.1. Estados Actuales

**Estados del hook `useModeloSelector`:**
- ✅ `versionActiva` - Versión activa (objeto completo)
- ✅ `indiceVersionActiva` - Índice de versión activa
- ✅ `colorActivo` - Color activo
- ✅ `coloresDisponibles` - Colores disponibles
- ✅ `imagenActual` - Imagen actual

**Estados locales (refs):**
- ✅ `isScrollingProgrammaticallyRef` - Flag de scroll programático
- ✅ `carouselRef` - Ref del DOM

### 4.2. Estados Faltantes (para mejor UX)

**Estados opcionales que mejorarían la UX:**

1. **Estado de carga inicial:**
   - `isInitializing` - Para mostrar skeleton mientras carga

2. **Estado de transición:**
   - `isTransitioning` - Para deshabilitar interacciones durante transición

3. **Estado de error:**
   - `error` - Si falla la carga de datos

**Nota:** Estos estados pueden no ser necesarios si el hook ya los maneja.

### 4.3. Documentación de Estados

**Problema:** Falta documentación clara de:
- Qué estados existen
- Cuándo cambian
- Qué causa los cambios

**Solución:** Agregar comentarios JSDoc en el hook o en el componente.

---

## 5. Problemas de UX (🟢 FUNCIONAL, MEJORABLE)

### 5.1. Problemas Identificados

#### A. Falta de Feedback Visual Durante Swipe
**Problema:** No hay indicador de que el swipe está siendo procesado.

**Solución opcional:**
- Agregar indicador de posición (dots)
- O mantener simple (el scroll ya da feedback)

#### B. Placeholder Muy Simple
**Problema:** El placeholder solo muestra texto.

```jsx
<div className={styles.carouselPlaceholder}>
  <span>{version.nombreCorto}</span>
</div>
```

**Mejora opcional:**
- Agregar skeleton loader
- O mantener simple (está bien para performance)

#### C. No Hay Indicadores de Posición
**Problema:** Usuario no sabe cuántas versiones hay ni en cuál está.

**Solución opcional:**
- Agregar dots indicadores
- O contador "1 de 5"
- O mantener simple si no es necesario

### 5.2. Lo Que Está Bien

- ✅ Swipe funciona correctamente
- ✅ Scroll smooth es agradable
- ✅ Placeholders son livianos (buena performance)
- ✅ Transiciones son suaves

---

## 6. Documentación Interna (🟢 PARCIAL)

### 6.1. Lo Que Está Bien

- ✅ Comentarios explican la intención del flag de scroll programático
- ✅ Comentarios explican el debounce
- ✅ Header del archivo tiene información básica

### 6.2. Lo Que Falta

- ❌ Documentación de los estados del hook
- ❌ Documentación de las props de `VersionContent`
- ❌ Documentación de los eventos y callbacks
- ❌ Ejemplos de uso
- ❌ Documentación de accesibilidad (inexistente)

---

## 7. Priorización de Problemas

### 7.1. 🔴 CRÍTICO - Accesibilidad

**Prioridad:** ALTA (bloquea usuarios con discapacidades)

**Problemas:**
1. Falta de ARIA labels
2. Falta de navegación por teclado
3. Falta de indicadores de estado
4. Falta de anuncios para screen readers

**Esfuerzo:** Medio (2-3 horas)
**Impacto:** Alto (cumple estándares WCAG)

**Acción:** Implementar accesibilidad mínima antes de cualquier refactor.

---

### 7.2. 🟡 IMPORTANTE - Separación de Responsabilidades

**Prioridad:** MEDIA (mejora mantenibilidad a largo plazo)

**Problemas:**
1. Lógica de scroll en el padre
2. Detección de swipe en el padre
3. Listeners de DOM en el padre

**Esfuerzo:** Alto (4-6 horas para refactor completo)
**Impacto:** Medio-Alto (mejora mantenibilidad)

**Acción:** Crear componente `VersionCarousel` que encapsule la lógica.

**Nota:** Puede hacerse después de accesibilidad.

---

### 7.3. 🟡 IMPORTANTE - Naming

**Prioridad:** MEDIA (mejora legibilidad)

**Problemas:**
1. Nombres genéricos (`carouselRef`, `handleCarouselScroll`)
2. Funciones que mezclan responsabilidades

**Esfuerzo:** Bajo (1 hora)
**Impacto:** Medio (mejora legibilidad)

**Acción:** Renombrar variables y funciones para expresar mejor intención.

**Nota:** Puede hacerse junto con el refactor de responsabilidades.

---

### 7.4. 🟢 MEJORABLE - UX

**Prioridad:** BAJA (funcional pero mejorable)

**Problemas:**
1. Falta de indicadores de posición
2. Placeholder muy simple

**Esfuerzo:** Bajo-Medio (2-3 horas)
**Impacto:** Bajo (mejora UX pero no es crítico)

**Acción:** Agregar indicadores opcionales si se requiere.

**Nota:** Solo si hay feedback de usuarios.

---

### 7.5. 🟢 MEJORABLE - Documentación

**Prioridad:** BAJA (mejora mantenibilidad)

**Problemas:**
1. Falta documentación de estados
2. Falta documentación de props
3. Falta documentación de accesibilidad

**Esfuerzo:** Bajo (1-2 horas)
**Impacto:** Bajo (mejora mantenibilidad)

**Acción:** Agregar comentarios JSDoc y documentación.

**Nota:** Puede hacerse incrementalmente.

---

## 8. Recomendaciones por Prioridad

### Fase 1: Accesibilidad (🔴 CRÍTICO)

**Objetivo:** Hacer el carrusel accesible.

**Tareas:**
1. Agregar ARIA labels y roles
2. Implementar navegación por teclado
3. Agregar indicadores de estado (aria-current, aria-posinset, aria-setsize)
4. Agregar región aria-live para anuncios

**Esfuerzo:** 2-3 horas
**Impacto:** Alto (cumple WCAG, desbloquea usuarios)

---

### Fase 2: Separación de Responsabilidades (🟡 IMPORTANTE)

**Objetivo:** Encapsular lógica del carrusel en componente propio.

**Tareas:**
1. Crear componente `VersionCarousel`
2. Mover lógica de scroll/swipe al componente
3. Exponer API simple: `onSlideChange(index)`
4. Mantener accesibilidad implementada

**Esfuerzo:** 4-6 horas
**Impacto:** Medio-Alto (mejora mantenibilidad)

---

### Fase 3: Naming y Documentación (🟡 IMPORTANTE / 🟢 MEJORABLE)

**Objetivo:** Mejorar legibilidad y documentación.

**Tareas:**
1. Renombrar variables para expresar mejor intención
2. Extraer funciones de utilidad (`formatVersionName`)
3. Agregar documentación JSDoc
4. Documentar estados y props

**Esfuerzo:** 2-3 horas
**Impacto:** Medio (mejora mantenibilidad)

---

### Fase 4: Mejoras de UX (🟢 OPCIONAL)

**Objetivo:** Mejorar experiencia visual.

**Tareas:**
1. Agregar indicadores de posición (dots o contador)
2. Mejorar placeholders con skeleton
3. Agregar animaciones de transición

**Esfuerzo:** 2-4 horas
**Impacto:** Bajo (mejora UX pero no crítico)

**Nota:** Solo si hay feedback de usuarios o requerimientos.

---

## 9. Conclusión

### Estado Actual

**Fortalezas:**
- ✅ Funcionalidad correcta
- ✅ Performance optimizada
- ✅ Código con separación semántica (flag de scroll programático)

**Debilidades:**
- ❌ Accesibilidad completamente ausente
- ⚠️ Lógica de UI mezclada con lógica de página
- ⚠️ Naming genérico que no expresa intención

### Prioridad de Acción

1. **🔴 INMEDIATO:** Implementar accesibilidad (Fase 1)
2. **🟡 CORTO PLAZO:** Refactor de responsabilidades (Fase 2)
3. **🟡 MEDIANO PLAZO:** Mejorar naming y documentación (Fase 3)
4. **🟢 LARGO PLAZO:** Mejoras de UX opcionales (Fase 4)

### Recomendación Final

**Empezar con Fase 1 (Accesibilidad)** porque:
- Es un bloqueador para usuarios con discapacidades
- Es requerimiento legal en muchos países
- Es relativamente rápido de implementar (2-3 horas)
- No requiere refactor grande

**Luego continuar con Fase 2 (Separación de Responsabilidades)** para:
- Mejorar mantenibilidad a largo plazo
- Facilitar testing
- Hacer el código más reutilizable

---

**Documento creado para guiar mejoras de calidad del carrusel mobile.**
**Enfoque: accesibilidad primero, luego mantenibilidad.**

