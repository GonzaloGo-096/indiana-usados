# Resumen: Cambios para que funcione en Preview

## ✅ Cambios Aplicados

### 1. **Igualado con CardSimilar (que SÍ funciona)**
- `aspect-ratio: 16 / 9` (igual que CardSimilar)
- `contain: layout style paint` (igual que CardSimilar)
- `object-fit: cover` y `object-position: center` en `.card__image` (igual que CardSimilar)
- Selectores `[class*="image"]` y `[class*="placeholder"]` (igual que CardSimilar)

### 2. **Removido z-index innecesario**
- Eliminado `z-index: 10` de `.card` que podía crear contexto de apilamiento problemático

### 3. **Ajustado cardWrapper**
- Removido `max-width: 100%` que podía interferir con `max-width: 360px` de la card
- Mantenido `height: auto` para altura real

### 4. **Agregado object-position: center**
- En `.image` y `.placeholder` de CloudinaryImage para evitar deformación

## ⚠️ Posibles Problemas Restantes en Preview

### 1. **Selector frágil `[class*="image"]`**
Si los nombres de clases se hashean diferente en producción, este selector puede fallar.

**Solución si falla**: Usar `:global()` o pasar una clase específica desde CloudinaryImage.

### 2. **Timing de carga CSS**
En preview, el CSS puede cargarse en orden diferente, causando que `contain` se aplique antes de que las imágenes se rendericen.

**Solución si falla**: Agregar `min-height` calculado basado en el ancho.

### 3. **Diferencias de minificación**
El CSS minificado puede cambiar el orden de las reglas, afectando la especificidad.

**Solución si falla**: Usar selectores más específicos o `!important` (aunque preferimos evitarlo).

## 🎯 Estado Actual

CardAuto ahora tiene **exactamente el mismo tratamiento** que CardSimilar que funciona. Si aún falla en preview, el problema sería específico del entorno de producción (minificación, timing, etc.).

