/**
 * peugeotExpert.js - Data del modelo Peugeot Expert
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
 * Configuración del modelo Peugeot Expert
 * 
 * TODO: Actualizar con data real:
 * - Versiones reales del Expert
 * - Colores específicos por versión
 * - Specs de cada versión
 * - Galería de imágenes
 */
export const PEUGEOT_EXPERT = {
  id: 'expert',
  marca: 'Peugeot',
  nombre: 'Expert',
  slug: 'expert',
  año: 2024,
  
  // Galería de imágenes (fija por modelo, no por versión)
  // TODO: Reemplazar con publicIds reales del Expert
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot Expert - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot Expert - Espacio de carga' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot Expert - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot Expert - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot Expert - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot Expert - Espacio de carga' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot Expert - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot Expert - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot Expert - Interior cabina' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot Expert - Capacidad máxima' }
    ]
  },
  
  // Versiones disponibles
  // TODO: Actualizar con versiones reales del Expert
  versiones: [
    {
      id: 'furgon',
      nombre: 'Furgón 1.6 HDi',
      nombreCorto: 'Furgón',
      descripcion: 'El furgón mediano con capacidad profesional. Ideal para flotas y trabajos de logística.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro'],
      colorDefault: 'blanco-nacre',
      specs: {
        carga: 'Capacidad 1200 kg',
        volumen: '5.3 m³',
        motor: 'HDi 1.6L Diesel',
        caja: 'Manual 6 velocidades',
        puertas: 'Laterales corredizas',
        consumo: '6.5 L/100km'
      }
    },
    {
      id: 'furgon-largo',
      nombre: 'Furgón Largo 2.0 HDi',
      nombreCorto: 'Furgón Largo',
      descripcion: 'Versión de batalla larga con motor 2.0 para máxima capacidad y potencia.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro'],
      colorDefault: 'blanco-nacre',
      specs: {
        carga: 'Capacidad 1400 kg',
        volumen: '6.6 m³',
        motor: 'HDi 2.0L Diesel 150cv',
        caja: 'Automática 8 velocidades',
        puertas: 'Laterales corredizas ambos lados',
        consumo: '7.0 L/100km'
      }
    },
    {
      id: 'premium',
      nombre: 'Premium 2.0 HDi',
      nombreCorto: 'Premium',
      descripcion: 'La versión tope de gama con equipamiento completo y máximo confort para el conductor.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'gris-selenium',
      specs: {
        carga: 'Capacidad 1400 kg',
        volumen: '6.6 m³',
        motor: 'HDi 2.0L Diesel 180cv',
        caja: 'Automática 8 velocidades',
        confort: 'Climatizador bi-zona',
        seguridad: 'Pack asistencias completo'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot Expert 0KM | Furgón Profesional - Versiones',
    description: 'Descubrí el nuevo Peugeot Expert. Furgón profesional con capacidad de hasta 1400 kg. Versiones Furgón, Furgón Largo y Premium.',
    keywords: 'Peugeot Expert, furgón, profesional, 0km, utilitario'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_EXPERT.versiones.find(v => v.id === versionId) || null
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

export default PEUGEOT_EXPERT

