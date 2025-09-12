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

// Fuentes (referencias para CSS)
export const FONTS = {
  // Barlow Family
  barlow: {
    black: './fuentes/Barlow-Black.ttf',
    blackItalic: './fuentes/Barlow-BlackItalic.ttf',
    bold: './fuentes/Barlow-Bold.ttf',
    boldItalic: './fuentes/Barlow-BoldItalic.ttf',
    extraBold: './fuentes/Barlow-ExtraBold.ttf',
    extraBoldItalic: './fuentes/Barlow-ExtraBoldItalic.ttf',
    extraLight: './fuentes/Barlow-ExtraLight.ttf',
    extraLightItalic: './fuentes/Barlow-ExtraLightItalic.ttf',
    italic: './fuentes/Barlow-Italic.ttf',
    light: './fuentes/Barlow-Light.ttf',
    lightItalic: './fuentes/Barlow-LightItalic.ttf',
    medium: './fuentes/Barlow-Medium.ttf',
    mediumItalic: './fuentes/Barlow-MediumItalic.ttf',
    regular: './fuentes/Barlow-Regular.ttf',
    semiBold: './fuentes/Barlow-SemiBold.ttf',
    semiBoldItalic: './fuentes/Barlow-SemiBoldItalic.ttf',
    thin: './fuentes/Barlow-Thin.ttf',
    thinItalic: './fuentes/Barlow-ThinItalic.ttf'
  },
  
  // Barlow Condensed Family
  barlowCondensed: {
    black: './fuentes/BarlowCondensed-Black.ttf',
    blackItalic: './fuentes/BarlowCondensed-BlackItalic.ttf',
    bold: './fuentes/BarlowCondensed-Bold.ttf',
    boldItalic: './fuentes/BarlowCondensed-BoldItalic.ttf',
    extraBold: './fuentes/BarlowCondensed-ExtraBold.ttf',
    extraBoldItalic: './fuentes/BarlowCondensed-ExtraBoldItalic.ttf',
    extraLight: './fuentes/BarlowCondensed-ExtraLight.ttf',
    extraLightItalic: './fuentes/BarlowCondensed-ExtraLightItalic.ttf',
    italic: './fuentes/BarlowCondensed-Italic.ttf',
    light: './fuentes/BarlowCondensed-Light.ttf',
    lightItalic: './fuentes/BarlowCondensed-LightItalic.ttf',
    medium: './fuentes/BarlowCondensed-Medium.ttf',
    mediumItalic: './fuentes/BarlowCondensed-MediumItalic.ttf',
    regular: './fuentes/BarlowCondensed-Regular.ttf',
    semiBold: './fuentes/BarlowCondensed-SemiBold.ttf',
    semiBoldItalic: './fuentes/BarlowCondensed-SemiBoldItalic.ttf',
    thin: './fuentes/BarlowCondensed-Thin.ttf',
    thinItalic: './fuentes/BarlowCondensed-ThinItalic.ttf'
  },
  
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