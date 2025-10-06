/**
 * imageSizes.js - Constantes para tamaños de imágenes responsive
 * 
 * Define tamaños y anchos para diferentes contextos de uso
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Tamaños responsive para diferentes contextos
// OPTIMIZADO: Valores basados en mediciones reales de grids típicos
// Cards: 360px (mobile), 350px (tablet), 300px (desktop-s), 330px (desktop-l)
export const IMAGE_SIZES = {
  // Cards de vehículos (tamaños exactos basados en grid real)
  // Mobile: 400px, Tablet: 400px, Desktop: 350px
  card: '(max-width: 576px) 400px, (max-width: 768px) 400px, (max-width: 992px) 350px, 350px',
  
  // Carrusel principal (siempre full width)
  carousel: '100vw',
  
  // Miniaturas del carrusel (tamaño fijo pequeño)
  thumbnail: '100px',
  
  // Hero/banner principal (siempre full width)
  hero: '100vw'
}

// Anchos para generar srcset
// OPTIMIZADO: Solo los tamaños necesarios para reducir ancho de banda
export const IMAGE_WIDTHS = {
  // Cards: 2 tamaños (base + retina 2x) - suficiente para la mayoría de casos
  card: [400, 800],
  
  // Carrusel: 4 tamaños para cubrir mobile, tablet, desktop y retina
  carousel: [400, 800, 1280, 1920],
  
  // Miniaturas: 2 tamaños (base + retina 2x)
  thumbnail: [100, 200],
  
  // Hero: 3 tamaños grandes para impacto visual
  hero: [800, 1280, 1920]
}
