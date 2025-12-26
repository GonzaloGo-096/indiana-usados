/**
 * Vehicles Assets - Imágenes para la página de Vehículos
 * 
 * NOTA: Migrado a Cloudinary. Este archivo mantiene compatibilidad.
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Migración a Cloudinary
 */

import { staticImages } from '@config/cloudinaryStaticImages'

// Imágenes responsivas para el hero de la página de Vehículos
// NOTA: Actualmente usa las mismas imágenes de Home
// TODO: Agregar imágenes específicas para Vehículos en Cloudinary si es necesario
export const vehiclesHeroImage = {
  mobile: staticImages.home.heroMobile.src,
  desktop: staticImages.home.heroDesktop.src,
  alt: "Vehículos usados de calidad en Indiana Usados"
}
