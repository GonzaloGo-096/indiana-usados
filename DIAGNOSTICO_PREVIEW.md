# Diagnóstico: Problemas en Preview vs Local

## 🔍 Herramientas de Diagnóstico

### 1. **Verificar si las imágenes existen en el DOM**

Abre la consola del navegador en preview y ejecuta:

```javascript
// Verificar si las imágenes están en el DOM
const cards = document.querySelectorAll('.card__image-container');
cards.forEach((card, index) => {
  const images = card.querySelectorAll('img');
  console.log(`Card ${index}:`, {
    containerHeight: card.offsetHeight,
    containerWidth: card.offsetWidth,
    imagesCount: images.length,
    images: Array.from(images).map(img => ({
      src: img.src.substring(0, 50) + '...',
      width: img.offsetWidth,
      height: img.offsetHeight,
      computedStyle: window.getComputedStyle(img).display,
      position: window.getComputedStyle(img).position,
      zIndex: window.getComputedStyle(img).zIndex
    }))
  });
});
```

### 2. **Verificar estilos computados**

```javascript
// Comparar estilos entre local y preview
const container = document.querySelector('.card__image-container');
if (container) {
  const styles = window.getComputedStyle(container);
  console.log('Container styles:', {
    aspectRatio: styles.aspectRatio,
    height: styles.height,
    width: styles.width,
    contain: styles.contain,
    position: styles.position,
    overflow: styles.overflow
  });
  
  const imageContainer = container.querySelector('[class*="imageContainer"]');
  if (imageContainer) {
    const imgStyles = window.getComputedStyle(imageContainer);
    console.log('ImageContainer styles:', {
      height: imgStyles.height,
      width: imgStyles.width,
      position: imgStyles.position,
      display: imgStyles.display
    });
  }
}
```

### 3. **Verificar clases CSS hasheadas**

```javascript
// Verificar si los selectores [class*="image"] funcionan
const containers = document.querySelectorAll('.card__image-container');
containers.forEach((container, index) => {
  const imageContainers = container.querySelectorAll('[class*="imageContainer"]');
  const images = container.querySelectorAll('[class*="image"]');
  const placeholders = container.querySelectorAll('[class*="placeholder"]');
  
  console.log(`Card ${index}:`, {
    imageContainersFound: imageContainers.length,
    imagesFound: images.length,
    placeholdersFound: placeholders.length,
    actualClasses: Array.from(imageContainers).map(el => el.className)
  });
});
```

### 4. **Verificar timing de carga**

```javascript
// Verificar si las imágenes se cargan después del CSS
window.addEventListener('load', () => {
  setTimeout(() => {
    const cards = document.querySelectorAll('.card__image-container');
    cards.forEach((card, index) => {
      const images = card.querySelectorAll('img');
      images.forEach((img, imgIndex) => {
        console.log(`Card ${index}, Image ${imgIndex}:`, {
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          offsetWidth: img.offsetWidth,
          offsetHeight: img.offsetHeight,
          src: img.src.substring(0, 50) + '...'
        });
      });
    });
  }, 1000); // Esperar 1 segundo después de load
});
```

### 5. **Comparar CSS minificado**

En preview, inspecciona el elemento y copia el CSS computado. Compara con local:

```javascript
// Obtener todos los estilos aplicados
const container = document.querySelector('.card__image-container');
if (container) {
  const computed = window.getComputedStyle(container);
  const allStyles = {};
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    allStyles[prop] = computed.getPropertyValue(prop);
  }
  console.log('All computed styles:', allStyles);
}
```

## 🎯 Checklist de Diagnóstico

### Paso 1: Verificar DOM
- [ ] ¿Las imágenes `<img>` existen en el DOM?
- [ ] ¿Tienen `src` válido?
- [ ] ¿Tienen dimensiones (`offsetWidth`, `offsetHeight`)?

### Paso 2: Verificar CSS
- [ ] ¿El contenedor tiene altura (`offsetHeight > 0`)?
- [ ] ¿El `aspect-ratio` se está aplicando?
- [ ] ¿Los selectores `[class*="image"]` encuentran elementos?

### Paso 3: Verificar Timing
- [ ] ¿Las imágenes se cargan después del CSS?
- [ ] ¿Hay errores de red (404, CORS, etc.)?
- [ ] ¿El `contain: layout style paint` se aplica correctamente?

### Paso 4: Verificar Minificación
- [ ] ¿Los nombres de clases son diferentes entre local y preview?
- [ ] ¿El orden de las reglas CSS es diferente?
- [ ] ¿Hay reglas CSS que se sobrescriben?

## 🔧 Soluciones según Diagnóstico

### Si las imágenes no están en el DOM:
- Problema de renderizado de React
- Verificar errores en consola
- Verificar que `CloudinaryImage` se renderiza

### Si las imágenes están pero no se ven:
- Problema de CSS (altura 0, z-index, etc.)
- Verificar estilos computados
- Verificar `contain: layout style paint`

### Si los selectores no funcionan:
- Problema de minificación/hasheo de clases
- Usar `:global()` o clases específicas

### Si es problema de timing:
- Agregar `min-height` como fallback
- Usar `IntersectionObserver` para verificar visibilidad

