/**
 * imagesMap.js - Mapa de imágenes para servicios de postventa
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Migración a Cloudinary
 */

import { staticImages } from '@config/cloudinaryStaticImages'

/**
 * Mapa de imágenes de servicios
 * Claves usadas en Postventa.jsx: 'taller-2', 'taller-3-jpeg', 'taller-motor'
 */
export const serviceImagesMap = {
  'taller-2': staticImages.postventa.services.chapa.src,        // Chapa y Pintura
  'taller-3-jpeg': staticImages.postventa.services.taller.src,  // Service
  'taller-motor': staticImages.postventa.services.repuestos.src // Repuestos
}

export default serviceImagesMap
