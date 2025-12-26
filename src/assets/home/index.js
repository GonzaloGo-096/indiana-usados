/**
 * Home Assets - Imágenes para la página Home
 * 
 * NOTA: Migrado a Cloudinary. Este archivo mantiene compatibilidad.
 * 
 * @author Indiana Usados
 * @version 4.0.0 - Migración a Cloudinary
 */

import { staticImages } from '@config/cloudinaryStaticImages'

// Hero image con srcSet (compatibilidad)
export const heroImage = {
  src: staticImages.home.heroDesktop.src,
  alt: staticImages.home.heroDesktop.alt,
  sizes: "(max-width: 1200px) 100vw, 1200px"
}

// Hero image responsivo
export const homeHeroImage = {
  mobile: staticImages.home.heroMobile.src,
  desktop: staticImages.home.heroDesktop.src,
  alt: staticImages.home.heroDesktop.alt
}

// Exportar imágenes individuales para compatibilidad
export const heroHomeWebp = staticImages.home.heroDesktop.src
