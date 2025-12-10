/**
 * Hero Images - Imágenes para el Hero de Home
 * 
 * Nota: El componente Hero usa las imágenes directamente.
 * Estas exportaciones se mantienen para compatibilidad.
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Actualizado para usar imágenes existentes
 */

import indianaHeroDesktop from './indiana-hero-1-desktop.webp'
import indianaHeroMobile from './indiana-hero-1-mobile.webp'

const generateSrcSet = (baseUrl) => {
  const widths = [400, 800, 1280, 1920]
  return widths.map(width => `${baseUrl} ${width}w`).join(', ')
}

// Hero image con srcSet (compatibilidad)
export const heroImage = {
  src: indianaHeroDesktop,
  srcSet: generateSrcSet(indianaHeroDesktop),
  alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
  sizes: "(max-width: 1200px) 100vw, 1200px"
}

// Hero image responsivo (similar a vehiclesHeroImage)
export const homeHeroImage = {
  mobile: indianaHeroMobile,
  desktop: indianaHeroDesktop,
  alt: "Vehículos de calidad en Indiana Usados"
}

// Exportar imágenes individuales para compatibilidad
export const heroHomeWebp = indianaHeroDesktop
