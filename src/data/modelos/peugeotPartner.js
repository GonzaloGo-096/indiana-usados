/**
 * peugeotPartner.js - Data del modelo Peugeot Partner
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
 * Configuración del modelo Peugeot Partner
 * 
 * TODO: Actualizar con data real:
 * - Versiones reales del Partner
 * - Colores específicos por versión
 * - Specs de cada versión
 * - Galería de imágenes
 */
export const PEUGEOT_PARTNER = {
  id: 'partner',
  marca: 'Peugeot',
  nombre: 'Partner',
  slug: 'partner',
  año: 2024,
  
  // Galería de imágenes (fija por modelo, no por versión)
  // TODO: Reemplazar con publicIds reales del Partner
  galeria: {
    mobile: [
      { publicId: '2008-galeria-1-mobile_xf79qs', alt: 'Peugeot Partner - Vista exterior' },
      { publicId: '2008-galeria-2-mobile_d8xwmz', alt: 'Peugeot Partner - Espacio de carga' },
      { publicId: '2008-galeria-3-mobile_ykqd6u', alt: 'Peugeot Partner - Detalle frontal' },
      { publicId: '2008-galeria-4-mobile_dqf5zf', alt: 'Peugeot Partner - Vista trasera' }
    ],
    desktop: [
      { publicId: '2008-galeria-1-desktop_cljotq', alt: 'Peugeot Partner - Vista exterior' },
      { publicId: '2008-galeria-2-desktop_gp3ruh', alt: 'Peugeot Partner - Espacio de carga' },
      { publicId: '2008-galeria-3-desktop_dxvyqd', alt: 'Peugeot Partner - Detalle frontal' },
      { publicId: '2008-galeria-4-desktop_c7yoxt', alt: 'Peugeot Partner - Vista trasera' },
      { publicId: '2008-galeria-5-desktop_g0mych', alt: 'Peugeot Partner - Interior cabina' },
      { publicId: '2008-galeria-6-desktop_drukj6', alt: 'Peugeot Partner - Capacidad de carga' }
    ]
  },
  
  // Versiones disponibles
  // TODO: Actualizar con versiones reales del Partner
  versiones: [
    {
      id: 'furgon',
      nombre: 'Furgón 1.6 HDi',
      nombreCorto: 'Furgón',
      descripcion: 'El utilitario compacto ideal para tu negocio. Máxima capacidad de carga en dimensiones urbanas.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro'],
      colorDefault: 'blanco-nacre',
      specs: {
        carga: 'Capacidad 800 kg',
        volumen: '3.3 m³',
        motor: 'HDi 1.6L Diesel',
        caja: 'Manual 5 velocidades',
        puertas: 'Laterales corredizas',
        consumo: '5.8 L/100km'
      }
    },
    {
      id: 'furgon-largo',
      nombre: 'Furgón Largo 1.6 HDi',
      nombreCorto: 'Furgón Largo',
      descripcion: 'Versión de batalla larga con mayor capacidad de carga para trabajos exigentes.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro'],
      colorDefault: 'blanco-nacre',
      specs: {
        carga: 'Capacidad 1000 kg',
        volumen: '4.1 m³',
        motor: 'HDi 1.6L Diesel',
        caja: 'Manual 5 velocidades',
        puertas: 'Laterales corredizas ambos lados',
        consumo: '6.0 L/100km'
      }
    },
    {
      id: 'patagonica',
      nombre: 'Patagónica 1.6 HDi',
      nombreCorto: 'Patagónica',
      descripcion: 'La versión familiar con 5 plazas y amplio espacio de equipaje. Ideal para trabajo y familia.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'gris-selenium',
      specs: {
        plazas: '5 plazas',
        equipaje: 'Amplio baúl',
        motor: 'HDi 1.6L Diesel',
        caja: 'Manual 5 velocidades',
        aire: 'Aire acondicionado',
        consumo: '5.8 L/100km'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot Partner 0KM | Furgón y Patagónica - Versiones',
    description: 'Descubrí el nuevo Peugeot Partner. Utilitario versátil para trabajo y familia. Versiones Furgón, Furgón Largo y Patagónica.',
    keywords: 'Peugeot Partner, furgón, utilitario, 0km, Patagónica'
  }
}

/**
 * Obtener versión por ID
 * @param {string} versionId - ID de la versión
 * @returns {Object|null} - Objeto versión o null
 */
export const getVersion = (versionId) => {
  return PEUGEOT_PARTNER.versiones.find(v => v.id === versionId) || null
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

export default PEUGEOT_PARTNER

