/**
 * Assets Index - Centralización de recursos estáticos
 * 
 * Centraliza todos los assets de la aplicación para facilitar
 * imports y mantenimiento
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Imágenes principales
export { default as defaultCarImage } from './auto1.jpg'

// Imágenes de vehículos
export { default as autoPruebaPrincipal } from './fotos/auto-prueba-principal.webp'
export { default as autoPrueba2 } from './fotos/auto-pueba-2.webp'
export { default as autoPrueba3 } from './fotos/auto-prueba-3.webp'

// Logo
export { default as indianaNavLogo } from './indiana-nav-logo.png'

// Iconos - LIMPIADOS (iconos movidos a componentes optimizados)
// WhatsApp icons - Comentados hasta que se agreguen los archivos
// export { default as whatsapp32 } from './whatsapp-32.svg'
// export { default as whatsapp64 } from './whatsapp-64.svg'

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

// Función para obtener imágenes del carrusel (evita el problema de imports dinámicos)
export const getCarouselImages = () => [
  './fotos/auto-prueba-principal.webp',
  './fotos/auto-pueba-2.webp',
  './fotos/auto-prueba-3.webp'
] 