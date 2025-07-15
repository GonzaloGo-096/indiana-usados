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

// ===== VARIABLES CSS =====
import { colors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'
import { shadows } from './shadows'
import { breakpoints } from './breakpoints'

/**
 * Genera variables CSS basadas en los design tokens
 * @returns {string} Variables CSS como string
 */
export const cssVariables = `
  :root {
    /* ===== COLORES ===== */
    --color-primary-100: ${colors.primary[100]};
    --color-primary-300: ${colors.primary[300]};
    --color-primary-500: ${colors.primary[500]};
    --color-primary-600: ${colors.primary[600]};
    --color-primary-700: ${colors.primary[700]};
    --color-primary-900: ${colors.primary[900]};
    
    --color-secondary-100: ${colors.secondary[100]};
    --color-secondary-300: ${colors.secondary[300]};
    --color-secondary-500: ${colors.secondary[500]};
    --color-secondary-600: ${colors.secondary[600]};
    --color-secondary-700: ${colors.secondary[700]};
    --color-secondary-900: ${colors.secondary[900]};
    
    --color-success-100: ${colors.success[100]};
    --color-success-500: ${colors.success[500]};
    --color-success-700: ${colors.success[700]};
    
    --color-warning-50: ${colors.warning[50]};
    --color-warning-100: ${colors.warning[100]};
    --color-warning-500: ${colors.warning[500]};
    --color-warning-600: ${colors.warning[600]};
    --color-warning-700: ${colors.warning[700]};
    
    --color-error-100: ${colors.error[100]};
    --color-error-500: ${colors.error[500]};
    --color-error-700: ${colors.error[700]};
    
    --color-info-100: ${colors.info[100]};
    --color-info-500: ${colors.info[500]};
    --color-info-700: ${colors.info[700]};
    
    --color-neutral-100: ${colors.neutral[100]};
    --color-neutral-300: ${colors.neutral[300]};
    --color-neutral-500: ${colors.neutral[500]};
    --color-neutral-600: ${colors.neutral[600]};
    --color-neutral-700: ${colors.neutral[700]};
    --color-neutral-800: ${colors.neutral[800]};
    --color-neutral-900: ${colors.neutral[900]};
    
    /* ===== COLORES BASE ===== */
    --color-white: #ffffff;
    --color-black: #000000;
    
    /* ===== NAV ===== */
    --nav-background: ${colors.nav.background};
    --nav-text: ${colors.nav.text};
    --nav-text-hover: ${colors.nav.textHover};
    
    /* ===== FOOTER ===== */
    --footer-background: ${colors.footer.background};
    --footer-background-dark: ${colors.footer.backgroundDark};
    --footer-text: ${colors.footer.text};
    --footer-text-secondary: ${colors.footer.textSecondary};
    --footer-text-hover: ${colors.footer.textHover};
    
    /* ===== TIPOGRAFÍA ===== */
    --font-family-primary: ${typography.fontFamily.primary};
    --font-family-secondary: ${typography.fontFamily.secondary};
    
    --font-size-xs: ${typography.fontSize.xs};
    --font-size-sm: ${typography.fontSize.sm};
    --font-size-base: ${typography.fontSize.base};
    --font-size-lg: ${typography.fontSize.lg};
    --font-size-xl: ${typography.fontSize.xl};
    --font-size-2xl: ${typography.fontSize['2xl']};
    --font-size-3xl: ${typography.fontSize['3xl']};
    
    --font-weight-light: ${typography.fontWeight.light};
    --font-weight-normal: ${typography.fontWeight.normal};
    --font-weight-medium: ${typography.fontWeight.medium};
    --font-weight-semibold: ${typography.fontWeight.semibold};
    --font-weight-bold: ${typography.fontWeight.bold};
    
    --line-height-tight: ${typography.lineHeight.tight};
    --line-height-normal: ${typography.lineHeight.normal};
    --line-height-relaxed: ${typography.lineHeight.relaxed};
    
    /* ===== ESPACIADO ===== */
    --spacing-0: ${spacing[0]};
    --spacing-1: ${spacing[1]};
    --spacing-2: ${spacing[2]};
    --spacing-3: ${spacing[3]};
    --spacing-4: ${spacing[4]};
    --spacing-5: ${spacing[5]};
    --spacing-6: ${spacing[6]};
    --spacing-8: ${spacing[8]};
    --spacing-10: ${spacing[10]};
    --spacing-12: ${spacing[12]};
    --spacing-16: ${spacing[16]};
    --spacing-20: ${spacing[20]};
    --spacing-24: ${spacing[24]};
    --spacing-32: ${spacing[32]};
    --spacing-40: ${spacing[40]};
    --spacing-48: ${spacing[48]};
    
    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --spacing-2xl: ${spacing['2xl']};
    --spacing-3xl: ${spacing['3xl']};
    
    /* ===== BREAKPOINTS ===== */
    --breakpoint-sm: ${breakpoints.sm};
    --breakpoint-md: ${breakpoints.md};
    --breakpoint-lg: ${breakpoints.lg};
    --breakpoint-xl: ${breakpoints.xl};
    --breakpoint-2xl: ${breakpoints['2xl']};
    
    /* ===== SOMBRAS ===== */
    --shadow-sm: ${shadows.sm};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
    --shadow-xl: ${shadows.xl};
  }
` 