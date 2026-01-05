# Migración Quirúrgica: var(--color-black) → Tokens Semánticos

## Resumen

Migración controlada y documentada de `var(--color-black)` hacia tokens semánticos según intención de diseño, no por equivalencia directa.

**Fecha:** 2024  
**Fase:** 3.1 - Migración base  
**Archivos migrados:** 5 archivos, 7 ocurrencias

---

## Criterios de Reemplazo Aplicados

### Reglas de Reemplazo
1. **Fondos o secciones oscuras** → `var(--color-surface-dark)`
2. **Texto principal oscuro** → `var(--color-text-primary)`
3. **Bordes, separadores fuertes o iconografía sólida** → `var(--color-neutral-900)`

---

## Detalle de Cambios por Archivo

### 1. Footer.module.css
**Línea 16:**
```css
/* ANTES */
background-color: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Fondo oscuro de sección → surface-dark */
background-color: var(--color-surface-dark);
```

**Criterio:** Fondo oscuro de sección completa → `surface-dark`

---

### 2. Vehiculos.module.css
**Línea 61 (.mainTitle):**
```css
/* ANTES */
color: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Texto principal oscuro → text-primary */
color: var(--color-text-primary);
```

**Línea 136 (.actionButton):**
```css
/* ANTES */
color: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Texto principal oscuro → text-primary */
color: var(--color-text-primary);
```

**Criterio:** Ambos son textos principales oscuros → `text-primary`

---

### 3. FeaturedVehicles.module.css
**Línea 32 (.title):**
```css
/* ANTES */
color: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Texto principal oscuro → text-primary */
color: var(--color-text-primary);
```

**Criterio:** Texto principal oscuro → `text-primary`

---

### 4. HeroImageCarousel.module.css
**Línea 191 (.arrow en @media prefers-contrast: high):**
```css
/* ANTES */
background: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Fondo sólido de iconografía → neutral-900 */
background: var(--color-neutral-900);
```

**Criterio:** Fondo sólido de elemento UI (iconografía) → `neutral-900`

---

### 5. ServiceCard.module.css
**Línea 67 (.content::before - Badge decorativo):**
```css
/* ANTES */
background: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Elemento decorativo/iconografía → neutral-900 */
background: var(--color-neutral-900);
```

**Línea 75 (.title):**
```css
/* ANTES */
color: var(--color-black);

/* DESPUÉS */
/* ✅ Migrado: Texto principal oscuro → text-primary */
color: var(--color-text-primary);
```

**Criterio:** 
- Badge decorativo → `neutral-900` (iconografía/elemento visual)
- Título → `text-primary` (texto principal)

---

## Distribución de Tokens Utilizados

| Token | Cantidad | Uso |
|-------|----------|-----|
| `--color-text-primary` | 5 | Textos principales oscuros |
| `--color-surface-dark` | 1 | Fondos de sección oscuros |
| `--color-neutral-900` | 2 | Iconografía y elementos decorativos |

---

## Validación

### ✅ Verificación de Referencias
```bash
grep -r "var(--color-black)" src/
```
**Resultado:** 0 coincidencias (migración completa)

### ✅ Linter
Todos los archivos migrados pasan el linter sin errores.

### ✅ Impacto Visual
**Confirmado:** No hay cambios visuales porque:
- `--color-text-primary` = `var(--color-neutral-900)` = `#0a0d14`
- `--color-surface-dark` = `var(--color-neutral-900)` = `#0a0d14`
- `--color-neutral-900` = `#0a0d14`
- Todos apuntan al mismo valor canónico

---

## Confirmación

✅ **Migración completa:** Todas las referencias a `var(--color-black)` han sido migradas  
✅ **Sin referencias restantes:** Verificado con grep  
✅ **Sin errores de linter:** Todos los archivos validados  
✅ **Sin cambios visuales:** Valores equivalentes canónicamente  
✅ **Documentación:** Comentarios en cada cambio explicando el criterio  

---

## Próximos Pasos

El sistema base está completo y funcional. Siguiente fase recomendada:

1. **Validación del sistema:**
   - ¿El sistema resiste el primer refactor? ✅
   - ¿Las variables semánticas alcanzan? ✅
   - ¿Hay algún token mal definido? ✅ (Todos funcionan correctamente)

2. **Migración de componente visible pero controlado:**
   - Componente Card (no Nav, no Home)
   - Migración gradual de colores hardcodeados a tokens

---

**Fin de la migración Fase 3.1**

