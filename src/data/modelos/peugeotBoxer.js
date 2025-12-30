/**
 * peugeotBoxer.js - Data del modelo Peugeot Boxer
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 4.0.0 - 2 versiones: L2H2 HDI140 y L3H2 HDI140
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot Boxer
 */
export const PEUGEOT_BOXER = {
  id: 'boxer',
  marca: 'Peugeot',
  nombre: 'Boxer',
  slug: 'boxer',
  año: 2024,
  
  // Imagen principal (la misma de la página principal del carrusel)
  imagenPrincipal: {
    publicId: 'boxer-blanca_zsb84z',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766786948/boxer-blanca_zsb84z.webp',
    alt: 'Peugeot Boxer 0km'
  },
  
  // Galería de imágenes (fija por modelo, no por versión)
  // TODO: Reemplazar con publicIds reales del Boxer
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot Boxer - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot Boxer - Espacio de carga' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot Boxer - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot Boxer - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot Boxer - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot Boxer - Espacio de carga' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot Boxer - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot Boxer - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot Boxer - Interior cabina' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot Boxer - Capacidad máxima' }
    ]
  },
  
  // Versiones disponibles - 2 versiones
  versiones: [
    {
      id: 'l2h2-hdi140',
      nombre: 'L2H2 HDI140',
      nombreCorto: 'L2H2 HDI140',
      descripcion: 'Boxer, es el vehículo utilitario de la marca de mayor capacidad, robusto, económico y adaptable a tu negocio. Diseñado y equipado para responder de manera duradera a las exigencias de los profesionales.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      specs: {
        carga: 'Capacidad 1500 kg',
        volumen: '10 m³',
        motor: 'HDi 2.2L 140cv',
        caja: 'Manual 6 velocidades',
        puertas: 'Traseras 180°',
        consumo: '8.5 L/100km'
      }
    },
    {
      id: 'l3h2-hdi140',
      nombre: 'L3H2 HDI140',
      nombreCorto: 'L3H2 HDI140',
      descripcion: 'Boxer, es el vehículo utilitario de la marca de mayor capacidad, robusto, económico y adaptable a tu negocio.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      specs: {
        carga: 'Capacidad 1800 kg',
        volumen: '13 m³',
        motor: 'HDi 2.2L 140cv',
        caja: 'Manual 6 velocidades',
        puertas: 'Laterales corredizas + traseras 180°',
        consumo: '9.0 L/100km'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot Boxer 0KM | L2H2 HDI140 y L3H2 HDI140',
    description: 'Descubrí el nuevo Peugeot Boxer. Vehículo utilitario de mayor capacidad, robusto y económico. Versiones L2H2 HDI140 y L3H2 HDI140.',
    keywords: 'Peugeot Boxer, furgón grande, 0km, utilitario, carga, L2H2, L3H2, HDI140'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_BOXER.versiones.find(v => v.id === versionId) || null
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

export default PEUGEOT_BOXER
