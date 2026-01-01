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
import { useParams } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import { getBrandIcon } from '@components/ui/icons'
import { VersionTabs, VersionContent, ModelGallery, FeatureSection, DimensionsSection } from '@components/ceroKm'
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
    cambiarVersion,
    cambiarVersionPorIndice,
    cambiarColor
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

  // Formatear nombre de versión: GT en rojo, siglas en mayúsculas, resto capitalizado
  const renderVersionName = () => {
    const nombre = versionActiva?.nombreCorto || ''
    
    // Formatear una palabra: siglas/códigos en mayúscula, resto capitalizado
    const formatWord = (word) => {
      const upper = word.toUpperCase()
      // Códigos alfanuméricos (T200, AM24, GT) o siglas cortas
      if (word.length <= 2 || /^[A-Z]+\d+$/i.test(word)) {
        return upper
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
    
    // Dividir por espacios, formatear cada palabra
    const palabras = nombre.split(' ')
    
    return (
      <span className={styles.versionName}>
        {palabras.map((palabra, i) => {
          const formatted = formatWord(palabra)
          const upperWord = palabra.toUpperCase()
          
          // Si es GT, ponerlo en rojo
          if (upperWord === 'GT') {
            return (
              <span key={i}>
                {i > 0 && ' '}
                <span className={styles.gtText}>{formatted}</span>
              </span>
            )
          }
          
          return (i > 0 ? ' ' : '') + formatted
        })}
      </span>
    )
  }

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
          <h1 className={styles.title}>
            {BrandIcon && <BrandIcon className={styles.brandIcon} />}
            <span>{modelo.marca}</span>
            <span className={styles.modelName}>{modelo.nombre}</span>
            {renderVersionName()}
          </h1>
        </header>

        {/* Tabs de versiones (visible solo si hay más de una versión) */}
        {versiones.length > 1 && (
          <div className={styles.tabsContainer}>
            <VersionTabs
              versiones={versiones}
              versionActivaId={versionActiva?.id}
              onVersionChange={cambiarVersion}
            />
          </div>
        )}

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

        {/* Secciones de características destacadas (si el modelo las tiene) */}
        {modelo.features && modelo.features.length > 0 && (
          <>
            {modelo.features.map((feature, index) => (
              <FeatureSection
                key={feature.id}
                feature={feature}
                reverse={index % 2 === 1}
                modeloNombre={modelo.nombre}
              />
            ))}
          </>
        )}

        {/* Sección de dimensiones (fija para todos los modelos) */}
        <DimensionsSection />

        {/* Galería de imágenes del modelo (fija, no cambia con versión) */}
        {modelo.galeria && (
          <ModelGallery
            model={`${modelo.marca.toLowerCase()}-${modelo.slug}`}
            images={modelo.galeria}
            title="Galería"
          />
        )}
      </div>
    </>
  )
}

export default CeroKilometroDetalle
