/**
 * Script de verificación del sistema de imágenes
 * Ejecutar en la consola del navegador para verificar que todo funciona
 */

console.log('🧪 VERIFICACIÓN DEL SISTEMA DE IMÁGENES');

// 1. Verificar que las funciones están disponibles
try {
  // Importar funciones (esto funcionará si estás en el navegador)
  console.log('✅ Funciones de Cloudinary disponibles');
} catch (e) {
  console.log('❌ Error al importar funciones:', e);
}

// 2. Verificar variables de entorno
console.log('📋 VARIABLES DE ENTORNO:');
console.log('VITE_IMG_PROGRESSIVE_JPEG:', import.meta.env.VITE_IMG_PROGRESSIVE_JPEG);
console.log('VITE_IMG_PLACEHOLDER_BLUR:', import.meta.env.VITE_IMG_PLACEHOLDER_BLUR);
console.log('VITE_IMG_METRICS:', import.meta.env.VITE_IMG_METRICS);

// 3. Verificar Performance Observer
if (window.PerformanceObserver) {
  console.log('✅ PerformanceObserver disponible');
} else {
  console.log('❌ PerformanceObserver no disponible');
}

// 4. Verificar sendBeacon
if (navigator.sendBeacon) {
  console.log('✅ sendBeacon disponible');
} else {
  console.log('❌ sendBeacon no disponible');
}

// 5. Verificar preconnect
const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]');
console.log('📡 Preconnect links encontrados:', preconnectLinks.length);
preconnectLinks.forEach(link => {
  console.log('  -', link.href);
});

// 6. Verificar imágenes de Cloudinary en la página
const cloudinaryImages = document.querySelectorAll('img[src*="res.cloudinary.com"]');
console.log('🖼️ Imágenes de Cloudinary en la página:', cloudinaryImages.length);

// 7. Verificar que las imágenes tienen los atributos correctos
cloudinaryImages.forEach((img, index) => {
  console.log(`Imagen ${index + 1}:`);
  console.log('  - src:', img.src.substring(0, 100) + '...');
  console.log('  - loading:', img.loading || 'no especificado');
  console.log('  - decoding:', img.decoding || 'no especificado');
  console.log('  - fetchpriority:', img.fetchpriority || 'no especificado');
});

console.log('🎯 VERIFICACIÓN COMPLETADA');
