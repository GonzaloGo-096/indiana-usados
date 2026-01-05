# Corrección Fondo Oscuro - Sección Usados (FASE 3.3.1)

## Resumen

Corrección del contenedor interno de la sección Usados que aún tenía fondo oscuro, unificando toda la sección bajo el sistema de superficies claras.

**Fecha:** 2024  
**Fase:** 3.3.1 - Unificación visual completa  
**Sección:** Usados (Vehiculos)

---

## Problema Identificado

### Contenedor con Fondo Oscuro

**Elemento:** `.vehiclesGrid`  
**Ubicación:** `src/pages/Vehiculos/Vehiculos.module.css` (línea 181)  
**Fondo original:** `background: #0a0d14; /* ✅ Fondo negro */`

**Contexto histórico:**
- La sección Usados tenía un layout mixto:
  - Header claro (fondo blanco)
  - Listado de autos con fondo oscuro (`#0a0d14`)
- Este diseño mixto ya no se alinea con el objetivo de unificar toda la sección bajo el sistema de superficies claras.

---

## Cambios Realizados

### 1. Fondo del Grid de Vehículos

**Archivo:** `src/pages/Vehiculos/Vehiculos.module.css`

#### Cambio en `.vehiclesGrid`
```css
/* ANTES */
.vehiclesGrid {
  margin-top: 0;
  background: #0a0d14; /* ✅ Fondo negro */
  padding-top: 50px;
  /* ... resto de propiedades ... */
}

/* DESPUÉS */
.vehiclesGrid {
  margin-top: 0;
  /* ✅ Migrado: Fondo oscuro histórico eliminado → token semántico surface (unificación visual bajo sistema de superficies claras) */
  background-color: var(--color-surface);
  padding-top: 50px;
  /* ... resto de propiedades ... */
}
```

**Token usado:** `var(--color-surface)` = `var(--color-white)` = `#ffffff`

**Criterio:** El contenedor del grid de vehículos ahora usa el mismo token semántico que el fondo principal de la página, unificando visualmente toda la sección bajo el sistema de superficies claras.

### 2. Comentario en Media Query

**Archivo:** `src/pages/Vehiculos/Vehiculos.module.css`

#### Actualización de comentario (línea 266)
```css
/* ANTES */
/* ✅ Desktop: Expandir fondo negro a todo el ancho de la pantalla */

/* DESPUÉS */
/* ✅ Desktop: Expandir grid a todo el ancho de la pantalla */
```

**Criterio:** El comentario fue actualizado para reflejar que ya no hay fondo oscuro, solo se expande el grid.

---

## Verificación de Otros Fondos Oscuros

### Elementos Evaluados

Se verificaron todos los elementos de la sección Usados:

1. **`.page`** ✅
   - Fondo: `var(--color-surface)` (ya migrado en FASE 3.3)

2. **`.vehiclesGrid`** ✅
   - Fondo: `var(--color-surface)` (corregido en esta fase)

3. **`.backButton`**
   - Fondo: `#0a0d14` (botón, NO contenedor de listado)
   - **Decisión:** NO modificar - Es un botón con diseño específico, no un contenedor de listado

4. **Otros elementos:**
   - `.container`: Transparente (correcto)
   - `.carouselSection`: Transparente (correcto)
   - `.titleSection`: Sin fondo (correcto)

### Conclusión

✅ **Todos los contenedores de listado/fondo de sección ahora usan `var(--color-surface)`**  
✅ **Solo quedan fondos oscuros en elementos de UI específicos (botones), no en contenedores estructurales**

---

## Confirmación de Unificación Visual

### Estado Antes

- **Header/Título:** Fondo claro (`#ffffff`)
- **Grid de vehículos:** Fondo oscuro (`#0a0d14`)
- **Resultado:** Layout mixto (claro/oscuro)

### Estado Después

- **Header/Título:** Fondo claro (`var(--color-surface)`)
- **Grid de vehículos:** Fondo claro (`var(--color-surface)`)
- **Resultado:** Sección completamente unificada en modo claro

