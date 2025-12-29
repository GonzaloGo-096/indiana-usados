/**
 * peugeot208.js - Data del modelo Peugeot 208
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Template inicial (modificar con data real)
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot 208
 * 
 * TODO: Actualizar con data real:
 * - Versiones reales del 208
 * - Colores específicos por versión
 * - Specs de cada versión
 * - Galería de imágenes
 */
export const PEUGEOT_208 = {
  id: '208',
  marca: 'Peugeot',
  nombre: '208',
  slug: '208',
  año: 2024,
  
  // Galería de imágenes (fija por modelo, no por versión)
  // TODO: Reemplazar con publicIds reales del 208
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot 208 - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot 208 - Interior i-Cockpit' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot 208 - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot 208 - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot 208 - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot 208 - Interior i-Cockpit' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot 208 - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot 208 - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot 208 - Detalles interiores' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot 208 - Tecnología a bordo' }
    ]
  },
  
  // Versiones disponibles
  // TODO: Actualizar con versiones reales del 208
  versiones: [
    {
      id: 'active',
      nombre: 'Active T200 AM24',
      nombreCorto: 'Active',
      descripcion: 'Es la versión más accesible de la familia 208, que se destaca por su excelente equilibrio de estética exterior, performance y equipamiento.',
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
      descripcion: 'La versión GT es la máxima expresión del Peugeot 208, con detalles y equipamientos únicos, tecnología de punta y la identidad visual de un verdadero GT.',
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
    title: 'Peugeot 208 0KM | Versiones, Colores y Especificaciones',
    description: 'Descubrí el nuevo Peugeot 208. Diseño moderno, tecnología i-Cockpit y eficiencia. Versiones Active, Allure y GT disponibles.',
    keywords: 'Peugeot 208, hatchback, 0km, i-Cockpit'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_208.versiones.find(v => v.id === versionId) || null
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
    .filter(Boolean)
}

export default PEUGEOT_208

