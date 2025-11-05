/**
 * imagesMap.js - Mapa compartido de imágenes para servicios
 * 
 * Centraliza las imágenes de servicios para evitar duplicación
 * entre ServiceCard y PostventaServiceCard
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import taller2Image from '@assets/taller-2.webp'
import taller3Image from '@assets/taller-3-jpeg.webp'
import tallerMotorImage from '@assets/taller-motor.webp'

/**
 * Mapa de imágenes de servicios
 * Claves: 'taller-2', 'taller-3-jpeg', 'taller-motor'
 */
export const serviceImagesMap = {
  'taller-2': taller2Image,
  'taller-3-jpeg': taller3Image,
  'taller-motor': tallerMotorImage
}

export default serviceImagesMap

