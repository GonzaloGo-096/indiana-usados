/**
 * SEOHead.jsx - Componente para manejo de SEO en páginas
 * 
 * Wrapper alrededor de useSEO para uso declarativo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { useSEO, useVehicleSEO, useVehiclesListSEO } from '@hooks/seo/useSEO'

/**
 * Componente SEOHead básico
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción meta
 * @param {string} props.keywords - Keywords (opcional)
 * @param {string} props.image - Imagen OG (opcional)
 * @param {string} props.url - URL canónica (opcional)
 * @param {string} props.type - Tipo OG (website, product, etc.)
 * @param {boolean} props.noindex - Si debe tener noindex
 */
export const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false
}) => {
  useSEO({ title, description, keywords, image, url, type, noindex })
  return null // Componente sin renderizado visual
}

/**
 * Componente específico para detalle de vehículo
 * 
 * @param {Object} props
 * @param {Object} props.vehicle - Datos del vehículo
 */
export const VehicleSEOHead = ({ vehicle }) => {
  useVehicleSEO(vehicle)
  return null
}

/**
 * Componente específico para listado de vehículos
 * 
 * @param {Object} props
 * @param {number} props.vehicleCount - Cantidad de vehículos
 * @param {boolean} props.noindex - Si debe tener noindex (para filtros/paginaciones)
 */
export const VehiclesListSEOHead = ({ vehicleCount = 0, noindex = false }) => {
  useVehiclesListSEO(vehicleCount, noindex)
  return null
}

export default SEOHead













