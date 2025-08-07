/**
 * Design Tokens - Breakpoints
 * 
 * Sistema de breakpoints centralizado para toda la aplicación
 * 
 * @author Indiana Usados
 * @version 2.0.0 - UNIFICADO
 */

export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
}

// Breakpoints para uso en CSS (sin 'px' para media queries)
export const breakpointsCSS = {
  xs: '0',
  sm: '576',
  md: '768',
  lg: '992',
  xl: '1200',
  '2xl': '1400',
}

// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
}

// Max-width media queries
export const maxMediaQueries = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  '2xl': `@media (max-width: ${breakpoints['2xl']})`,
} 