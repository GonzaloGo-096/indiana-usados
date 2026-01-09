# Diagnóstico Mejorado - Buscar Cards de Diferentes Maneras

## 🔍 Problema: No se encontraron cards

Si el diagnóstico anterior dice "Cards encontradas: 0", puede ser porque:
1. Las clases CSS están hasheadas diferente en producción
2. Las cards aún no se renderizaron
3. El selector no coincide

## ✅ Diagnóstico Mejorado (Copia y Pega)

```javascript
// Diagnóstico mejorado - busca de múltiples formas
(function() {
  console.group('🔍 Diagnóstico Mejorado de Imágenes');
  
  // Método 1: Buscar por clase exacta
  const cards1 = document.querySelectorAll('.card__image-container');
  console.log('Método 1 (.card__image-container):', cards1.length);
  
  // Método 2: Buscar por atributo data
  const cards2 = document.querySelectorAll('[data-testid="vehicle-card"]');
  console.log('Método 2 ([data-testid="vehicle-card"]):', cards2.length);
  
  // Método 3: Buscar cualquier div que contenga "card" en la clase
  const allDivs = document.querySelectorAll('div');
  const cards3 = Array.from(allDivs).filter(div => {
    return div.className && (
      div.className.includes('card') || 
      div.className.includes('Card') ||
      div.className.includes('image-container')
    );
  });
  console.log('Método 3 (cualquier div con "card"):', cards3.length);
  
  // Método 4: Buscar por estructura (div > div con imagen)
  const cards4 = Array.from(allDivs).filter(div => {
    const hasImage = div.querySelector('img');
    const hasAspectRatio = window.getComputedStyle(div).aspectRatio !== 'none';
    return hasImage && hasAspectRatio;
  });
  console.log('Método 4 (div con img y aspect-ratio):', cards4.length);
  
  // Método 5: Buscar imágenes de Cloudinary
  const cloudinaryImages = Array.from(document.querySelectorAll('img')).filter(img => {
    return img.src && (
      img.src.includes('cloudinary.com') ||
      img.src.includes('res.cloudinary')
    );
  });
  console.log('Método 5 (imágenes Cloudinary):', cloudinaryImages.length);
  
  // Si encontramos algo, analizarlo
  const foundCards = cards1.length > 0 ? cards1 : 
                     cards2.length > 0 ? cards2 :
                     cards3.length > 0 ? cards3.slice(0, 5) :
                     cards4.length > 0 ? cards4.slice(0, 5) : [];
  
  if (foundCards.length > 0) {
    console.group('📦 Análisis de Cards Encontradas');
    
    foundCards.forEach((card, index) => {
      console.group(`Card ${index + 1}`);
      
      // Información del elemento
      console.log('🏷️ Clases:', card.className);
      console.log('📏 Dimensiones:', {
        altura: card.offsetHeight,
        ancho: card.offsetWidth,
        tieneAltura: card.offsetHeight > 0
      });
      
      // Estilos computados
      const styles = window.getComputedStyle(card);
      console.log('🎨 Estilos:', {
        aspectRatio: styles.aspectRatio,
        height: styles.height,
        width: styles.width,
        contain: styles.contain,
        position: styles.position,
        display: styles.display
      });
      
      // Buscar imágenes
      const images = card.querySelectorAll('img');
      console.log('🖼️ Imágenes encontradas:', images.length);
      
      images.forEach((img, i) => {
        const imgStyles = window.getComputedStyle(img);
        console.log(`  Imagen ${i + 1}:`, {
          src: img.src.substring(0, 60) + '...',
          altura: img.offsetHeight,
          ancho: img.offsetWidth,
          completa: img.complete,
          position: imgStyles.position,
          objectFit: imgStyles.objectFit,
          zIndex: imgStyles.zIndex,
          display: imgStyles.display,
          visibility: imgStyles.visibility,
          opacity: imgStyles.opacity
        });
      });
      
      // Buscar imageContainer
      const imageContainers = card.querySelectorAll('[class*="imageContainer"]');
      console.log('📷 ImageContainers (selector [class*="imageContainer"]):', imageContainers.length);
      
      if (imageContainers.length === 0) {
        // Buscar de otra forma
        const allChildren = card.querySelectorAll('*');
        const possibleContainers = Array.from(allChildren).filter(el => {
          const cls = el.className || '';
          return cls.includes('image') || cls.includes('Container') || cls.includes('Image');
        });
        console.log('📷 Posibles contenedores (búsqueda amplia):', possibleContainers.length);
        if (possibleContainers.length > 0) {
          console.log('  Clases encontradas:', possibleContainers.map(el => el.className));
        }
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  } else {
    console.warn('❌ No se encontraron cards con ningún método');
    console.log('💡 Verificaciones adicionales:');
    
    // Verificar si React está renderizando
    const root = document.getElementById('root');
    if (root) {
      console.log('✅ Root encontrado, elementos hijos:', root.children.length);
    } else {
      console.error('❌ No se encontró #root');
    }
    
    // Verificar si hay errores en consola
    console.log('💡 Revisa la pestaña "Console" para errores de React');
    console.log('💡 Revisa la pestaña "Network" para errores de carga');
  }
  
  console.groupEnd();
})();
```

## 🎯 Qué Hacer Según los Resultados

### Si encuentra cards con Método 2, 3, 4 o 5:
- Las clases están hasheadas diferente
- Usa las clases reales que encuentre para diagnosticar

### Si encuentra imágenes Cloudinary pero no cards:
- Las imágenes se están renderizando pero el contenedor tiene problemas
- Verifica la altura del contenedor padre

### Si no encuentra nada:
- Las cards no se están renderizando
- Verifica errores de React en consola
- Verifica que la página haya cargado completamente

