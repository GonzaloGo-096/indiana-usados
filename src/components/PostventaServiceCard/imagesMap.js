/**
 * imagesMap.js - Mapa de imágenes para servicios de postventa
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Reorganización por páginas
 */

import serviceChapa from '@assets/postventa/service-chapa.webp'
import serviceTaller from '@assets/postventa/service-taller.webp'
import serviceRepuestos from '@assets/postventa/service-repuestos.webp'

/**
 * Mapa de imágenes de servicios
 * Claves usadas en Postventa.jsx: 'taller-2', 'taller-3-jpeg', 'taller-motor'
 */
export const serviceImagesMap = {
  'taller-2': serviceChapa,        // Chapa y Pintura
  'taller-3-jpeg': serviceTaller,  // Service
  'taller-motor': serviceRepuestos // Repuestos
}

export default serviceImagesMap

