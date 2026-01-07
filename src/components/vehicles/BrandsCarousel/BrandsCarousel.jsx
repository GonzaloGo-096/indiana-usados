/**
 * BrandsCarousel - Carrusel de logos de marcas con navegación manual
 * 
 * Muestra las marcas disponibles en un carrusel horizontal
 * con flechas de navegación y logos seleccionables.
 * 
 * ✅ ACTUALIZADO: Integrado con sistema de filtros
 * - Recibe selectedBrands desde URL (fuente de verdad)
 * - Emite onBrandSelect cuando se selecciona una marca
 * - Estado visual basado en selectedBrands (no estado interno)
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Integración con filtros
 */

import React, { useRef, useState, useEffect } from 'react'
import CarouselDots from '@components/ui/CarouselDots/CarouselDots'
import { BRAND_LOGOS } from '@config/brandLogos'
import { ChevronIcon } from '@components/ui/icons'
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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [activePage, setActivePage] = useState(0)

  // Verificar si se puede scrollear
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px de tolerancia

    // Paginación por viewport
    const pages = Math.max(1, Math.ceil(scrollWidth / clientWidth))
    const active = Math.min(pages - 1, Math.max(0, Math.round(scrollLeft / clientWidth)))
    setPageCount(pages)
    setActivePage(active)
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -500,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 500,
        behavior: 'smooth'
      })
    }
  }

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
      {/* Flecha izquierda */}
      {canScrollLeft && (
        <button 
          className={styles.arrowButton}
          onClick={scrollLeft}
          aria-label="Marca anterior"
        >
          <ChevronIcon direction="left" />
        </button>
      )}

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
          return (
            <div 
              key={index} 
              className={`${styles.brandItem} ${isSelected ? styles.brandItemSelected : ''}`}
              onClick={() => handleBrandClick(brand)}
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className={`${styles.brandLogo} ${isSelected ? styles.brandLogoSelected : ''} ${isSmallLogo ? styles.brandLogoSmall : ''} ${isLargeLogo ? styles.brandLogoLarge : ''}`}
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

      <CarouselDots
        count={pageCount}
        activeIndex={activePage}
        variant="autocity"
        onDotClick={(i) => {
          if (!scrollContainerRef.current) return
          const el = scrollContainerRef.current
          el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
        }}
      />

      {/* Flecha derecha */}
      {canScrollRight && (
        <button 
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          onClick={scrollRight}
          aria-label="Marca siguiente"
        >
          <ChevronIcon direction="right" />
        </button>
      )}
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
