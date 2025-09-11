/**
 * components/vehicles/index.js - Exportaciones de componentes de vehículos
 * 
 * Organización por dominio:
 * - Card: Tarjetas de vehículos
 * - List: Listas y grids
 * - Detail: Detalles de vehículos
 * - Filters: Filtros específicos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// ===== CARD COMPONENTS =====
export { CardAuto } from './Card/CardAuto/CardAuto'

// ===== LIST COMPONENTS =====
// export { default as VehiclesList } from './List/VehiclesList' // ❌ NO USADO: Solo en tests
export { default as AutosGrid } from './List/ListAutos/AutosGrid'

// ===== DETAIL COMPONENTS =====
export { CardDetalle } from './Detail/CardDetalle/CardDetalle'

// ===== FILTER COMPONENTS =====
// export { default as FilterFormSimplified } from './Filters/filters/FilterFormSimplified' // ❌ REMOVIDO: Se importa dinámicamente en LazyFilterForm 