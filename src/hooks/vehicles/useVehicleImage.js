/**
 * getVehicleImageUrl - Función utilitaria para obtener URL de imagen de un vehículo
 * 
 * @author Indiana Usados  
 * @version 3.0.0 - Simplificado: eliminado hook innecesario, solo función pura
 */

import { extractFirstImageUrl } from '@utils/imageExtractors'

/**
 * Función utilitaria para obtener imagen de vehículo
 * Usa helper centralizado de imageExtractors
 * 
 * @param {Object} vehicle - Objeto del vehículo
 * @returns {string} URL de la imagen o fallback
 * 
 * @example
 * const imageUrl = getVehicleImageUrl(vehicle)
 */
export const getVehicleImageUrl = extractFirstImageUrl
