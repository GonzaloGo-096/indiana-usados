/**
 * peugeotExpert.js - Data del modelo Peugeot Expert
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Versión única
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot Expert
 */
export const PEUGEOT_EXPERT = {
  id: 'expert',
  marca: 'Peugeot',
  nombre: 'Expert',
  slug: 'expert',
  año: 2024,
  
  // Imagen principal (la misma de la página principal del carrusel)
  imagenPrincipal: {
    publicId: 'expert-blanca_bpowxc',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766786957/expert-blanca_bpowxc.webp',
    alt: 'Peugeot Expert 0km'
  },
  
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
  
  // Versiones disponibles - Versión única
  versiones: [
    {
      id: 'expert',
      nombre: 'Expert',
      nombreCorto: 'Expert',
      descripcion: 'El furgón mediano con capacidad profesional. Ideal para flotas y trabajos de logística que requieren versatilidad y eficiencia.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      specs: {
        carga: 'Capacidad 1200 kg',
        volumen: '5.3 m³',
        motor: 'HDi 1.6L Diesel',
        caja: 'Manual 6 velocidades',
        puertas: 'Laterales corredizas',
        consumo: '6.5 L/100km'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot Expert 0KM | Furgón Profesional',
    description: 'Descubrí el nuevo Peugeot Expert. Furgón profesional con capacidad de 1200 kg y 5.3 m³.',
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
