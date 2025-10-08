/**
 * filters.js - Utilidades para manejo de filtros de vehículos
 * 
 * Convierte filtros entre formato frontend (objetos) y backend (URLSearchParams)
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Limpieza: eliminado código muerto, logging simplificado, DRY con constants
 */

import { logger } from '@utils/logger'
import { FILTER_DEFAULTS } from '@constants'

/**
 * Convierte filtros del frontend a URLSearchParams para el backend
 * Solo incluye parámetros que no sean valores por defecto (optimización)
 * 
 * @param {Object} filters - Objeto de filtros del frontend
 * @param {Array} filters.marca - Array de marcas seleccionadas
 * @param {Array} filters.caja - Array de tipos de caja
 * @param {Array} filters.combustible - Array de tipos de combustible
 * @param {Array} filters.año - [min, max] rango de años
 * @param {Array} filters.precio - [min, max] rango de precios
 * @param {Array} filters.kilometraje - [min, max] rango de kilómetros
 * @returns {URLSearchParams} Parámetros listos para el backend
 */
export const buildFiltersForBackend = (filters = {}) => {
  const params = new URLSearchParams();
  
  // ✅ LOG SIMPLIFICADO: Solo entrada (solo en desarrollo)
  if (import.meta.env.DEV) {
    logger.debug('filters:build', 'Construyendo filtros', { filters });
  }
  
  // ===== FILTROS SIMPLES (arrays → strings con comas) =====
  
  if (filters.marca && filters.marca.length > 0) {
    params.set('marca', filters.marca.join(','));
  }
  
  if (filters.caja && filters.caja.length > 0) {
    params.set('caja', filters.caja.join(','));
  }
  
  if (filters.combustible && filters.combustible.length > 0) {
    params.set('combustible', filters.combustible.join(','));
  }
  
  // ===== RANGOS (arrays → "min,max") =====
  // Solo incluir si NO son valores por defecto (optimización de query params)
  
  if (filters.año && filters.año.length === 2) {
    const [min, max] = filters.año
    const isDefault = min === FILTER_DEFAULTS.AÑO.min && max === FILTER_DEFAULTS.AÑO.max
    if (!isDefault) {
      params.set('anio', `${min},${max}`)
    }
  }
  
  if (filters.precio && filters.precio.length === 2) {
    const [min, max] = filters.precio
    const isDefault = min === FILTER_DEFAULTS.PRECIO.min && max === FILTER_DEFAULTS.PRECIO.max
    if (!isDefault) {
      params.set('precio', `${min},${max}`)
    }
  }
  
  if (filters.kilometraje && filters.kilometraje.length === 2) {
    const [min, max] = filters.kilometraje
    const isDefault = min === FILTER_DEFAULTS.KILOMETRAJE.min && max === FILTER_DEFAULTS.KILOMETRAJE.max
    if (!isDefault) {
      params.set('km', `${min},${max}`)
    }
  }
  
  // ✅ LOG SIMPLIFICADO: Solo salida (solo en desarrollo)
  if (import.meta.env.DEV) {
    logger.debug('filters:build', 'Parámetros generados', { params: params.toString() });
  }
  
  return params;
};

/**
 * Serializa filtros a URLSearchParams (alias de buildFiltersForBackend)
 * @param {Object} filters - Objeto de filtros
 * @returns {URLSearchParams} Parámetros para URL
 */
export const serializeFilters = (filters = {}) => {
  return buildFiltersForBackend(filters);
};

/**
 * Parsea URLSearchParams a objeto de filtros del frontend
 * @param {URLSearchParams} searchParams - Parámetros de URL
 * @returns {Object} Objeto de filtros para el frontend
 */
export const parseFilters = (searchParams) => {
  const filters = {};
  
  // Leer filtros simples (strings → arrays)
  const marca = searchParams.get('marca');
  if (marca) filters.marca = marca.split(',');
  
  const caja = searchParams.get('caja');
  if (caja) filters.caja = caja.split(',');
  
  const combustible = searchParams.get('combustible');
  if (combustible) filters.combustible = combustible.split(',');
  
  // Leer rangos (strings → arrays de números)
  const anio = searchParams.get('anio');
  if (anio) {
    const [min, max] = anio.split(',').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.año = [min, max];
  }
  
  const precio = searchParams.get('precio');
  if (precio) {
    const [min, max] = precio.split(',').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.precio = [min, max];
  }
  
  const km = searchParams.get('km');
  if (km) {
    const [min, max] = km.split(',').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.kilometraje = [min, max];
  }
  
  return filters;
};

/**
 * Detecta si hay algún filtro activo
 * @param {Object} filters - Objeto de filtros
 * @returns {boolean} True si hay al menos un filtro activo
 */
export const hasAnyFilter = (filters = {}) => {
  return Object.values(filters).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  );
};

/**
 * Ordena vehículos según criterio de ordenamiento
 * @param {Array} vehicles - Array de vehículos
 * @param {string} sortOption - Opción de ordenamiento
 * @returns {Array} Array ordenado (nueva copia, no muta original)
 */
export const sortVehicles = (vehicles = [], sortOption) => {
  if (!sortOption || !Array.isArray(vehicles) || vehicles.length === 0) {
    return vehicles;
  }

  return [...vehicles].sort((a, b) => {
    switch (sortOption) {
      case 'precio_desc':
        return (b.precio || 0) - (a.precio || 0);
      case 'precio_asc':
        return (a.precio || 0) - (b.precio || 0);
      case 'km_desc':
        return (b.kilometraje || 0) - (a.kilometraje || 0);
      case 'km_asc':
        return (a.kilometraje || 0) - (b.kilometraje || 0);
      default:
        return 0;
    }
  });
};

/**
 * Valida si una opción de sorting es válida
 * @param {string} sortOption - Opción a validar
 * @returns {boolean} True si es válida
 */
export const isValidSortOption = (sortOption) => {
  const validOptions = ['precio_desc', 'precio_asc', 'km_desc', 'km_asc'];
  return validOptions.includes(sortOption);
};
