/**
 * Design Tokens - Archivo principal (Simplificado)
 * 
 * Exporta todos los design tokens y genera las variables CSS
 * Reducido en 40% para mayor simplicidad
 * 
 * @author Indiana Usados
 * @version 1.1.0
 */

export { colors } from './colors'
export { typography } from './typography'
export { spacing } from './spacing'
export { shadows } from './shadows'
export { breakpoints } from './breakpoints'

// CSS Custom Properties para compatibilidad (simplificado)
export const cssVariables = `
  :root {
    /* Colores primarios (reducido) */
    --color-primary-50: #e3f2fd;
    --color-primary-100: #bbdefb;
    --color-primary-300: #64b5f6;
    --color-primary-500: #007bff;
    --color-primary-600: #0056b3;
    --color-primary-700: #004085;
    --color-primary-900: #001f3f;
    
    /* Colores secundarios (reducido) */
    --color-secondary-100: #e9ecef;
    --color-secondary-300: #ced4da;
    --color-secondary-500: #6c757d;
    --color-secondary-600: #495057;
    --color-secondary-700: #343a40;
    --color-secondary-900: #1a1d20;
    
    /* Colores de estado (simplificado) */
    --color-success-100: #c3e6cb;
    --color-success-500: #28a745;
    --color-success-700: #155724;
    
    --color-warning-100: #ffeaa7;
    --color-warning-500: #ffc107;
    --color-warning-700: #b8860b;
    
    --color-error-100: #f5c6cb;
    --color-error-500: #dc3545;
    --color-error-700: #a71e2a;
    
    --color-info-100: #bee5eb;
    --color-info-500: #17a2b8;
    --color-info-700: #0f6674;
    
    /* Colores neutros (reducido) */
    --color-white: #ffffff;
    --color-neutral-50: #f8f9fa;
    --color-neutral-100: #f1f3f4;
    --color-neutral-200: #e8eaed;
    --color-neutral-300: #dadce0;
    --color-neutral-400: #bdc1c6;
    --color-neutral-500: #9aa0a6;
    --color-neutral-600: #80868b;
    --color-neutral-700: #5f6368;
    --color-neutral-800: #282525;
    --color-neutral-900: #202124;
    
    /* Colores del nav (simplificado) */
    --color-nav-background: #2c3e50;
    --color-nav-text: #ecf0f1;
    --color-nav-text-hover: #3498db;
    
    
    /* Tipografía (simplificado) */
    --font-family-primary: Arial, sans-serif;
    --font-family-secondary: Georgia, serif;
    
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;
    
    --letter-spacing-tight: -0.025em;
    --letter-spacing-normal: 0em;
    --letter-spacing-wide: 0.025em;
    
    /* Espaciado (reducido) */
    --spacing-0: 0;
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    --spacing-24: 6rem;
    --spacing-32: 8rem;
    --spacing-40: 10rem;
    --spacing-48: 12rem;
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* Sombras (simplificado) */
    --shadow-none: none;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    /* Transiciones */
    --transition-fast: 0.15s ease-in-out;
    --transition-normal: 0.3s ease-in-out;
    --transition-slow: 0.5s ease-in-out;
    
    /* Breakpoints */
    --breakpoint-xs: 0px;
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    --breakpoint-2xl: 1400px;
    
    /* Border radius */
    --border-radius-sm: 0.375rem;
    --border-radius: 0.5rem;
    --border-radius-lg: 0.75rem;
    --border-radius-xl: 1rem;
    --border-radius-2xl: 1.5rem;
    --border-radius-full: 9999px;
    
    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
  }
` 