/**
 * Hero Images - Imágenes para el Hero
 * 
 * LCP Phase 1: Imagen única fija (sin carrusel)
 * - srcSet con anchos reales (400w, 800w, 1280w, 1920w)
 * - sizes ajustado al tamaño real del contenedor
 * 
 * @author Indiana Usados
 * @version 2.0.0 - LCP Phase 1: Hero image fija
 */

// Imagen principal en formato WebP
import fotoprincipalWebp from '../foto-principal.webp'

// LCP Phase 1: Generar srcSet con anchos reales
// Nota: En producción, Vite generará URLs con hash para cada variante
// Por ahora usamos la misma imagen, pero el navegador elegirá según el ancho
const generateSrcSet = (baseUrl) => {
  // LCP Phase 1: Usar anchos reales en lugar de densidades
  // En el futuro, generar variantes de tamaño reales
  const widths = [400, 800, 1280, 1920]
  return widths.map(width => `${baseUrl} ${width}w`).join(', ')
}

// LCP Phase 1: Configuración de imagen hero única
export const heroImage = {
  src: fotoprincipalWebp,
  srcSet: generateSrcSet(fotoprincipalWebp),
  alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
  // LCP Phase 1: sizes ajustado al tamaño real del contenedor
  // Mobile: 100vw, Tablet: 80vw, Desktop: min(36vw, 580px)
  sizes: "(max-width: 767px) 100vw, (max-width: 991px) 80vw, min(36vw, 580px)"
}

// Export individual para flexibilidad
export { fotoprincipalWebp }
