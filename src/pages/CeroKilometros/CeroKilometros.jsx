/**
 * CeroKilometros - Página de catálogo 0km
 * 
 * Carrusel horizontal de modelos Peugeot 0km
 * Mobile-first, fondo blanco, hover sombreado
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Carrusel de modelos con Cloudinary
 */

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import { ModelCard } from '@components/ModelCard'
import { modelos } from '@assets/ceroKm'
import styles from './CeroKilometros.module.css'

const CeroKilometros = () => {
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Verificar estado de scroll
  const checkScrollButtons = useCallback(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const { scrollLeft, scrollWidth, clientWidth } = carousel
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    checkScrollButtons()
    carousel.addEventListener('scroll', checkScrollButtons)
    window.addEventListener('resize', checkScrollButtons)

    return () => {
      carousel.removeEventListener('scroll', checkScrollButtons)
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [checkScrollButtons])

  // Scroll del carrusel (2 cards por click)
  const scroll = (direction) => {
    const carousel = carouselRef.current
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
            <img 
              src="/assets/logos/brands/logo-negro.webp" 
              alt="Logo Peugeot" 
              className={styles.logo}
              width="48"
              height="48"
            />
            Peugeot 0 KM
          </h1>
          <p className={styles.subtitle}>Descubrí toda la gama de modelos</p>
        </header>

        {/* Carrusel de modelos */}
        <section className={styles.carouselSection} aria-label="Modelos Peugeot 0km">
          <div className={styles.carouselWrapper}>
            {/* Botón izquierdo */}
            <button
              className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Ver modelos anteriores"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Carrusel */}
            <div 
              ref={carouselRef}
              className={styles.carousel}
              role="list"
              aria-label="Carrusel de modelos"
            >
              {modelos.map((modelo) => (
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
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Ver más modelos"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Indicador de scroll en mobile */}
          <p className={styles.scrollHint}>
            <span>←</span> Deslizá para ver más modelos <span>→</span>
          </p>
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
