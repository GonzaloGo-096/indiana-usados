/**
 * Utilidades de debugging para imágenes en preview
 * 
 * Uso en consola del navegador:
 * import { debugCardImages } from '@utils/debugImages'
 * debugCardImages()
 */

/**
 * Diagnóstico completo de imágenes en cards
 */
export function debugCardImages() {
  console.group('🔍 Diagnóstico de Imágenes en Cards');
  
  const cards = document.querySelectorAll('.card__image-container');
  
  if (cards.length === 0) {
    console.warn('❌ No se encontraron contenedores .card__image-container');
    console.groupEnd();
    return;
  }
  
  console.log(`✅ Encontradas ${cards.length} cards`);
  
  cards.forEach((card, index) => {
    console.group(`Card ${index + 1}`);
    
    // Verificar contenedor
    const containerStyles = window.getComputedStyle(card);
    console.log('📦 Contenedor:', {
      height: card.offsetHeight,
      width: card.offsetWidth,
      aspectRatio: containerStyles.aspectRatio,
      contain: containerStyles.contain,
      position: containerStyles.position,
      overflow: containerStyles.overflow,
      backgroundColor: containerStyles.backgroundColor
    });
    
    // Verificar imageContainer
    const imageContainers = card.querySelectorAll('[class*="imageContainer"]');
    console.log(`📷 ImageContainers encontrados: ${imageContainers.length}`);
    
    imageContainers.forEach((imgContainer, imgIndex) => {
      const imgStyles = window.getComputedStyle(imgContainer);
      console.log(`  ImageContainer ${imgIndex + 1}:`, {
        className: imgContainer.className,
        height: imgContainer.offsetHeight,
        width: imgContainer.offsetWidth,
        position: imgStyles.position,
        display: imgStyles.display
      });
      
      // Verificar imágenes dentro
      const images = imgContainer.querySelectorAll('img');
      images.forEach((img, i) => {
        const imgComputed = window.getComputedStyle(img);
        console.log(`    Imagen ${i + 1}:`, {
          src: img.src.substring(0, 60) + '...',
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          offsetWidth: img.offsetWidth,
          offsetHeight: img.offsetHeight,
          position: imgComputed.position,
          objectFit: imgComputed.objectFit,
          objectPosition: imgComputed.objectPosition,
          zIndex: imgComputed.zIndex,
          opacity: imgComputed.opacity,
          display: imgComputed.display,
          visibility: imgComputed.visibility
        });
      });
    });
    
    // Verificar si los selectores funcionan
    const imagesBySelector = card.querySelectorAll('[class*="image"]');
    const placeholdersBySelector = card.querySelectorAll('[class*="placeholder"]');
    console.log('🔍 Selectores:', {
      '[class*="image"] encontrados': imagesBySelector.length,
      '[class*="placeholder"] encontrados': placeholdersBySelector.length
    });
    
    console.groupEnd();
  });
  
  console.groupEnd();
}

/**
 * Comparar estilos entre local y preview
 */
export function compareStyles() {
  const container = document.querySelector('.card__image-container');
  if (!container) {
    console.warn('❌ No se encontró .card__image-container');
    return;
  }
  
  const styles = window.getComputedStyle(container);
  const relevantStyles = {
    aspectRatio: styles.aspectRatio,
    height: styles.height,
    width: styles.width,
    contain: styles.contain,
    position: styles.position,
    overflow: styles.overflow,
    backgroundColor: styles.backgroundColor,
    minHeight: styles.minHeight,
    maxHeight: styles.maxHeight
  };
  
  console.log('📊 Estilos del contenedor:', relevantStyles);
  
  // Copiar al clipboard (si está disponible)
  const stylesString = JSON.stringify(relevantStyles, null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(stylesString).then(() => {
      console.log('✅ Estilos copiados al clipboard');
    });
  }
  
  return relevantStyles;
}

/**
 * Verificar timing de carga
 */
export function checkLoadTiming() {
  console.group('⏱️ Timing de Carga');
  
  const checkImages = () => {
    const cards = document.querySelectorAll('.card__image-container');
    cards.forEach((card, index) => {
      const images = card.querySelectorAll('img');
      images.forEach((img, imgIndex) => {
        console.log(`Card ${index}, Img ${imgIndex}:`, {
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          offsetWidth: img.offsetWidth,
          offsetHeight: img.offsetHeight,
          loading: img.loading,
          decoding: img.decoding
        });
      });
    });
  };
  
  // Verificar inmediatamente
  console.log('📸 Estado inmediato:');
  checkImages();
  
  // Verificar después de load
  if (document.readyState === 'complete') {
    setTimeout(() => {
      console.log('📸 Estado después de 1s:');
      checkImages();
    }, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.log('📸 Estado después de load + 1s:');
        checkImages();
      }, 1000);
    });
  }
  
  console.groupEnd();
}

/**
 * Verificar clases CSS hasheadas
 */
export function checkHashedClasses() {
  console.group('🔤 Clases CSS Hasheadas');
  
  const containers = document.querySelectorAll('.card__image-container');
  containers.forEach((container, index) => {
    const allElements = container.querySelectorAll('*');
    const classesMap = new Map();
    
    allElements.forEach(el => {
      if (el.className) {
        const classes = el.className.split(' ');
        classes.forEach(cls => {
          if (cls.includes('image') || cls.includes('Container') || cls.includes('placeholder')) {
            if (!classesMap.has(cls)) {
              classesMap.set(cls, []);
            }
            classesMap.get(cls).push(el.tagName);
          }
        });
      }
    });
    
    console.log(`Card ${index + 1} - Clases relevantes:`, Object.fromEntries(classesMap));
  });
  
  console.groupEnd();
}

// Hacer disponible globalmente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.debugCardImages = debugCardImages;
  window.compareStyles = compareStyles;
  window.checkLoadTiming = checkLoadTiming;
  window.checkHashedClasses = checkHashedClasses;
}

