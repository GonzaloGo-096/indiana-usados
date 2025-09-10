/**
 * imageSizes.js - Constantes para tamaños de imágenes responsive
 * 
 * Define tamaños y anchos para diferentes contextos de uso
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Tamaños responsive para diferentes contextos
export const IMAGE_SIZES = {
  // Cards de vehículos
  card: '(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 25vw',
  
  // Carrusel principal
  carousel: '(max-width: 576px) 100vw, (max-width: 768px) 100vw, (max-width: 992px) 100vw, 100vw',
  
  // Miniaturas del carrusel
  thumbnail: '(max-width: 576px) 20vw, (max-width: 768px) 15vw, (max-width: 992px) 12vw, 10vw',
  
  // Hero/banner principal
  hero: '(max-width: 576px) 100vw, (max-width: 768px) 100vw, (max-width: 992px) 100vw, 100vw'
}

// Anchos para generar srcset
export const IMAGE_WIDTHS = {
  // Cards: optimizado para grids responsivos
  card: [320, 640, 800],
  
  // Carrusel: más anchos para mejor calidad
  carousel: [320, 640, 1280],
  
  // Miniaturas: tamaños pequeños
  thumbnail: [90, 180],
  
  // Hero: tamaños grandes para impacto visual
  hero: [640, 1280, 1920]
}
