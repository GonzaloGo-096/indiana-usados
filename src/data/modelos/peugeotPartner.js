/**
 * peugeotPartner.js - Data del modelo Peugeot Partner
 * 
 * Contiene toda la información del modelo: versiones, colores permitidos,
 * specs, descripciones y galería de imágenes.
 * La UI consume esta data sin conocer strings mágicos.
 * 
 * @author Indiana Usados
 * @version 4.0.0 - Contenido actualizado: Partner Confort 1.6 y 1.6 HDI 92
 */

import { COLORES } from './colores'

/**
 * Configuración del modelo Peugeot Partner
 */
export const PEUGEOT_PARTNER = {
  id: 'partner',
  marca: 'Peugeot',
  nombre: 'Partner',
  slug: 'partner',
  año: 2024,
  
  // Imagen principal (la misma de la página principal del carrusel)
  imagenPrincipal: {
    publicId: 'partner_blanca_epe2vd',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766786956/partner_blanca_epe2vd.webp',
    alt: 'Peugeot Partner 0km'
  },
  
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
  
  // Versiones disponibles - Solo 2 versiones
  versiones: [
    {
      id: '1.6',
      nombre: 'PARTNER CONFORT 1.6',
      nombreCorto: 'PARTNER CONFORT 1.6',
      descripcion: 'Partner Confort satisface las todas las necesidades del conductor y de su actividad. Todo está pensado para que el placer de conducir no se altere en ninguna circunstancia.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      specs: {
        carga: 'Capacidad 800 kg',
        volumen: '3.3 m³',
        motor: '1.6L',
        caja: 'Manual 5 velocidades',
        puertas: 'Laterales corredizas',
        consumo: '5.8 L/100km'
      }
    },
    {
      id: '1.6-hdi-92',
      nombre: 'PARTNER CONFORT 1.6 HDI 92',
      nombreCorto: 'PARTNER CONFORT 1.6 HDI 92',
      descripcion: 'Partner Confort satisface las todas las necesidades del conductor y de su actividad. Todo está pensado para que el placer de conducir no se altere en ninguna circunstancia.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      specs: {
        carga: 'Capacidad 800 kg',
        volumen: '3.3 m³',
        motor: 'HDi 1.6L 92cv',
        caja: 'Manual 5 velocidades',
        puertas: 'Laterales corredizas',
        consumo: '5.5 L/100km'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot Partner 0KM | Partner Confort 1.6 y 1.6 HDI 92',
    description: 'Descubrí el nuevo Peugeot Partner Confort. Utilitario versátil para trabajo. Versiones 1.6 y 1.6 HDI 92 disponibles.',
    keywords: 'Peugeot Partner, Partner Confort, furgón, utilitario, 0km, 1.6, HDI 92'
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
