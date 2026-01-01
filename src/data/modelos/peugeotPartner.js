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
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-1-mobile_xf79qs.webp', alt: 'Peugeot Partner - Vista exterior' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-2-mobile_d8xwmz.webp', alt: 'Peugeot Partner - Espacio de carga' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-3-mobile_ykqd6u.webp', alt: 'Peugeot Partner - Detalle frontal' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-4-mobile_dqf5zf.webp', alt: 'Peugeot Partner - Vista trasera' }
    ],
    desktop: [
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-1-desktop_cljotq.webp', alt: 'Peugeot Partner - Vista exterior' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-2-desktop_gp3ruh.webp', alt: 'Peugeot Partner - Espacio de carga' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-3-desktop_dxvyqd.webp', alt: 'Peugeot Partner - Detalle frontal' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-4-desktop_c7yoxt.webp', alt: 'Peugeot Partner - Vista trasera' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-5-desktop_g0mych.webp', alt: 'Peugeot Partner - Interior cabina' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-6-desktop_drukj6.webp', alt: 'Peugeot Partner - Capacidad de carga' }
    ]
  },
  
  // Versiones disponibles - Solo 2 versiones
  versiones: [
    {
      id: '1.6',
      nombre: 'CONFORT 1.6',
      nombreCorto: 'CONFORT 1.6',
      descripcion: 'Partner Confort satisface las todas las necesidades del conductor y de su actividad. Todo está pensado para que el placer de conducir no se altere en ninguna circunstancia.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      equipamiento: {
        titulo: '',
        items: [
          'Capacidad de tanque de combustible: 55 Lts',
          'Capacidad de carga: 3 m³ /800 kg',
          'Ganchos para sujeción de carga'
        ]
      },
      specs: null,
      pdf: {
        href: '/pdf/pdf-partner.pdf',
        label: 'Ficha Técnica',
        fileSize: null,
        variant: 'primary',
        size: 'medium'
      }
    },
    {
      id: '1.6-hdi-92',
      nombre: 'CONFORT 1.6 HDI 92',
      nombreCorto: 'CONFORT 1.6 HDI 92',
      descripcion: 'Partner Confort satisface las todas las necesidades del conductor y de su actividad. Todo está pensado para que el placer de conducir no se altere en ninguna circunstancia.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      equipamiento: {
        titulo: '',
        items: [
          'Motorización diésel HDi de 92 CV',
          'Capacidad de tanque de combustible: 55 Lts',
          'Capacidad de carga: 3 m³ /800 kg',
          'Ganchos para sujeción de carga'
        ]
      },
      specs: null,
      pdf: {
        href: '/pdf/pdf-partner.pdf',
        label: 'Ficha Técnica',
        fileSize: null,
        variant: 'primary',
        size: 'medium'
      }
    }
  ],
  
  // Secciones de características destacadas
  features: [
    {
      id: 'seguridad',
      title: 'SEGURIDAD',
      description: 'La protección de los pasajeros se materializa tanto en el diseño como en cada uno de los elementos y sistemas que componen el equipamiento dispuesto en el vehículo. Se buscó en principio equilibrar una dote racional y precisa, incorporando el ABS con REF y el doble airbag de serie en todas las versiones que se suman al equipo predeterminado de luces antiniebla traseras, inmovilizador de motor, barras protectoras de conductor y para la zona de carga y ganchos para sujeción de carga.',
      images: {
        mobile: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767219810/partner-motorizacion1-dk_s7svz6.webp',
        desktop: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767219733/partner-motorizacion1-dk_jhurfj.webp'
      }
    },
    {
      id: 'capacidad-optimizada',
      title: 'CAPACIDAD OPTIMIZADA',
      description: 'La capacidad de carga fue mejorada y permite transportar un total de 800 kg. y un volumen aprovechable de 3.000 lts. Las puertas simétricas traseras son del tipo batiente y permiten un ángulo de apertura de 180º para facilitar el acceso al espacio de carga. La posibilidad de sumar puertas corredizas laterales otorga puntaje extra en funcionalidad.',
      images: {
        mobile: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767219828/partner-seguridad1-dk_uxsh4u.webp',
        desktop: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767219757/partner-seguridad1-dk_nmfdfh.webp'
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
