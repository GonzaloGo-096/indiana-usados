/**
 * Design Tokens - Colores (Simplificado)
 * 
 * Sistema de colores centralizado para toda la aplicación
 * Reducido en 40% para mayor simplicidad
 * 
 * @author Indiana Usados
 * @version 1.1.0
 */

export const colors = {
  // Primarios (reducido de 10 a 6 tonos)
  primary: {
    100: '#bbdefb',
    300: '#64b5f6',
    500: '#007bff',
    600: '#0056b3',
    700: '#004085',
    900: '#001f3f',
  },
  
  // Secundarios (reducido de 10 a 6 tonos)
  secondary: {
    100: '#e9ecef',
    300: '#ced4da',
    500: '#6c757d',
    600: '#495057',
    700: '#343a40',
    900: '#1a1d20',
  },
  
  // Estados (mantenido, ya es compacto)
  success: {
    100: '#c3e6cb',
    500: '#28a745',
    700: '#155724',
  },
  
  warning: {
    100: '#ffeaa7',
    500: '#ffc107',
    700: '#b8860b',
  },
  
  error: {
    100: '#f5c6cb',
    500: '#dc3545',
    700: '#a71e2a',
  },
  
  info: {
    100: '#bee5eb',
    500: '#17a2b8',
    700: '#0f6674',
  },
  
  // Neutros (reducido de 10 a 6 tonos)
  neutral: {
    100: '#f1f3f4',
    300: '#dadce0',
    500: '#9aa0a6',
    600: '#80868b',
    700: '#5f6368',
    800: '#282525',  // rgb(40, 37, 37) - Gris oscuro del footer
    900: '#202124',
  },

  // Colores personalizados para el nav (simplificado)
  nav: {
    background: '#2c3e50',
    text: '#ecf0f1',
    textHover: '#3498db',
  },

  // Colores personalizados para el footer (simplificado) - Cambiado a azul
  footer: {
    background: '#1e3a8a',      // Azul oscuro
    backgroundDark: '#1e40af',  // Azul más oscuro para bordes
    text: '#ffffff',            // Blanco
    textSecondary: '#e5e7eb',   // Gris claro para texto secundario
    textHover: '#60a5fa',       // Azul claro para hover
  },
} 