/**
 * Assets Index - Centralización de recursos estáticos
 * 
 * NOTA: Las imágenes estáticas ahora se consumen desde Cloudinary
 * via src/config/cloudinaryStaticImages.js
 * 
 * Este archivo mantiene exports legacy para compatibilidad.
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Migración a Cloudinary
 */

import { staticImages } from '@config/cloudinaryStaticImages'

// ===== VEHICLES (Fallback para vehículos sin imagen) =====
// Usado por: ImageCarousel, Dashboard, imageExtractors, imageNormalizerOptimized
export const defaultCarImage = staticImages.usados.placeholder.src

// ===== LEGACY EXPORTS (Compatibilidad hacia atrás) =====
// Estos exports se mantienen para no romper imports existentes
// pero ahora apuntan a Cloudinary

export const logoNav = staticImages.nav.logo.src
export const indianaNavLogo = staticImages.nav.logo.src // Legacy alias

// ===== HOME (Legacy) =====
export const heroImage = {
  src: staticImages.home.heroDesktop.src,
  alt: staticImages.home.heroDesktop.alt
}
export const heroHomeWebp = staticImages.home.heroDesktop.src

// ===== POSTVENTA (Legacy) =====
export const heroPostventa = staticImages.postventa.hero.src
export const serviceChapa = staticImages.postventa.services.chapa.src
export const serviceTaller = staticImages.postventa.services.taller.src
export const serviceRepuestos = staticImages.postventa.services.repuestos.src
