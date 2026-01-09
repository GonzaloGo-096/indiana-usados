# Guía Rápida: Diagnosticar Problemas en Preview

## 🚀 Método Rápido (5 minutos)

### Paso 1: Abrir Preview y Consola
1. Abre el preview de Vercel
2. Abre las DevTools (F12)
3. Ve a la pestaña "Console"

### Paso 2: Ejecutar Diagnóstico Automático

Copia y pega este código en la consola:

```javascript
// Diagnóstico rápido de imágenes
(function() {
  console.group('🔍 Diagnóstico de Imágenes');
  
  const cards = document.querySelectorAll('.card__image-container');
  console.log(`📦 Cards encontradas: ${cards.length}`);
  
  if (cards.length === 0) {
    console.error('❌ No se encontraron cards');
    console.groupEnd();
    return;
  }
  
  cards.forEach((card, index) => {
    const containerHeight = card.offsetHeight;
    const containerWidth = card.offsetWidth;
    const imageContainers = card.querySelectorAll('[class*="imageContainer"]');
    const images = card.querySelectorAll('img');
    
    console.group(`Card ${index + 1}`);
    console.log('📦 Contenedor:', {
      altura: containerHeight,
      ancho: containerWidth,
      tieneAltura: containerHeight > 0
    });
    
    console.log('📷 ImageContainers:', imageContainers.length);
    console.log('🖼️ Imágenes:', images.length);
    
    images.forEach((img, i) => {
      const tieneAltura = img.offsetHeight > 0;
      const tieneAncho = img.offsetWidth > 0;
      const estaCargada = img.complete;
      
      console.log(`  Imagen ${i + 1}:`, {
        tieneAltura,
        tieneAncho,
        estaCargada,
        altura: img.offsetHeight,
        ancho: img.offsetWidth,
        src: img.src.substring(0, 50) + '...',
        problema: !tieneAltura ? '❌ SIN ALTURA' : !tieneAncho ? '❌ SIN ANCHO' : '✅ OK'
      });
    });
    
    // Verificar estilos
    const styles = window.getComputedStyle(card);
    console.log('🎨 Estilos:', {
      aspectRatio: styles.aspectRatio,
      height: styles.height,
      contain: styles.contain
    });
    
    console.groupEnd();
  });
  
  console.groupEnd();
})();
```

### Paso 3: Interpretar Resultados

#### ✅ Si TODO está OK:
- `tieneAltura: true` y `tieneAncho: true` → El problema NO es CSS
- Verificar errores de red (pestaña Network)
- Verificar que las URLs de imágenes sean válidas

#### ❌ Si hay problemas:

**Problema 1: `tieneAltura: false`**
```
Solución: El contenedor no tiene altura
- Verificar que aspect-ratio se esté aplicando
- Verificar que contain: layout no esté bloqueando
```

**Problema 2: `ImageContainers: 0`**
```
Solución: Los selectores [class*="imageContainer"] no funcionan
- Las clases se hashearon diferente en producción
- Usar :global() o clases específicas
```

**Problema 3: `Imágenes: 0`**
```
Solución: Las imágenes no se están renderizando
- Verificar errores de React en consola
- Verificar que CloudinaryImage se renderiza
```

## 🔧 Método Avanzado (10 minutos)

### 1. Comparar CSS entre Local y Preview

**En Local:**
```javascript
const container = document.querySelector('.card__image-container');
const styles = window.getComputedStyle(container);
console.log('LOCAL:', {
  aspectRatio: styles.aspectRatio,
  height: styles.height,
  contain: styles.contain
});
```

**En Preview:**
Ejecuta el mismo código y compara los valores.

### 2. Verificar Clases Hasheadas

```javascript
const container = document.querySelector('.card__image-container');
const allElements = container.querySelectorAll('*');
const classes = [];
allElements.forEach(el => {
  if (el.className) {
    classes.push(...el.className.split(' '));
  }
});
console.log('Clases encontradas:', classes.filter(c => 
  c.includes('image') || c.includes('Container') || c.includes('placeholder')
));
```

### 3. Verificar Timing

```javascript
// Verificar inmediatamente
console.log('Inmediato:', document.querySelectorAll('.card__image-container img').length);

// Verificar después de load
window.addEventListener('load', () => {
  setTimeout(() => {
    console.log('Después de load:', document.querySelectorAll('.card__image-container img').length);
  }, 1000);
});
```

## 📊 Checklist de Diagnóstico

Marca lo que encuentres:

- [ ] **DOM**: Las imágenes `<img>` existen
- [ ] **Dimensiones**: Las imágenes tienen `offsetHeight > 0`
- [ ] **CSS**: El contenedor tiene `aspect-ratio` aplicado
- [ ] **Selectores**: `[class*="imageContainer"]` encuentra elementos
- [ ] **Timing**: Las imágenes se cargan correctamente
- [ ] **Red**: No hay errores 404 o CORS
- [ ] **Clases**: Los nombres de clases son correctos

## 🎯 Soluciones según Diagnóstico

| Problema Detectado | Solución |
|-------------------|----------|
| Contenedor sin altura | Agregar `min-height` o verificar `aspect-ratio` |
| Selectores no funcionan | Usar `:global()` o clases específicas |
| Imágenes no se renderizan | Verificar errores de React/CloudinaryImage |
| Timing de carga | Agregar fallback o delay |
| CSS diferente | Verificar minificación/orden de reglas |