✅ **Confirmado:** La sección Usados está ahora 100% unificada bajo el sistema de superficies claras.

---

## Impacto Visual

### Cambio Visible

✅ **Cambio visual significativo:**
- El grid de vehículos ahora tiene fondo claro (blanco) en lugar de oscuro (negro)
- Toda la sección Usados es visualmente consistente con fondo claro
- Las cards blancas ahora se ven sobre fondo claro (pueden requerir ajuste de sombras/bordes en el futuro)

### Equivalencia de Tokens

- **Antes:** `background: #0a0d14` (negro profundo)
- **Después:** `background-color: var(--color-surface)` = `var(--color-white)` = `#ffffff` (blanco)
- **Resultado:** Cambio visual intencional (de oscuro a claro) para unificar la sección

---

## Verificación de Efectos Colaterales

### Elementos Verificados

✅ **Cards individuales:** No modificadas (como se solicitó)  
✅ **Sombras:** No modificadas  
✅ **Bordes:** No modificadas  
✅ **Textos:** No modificadas  
✅ **JSX:** No modificado  
✅ **Estructura:** No modificada  
✅ **Otras secciones:** No afectadas  

### Nota sobre Cards

Las cards de vehículos (`CardAuto`) tienen fondo blanco (`var(--color-white)`) y ahora se mostrarán sobre fondo blanco. Esto puede requerir ajustes futuros en:
- Bordes de las cards (para separación visual)
- Sombras de las cards (para elevación)

**Pero estos ajustes NO son parte de esta fase** (según restricciones: "NO tocar cards individuales").

---

## Archivos Modificados

### 1. `src/pages/Vehiculos/Vehiculos.module.css`

**Cambios:**
- Línea 183: `background: #0a0d14` → `background-color: var(--color-surface)`
- Línea 182: Comentario agregado explicando la migración
- Línea 266: Comentario actualizado (eliminada referencia a "fondo negro")

**Total de cambios:** 1 propiedad modificada, 2 comentarios agregados/actualizados

---

## Documentación Agregada

### Comentarios en el Código

1. **Propiedad `.vehiclesGrid`:**
   - Comentario: `/* ✅ Migrado: Fondo oscuro histórico eliminado → token semántico surface (unificación visual bajo sistema de superficies claras) */`

2. **Media query desktop:**
   - Comentario actualizado: `/* ✅ Desktop: Expandir grid a todo el ancho de la pantalla */`

---

## Estado Final

### Tokens Utilizados en Sección Usados

| Elemento | Token | Valor Actual |
|----------|-------|--------------|
| Fondo página (`.page`) | `var(--color-surface)` | `#ffffff` |
| Fondo grid (`.vehiclesGrid`) | `var(--color-surface)` | `#ffffff` |

### Eliminación de Fondos Oscuros

✅ **Contenedores de listado/fondo:** 0 fondos oscuros  
✅ **Contenedores estructurales:** Todos usan `var(--color-surface)`  
✅ **Sección unificada:** 100% modo claro  

---

## Validación

### ✅ Checklist

- [x] Contenedor `.vehiclesGrid` identificado
- [x] Fondo oscuro eliminado
- [x] Migrado a `var(--color-surface)`
- [x] Comentario explicativo agregado
- [x] Comentario en media query actualizado
- [x] Sin errores de linter
- [x] Sección visualmente unificada
- [x] Sin efectos colaterales en cards, sombras, bordes, textos

---

## Confirmación Final

✅ **Eliminación total del fondo oscuro:** `.vehiclesGrid` ahora usa `var(--color-surface)`  
✅ **Sección visualmente unificada:** Toda la sección Usados está en modo claro  
✅ **Sistema de superficies aplicado:** Todos los contenedores estructurales usan tokens semánticos  
✅ **Preparado para temas:** Listo para futuros sistemas de temas  

---

**Fin de la corrección FASE 3.3.1**

