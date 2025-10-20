/**
 * Hero Images - Imágenes para el carrusel del Hero
 * 
 * Centraliza las imágenes del carrusel principal
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Same image repeated for testing
 */

// Imagen principal (repetida para testing del carrusel)
import fotoprincipal1x from './fotoprincipal.jpg'
import fotoprincipal2x from './fotoprincipal@2x.jpg'

// Configuración de imágenes para el carrusel
// TEMPORAL: Repetir la misma imagen hasta tener otras
export const heroImages = [
  {
    src: fotoprincipal1x,
    srcSet: `${fotoprincipal1x} 1x, ${fotoprincipal2x} 2x`,
    alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
    sizes: "(min-width: 768px) 50vw, 100vw"
  },
  {
    src: fotoprincipal1x,
    srcSet: `${fotoprincipal1x} 1x, ${fotoprincipal2x} 2x`,
    alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
    sizes: "(min-width: 768px) 50vw, 100vw"
  },
  {
    src: fotoprincipal1x,
    srcSet: `${fotoprincipal1x} 1x, ${fotoprincipal2x} 2x`,
    alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
    sizes: "(min-width: 768px) 50vw, 100vw"
  }
]

// Export individual para flexibilidad
export { fotoprincipal1x, fotoprincipal2x }
