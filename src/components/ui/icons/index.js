/**
 * Sistema de Íconos - Indiana Usados
 * 
 * ORGANIZACIÓN:
 * - Dominio (vehículos): Íconos específicos del negocio automotriz
 * - UI General: Íconos de interfaz reutilizables
 * - Contacto/Social: Íconos de redes y comunicación
 * 
 * CONVENCIONES:
 * - Un archivo por ícono: {Nombre}Icon.jsx
 * - Props estándar: size, color, className
 * - Uso de currentColor para herencia CSS
 * - viewBox="0 0 24 24" en todos
 * - aria-hidden="true" para accesibilidad
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Sistema consolidado y escalable
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🚗 DOMINIO - Íconos específicos de vehículos
// ═══════════════════════════════════════════════════════════════════════════

export { CalendarIcon } from './CalendarIcon'
export { RouteIcon } from './RouteIcon'
export { GearboxIcon } from './GearboxIcon'
export { KilometrajeIcon } from './KilometrajeIcon'
export { TransmisionIcon } from './TransmisionIcon'
export { AnioIcon } from './AnioIcon'
export { KmIcon } from './KmIcon'
export { CajaIconDetalle } from './CajaIconDetalle'

// ═══════════════════════════════════════════════════════════════════════════
// 🏷️ MARCAS - Logos de fabricantes
// ═══════════════════════════════════════════════════════════════════════════

export { PeugeotIcon } from './PeugeotIcon'
export { getBrandIcon, hasBrandIcon, BRAND_ICONS } from './brandIcons'

// ═══════════════════════════════════════════════════════════════════════════
// 🎛️ UI GENERAL - Íconos de interfaz reutilizables
// ═══════════════════════════════════════════════════════════════════════════

export { ChevronIcon } from './ChevronIcon'
export { CheckIcon } from './CheckIcon'
export { CloseIcon } from './CloseIcon'
export { FilterIcon } from './FilterIcon'
export { SortIcon } from './SortIcon'
export { ArrowUpIcon } from './ArrowUpIcon'
export { DownloadIcon } from './DownloadIcon'

// ═══════════════════════════════════════════════════════════════════════════
// 📱 CONTACTO / SOCIAL - Íconos de redes y comunicación
// ═══════════════════════════════════════════════════════════════════════════

export { WhatsAppIcon } from './WhatsAppIcon'
export { LocationIcon } from './LocationIcon'
export { PhoneIcon } from './PhoneIcon'
export { InstagramIcon } from './InstagramIcon'

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 COMPATIBILIDAD - Alias para imports legacy (deprecar progresivamente)
// ═══════════════════════════════════════════════════════════════════════════

// Alias para compatibilidad con imports existentes (se pueden deprecar en el futuro)
export { WhatsAppIcon as WhatsAppIconOptimized } from './WhatsAppIcon'
