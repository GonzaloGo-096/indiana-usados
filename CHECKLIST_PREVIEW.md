# Checklist: Diferencias que pueden causar problemas en Preview

## ✅ Ya aplicado (igual que CardSimilar)
- [x] `aspect-ratio: 16 / 9`
- [x] `contain: layout style paint`
- [x] `object-fit: cover` y `object-position: center` en `.card__image`
- [x] Selectores `[class*="image"]` y `[class*="placeholder"]` (igual que CardSimilar)
- [x] Removido `z-index: 10` de la card

## ⚠️ Posibles problemas en Preview

### 1. **cardWrapper fuerza max-width: 100%**
```css
.cardWrapper :global(.card) {
    width: 100%;
    max-width: 100%; /* ⚠️ Puede interferir con max-width: 360px de la card */
}
```

**Solución**: Asegurar que la card mantenga su `max-width: 360px` incluso dentro del wrapper.

### 2. **Selector frágil `[class*="image"]`**
Este selector puede fallar en producción si los nombres de clases se hashean de manera diferente.

**Solución**: Si falla, usar `:global()` o pasar una clase específica.

### 3. **Timing de carga diferente**
En preview, el CSS puede cargarse en un orden diferente, causando que `contain: layout style paint` se aplique antes de que las imágenes se rendericen.

**Solución**: Asegurar que el contenedor tenga altura incluso antes de que las imágenes carguen.

