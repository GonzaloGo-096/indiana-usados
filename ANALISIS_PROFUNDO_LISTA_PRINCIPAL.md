# Análisis Profundo: Lista Principal - Imágenes No Visibles

## 🔍 Estructura del DOM en Lista Principal

```
.grid (display: grid)
  └── .cardWrapper (min-height: 350px, width: 100%)
      └── .card (height: 100%, width: 100%, max-width: 360px)
          └── .card__image-container (aspect-ratio: 16/10, contain: layout style paint)
              └── .imageContainer (aspect-ratio: 16/10, height: 100%)
                  ├── .placeholder (position: absolute)
                  └── .image (position: absolute)
```

## 🎯 Problema Identificado

### Cadena de Problemas

1. **`.cardWrapper`** tiene `min-height: 350px` pero **NO tiene `height`**
2. **`.card`** tiene `height: 100%` - intenta ocupar 100% de la altura del wrapper
3. **Problema**: Si el wrapper solo tiene `min-height` sin `height` real, el 100% no se calcula correctamente
4. **`.card__image-container`** tiene `aspect-ratio: 16 / 10` pero depende de que el padre (`.card`) tenga altura
5. **`contain: layout style paint`** aísla el layout, agravando el problema
6. **Con lazy loading**: El navegador calcula el layout antes de que las imágenes se carguen, causando colapso

### Comparación con CardSimilar (que SÍ funciona)

**CardSimilar**:
- NO está dentro de un `cardWrapper` con `min-height`
- Se usa directamente en carruseles sin wrapper adicional
- El contenedor padre tiene altura real calculada

**CardAuto en Lista Principal**:
- Está dentro de `cardWrapper` con solo `min-height`
- La card intenta `height: 100%` de un padre sin altura real
- El cálculo de altura falla en producción

## ✅ Solución Propuesta

### Opción 1: Asegurar altura en cardWrapper (MÁS SEGURA)

Agregar `height: auto` o `height: fit-content` al `cardWrapper` para que tenga altura real basada en el contenido.

### Opción 2: Asegurar altura mínima en card__image-container

Agregar `min-height` calculada basada en el ancho y aspect-ratio.

### Opción 3: Remover height: 100% de la card cuando está en cardWrapper

Hacer que la card no dependa de la altura del wrapper.

## 🔧 Solución Aplicada

### Cambio 1: `ListAutos.module.css` - cardWrapper con altura real

```css
.cardWrapper {
    min-height: 350px;
    height: auto; /* ✅ CRÍTICO: Altura real basada en contenido para que height: 100% de la card funcione */
    width: 100%;
}
```

**Razón**: Cuando `cardWrapper` solo tiene `min-height` sin `height`, el `height: 100%` de `.card` no se calcula correctamente. Con `height: auto`, el wrapper tiene altura real basada en su contenido.

### Cambio 2: `CardAuto.module.css` - Fallback de altura mínima

```css
.card__image-container {
    /* ... propiedades existentes ... */
    aspect-ratio: 16 / 10;
    contain: layout style paint;
    min-height: 0;
    flex-shrink: 0;
    /* ✅ CRÍTICO: Altura mínima como fallback cuando aspect-ratio no se calcula correctamente */
    min-height: 200px; /* Fallback mínimo para evitar colapso total */
}
```

**Razón**: Aunque `aspect-ratio` debería funcionar, `contain: layout style paint` puede interferir con el cálculo en algunos navegadores o en producción. El `min-height: 200px` asegura que el contenedor tenga al menos espacio mínimo, evitando el colapso total.

## 📊 Resultado Esperado

1. **cardWrapper** tiene altura real (`height: auto`)
2. **card** puede calcular `height: 100%` correctamente
3. **card__image-container** tiene altura mínima como fallback
4. **CloudinaryImage** puede renderizar correctamente con `position: absolute`

## 🧪 Pruebas Necesarias

- [ ] Verificar en preview de Vercel que las imágenes se muestran
- [ ] Verificar que no hay regresión en otras cards (inicio, carruseles)
- [ ] Verificar que el layout no se rompe en diferentes tamaños de pantalla

