/**
 * CeroKilometroDetalle - Página de detalle de modelo 0km
 * 
 * Mobile: Carrusel horizontal de versiones (VersionCarousel)
 * Desktop: Tabs + layout de 2 columnas
 * 
 * Responsabilidades:
 * - Orquestación de estado de dominio (useModeloSelector)
 * - Decisión de qué renderizar en cada slide
 * - Lógica de negocio y formateo
 * 
 * El carrusel (VersionCarousel) solo controla la navegación, no el contenido.
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Refactor: Separación de responsabilidades (VersionCarousel)
 */

import React from 'react'
import { useParams } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import { getBrandIcon } from '@components/ui/icons'
import { VersionTabs, VersionContent, VersionCarousel, ModelGallery, FeatureSection, DimensionsSection, ScrollParallaxTransition208, ScrollParallaxTransition2008 } from '@components/ceroKm'
import { useModeloSelector } from '@hooks/ceroKm'
import { existeModelo } from '@data/modelos'
import styles from './CeroKilometroDetalle.module.css'

const CeroKilometroDetalle = () => {
  const { autoSlug } = useParams()
  
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
        {/* Hero Image (solo desktop) - Al inicio */}
        {modelo.heroImage && (
          <div className={styles.heroContainer}>
            <div className={styles.heroBadge}>
              NUEVO {modelo.nombre}
            </div>
            <img
              src={modelo.heroImage.url}
              alt={modelo.heroImage.alt}
              className={styles.heroImage}
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        {/* Header - Debajo del hero */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {BrandIcon && <BrandIcon className={styles.brandIcon} />}
            <span>{modelo.marca}</span>
            <span className={styles.modelName}>{modelo.nombre}</span>
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
        <VersionCarousel
          versions={versiones}
          activeIndex={indiceVersionActiva}
          onChangeIndex={cambiarVersionPorIndice}
          ariaLabel={`Versiones del ${modelo.marca} ${modelo.nombre}. Use las flechas para navegar.`}
        >
          {(version, index, isActive) => (
            // El padre decide qué renderizar, el carrusel solo controla la navegación
            isActive ? (
              <VersionContent
                version={version}
                modeloMarca={modelo.marca}
                modeloNombre={modelo.nombre}
                colorActivo={colorActivo}
                coloresDisponibles={coloresDisponibles}
                imagenActual={imagenActual}
                onColorChange={cambiarColor}
                layout="mobile"
              />
            ) : (
              <div className={styles.carouselPlaceholder}>
                <span>{version.nombreCorto}</span>
              </div>
            )
          )}
        </VersionCarousel>

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
            {modelo.features.map((feature, index) => {
              const isLast = index === modelo.features.length - 1
              return (
                <FeatureSection
                  key={feature.id}
                  feature={feature}
                  reverse={index % 2 === 1}
                  modeloNombre={modelo.nombre}
                  isLast={isLast}
                />
              )
            })}
          </>
        )}

        {/* Sección premium de transición parallax (solo para modelos 208 y 2008) */}
        {autoSlug === '208' && (
          <ScrollParallaxTransition208 />
        )}
        {autoSlug === '2008' && (
          <ScrollParallaxTransition2008 />
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
