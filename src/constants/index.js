/**
 * Constants - Exportaciones centralizadas
 * 
 * Agrupa todas las constantes y design tokens de la aplicación
 * para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

// ===== CONSTANTES DE FILTROS =====
export * from './filterOptions'

// ===== DESIGN TOKENS =====
export * from './colors'
export * from './typography'
export * from './spacing'
export * from './shadows'
export * from './breakpoints'

// ===== VARIABLES CSS SIMPLIFICADAS PARA DEBUG =====
export const cssVariables = `
  :root {
    /* ===== COLORES BÁSICOS ===== */
    --color-white: #ffffff;
    --color-black: #000000;
    --color-red: #ff0000;
    --color-blue: #0000ff;
    
    /* ===== ESPACIADO BÁSICO ===== */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-4: 1rem;
    
    /* ===== TIPOGRAFÍA BÁSICA ===== */
    --font-size-base: 1rem;
    --font-weight-normal: 400;
    --font-weight-bold: 700;
  }
` 