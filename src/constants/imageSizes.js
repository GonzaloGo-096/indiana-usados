/**
 * imageSizes.js - Constantes para tamaños de imágenes responsive
 * 
 * MIGRACIÓN: Sistema de imágenes WebP estáticas (1400px base)
 * - Imágenes pre-optimizadas: 1400px, quality ~75, WebP
 * - Un solo tamaño base → browser escala según viewport
 * - Reduce requests, simplifica generación, mejora cache
 * 
 * @author Indiana Usados
 * @version 2.0.0 - WebP estáticas: 1400px base, mobile-first
 */

// Tamaños responsive para diferentes contextos
// ACTUALIZADO: Mobile-first, basado en imágenes estáticas 1400px
export const IMAGE_SIZES = {
  // Cards de vehículos (optimizado para mobile-first)
  // Mobile: 100vw, Tablet: 50vw, Desktop: 350px
  card: '(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 350px',
  
  // Carrusel principal (siempre full width)
  carousel: '100vw',
  
  // Miniaturas del carrusel (tamaño fijo pequeño)
  thumbnail: '100px',
  
  // Hero/banner principal (siempre full width)
  hero: '100vw'
}

// Anchos para srcset
// ACTUALIZADO: Un solo tamaño (1400px) para simplificar
// El browser descarga una vez y escala según viewport
export const IMAGE_WIDTHS = {
  // Cards: 1400px base (suficiente para retina display)
  card: [1400],
  
  // Carrusel: 1400px base
  carousel: [1400],
  
  // Miniaturas: 1400px base (se escala automáticamente)
  thumbnail: [1400],
  
  // Hero: 1400px base
  hero: [1400]
}

// ===== LEGACY: Mantener para compatibilidad =====
// Estos valores se usan solo si hay fallback a Cloudinary
export const LEGACY_IMAGE_WIDTHS = {
  card: [400, 800],
  carousel: [400, 800, 1280, 1920],
  thumbnail: [100, 200],
  hero: [800, 1280, 1920]
}
