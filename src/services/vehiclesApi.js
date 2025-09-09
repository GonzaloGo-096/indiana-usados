import axiosInstance from '../api/axiosInstance';
import { buildFiltersForBackend } from '../utils/filters';

// ✅ FUNCIÓN SIMPLE para obtener vehículos
export const getMainVehicles = async ({ filters = {}, limit = 12, cursor = null, signal } = {}) => {
  const urlParams = buildFiltersForBackend(filters);
  urlParams.set('limit', String(limit));
  
  // 🔍 AGREGAR CURSOR=1 SIEMPRE AL PRINCIPIO
  if (!cursor) cursor = 1;
  urlParams.set('cursor', String(cursor));
  
  // 🔍 LOG CRÍTICO: Ver URL final
  console.log('🔍 URL FINAL:', `/photos/getallphotos?${urlParams.toString()}`);
  
  const { data } = await axiosInstance.get(`/photos/getallphotos?${urlParams.toString()}`, { signal });
  return data;
};

// ✅ EXPORTAR OBJETO para compatibilidad
export const vehiclesApi = {
  getMainVehicles,
  getVehicles: getMainVehicles // Alias para compatibilidad
};
