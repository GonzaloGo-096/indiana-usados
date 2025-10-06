/**
 * Assets Index - Centralización de recursos estáticos
 * 
 * Centraliza los assets de la aplicación para facilitar
 * imports y mantenimiento
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Imágenes principales
export { default as defaultCarImage } from './auto1.jpg'

// Imágenes de vehículos - Eliminadas (fotos de prueba)

// Logo
export { default as indianaNavLogo } from './indiana-nav-logo.png'

// Iconos - Movidos a componentes optimizados

// Fuentes (referencias para CSS) - Solo Next Sphere (Barlow Condensed ahora está en CSS)
export const FONTS = {
  // Next Sphere Family
  nextSphere: {
    black: './fuentes/Next Sphere Black.otf',
    bold: './fuentes/Next Sphere Bold.otf',
    extraBold: './fuentes/Next Sphere Extra Bold.otf',
    extraLight: './fuentes/Next Sphere Extra Light.otf',
    light: './fuentes/Next Sphere Light.otf',
    medium: './fuentes/Next Sphere Medium.otf',
    regular: './fuentes/Next Sphere Regular.otf',
    semiBold: './fuentes/Next Sphere Semi Bold.otf',
    thin: './fuentes/Next Sphere Thin.otf'
  }
}

// Función para obtener imágenes por defecto (evita el problema de imports dinámicos)
export const getDefaultImages = () => ({
  car: './auto1.jpg',
  vehicle: './auto1.jpg',
  auto: './auto1.jpg'
})

// Función para obtener imágenes del carrusel - Eliminada (fotos de prueba) 