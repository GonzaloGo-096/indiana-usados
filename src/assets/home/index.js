/**
 * Hero Images - Imágenes para el Hero de Home
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Reorganización por páginas
 */

import heroHomeWebp from './hero-home.webp'

const generateSrcSet = (baseUrl) => {
  const widths = [400, 800, 1280, 1920]
  return widths.map(width => `${baseUrl} ${width}w`).join(', ')
}

export const heroImage = {
  src: heroHomeWebp,
  srcSet: generateSrcSet(heroHomeWebp),
  alt: "Promoción destacada: Vehículo usado de calidad en Indiana Usados",
  sizes: "(max-width: 1200px) 100vw, 1200px"
}

export { heroHomeWebp }
