/**
 * Design Tokens - Tipografía (Simplificado)
 * 
 * Sistema de tipografía centralizado para toda la aplicación
 * Reducido en 40% para mayor simplicidad
 * 
 * @author Indiana Usados
 * @version 1.1.0
 */

export const typography = {
  fontFamily: {
    primary: 'Arial, sans-serif',
    secondary: 'Georgia, serif',
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  },
} 