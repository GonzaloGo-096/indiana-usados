/**
 * CeroKilometroDetalle - Página de detalle de modelo 0km
 * 
 * Mobile: Carrusel horizontal de versiones
 * Desktop: Tabs + layout de 2 columnas
 * 
 * Usa el hook useModeloSelector para manejar estado.
 * Componentes presentacionales reutilizables.
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Fase 2: Implementación real con data
 */

import React, { useRef, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import { getBrandIcon } from '@components/ui/icons'
import { VersionTabs, VersionContent } from '@components/ceroKm'
import { useModeloSelector } from '@hooks/ceroKm'
import { existeModelo } from '@data/modelos'
import styles from './CeroKilometroDetalle.module.css'

const CeroKilometroDetalle = () => {
  const { autoSlug } = useParams()
  const carouselRef = useRef(null)
  
  // Verificar si el modelo existe
  if (!existeModelo(autoSlug)) {
    return (
      <div className={styles.container}>
        <Link to="/0km" className={styles.backLink}>← Volver al catálogo</Link>
        <h1 className={styles.errorTitle}>Modelo no encontrado</h1>
        <p className={styles.errorText}>El modelo "{autoSlug}" no está disponible.</p>
      </div>
    )
  }
  
  // Hook para manejar estado de versión y color
  const {
    modelo,
    versiones,
    versionActiva,
    colorActivo,
    coloresDisponibles,
    imagenActual,
    indiceVersionActiva,
    totalVersiones,
    puedeIrAnterior,
    puedeIrSiguiente,
    cambiarVersion,
    cambiarVersionPorIndice,
    cambiarColor,
    irAVersionAnterior,
    irAVersionSiguiente
  } = useModeloSelector(autoSlug)

  // Scroll del carrusel mobile al cambiar versión por tabs
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    const slideWidth = carousel.offsetWidth
    carousel.scrollTo({
      left: indiceVersionActiva * slideWidth,
      behavior: 'smooth'
    })
  }, [indiceVersionActiva])

  // Detectar swipe en mobile para cambiar versión
  const handleCarouselScroll = useCallback(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    const slideWidth = carousel.offsetWidth
    const scrollPosition = carousel.scrollLeft
    const newIndex = Math.round(scrollPosition / slideWidth)
    
    if (newIndex !== indiceVersionActiva && newIndex >= 0 && newIndex < totalVersiones) {
      cambiarVersionPorIndice(newIndex)
    }
  }, [indiceVersionActiva, totalVersiones, cambiarVersionPorIndice])

  // Debounce del scroll para evitar múltiples cambios
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    let scrollTimeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleCarouselScroll, 100)
    }
    
    carousel.addEventListener('scroll', handleScroll)
    return () => {
      carousel.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleCarouselScroll])

  if (!modelo) return null

  // Obtener ícono de marca dinámicamente
  const BrandIcon = getBrandIcon(modelo.marca)

  return (
    <>
      <SEOHead
        title={modelo.seo.title}
        description={modelo.seo.description}
        keywords={modelo.seo.keywords}
        url={`/0km/${autoSlug}`}
        type="product"
      />
      
      <div className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <Link to="/0km" className={styles.backLink}>← Volver al catálogo</Link>
          <h1 className={styles.title}>
            {BrandIcon && <BrandIcon className={styles.brandIcon} />}
            <span>{modelo.marca}</span>
            <span className={styles.modelName}>{modelo.nombre}</span>
          </h1>
        </header>

        {/* Tabs de versiones (visible en tablet/desktop) */}
        <div className={styles.tabsContainer}>
          <VersionTabs
            versiones={versiones}
            versionActivaId={versionActiva?.id}
            onVersionChange={cambiarVersion}
          />
        </div>

        {/* Indicador de versión mobile */}
        <div className={styles.mobileIndicator}>
          <span className={styles.indicatorText}>
            {versionActiva?.nombreCorto} ({indiceVersionActiva + 1}/{totalVersiones})
          </span>
          <p className={styles.swipeHint}>Deslizá para ver otras versiones</p>
        </div>

        {/* Contenido Mobile: Carrusel */}
        <div className={styles.mobileContent}>
          <div 
            ref={carouselRef}
            className={styles.carousel}
          >
            {versiones.map((version, index) => {
              const isActive = version.id === versionActiva?.id
              return (
                <div key={version.id} className={styles.carouselSlide}>
                  {/* Solo renderizar contenido completo si es la versión activa o adyacente */}
                  {Math.abs(index - indiceVersionActiva) <= 1 ? (
                    <VersionContent
                      version={isActive ? versionActiva : version}
                      modeloMarca={modelo.marca}
                      modeloNombre={modelo.nombre}
                      colorActivo={isActive ? colorActivo : null}
                      coloresDisponibles={isActive ? coloresDisponibles : []}
                      imagenActual={isActive ? imagenActual : null}
                      onColorChange={cambiarColor}
                      layout="mobile"
                    />
                  ) : (
                    <div className={styles.carouselPlaceholder}>
                      <span>{version.nombreCorto}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Navegación mobile */}
          <div className={styles.mobileNav}>
            <button
              className={styles.navButton}
              onClick={irAVersionAnterior}
              disabled={!puedeIrAnterior}
              aria-label="Versión anterior"
            >
              ←
            </button>
            <div className={styles.dots}>
              {versiones.map((v, i) => (
                <span
                  key={v.id}
                  className={`${styles.dot} ${i === indiceVersionActiva ? styles.dotActive : ''}`}
                />
              ))}
            </div>
            <button
              className={styles.navButton}
              onClick={irAVersionSiguiente}
              disabled={!puedeIrSiguiente}
              aria-label="Versión siguiente"
            >
              →
            </button>
          </div>
        </div>

        {/* Contenido Desktop: Layout 2 columnas */}
        <div className={styles.desktopContent}>
          <VersionContent
            version={versionActiva}
            modeloMarca={modelo.marca}
            modeloNombre={modelo.nombre}
            colorActivo={colorActivo}
            coloresDisponibles={coloresDisponibles}
            imagenActual={imagenActual}
            onColorChange={cambiarColor}
            layout="desktop"
          />
        </div>
      </div>
    </>
  )
}

export default CeroKilometroDetalle
