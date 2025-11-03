/**
 * Hero Images - Imágenes para el carrusel del Hero
 * 
 * Centraliza las imágenes del carrusel principal
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Same image repeated for testing
 */

// Imagen principal en formato WebP (repetida hasta tener variantes)
import fotoprincipalWebp from '../foto-principal.webp'

// Configuración de imágenes para el carrusel
// TEMPORAL: Repetir la misma imagen hasta tener otras
export const heroImages = [
  {
    src: fotoprincipalWebp,
    srcSet: `${fotoprincipalWebp} 1x, ${fotoprincipalWebp} 2x`,
    alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
    sizes: "(min-width: 768px) 50vw, 100vw"
  },
  {
    src: fotoprincipalWebp,
    srcSet: `${fotoprincipalWebp} 1x, ${fotoprincipalWebp} 2x`,
    alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
    sizes: "(min-width: 768px) 50vw, 100vw"
  },
  {
    src: fotoprincipalWebp,
    srcSet: `${fotoprincipalWebp} 1x, ${fotoprincipalWebp} 2x`,
    alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
    sizes: "(min-width: 768px) 50vw, 100vw"
  }
]

// Export individual para flexibilidad
export { fotoprincipalWebp }
