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
import { SEOHead } from '@components/SEO'
import { ModelCard } from '@components/ModelCard'
import { modelos } from '@assets/ceroKm'
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

  return (
    <>
      <SEOHead
        title="Peugeot 0KM - Autos Nuevos | Indiana"
        description="Descubrí la gama completa de Peugeot 0km. 208, 2008, 3008, 5008, Partner, Expert y Boxer disponibles con financiación."
        url="/0km"
      />
      
      <div className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            15 Años Trabajando Juntos
          </h1>
          <p className={styles.subtitle}>Indiana y Peugeot - Descubrí toda la gama de modelos 0 KM</p>
          
          {/* Logos: Indiana y Peugeot */}
          <div className={styles.logosContainer}>
            <img 
              src="/assets/logos/logos-indiana/desktop/azul-chico-desktop.webp" 
              alt="Logo Indiana" 
              className={styles.indianaLogo}
              loading="eager"
            />
            <img 
              src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
              alt="Logo Peugeot" 
              className={styles.peugeotLogo}
              loading="eager"
            />
          </div>
        </header>

        {/* Sección: Gama de Vehículos */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionLogoWrapper}>
              <div className={styles.sectionLine}></div>
              <img 
                src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
                alt="Logo Peugeot" 
                className={styles.sectionLogo}
              />
              <div className={styles.sectionLine}></div>
            </div>
            <h2 className={styles.sectionTitle}>
              Gama de Vehículos
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

        {/* Sección: Gama de Utilitarios */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionLogoWrapper}>
              <div className={styles.sectionLine}></div>
              <img 
                src="/assets/logos/logos-peugeot/Peugeot_logo_PNG8.webp" 
                alt="Logo Peugeot" 
                className={styles.sectionLogo}
              />
              <div className={styles.sectionLine}></div>
            </div>
            <h2 className={styles.sectionTitle}>
              Gama de Utilitarios
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

        {/* CTA */}
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
            Contactanos por WhatsApp
          </a>
        </section>

        {/* Back link */}
        <Link to="/" className={styles.backLink}>← Volver al inicio</Link>
      </div>
    </>
  )
}

export default CeroKilometros
