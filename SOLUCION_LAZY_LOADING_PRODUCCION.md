# Solución: Imágenes No Visibles en Lista Principal (Solo Preview)

## 🔍 Problema Específico Identificado

### Síntomas
- ✅ Card del inicio funciona
- ✅ Cards de carruseles (similar precio, similar marca) funcionan  
- ❌ **Cards de la lista principal NO funcionan** (solo en preview, sí en local)
- ✅ URL del backend llega correctamente (200 OK)

### Causa Raíz

El problema es específico de la **lista principal** porque:

1. **`cardWrapper` con `min-height`**: El wrapper tiene `min-height: 350px` pero no `height` explícita
2. **Lazy loading**: Las imágenes tienen `loading="lazy"` 
3. **`contain: layout style paint`**: Esta propiedad en `.card__image-container` puede interferir con el cálculo de altura cuando se combina con lazy loading
4. **Timing en producción**: En preview, el navegador puede calcular el layout antes de que las imágenes lazy se carguen, causando que el contenedor colapse a 0px

### Por Qué Funciona en Local Pero No en Preview

- **Local**: El timing de carga es diferente, el CSS se aplica de forma más gradual
- **Preview**: CSS minificado, orden diferente, y el navegador calcula el layout más estricto
- **`contain: layout style paint`**: Aísla el layout del contenedor, y en producción puede causar que el `aspect-ratio` no se calcule correctamente antes de que las imágenes lazy se carguen

## ✅ Solución Aplicada

### 1. **CardAuto.module.css** - Asegurar cálculo de altura

```css
.card__image-container {
    /* ... propiedades existentes ... */
    aspect-ratio: 16 / 10;
    contain: layout style paint;
    
    /* ✅ NUEVO: Asegurar que el aspect-ratio se calcule incluso con contain y lazy loading */
    min-height: 0;
    flex-shrink: 0;
}
```

### 2. **CloudinaryImage.module.css** - Forzar aspect-ratio en contenedor

```css
.imageContainer {
    position: relative;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    min-height: 0;
    flex-shrink: 0;
    /* ✅ NUEVO: Forzar aspect-ratio igual al padre para calcular altura correctamente */
    aspect-ratio: 16 / 10;
}
```

## 🎯 Cómo Funciona

1. **`.card__image-container`** tiene `aspect-ratio: 16 / 10` y `flex-shrink: 0` para asegurar que tenga altura
2. **`.imageContainer`** también tiene `aspect-ratio: 16 / 10` para calcular su altura independientemente del padre
3. Esto asegura que incluso si el padre tiene `contain: layout style paint` y las imágenes son lazy, el contenedor tiene altura calculada

## 📋 Archivos Modificados

1. ✅ `src/components/vehicles/Card/CardAuto/CardAuto.module.css`
   - Agregado `min-height: 0` y `flex-shrink: 0` a `.card__image-container`

2. ✅ `src/components/ui/CloudinaryImage/CloudinaryImage.module.css`
   - Agregado `aspect-ratio: 16 / 10` a `.imageContainer`

## 🔍 Verificación

Para verificar que funciona en preview:

1. **Inspeccionar `.imageContainer`**: Debe tener `height` calculada (no `0px`)
2. **Inspeccionar `.card__image-container`**: Debe tener altura basada en `aspect-ratio`
3. **Verificar imágenes**: Deben ser visibles en la lista principal

## 📝 Notas

- Esta solución es específica para el problema de lazy loading en producción
- El `aspect-ratio` en `.imageContainer` asegura que tenga altura incluso si el padre no la calcula correctamente
- No afecta otros componentes porque solo se aplica cuando hay placeholder (CloudinaryImage con showPlaceholder)

