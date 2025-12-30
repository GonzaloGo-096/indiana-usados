/**
 * peugeot408.js - Data del modelo Peugeot 408
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Nuevo formato con equipamiento
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot 408
 */
export const PEUGEOT_408 = {
  id: '408',
  marca: 'Peugeot',
  nombre: '408',
  slug: '408',
  año: 2024,
  
  // Galería de imágenes (fija por modelo, no por versión)
  galeria: {
    mobile: [
      { publicId: '408-galeria-2-mobile_lddxv4', alt: 'Peugeot 408 - Vista exterior' },
      { publicId: '408-galeria-3-mobile_flepzo', alt: 'Peugeot 408 - Interior i-Cockpit' },
      { publicId: '408-galeria-4-mobile_zhqnov', alt: 'Peugeot 408 - Detalle frontal' },
      { publicId: '408-galeria-5-mobile_srnsqt', alt: 'Peugeot 408 - Vista trasera' }
    ],
    desktop: [
      { publicId: '408-galeria-1-desktop_obmjrm', alt: 'Peugeot 408 - Vista exterior' },
      { publicId: '408-galeria-2-desktop_a1fsgw', alt: 'Peugeot 408 - Interior i-Cockpit' },
      { publicId: '408-galeria-3-desktop_wo7lyj', alt: 'Peugeot 408 - Detalle frontal' },
      { publicId: '408-galeria-4-desktop_eswlmd', alt: 'Peugeot 408 - Vista trasera' },
      { publicId: '408-galeria-5-desktop_jqaay6', alt: 'Peugeot 408 - Detalles interiores' },
      { publicId: '408-galeria-6-desktop_rubyvw', alt: 'Peugeot 408 - Tecnología a bordo' }
    ]
  },
  
  // Versiones disponibles
  versiones: [
    {
      id: 'gt',
      nombre: 'GT',
      nombreCorto: 'GT',
      descripcion: 'La versión GT es la máxima expresión del nuevo 408. Cuenta con detalles de diseño únicos y equipamientos exclusivos tanto en el exterior como en el interior, que lo convierten en un verdadero GT.',
      coloresPermitidos: [
        '408-blanco-okenite',
        '408-azul-obsession',
        '408-negro-perla',
        '408-gris-selenium'
      ],
      colorDefault: '408-gris-selenium',
      equipamiento: {
        titulo: null, // Sin título, solo lista
        items: [
          'Faros Píxel LED',
          'Parrilla frontal color carrocería',
          'Techo bitono en color negro',
          'Techo panorámico corredizo',
          'Asientos de cuero Alcántara con costura GT',
          'Volante GT con levas de cambio',
          'Peugeot i-Cockpit 3D',
          '9+ ADAS'
        ]
      },
      specs: null // Sin specs técnicas
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot 408 GT 0KM | Fastback Premium',
    description: 'Descubrí el nuevo Peugeot 408 GT. Diseño fastback único, i-Cockpit 3D y equipamiento exclusivo. La máxima expresión del 408.',
    keywords: 'Peugeot 408, GT, fastback, 0km, premium, i-Cockpit'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_408.versiones.find(v => v.id === versionId) || null
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

export default PEUGEOT_408

