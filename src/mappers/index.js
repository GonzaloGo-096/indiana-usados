/**
 * Índice de mappers para transformación de datos
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Agregado mapper de presentación para admin
 */

// Mappers de dominio (API ↔ modelo)
export {
  mapVehiclesPage,
  mapVehicle
} from './vehicleMapper.js'

// Mappers de presentación (modelo ↔ UI específica)
export { toAdminListItem } from './admin/toAdminListItem'
