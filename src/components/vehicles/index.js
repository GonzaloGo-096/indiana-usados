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
export { CardAutoCompact } from './Card/CardAutoCompact/CardAutoCompact'

// ===== LIST COMPONENTS =====
export { default as AutosGrid } from './List/ListAutos/AutosGrid'

// ===== DETAIL COMPONENTS =====
export { CardDetalle } from './Detail/CardDetalle/CardDetalle'

// ===== FEATURED COMPONENTS =====
export { default as FeaturedVehicles } from './FeaturedVehicles'

// ===== BRANDS CAROUSEL =====
export { default as BrandsCarousel } from './BrandsCarousel/BrandsCarousel' 