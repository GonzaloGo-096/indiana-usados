/**
 * modelos/index.js - Índice de modelos 0km
 * 
 * Centraliza el acceso a todos los modelos disponibles.
 * Permite agregar nuevos modelos fácilmente.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { PEUGEOT_2008, getVersion, getColoresVersion, getImagenVersionColor } from './peugeot2008'
import { COLORES, getColor, getColorImage } from './colores'

// Registro de modelos (agregar nuevos modelos aquí)
const MODELOS = {
  '2008': PEUGEOT_2008,
  // '208': PEUGEOT_208, // Futuro
  // '3008': PEUGEOT_3008, // Futuro
}

/**
 * Obtener modelo por slug
 * @param {string} slug - Slug del modelo (ej: '2008')
 * @returns {Object|null} - Objeto modelo o null
 */
export const getModelo = (slug) => MODELOS[slug] || null

/**
 * Verificar si un modelo existe
 * @param {string} slug - Slug del modelo
 * @returns {boolean}
 */
export const existeModelo = (slug) => !!MODELOS[slug]

/**
 * Obtener lista de slugs de modelos disponibles
 * @returns {string[]}
 */
export const getModelosSlugs = () => Object.keys(MODELOS)

// Re-exportar para acceso directo
export {
  PEUGEOT_2008,
  COLORES,
  getVersion,
  getColoresVersion,
  getImagenVersionColor,
  getColor,
  getColorImage
}


