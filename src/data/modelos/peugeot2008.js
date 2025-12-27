/**
 * peugeot2008.js - Data del modelo Peugeot 2008
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs y descripciones. La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot 2008
 */
export const PEUGEOT_2008 = {
  id: '2008',
  marca: 'Peugeot',
  nombre: '2008',
  slug: '2008',
  año: 2024,
  
  // Versiones disponibles
  versiones: [
    {
      id: 'active',
      nombre: 'Active T200 AM24',
      nombreCorto: 'Active',
      descripcion: 'Es la versión más accesible de la familia 2008, que se destaca por su excelente equilibrio de estética exterior, performance y equipamiento.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'blanco-nacre',
      specs: {
        motor: '1.2 PureTech 130cv',
        transmision: 'Automática 6 velocidades',
        traccion: 'Delantera',
        combustible: 'Nafta',
        consumo: '6.2 L/100km',
        potencia: '130 CV',
        torque: '230 Nm'
      }
    },
    {
      id: 'allure',
      nombre: 'Allure T200 AM24',
      nombreCorto: 'Allure',
      descripcion: 'La versión Allure cuenta con un gran nivel de equipamiento de tecnología y seguridad de punta.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'gris-selenium',
      specs: {
        motor: '1.2 PureTech 130cv',
        transmision: 'Automática 6 velocidades',
        traccion: 'Delantera',
        combustible: 'Nafta',
        consumo: '6.2 L/100km',
        potencia: '130 CV',
        torque: '230 Nm'
      }
    },
    {
      id: 'gt',
      nombre: 'GT T200 AM24',
      nombreCorto: 'GT',
      descripcion: 'La versión GT es la máxima expresión del Peugeot 2008, con detalles y equipamientos únicos, tecnología de punta y la identidad visual de un verdadero GT.',
      coloresPermitidos: ['negro', 'gris-selenium', 'blanco-nacre'],
      colorDefault: 'negro',
      specs: {
        motor: '1.2 PureTech 130cv',
        transmision: 'Automática 6 velocidades',
        traccion: 'Delantera',
        combustible: 'Nafta',
        consumo: '6.4 L/100km',
        potencia: '130 CV',
        torque: '230 Nm'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot 2008 0KM | Versiones, Colores y Especificaciones',
    description: 'Descubrí el nuevo Peugeot 2008. Motor PureTech 130cv, i-Cockpit 3D y diseño SUV. Versiones Active, Allure y GT disponibles.',
    keywords: 'Peugeot 2008, SUV, 0km, PureTech, i-Cockpit'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_2008.versiones.find(v => v.id === versionId) || null
}

/**
 * Obtener colores de una versión con data completa
 * @param {string} versionId - ID de la versión
 * @returns {Array} - Array de objetos color
 */
export const getColoresVersion = (versionId) => {
  const version = getVersion(versionId)
  if (!version) return []
  
  return version.coloresPermitidos
    .map(colorKey => COLORES[colorKey])
    .filter(Boolean) // Filtrar colores que no existan
}

/**
 * Obtener imagen para una versión y color
 * @param {string} versionId - ID de la versión
 * @param {string} colorKey - Key del color
 * @returns {Object} - { url, alt, hasImage }
 */
export const getImagenVersionColor = (versionId, colorKey) => {
  const version = getVersion(versionId)
  const color = COLORES[colorKey]
  
  if (!version || !color) {
    return { url: null, alt: '', hasImage: false }
  }
  
  // Por ahora, todos los colores usan la misma estructura de URL
  // En el futuro se puede customizar por versión
  return {
    url: color.url,
    alt: `Peugeot 2008 ${version.nombreCorto} ${color.label}`,
    hasImage: !!color.url
  }
}

export default PEUGEOT_2008

