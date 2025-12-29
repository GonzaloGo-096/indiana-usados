/**
 * peugeotBoxer.js - Data del modelo Peugeot Boxer
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
 * Configuración del modelo Peugeot Boxer
 * 
 * TODO: Actualizar con data real:
 * - Versiones reales del Boxer
 * - Colores específicos por versión
 * - Specs de cada versión
 * - Galería de imágenes
 */
export const PEUGEOT_BOXER = {
  id: 'boxer',
  marca: 'Peugeot',
  nombre: 'Boxer',
  slug: 'boxer',
  año: 2024,
  
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
  
  // Versiones disponibles
  // TODO: Actualizar con versiones reales del Boxer
  versiones: [
    {
      id: 'furgon-330',
      nombre: 'Furgón 330 2.2 HDi',
      nombreCorto: 'Furgón 330',
      descripcion: 'El furgón grande de entrada con excelente relación capacidad-precio para flotas.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro'],
      colorDefault: 'blanco-nacre',
      specs: {
        carga: 'Capacidad 1500 kg',
        volumen: '10 m³',
        motor: 'HDi 2.2L Diesel 140cv',
        caja: 'Manual 6 velocidades',
        puertas: 'Traseras 180°',
        consumo: '8.5 L/100km'
      }
    },
    {
      id: 'furgon-435',
      nombre: 'Furgón 435 2.2 HDi',
      nombreCorto: 'Furgón 435',
      descripcion: 'Versión de batalla larga con altura elevada para máxima capacidad volumétrica.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro'],
      colorDefault: 'blanco-nacre',
      specs: {
        carga: 'Capacidad 1800 kg',
        volumen: '13 m³',
        motor: 'HDi 2.2L Diesel 160cv',
        caja: 'Manual 6 velocidades',
        puertas: 'Laterales corredizas + traseras 180°',
        consumo: '9.0 L/100km'
      }
    },
    {
      id: 'furgon-435-premium',
      nombre: 'Furgón 435 Premium',
      nombreCorto: 'Premium',
      descripcion: 'La versión tope de gama con equipamiento completo, caja automática y máximo confort.',
      coloresPermitidos: ['blanco-nacre', 'gris-artense', 'negro', 'gris-selenium'],
      colorDefault: 'gris-selenium',
      specs: {
        carga: 'Capacidad 1800 kg',
        volumen: '15 m³',
        motor: 'HDi 2.2L Diesel 180cv',
        caja: 'Automática 8 velocidades',
        confort: 'Climatizador + asiento premium',
        seguridad: 'Pack asistencias completo'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Peugeot Boxer 0KM | Furgón Grande - Versiones',
    description: 'Descubrí el nuevo Peugeot Boxer. Furgón grande con capacidad de hasta 1800 kg y 15 m³. Versiones 330, 435 y Premium.',
    keywords: 'Peugeot Boxer, furgón grande, 0km, utilitario, carga'
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

