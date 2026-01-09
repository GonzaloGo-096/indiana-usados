/**
 * BrandsCarousel - Carrusel de logos de marcas
 * 
 * Muestra las marcas disponibles en un carrusel horizontal
 * con logos seleccionables.
 * 
 * ✅ ACTUALIZADO: Integrado con sistema de filtros
 * - Recibe selectedBrands desde URL (fuente de verdad)
 * - Emite onBrandSelect cuando se selecciona una marca
 * - Estado visual basado en selectedBrands (no estado interno)
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Sin indicadores de navegación
 */

import React, { useRef } from 'react'
import { BRAND_LOGOS } from '@config/brandLogos'
import styles from './BrandsCarousel.module.css'

const BrandsCarouselComponent = ({ selectedBrands = [], onBrandSelect, isFiltersVisible = false }) => {
  // Obtener solo las marcas que tienen logos reales (no el logo genérico)
  // Excluir logos de Indiana y Peugeot vintage del carrusel
  const brands = Object.values(BRAND_LOGOS).filter(
    brand => 
      !brand.src.includes('logo-negro.webp') &&
      !brand.alt.includes('Indiana') &&
      !brand.alt.includes('Peugeot Vintage')
  )

  const scrollContainerRef = useRef(null)

  // ✅ ACTUALIZADO: Obtener nombre de marca desde alt (ej: "Logo Toyota" → "Toyota")
  const getBrandName = (brand) => {
    return brand.alt.replace('Logo ', '')
  }

  // ✅ ACTUALIZADO: Verificar si una marca está seleccionada
  const isBrandSelected = (brandName) => {
    return selectedBrands.includes(brandName)
  }

  // ✅ ACTUALIZADO: Handler que pasa el nombre de la marca (no el objeto brand)
  const handleBrandClick = (brand) => {
    if (onBrandSelect) {
      const brandName = getBrandName(brand)
      onBrandSelect(brandName)
    }
  }

  // ✅ Detectar si hay alguna marca seleccionada (para aplicar estilos globales)
  const hasSelectedBrand = selectedBrands.length > 0

  return (
    <div className={`${styles.carouselContainer} ${hasSelectedBrand ? styles.hasSelection : ''}`}>
      {/* Contenedor de logos con scroll */}
      <div 
        ref={scrollContainerRef}
        className={styles.carouselTrack}
      >
        {brands.map((brand, index) => {
          // Obtener el nombre de la marca desde el alt text
          const brandName = getBrandName(brand)
          const isSelected = isBrandSelected(brandName)
          // Detectar el tamaño del logo desde la configuración
          const isSmallLogo = brand.size === 'small'
          const isLargeLogo = brand.size === 'large'
          const isFord = brandName.toLowerCase() === 'ford'
          return (
            <div 
              key={index} 
              className={`${styles.brandItem} ${isSelected ? styles.brandItemSelected : ''}`}
              onClick={() => handleBrandClick(brand)}
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className={`${styles.brandLogo} ${isSelected ? styles.brandLogoSelected : ''} ${isSmallLogo ? styles.brandLogoSmall : ''} ${isLargeLogo && !isFord ? styles.brandLogoLarge : ''} ${isFord ? styles.brandLogoFord : ''}`}
                loading="lazy"
              />
              {/* ✅ Tilde verde cuando está seleccionado */}
              {isSelected && (
                <div className={styles.checkmark}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#10b981" />
                    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ✅ OPTIMIZADO: Memoizar componente con comparación personalizada (evita re-renders innecesarios)
const BrandsCarousel = React.memo(BrandsCarouselComponent, (prevProps, nextProps) => {
  // Comparar selectedBrands por contenido (no referencia)
  const prevBrands = prevProps.selectedBrands || []
  const nextBrands = nextProps.selectedBrands || []
  
  if (prevBrands.length !== nextBrands.length) return false
  
  // Usar Set para comparación eficiente
  const prevSet = new Set(prevBrands)
  const nextSet = new Set(nextBrands)
  
  if (prevSet.size !== nextSet.size) return false
  
  // Verificar que todos los elementos de prevBrands estén en nextBrands
  for (const brand of prevBrands) {
    if (!nextSet.has(brand)) return false
  }
  
  // Comparar onBrandSelect por referencia (ya está memoizado en el padre)
  if (prevProps.onBrandSelect !== nextProps.onBrandSelect) return false
  
  // Comparar isFiltersVisible (aunque ya no se pasa, por compatibilidad)
  if (prevProps.isFiltersVisible !== nextProps.isFiltersVisible) return false
  
  // Props son iguales, no re-renderizar
  return true
})

BrandsCarousel.displayName = 'BrandsCarousel'

export default BrandsCarousel
