/**
 * getBrandLogo.js - Utilidad para obtener logo de marca
 * 
 * Normaliza el nombre de la marca a brandKey y devuelve
 * la configuración del logo correspondiente o el fallback.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { BRAND_LOGOS, DEFAULT_BRAND_LOGO } from '@config/brandLogos'

/**
 * Normaliza el nombre de la marca a brandKey
 * 
 * Transformaciones:
 * - lowercase
 * - elimina espacios
 * - elimina guiones y caracteres especiales
 * - normaliza caracteres especiales (ej: "Citroën" → "citroen")
 * 
 * @param {string} marca - Nombre de la marca (ej: "Mercedes-Benz", "Peugeot")
 * @returns {string} brandKey normalizado (ej: "mercedesbenz", "peugeot")
 */
const normalizeBrandKey = (marca) => {
  if (!marca || typeof marca !== 'string') {
    return null
  }

  return marca
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .replace(/[^a-z0-9]/g, '') // Elimina todo excepto letras y números
    .trim()
}

/**
 * Obtiene la configuración del logo para una marca
 * 
 * @param {string} marca - Nombre de la marca del vehículo
 * @returns {{src: string, alt: string}} Configuración del logo
 * 
 * @example
 * getBrandLogo('Peugeot') // { src: '/assets/logos/brands/peugeot.webp', alt: 'Logo Peugeot' }
 * getBrandLogo('Mercedes-Benz') // { src: '/assets/logos/brands/mercedesbenz.webp', alt: 'Logo Mercedes-Benz' }
 * getBrandLogo('Marca Desconocida') // { src: '/assets/logos/brands/logo-chico-solid.webp', alt: 'Logo de marca' }
 */
export const getBrandLogo = (marca) => {
  // Si no hay marca, devolver fallback
  if (!marca) {
    return DEFAULT_BRAND_LOGO
  }

  // Normalizar marca a brandKey
  const brandKey = normalizeBrandKey(marca)

  // Si no se pudo normalizar, devolver fallback
  if (!brandKey) {
    return DEFAULT_BRAND_LOGO
  }

  // Buscar logo en el mapping
  const logo = BRAND_LOGOS[brandKey]

  // Si existe, devolverlo; si no, devolver fallback
  return logo || DEFAULT_BRAND_LOGO
}

