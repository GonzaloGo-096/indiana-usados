/**
 * brandIcons.js - Mapeo de marcas a sus íconos
 * 
 * Permite obtener el ícono correcto para cada marca de vehículo.
 * Agregar nuevas marcas aquí cuando se añadan al catálogo.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { PeugeotIcon } from './PeugeotIcon'

/**
 * Mapeo de marca (lowercase) a componente de ícono
 */
export const BRAND_ICONS = {
  peugeot: PeugeotIcon,
  // citroen: CitroenIcon, // Futuro
  // ford: FordIcon, // Futuro
  // chevrolet: ChevroletIcon, // Futuro
}

/**
 * Obtener componente de ícono para una marca
 * @param {string} marca - Nombre de la marca (case-insensitive)
 * @returns {React.Component|null} - Componente de ícono o null
 */
export const getBrandIcon = (marca) => {
  if (!marca) return null
  const key = marca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return BRAND_ICONS[key] || null
}

/**
 * Verificar si una marca tiene ícono disponible
 * @param {string} marca - Nombre de la marca
 * @returns {boolean}
 */
export const hasBrandIcon = (marca) => {
  if (!marca) return false
  const key = marca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return !!BRAND_ICONS[key]
}



