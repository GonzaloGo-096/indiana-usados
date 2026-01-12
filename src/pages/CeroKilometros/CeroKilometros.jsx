/**
 * CeroKilometros - Página de catálogo 0km
 * 
 * Carrusel horizontal de modelos Peugeot 0km
 * Mobile-first, fondo blanco, hover sombreado
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Carrusel de modelos con Cloudinary
 */

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SEOHead, StructuredData } from '@components/SEO'
import { ModelCard } from '@components/ModelCard'
import { modelos } from '@assets/ceroKm'
import { getAllModelos } from '@data/modelos'
import { SEO_CONFIG } from '@config/seo'
import styles from './CeroKilometros.module.css'

const CeroKilometros = () => {
  // Refs independientes para cada carrusel
  const vehCarouselRef = useRef(null)
  const utilCarouselRef = useRef(null)
  // Estado de scroll para cada carrusel
  const [vehCanScrollLeft, setVehCanScrollLeft] = useState(false)
  const [vehCanScrollRight, setVehCanScrollRight] = useState(true)
  const [utilCanScrollLeft, setUtilCanScrollLeft] = useState(false)
  const [utilCanScrollRight, setUtilCanScrollRight] = useState(true)

  // Separar modelos en dos grupos: Vehículos vs Utilitarios (Partner, Expert, Boxer)
  const utilitariosKeys = useMemo(() => ['partner', 'expert', 'boxer'], [])
  const { vehiculos, utilitarios } = useMemo(() => {
    const lower = (s) => (s || '').toLowerCase()
    const util = modelos.filter(m => utilitariosKeys.includes(lower(m.slug)))
    const veh = modelos.filter(m => !utilitariosKeys.includes(lower(m.slug)))
    return { vehiculos: veh, utilitarios: util }
  }, [utilitariosKeys])


  // Verificar estado de scroll (helper)
  const checkScrollButtons = useCallback((ref, setLeft, setRight) => {
    const carousel = ref.current
    if (!carousel) return

    const { scrollLeft, scrollWidth, clientWidth } = carousel
    setLeft(scrollLeft > 0)
    setRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])


  // Efectos: listeners de scroll/resize por carrusel
  useEffect(() => {
    const carousel = vehCarouselRef.current
    if (!carousel) return

    checkScrollButtons(vehCarouselRef, setVehCanScrollLeft, setVehCanScrollRight)
    const onScroll = () => {
      checkScrollButtons(vehCarouselRef, setVehCanScrollLeft, setVehCanScrollRight)
    }
    const onResize = () => {
      checkScrollButtons(vehCarouselRef, setVehCanScrollLeft, setVehCanScrollRight)
    }
    carousel.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      carousel.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [checkScrollButtons])

  useEffect(() => {
    const carousel = utilCarouselRef.current
    if (!carousel) return

    checkScrollButtons(utilCarouselRef, setUtilCanScrollLeft, setUtilCanScrollRight)
    const onScroll = () => {
      checkScrollButtons(utilCarouselRef, setUtilCanScrollLeft, setUtilCanScrollRight)
    }
    const onResize = () => {
      checkScrollButtons(utilCarouselRef, setUtilCanScrollLeft, setUtilCanScrollRight)
    }
    carousel.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      carousel.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [checkScrollButtons])

  // Scroll del carrusel (2 cards por click)
  const scroll = (ref, direction) => {
    const carousel = ref.current
    if (!carousel) return

    // ~2 cards + gap por click para navegación más rápida
    const scrollAmount = direction === 'left' ? -650 : 650
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  // Structured Data: ItemList de modelos Peugeot
  const allModelos = getAllModelos()
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Gama de Modelos Peugeot 0km',
    description: 'Catálogo completo de modelos Peugeot 0km disponibles en Indiana Peugeot, concesionaria oficial en Tucumán',
    itemListElement: allModelos.map((modelo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${modelo.marca} ${modelo.nombre}`,
        brand: {
          '@type': 'Brand',
          name: modelo.marca
        },
        url: `${SEO_CONFIG.siteUrl}/0km/${modelo.slug}`,
        image: modelo.heroImage?.url || modelo.src
      }
    }))
  }

  return (
    <>
      <SEOHead
        title="Peugeot 0km en Tucumán | Concesionaria Oficial | Indiana Peugeot"
        description="Concesionaria oficial Peugeot en Tucumán. Descubrí la gama completa de Peugeot 0km: 208, 2008, 3008, 5008, Partner, Expert y Boxer. Financiación disponible."
        keywords="Peugeot 0km Tucumán, concesionaria Peugeot Tucumán, autos Peugeot nuevos, Peugeot 208, Peugeot 2008, Peugeot 3008, Peugeot 5008, Peugeot Partner, Peugeot Expert, Peugeot Boxer"
        url="/0km"
        type="website"
      />
      <StructuredData schema={itemListSchema} id="0km-itemlist" />
      
      <div className={styles.page}>
        {/* Header Contextual Editorial */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Catálogo Peugeot 0km
            </h1>
            <p className={styles.subtitle}>
              Concesionaria oficial Peugeot en Tucumán. Gama completa de modelos nuevos con garantía oficial y financiación disponible.
            </p>
          </div>
        </header>

        {/* Sección: Gama Peugeot – Autos */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionLogoWrapper}>
              <div className={styles.sectionLine}></div>
              <img 
                src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
                alt="Logo Peugeot" 
                className={styles.sectionLogo}
                loading="lazy"
              />
              <div className={styles.sectionLine}></div>
            </div>
            <h2 className={styles.sectionTitle}>
              Gama Peugeot – Autos
            </h2>
          </div>
        </div>
        <section className={styles.carouselSection} aria-label="Gama de Vehículos Peugeot 0km">
          <div className={styles.carouselWrapper}>
            {/* Botón izquierdo */}
            <button
              className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
              onClick={() => scroll(vehCarouselRef, 'left')}
              disabled={!vehCanScrollLeft}
              aria-label="Ver modelos anteriores"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Carrusel */}
            <div 
              ref={vehCarouselRef}
              className={styles.carousel}
              role="list"
              aria-label="Carrusel de modelos - vehículos"
            >
              {vehiculos.map((modelo) => (
                <div key={modelo.slug} role="listitem">
                  <ModelCard
                    src={modelo.src}
                    alt={modelo.alt}
                    titulo={modelo.titulo}
                    slug={modelo.slug}
                  />
                </div>
              ))}
            </div>

            {/* Botón derecho */}
            <button
              className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
              onClick={() => scroll(vehCarouselRef, 'right')}
              disabled={!vehCanScrollRight}
              aria-label="Ver más modelos"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </section>

        {/* Sección: Gama Peugeot – Utilitarios */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionLogoWrapper}>
              <div className={styles.sectionLine}></div>
              <img 
                src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
                alt="Logo Peugeot" 
                className={styles.sectionLogo}
                loading="lazy"
              />
              <div className={styles.sectionLine}></div>
            </div>
            <h2 className={styles.sectionTitle}>
              Gama Peugeot – Utilitarios
            </h2>
          </div>
        </div>
        <section className={styles.carouselSection} aria-label="Gama de Utilitarios Peugeot">
          <div className={styles.carouselWrapper}>
            {/* Botón izquierdo */}
            <button
              className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
              onClick={() => scroll(utilCarouselRef, 'left')}
              disabled={!utilCanScrollLeft}
              aria-label="Ver utilitarios anteriores"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Carrusel */}
            <div 
              ref={utilCarouselRef}
              className={styles.carousel}
              role="list"
              aria-label="Carrusel de modelos - utilitarios"
            >
              {utilitarios.map((modelo) => (
                <div key={modelo.slug} role="listitem">
                  <ModelCard
                    src={modelo.src}
                    alt={modelo.alt}
                    titulo={modelo.titulo}
                    slug={modelo.slug}
                  />
                </div>
              ))}
            </div>

            {/* Botón derecho */}
            <button
              className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
              onClick={() => scroll(utilCarouselRef, 'right')}
              disabled={!utilCanScrollRight}
              aria-label="Ver más utilitarios"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </section>

        {/* Bloque Puente hacia Planes */}
        <section className={styles.financingBridge}>
          <div className={styles.financingContent}>
            <h3 className={styles.financingTitle}>Financiación disponible</h3>
            <p className={styles.financingText}>
              Consultá nuestros planes de financiación para modelos Peugeot 0km. Opciones flexibles adaptadas a tu necesidad.
            </p>
            <Link to="/planes" className={styles.financingLink}>
              Ver planes de financiación
            </Link>
          </div>
        </section>

        {/* Cierre Editorial Institucional (antes de contacto) */}
        <section className={styles.editorialClose}>
          <h3 className={styles.editorialSubtitle}>
            Concesionaria oficial Peugeot en Tucumán
          </h3>
          <p className={styles.editorialText}>
            Con <span className={styles.highlightYears}>15 años</span> de experiencia, Indiana Peugeot es tu concesionaria oficial en Tucumán. Gama completa de modelos 0km, garantía oficial Peugeot, servicio postventa certificado y opciones de financiación.
          </p>
        </section>

        {/* CTA Contacto */}
        <section className={styles.ctaSection}>
          <p className={styles.ctaText}>
            ¿Querés más información sobre algún modelo?
          </p>
          <a 
            href="https://wa.me/543816295959?text=Hola!%20Me%20interesa%20conocer%20más%20sobre%20los%20modelos%200km"
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
    </>
  )
}

export default CeroKilometros
