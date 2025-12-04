/**
 * Assets Index - Centralización de recursos estáticos
 * 
 * Estructura por páginas:
 * - common/     → Logos y recursos compartidos
 * - home/       → Imágenes de página Home
 * - postventa/  → Imágenes de página Postventa
 * - vehicles/   → Fallbacks para vehículos
 * - fonts/      → Fuentes Barlow Condensed
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Reorganización por páginas
 */

// ===== COMMON (Recursos compartidos) =====
import logoNavImg from './common/INDIANA-final.webp'

export const logoNav = logoNavImg
export const indianaNavLogo = logoNavImg // Legacy alias

// ===== VEHICLES (Fallbacks) =====
export { default as defaultCarImage } from './vehicles/fallback-vehicle.jpg'

// ===== HOME (Re-exportar desde subcarpeta) =====
export { heroImage, heroHomeWebp } from './home'

// ===== POSTVENTA (Servicios) =====
export { default as serviceChapa } from './postventa/service-chapa.webp'
export { default as serviceTaller } from './postventa/service-taller.webp'
export { default as serviceRepuestos } from './postventa/service-repuestos.webp'
export { default as heroPostventa } from './postventa/hero-postventa.webp'