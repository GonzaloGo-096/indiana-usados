// ✅ FUNCIÓN ÚNICA Y SIMPLE para convertir filtros del frontend al backend
import { logger } from '@utils/logger'

export const buildFiltersForBackend = (filters = {}) => {
  const params = new URLSearchParams();
  
  // 🔍 LOG CRÍTICO: Ver qué filtros llegan (solo en desarrollo)
  if (import.meta.env.DEV) {
    logger.debug('filters:build', 'RECIBE', filters);
  }
  
  // 1. FILTROS SIMPLES (arrays → strings)
  if (filters.marca && filters.marca.length > 0) {
    params.set('marca', filters.marca.join(','));
    if (import.meta.env.DEV) {
      logger.debug('filters:build', 'MARCA ENVIADA', filters.marca.join(','));
    }
  }
  
  if (filters.caja && filters.caja.length > 0) {
    params.set('caja', filters.caja.join(','));
    if (import.meta.env.DEV) {
      logger.debug('filters:build', 'CAJA ENVIADA', filters.caja.join(','));
    }
  }
  
  if (filters.combustible && filters.combustible.length > 0) {
    params.set('combustible', filters.combustible.join(','));
    if (import.meta.env.DEV) {
      logger.debug('filters:build', 'COMBUSTIBLE ENVIADO', filters.combustible.join(','));
    }
  }
  
  // 2. RANGOS (arrays → "min,max") - SOLO SI NO SON VALORES POR DEFECTO
  if (filters.año && filters.año.length === 2 && 
      !(filters.año[0] === 1990 && filters.año[1] === 2024)) {
    params.set('anio', `${filters.año[0]},${filters.año[1]}`);
    logger.debug('filters:build', 'AÑO ENVIADO', `${filters.año[0]},${filters.año[1]}`);
  }
  
  if (filters.precio && filters.precio.length === 2 && 
      !(filters.precio[0] === 5000000 && filters.precio[1] === 100000000)) {
    params.set('precio', `${filters.precio[0]},${filters.precio[1]}`);
    logger.debug('filters:build', 'PRECIO ENVIADO', `${filters.precio[0]},${filters.precio[1]}`);
  }
  
  if (filters.kilometraje && filters.kilometraje.length === 2 && 
      !(filters.kilometraje[0] === 0 && filters.kilometraje[1] === 200000)) {
    params.set('km', `${filters.kilometraje[0]},${filters.kilometraje[1]}`);
    logger.debug('filters:build', 'KM ENVIADO', `${filters.kilometraje[0]},${filters.kilometraje[1]}`);
  }
  
  if (import.meta.env.DEV) {
    logger.debug('filters:build', 'PARÁMETROS FINALES', params.toString());
  }
  return params;
};

// ✅ FUNCIÓN SIMPLE para serializar a URL
export const serializeFilters = (filters = {}) => {
  return buildFiltersForBackend(filters);
};

// ✅ FUNCIÓN SIMPLE para parsear desde URL
export const parseFilters = (searchParams) => {
  const filters = {};
  
  // Leer filtros simples
  const marca = searchParams.get('marca');
  if (marca) filters.marca = marca.split(',');
  
  const caja = searchParams.get('caja');
  if (caja) filters.caja = caja.split(',');
  
  const combustible = searchParams.get('combustible');
  if (combustible) filters.combustible = combustible.split(',');
  
  // Leer rangos
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

// ✅ FUNCIÓN SIMPLE para detectar filtros activos
export const hasAnyFilter = (filters = {}) => {
  return Object.values(filters).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  );
};

// ✅ FUNCIÓN SIMPLE para generar clave de filtros
export const filtersKey = (filters = {}) => {
  return JSON.stringify(filters);
};

// ✅ NUEVO: Utilidades de sorting
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

// ✅ NUEVO: Validar opción de sorting
export const isValidSortOption = (sortOption) => {
  const validOptions = ['precio_desc', 'precio_asc', 'km_desc', 'km_asc'];
  return validOptions.includes(sortOption);
};
