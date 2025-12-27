/**
 * CeroKm Assets - Imágenes de modelos 0km
 * 
 * NOTA: Migrado a Cloudinary. Este archivo mantiene compatibilidad.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Migración a Cloudinary
 */

import { staticImages } from '@config/cloudinaryStaticImages'

// Array de modelos para el carrusel
export const modelos = Object.entries(staticImages.ceroKm.modelos).map(([slug, data]) => ({
  slug,
  ...data
}))

// Exportar imágenes individuales para compatibilidad
export const modelo208 = staticImages.ceroKm.modelos["208"]
export const modelo2008 = staticImages.ceroKm.modelos["2008"]
export const modelo3008 = staticImages.ceroKm.modelos["3008"]
export const modelo5008 = staticImages.ceroKm.modelos["5008"]
export const modeloPartner = staticImages.ceroKm.modelos.partner
export const modeloExpert = staticImages.ceroKm.modelos.expert
export const modeloBoxer = staticImages.ceroKm.modelos.boxer

// Objeto con todos los modelos (compatibilidad)
export const modelosMap = staticImages.ceroKm.modelos


