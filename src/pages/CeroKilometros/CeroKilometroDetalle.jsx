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
import { SEOHead, StructuredData } from '@components/SEO'
import { getBrandIcon } from '@components/ui/icons'
import { VersionTabs, VersionContent, VersionCarousel, ModelGallery, FeatureSection, DimensionsSection, ScrollParallaxTransition208, ScrollParallaxTransition2008 } from '@components/ceroKm'
import { useModeloSelector } from '@hooks/ceroKm'
import { existeModelo } from '@data/modelos'
import { SEO_CONFIG } from '@config/seo'
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

  // Structured Data: Product para modelo Peugeot 0km
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${modelo.marca} ${modelo.nombre}`,
    brand: {
      '@type': 'Brand',
      name: modelo.marca
    },
    description: modelo.seo.description || `Peugeot ${modelo.nombre} 0km disponible en Indiana Peugeot, concesionaria oficial en Tucumán`,
    image: modelo.heroImage?.url || modelo.src,
    url: `${SEO_CONFIG.siteUrl}/0km/${autoSlug}`,
    category: 'Automotive',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'ARS',
      url: `${SEO_CONFIG.siteUrl}/0km/${autoSlug}`,
      seller: {
        '@type': 'AutomotiveBusiness',
        name: SEO_CONFIG.business.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: SEO_CONFIG.business.address.addressLocality,
          addressRegion: SEO_CONFIG.business.address.addressRegion,
          addressCountry: SEO_CONFIG.business.address.addressCountry
        }
      }
    }
  }

  return (
    <>
      <SEOHead
        title={`${modelo.marca} ${modelo.nombre} 0km en Tucumán | Concesionaria Oficial | Indiana Peugeot`}
        description={modelo.seo.description || `Peugeot ${modelo.nombre} 0km disponible en Indiana Peugeot, concesionaria oficial en Tucumán. Financiación disponible.`}
        keywords={`${modelo.marca} ${modelo.nombre} 0km Tucumán, Peugeot ${modelo.nombre} precio, concesionaria Peugeot ${modelo.nombre}`}
        url={`/0km/${autoSlug}`}
        type="product"
      />
      <StructuredData schema={productSchema} id="0km-product" />
      
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
          <ScrollParallaxTransition208 modelo={modelo.nombre} />
        )}
        {autoSlug === '2008' && (
          <ScrollParallaxTransition2008 modelo={autoSlug} />
        )}

        {/* Sección de dimensiones (solo para utilitarios: Partner, Expert y Boxer) */}
        {(autoSlug === 'partner' || autoSlug === 'expert' || autoSlug === 'boxer') && (
          <DimensionsSection />
        )}

        {/* CTA Contacto - Antes de la galería */}
        <div className={styles.ctaContainer}>
          <section className={styles.ctaSection}>
            <p className={styles.ctaText}>
              ¿Querés más información sobre el {modelo.marca} {modelo.nombre}?
            </p>
            <a 
              href={`https://wa.me/543816295959?text=${encodeURIComponent(`Hola! Me interesa conocer más sobre el ${modelo.marca} ${modelo.nombre} 0km`)}`}
              className={styles.ctaButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg 
                className={styles.whatsappIcon} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Contactanos por WhatsApp</span>
            </a>
          </section>
        </div>

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
