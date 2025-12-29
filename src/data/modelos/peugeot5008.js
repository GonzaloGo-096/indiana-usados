/**
 * peugeot5008.js - Data del modelo Peugeot 5008
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
 * Configuración del modelo Peugeot 5008
 * 
 * TODO: Actualizar con data real:
 * - Versiones reales del 5008
 * - Colores específicos por versión
 * - Specs de cada versión
 * - Galería de imágenes
 */
export const PEUGEOT_5008 = {
  id: '5008',
  marca: 'Peugeot',
  nombre: '5008',
  slug: '5008',
  año: 2024,
  
  // Galería de imágenes (fija por modelo, no por versión)
  // TODO: Reemplazar con publicIds reales del 5008
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot 5008 - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot 5008 - Interior 7 plazas' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot 5008 - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot 5008 - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot 5008 - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot 5008 - Interior 7 plazas' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot 5008 - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot 5008 - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot 5008 - Tercera fila de asientos' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot 5008 - Tecnología a bordo' }
    ]
  },
  
  // Versiones disponibles
  // TODO: Actualizar con versiones reales del 5008
  versiones: [
    {
      id: 'allure',
      nombre: 'Allure THP AM24',
      nombreCorto: 'Allure',
      descripcion: 'El SUV familiar de 7 plazas con el mejor equilibrio entre espacio, confort y equipamiento tecnológico.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'blanco-nacre',
      specs: {
        llantas: 'Aleación diamantadas 18"',
        faros: 'Full LED',
        motor: 'THP 1.6L Turbo',
        caja: 'Automática 6 velocidades',
        plazas: '7 plazas modulares',
        airbags: 'Frontales, laterales y cortina'
      }
    },
    {
      id: 'allure-pack',
      nombre: 'Allure Pack THP AM24',
      nombreCorto: 'Allure Pack',
      descripcion: 'La versión Allure Pack suma equipamiento premium de confort y asistencias a la conducción.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'gris-selenium',
      specs: {
        llantas: 'Aleación diamantadas 18"',
        faros: 'Full LED con función cornering',
        motor: 'THP 1.6L Turbo',
        caja: 'Automática 6 velocidades',
        plazas: '7 plazas modulares',
        airbags: 'Frontales, laterales y cortina'
      }
    },
    {
      id: 'gt',
      nombre: 'GT THP AM24',
      nombreCorto: 'GT',
      descripcion: 'La máxima expresión del 5008 con equipamiento full, techo panorámico y la identidad deportiva GT.',
      coloresPermitidos: ['negro', 'gris-selenium', 'blanco-nacre'],
      colorDefault: 'negro',
      specs: {
        llantas: 'Aleación diamantadas 19"',
        faros: 'Full LED Matrix',
        motor: 'THP 1.6L Turbo',
        caja: 'Automática 8 velocidades',
        plazas: '7 plazas modulares',
        airbags: 'Frontales, laterales y cortina'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot 5008 0KM | SUV 7 Plazas - Versiones y Colores',
    description: 'Descubrí el nuevo Peugeot 5008. SUV familiar de 7 plazas con i-Cockpit y máximo confort. Versiones Allure, Allure Pack y GT.',
    keywords: 'Peugeot 5008, SUV, 7 plazas, 0km, familiar'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_5008.versiones.find(v => v.id === versionId) || null
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

export default PEUGEOT_5008

