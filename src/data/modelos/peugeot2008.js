/**
 * peugeot2008.js - Data del modelo Peugeot 2008
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Agregada galería de imágenes
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
  
  // Galería de imágenes (fija por modelo, no por versión)
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot 2008 - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot 2008 - Interior i-Cockpit' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot 2008 - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot 2008 - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot 2008 - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot 2008 - Interior i-Cockpit' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot 2008 - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot 2008 - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot 2008 - Detalles interiores' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot 2008 - Tecnología a bordo' }
    ]
  },
  
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
        llantas: 'Aleación diamantadas 17"',
        faros: 'ECO-LED y DRL LED',
        motor: 'T200 de 1.0L',
        caja: 'Automática CVT 7 marchas',
        sensores: 'Estacionamiento traseros',
        airbags: 'Frontales y laterales'
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
        llantas: 'Aleación diamantadas 17"',
        faros: 'ECO-LED y DRL LED',
        motor: 'T200 de 1.0L',
        caja: 'Automática CVT 7 marchas',
        acceso: 'Arranque sin llave',
        airbags: 'Frontales, laterales y cortina'
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
        llantas: 'Aleación diamantadas 17"',
        faros: 'ECO-LED y DRL LED',
        motor: 'T200 de 1.0L',
        caja: 'Automática CVT 7 marchas',
        acceso: 'Arranque sin llave',
        airbags: 'Frontales, laterales y cortina'
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

