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
  
  // Hero image (solo desktop)
  heroImage: {
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767294210/portada-expert-dk_j5a2cp.avif',
    alt: 'Peugeot Expert'
  },
  
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
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-1-mobile_xf79qs.webp', alt: 'Peugeot Expert - Vista exterior' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-2-mobile_d8xwmz.webp', alt: 'Peugeot Expert - Espacio de carga' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-3-mobile_ykqd6u.webp', alt: 'Peugeot Expert - Detalle frontal' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-4-mobile_dqf5zf.webp', alt: 'Peugeot Expert - Vista trasera' }
    ],
    desktop: [
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-1-desktop_cljotq.webp', alt: 'Peugeot Expert - Vista exterior' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-2-desktop_gp3ruh.webp', alt: 'Peugeot Expert - Espacio de carga' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-3-desktop_dxvyqd.webp', alt: 'Peugeot Expert - Detalle frontal' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-4-desktop_c7yoxt.webp', alt: 'Peugeot Expert - Vista trasera' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-5-desktop_g0mych.webp', alt: 'Peugeot Expert - Interior cabina' },
      { url: 'https://res.cloudinary.com/drbeomhcu/image/upload/2008-galeria-6-desktop_drukj6.webp', alt: 'Peugeot Expert - Capacidad máxima' }
    ]
  },
  
  // Versiones disponibles
  versiones: [
    {
      id: 'l3-hdi-120-mixto',
      nombre: 'L3 HDI 120 - Mixto',
      nombreCorto: 'L3 HDI 120 - Mixto',
      descripcion: 'Ingresa al mundo utilitario con Expert, con un gran nivel de equipamiento.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      equipamiento: {
        titulo: '',
        items: [
          'Motorización 2.2L HDI de 150cv',
          'Capacidad de carga 4 m³/1285Kg',
          '3 plazas para pasajeros en fila 2',
          'Cristales en fila 2',
          'Pantalla Multimedia 5 pulgadas',
          'Doble Airbag'
        ]
      },
      specs: null,
      pdf: {
        href: '/pdf/pdf-expert.pdf',
        label: 'Ficha Técnica',
        fileSize: null,
        variant: 'primary',
        size: 'medium'
      }
    },
    {
      id: 'l3-hdi-120-carga',
      nombre: 'L3 HDI 120 - Carga',
      nombreCorto: 'L3 HDI 120 - Carga',
      descripcion: 'Ingresa al mundo utilitario con Expert, con un gran nivel de equipamiento.',
      coloresPermitidos: [], // Sin colores
      colorDefault: null,
      equipamiento: {
        titulo: '',
        items: [
          'Capacidad de carga de 6,1 m³/1450Kg',
          '3 plazas delanteras',
          'Pantalla Multimedia 5 pulgadas',
          'Doble Airbag',
          'Dirección asistida Eléctrica',
          'Motorización 1.5L HDI de 120cv'
        ]
      },
      specs: null,
      pdf: {
        href: '/pdf/pdf-expert.pdf',
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
      id: 'mayor-eficiencia',
      title: 'MAYOR EFICIENCIA',
      description: 'Una arquitectura de última generación que conjuga un tamaño ideal y se adapta a todas las necesidades con una capacidad de carga.',
      images: {
        mobile: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767290234/confort3dk_am1dqv.webp',
        desktop: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767289203/confort3dk_rbmyii.webp'
      }
    },
    {
      id: 'con-nuevas-exigencias',
      title: 'CON NUEVAS EXIGENCIAS',
      description: 'El rediseño de Peugeot Expert lo convirtió en el integrante  más moderno de la gama de vehículos utilitarios, definiendo la nueva medida de trabajo para los profesionales actuales. Además de un restyling exterior, para adecuarla a la nueva imagen de la marca, se mejoró la eficiencia, la seguridad y modularidad.',
      images: {
        mobile: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767290248/confort1dk_mieky2.webp',
        desktop: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767289212/confort1dk_oruvxc.webp'
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
