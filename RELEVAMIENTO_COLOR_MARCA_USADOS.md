# Relevamiento Uso Color de Marca - Sección Usados

## Resumen Ejecutivo

Auditoría visual del uso del color de marca (tokens `brand-500`, `brand-600` / #0055A4, #003d7a) EXCLUSIVAMENTE en la sección Usados (/vehiculos).

**Fecha:** 2024  
**Alcance:** Página Vehiculos + Componentes Cards y UI dentro de esa sección  
**Objetivo:** Análisis de uso actual, NO implementación

---

## Tokens de Marca Disponibles

Según `variables.css`:
- `--color-brand-500`: #0055A4 (azul principal)
- `--color-brand-600`: #003d7a (azul más oscuro, hover/active)

---

## 1. USOS CORRECTOS (Bien Aplicados)

### 1.1. Precio en Cards (CardAuto)

**Ubicación:** `src/components/vehicles/Card/CardAuto/CardAuto.module.css`  
**Línea:** 325  
**Elemento:** `.price_value`  
**Uso:** `color: var(--color-brand-500);`

**Análisis:**
- ✅ **Correcto:** El precio es el elemento de mayor jerarquía visual después de la imagen
- ✅ **Correcto:** El color de marca aplicado al precio es consistente con el diseño "premium confiable"
- ✅ **Correcto:** El comentario en código indica intención clara: "Color de acento solo para precio"
- ✅ **Correcto:** Uso del token semántico `brand-500` (no hardcoded)

**Contexto:** Cards de vehículos en el listado principal de Usados.

---

### 1.2. Focus Outline en Cards (CardAuto)

**Ubicación:** `src/components/vehicles/Card/CardAuto/CardAuto.module.css`  
**Línea:** 44  
**Elemento:** `.card:focus`  
**Uso:** `outline: 2px solid var(--color-brand-500);`

**Análisis:**
- ✅ **Correcto:** Outline de accesibilidad usando color de marca
- ✅ **Correcto:** Estándar de accesibilidad (focus visible)
- ✅ **Correcto:** Uso del token semántico `brand-500`

**Contexto:** Accesibilidad en cards clickeables.

---

### 1.3. Botones de Acción en Header (Vehiculos)

**Ubicación:** `src/pages/Vehiculos/Vehiculos.module.css`  
**Líneas:** 115, 126, 152, 157  
**Elementos:** `.actionButtons`, `.actionButtons::after`, `.actionButton:hover`, `.actionButton.active`

**Usos:**
1. **Borde del contenedor:** `border: 2px solid var(--color-brand-500);`
2. **Línea divisoria:** `background: var(--color-brand-500);` (con opacity: 0.3)
3. **Hover:** `color: var(--color-brand-600);`
4. **Estado active:** `color: var(--color-brand-600);`

**Análisis:**
- ✅ **Correcto:** Uso del color de marca para elementos interactivos
- ✅ **Correcto:** Diferenciación hover/active con `brand-600` (más oscuro)
- ✅ **Correcto:** Borde y línea divisoria usan `brand-500` (principal)
- ✅ **Correcto:** Uso de tokens semánticos

**Contexto:** Botones "Filtrar" y "Ordenar" en el header de la página (visible en desktop, líneas 136-171 de Vehiculos.jsx).

---

## 2. USOS AUSENTES (Oportunidades de Mejora)

### 2.1. Botón "Aplicar" en Filtros (FilterFormSimple)

**Ubicación:** `src/components/vehicles/Filters/FilterFormSimple.module.css`  
**Línea:** 219-226  
**Elemento:** `.applyButton`  
**Uso actual:** `background: #0a0d14;` (negro hardcoded)

**Análisis:**
- ❌ **Ausente:** El botón principal de acción "Aplicar" no usa color de marca
- ❌ **Inconsistente:** Usa fondo negro (#0a0d14) en lugar de azul de marca
- ❌ **Hardcoded:** Color hardcodeado, no usa tokens

**Recomendación (NO implementar aún):**
- Podría usar `background: var(--color-brand-500);`
- Hover podría usar `var(--color-brand-600);`

**Contexto:** Botón principal de acción en el formulario de filtros (visible en mobile y desktop).

---

### 2.2. Botón "Filtrar" Mobile (FilterFormSimple)

**Ubicación:** `src/components/vehicles/Filters/FilterFormSimple.module.css`  
**Línea:** 16-31  
**Elemento:** `.filterButtonMobile`  
**Uso actual:** `background: #0a0d14;` (negro hardcoded)

**Análisis:**
- ❌ **Ausente:** El botón de apertura de filtros en mobile no usa color de marca
- ❌ **Inconsistente:** Usa fondo negro en lugar de azul
- ❌ **Hardcoded:** Color hardcodeado

**Recomendación (NO implementar aún):**
- Podría usar `background: var(--color-brand-500);`
- Hover podría usar `var(--color-brand-600);`

**Contexto:** Botón que abre el drawer de filtros en dispositivos móviles.

---

### 2.3. Enlaces/Links (Si existen)

**Análisis:**
- ⚠️ **No detectados:** No se encontraron enlaces específicos dentro de la sección Usados que usen color de marca
- ⚠️ **Cards clickeables:** Las cards son clickeables pero no son enlaces tradicionales (usan `onClick` con `navigate`)
- ⚠️ **No aplicable:** Las cards completas funcionan como CTAs pero no necesitan color de marca (el precio ya lo tiene)

**Contexto:** Las cards de vehículos son completamente clickeables pero no tienen estilo de link tradicional.

---

## 3. USOS INCORRECTOS (No Detectados)

**Análisis:**
- ✅ **No se detectaron usos incorrectos:** Todos los usos actuales del color de marca son apropiados para su contexto
- ✅ **Jerarquía respetada:** El color de marca se usa solo en elementos de alta jerarquía (precio, CTAs, focus)
- ✅ **Tokens correctos:** Todos los usos actuales utilizan tokens semánticos (`brand-500`, `brand-600`)

---

## 4. RESUMEN POR TIPO DE ELEMENTO

### 4.1. CTAs (Call to Action)

**Estado:** **Subutilizado**
- ✅ **Bien aplicado:** Botones de acción en header (Filtrar/Ordenar) - Desktop
- ❌ **Ausente:** Botón "Aplicar" en filtros (usa negro)
- ❌ **Ausente:** Botón "Filtrar" mobile (usa negro)

**Conclusión:** Los CTAs principales de filtros no usan color de marca, solo los botones secundarios del header.

---

### 4.2. Precio

**Estado:** **Correctamente aplicado**
- ✅ **Bien aplicado:** Precio en CardAuto usa `var(--color-brand-500)`
- ✅ **Consistente:** Todas las cards de vehículos usan marca en precio

**Conclusión:** Uso correcto y consistente del color de marca en precios.

---

### 4.3. Links

**Estado:** **No aplicable**
- ⚠️ **No hay links tradicionales:** Las cards son clickeables pero no son enlaces estilizados
- ⚠️ **No detectados:** No se encontraron enlaces dentro de la sección que requieran color de marca

**Conclusión:** No hay enlaces tradicionales en la sección Usados.

---

### 4.4. Estados Hover/Focus

**Estado:** **Correctamente aplicado**
- ✅ **Focus:** Cards usan `brand-500` en outline (accesibilidad)
- ✅ **Hover:** Botones de acción usan `brand-600` en hover (correcto)
- ✅ **Active:** Botones de acción usan `brand-600` en active (correcto)

**Conclusión:** Estados interactivos usan correctamente el color de marca con jerarquía apropiada (`brand-500` para focus, `brand-600` para hover/active).

---

## 5. ANÁLISIS DE COHERENCIA

### Fortalezas

1. ✅ **Jerarquía clara:** El color de marca se reserva para elementos de alta importancia (precio, CTAs principales)
2. ✅ **Tokens semánticos:** Todos los usos actuales utilizan tokens (`brand-500`, `brand-600`)
3. ✅ **Estados consistentes:** Hover/active usan `brand-600` consistentemente
4. ✅ **Accesibilidad:** Focus outline usa marca (estándar de accesibilidad)

### Debilidades

1. ❌ **CTAs principales sin marca:** Los botones de acción más importantes ("Aplicar" filtros, "Filtrar" mobile) no usan color de marca
2. ❌ **Inconsistencia visual:** Filtros usan negro (#0a0d14) mientras header usa marca
3. ❌ **Hardcoded en filtros:** Colores hardcodeados en lugar de tokens

---

## 6. CONCLUSIÓN

### Coherencia General: **MODERADA**

**Análisis:**
- ✅ **Fortaleza:** El uso actual del color de marca es **correcto pero limitado**
- ❌ **Debilidad:** Los **CTAs principales de filtros no usan marca** (usando negro en su lugar)
- ✅ **Fortaleza:** Los elementos que SÍ usan marca lo hacen **correctamente y con tokens semánticos**

### Resumen de Estado

| Categoría | Estado | Detalle |
|-----------|--------|---------|
| **Precio** | ✅ Correcto | Todas las cards usan `brand-500` |
| **CTAs Header** | ✅ Correcto | Botones Filtrar/Ordenar usan marca |
| **CTAs Filtros** | ❌ Ausente | Botones "Aplicar" y "Filtrar" mobile usan negro |
| **Focus/Hover** | ✅ Correcto | Estados interactivos usan marca correctamente |
| **Tokens** | ✅ Correcto | Todos los usos actuales usan tokens semánticos |

### Recomendación General

**El color de marca está subutilizado en CTAs principales**, especialmente en el formulario de filtros. Los botones de acción más importantes ("Aplicar", "Filtrar" mobile) deberían usar color de marca para:
1. **Coherencia visual** con el resto de la aplicación
2. **Jerarquía clara** (marca = acción principal)
3. **Consistencia** con el header (que SÍ usa marca)

**Sin embargo, el uso actual NO es incorrecto**, solo **incompleto**. Los elementos que usan marca lo hacen correctamente.

---

## 7. ARCHIVOS RELEVADOS

### Archivos con uso de marca:

1. `src/components/vehicles/Card/CardAuto/CardAuto.module.css`
   - Línea 44: Focus outline
   - Línea 325: Precio

2. `src/pages/Vehiculos/Vehiculos.module.css`
   - Línea 115: Borde actionButtons
   - Línea 126: Línea divisoria actionButtons
   - Línea 152: Hover actionButton
   - Línea 157: Active actionButton

### Archivos sin uso de marca (oportunidades):

3. `src/components/vehicles/Filters/FilterFormSimple.module.css`
   - Línea 16: filterButtonMobile (usa #0a0d14)
   - Línea 219: applyButton (usa #0a0d14)

---

**Fin del relevamiento**

