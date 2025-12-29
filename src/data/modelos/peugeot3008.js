/**
 * peugeot3008.js - Data del modelo Peugeot 3008
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Data real del 3008 GT
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot 3008
 */
export const PEUGEOT_3008 = {
  id: '3008',
  marca: 'Peugeot',
  nombre: '3008',
  slug: '3008',
  año: 2024,
  
  // Galería de imágenes (fija por modelo, no por versión)
  // TODO: Reemplazar con publicIds reales del 3008 cuando estén disponibles
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot 3008 - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot 3008 - Interior i-Cockpit' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot 3008 - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot 3008 - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot 3008 - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot 3008 - Interior i-Cockpit' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot 3008 - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot 3008 - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot 3008 - Detalles interiores' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot 3008 - Tecnología a bordo' }
    ]
  },
  
  // Versiones disponibles
  versiones: [
    {
      id: 'gt',
      nombre: 'GT',
      nombreCorto: 'GT',
      descripcion: 'La versión GT es la máxima expresión del nuevo 3008. Cuenta con detalles de diseño únicos y equipamientos exclusivos tanto en el exterior como en el interior, que lo convierte en un verdadero GT.',
      coloresPermitidos: [
        '3008-azul-ingaro',
        '3008-gris-titanium', 
        '3008-azul-obsession',
        '3008-gris-artense',
        '3008-negro-perla'
      ],
      colorDefault: '3008-azul-obsession',
      specs: {
        llantas: 'Aleación diamantadas 19"',
        faros: 'Full LED Matrix',
        motor: 'THP 1.6L Turbo',
        caja: 'Automática 8 velocidades',
        icockpit: 'i-Cockpit 3D',
        airbags: 'Frontales, laterales y cortina'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot 3008 GT 0KM | SUV Premium - Colores y Especificaciones',
    description: 'Descubrí el nuevo Peugeot 3008 GT. SUV premium con i-Cockpit 3D, motor turbo y diseño vanguardista. La máxima expresión del 3008.',
    keywords: 'Peugeot 3008, GT, SUV, 0km, premium, i-Cockpit'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_3008.versiones.find(v => v.id === versionId) || null
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

export default PEUGEOT_3008
