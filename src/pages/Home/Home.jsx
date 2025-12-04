/**
 * Home - Página principal
 * 
 * LCP Phase 1: Hero image fija (sin carrusel)
 * Hero Image: Tamaños ajustados para igualar Postventa
 * 
 * @author Indiana Usados
 * @version 4.0.0 - LCP Phase 1: Hero image optimizada
 * @version 4.1.0 - FCP/LCP Phase 3: Runtime diagnostics agregado
 * @version 4.2.0 - Hero image redimensionada (tamaños = Postventa)
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@ui/Button'
import HeroImage from '@ui/HeroImage' // LCP Phase 1: Nuevo componente simple
import { FeaturedVehicles } from '@vehicles'
import { SEOHead } from '@components/SEO'
import styles from './Home.module.css'
import { heroImage } from '../../assets/home' // LCP Phase 1: Objeto único, no array
import imgPostventa from '../../assets/postventa/hero-postventa.webp'

// FCP/LCP Phase 3: Runtime diagnostics - Iniciar medición cuando el módulo se carga
// Esto captura el momento en que React empieza a procesar el componente
if (typeof window !== 'undefined') {
  if (!window.__ReactRenderTimerStarted) {
    window.__ReactRenderTimerStarted = true
    console.time('React render')
  }
}

const Home = () => {
  // FCP/LCP Phase 3: Runtime diagnostics - Finalizar medición cuando Home está montado
  useEffect(() => {
    console.timeEnd('React render')
    // Limpiar flag para permitir mediciones futuras si es necesario
    if (typeof window !== 'undefined') {
      window.__ReactRenderTimerStarted = false
    }
  }, [])

  return (
    <>
      <SEOHead
        title="Indiana Usados - Autos Usados con Garantía en Argentina"
        description="Indiana Usados es una concesionaria de autos usados en Argentina. Amplia selección de vehículos usados con garantía, financiamiento y servicio postventa profesional."
        keywords="autos usados, concesionaria, vehículos usados, autos usados Argentina, comprar auto usado, garantía autos usados"
        url="/"
        type="website"
      />
      <div className={styles.home}>
      {/* Sección A: Hero - LCP Phase 1: Imagen fija optimizada */}
      <section className={styles.hero}>
        <div className="container">
          <HeroImage 
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes={heroImage.sizes}
            alt={heroImage.alt}
            className={styles.heroImageContainer}
          />
        </div>
      </section>

      {/* Sección B: Featured Vehicles */}
      <section className={styles.features}>
        <FeaturedVehicles />
      </section>

      {/* Sección C: Banner Postventa */}
      <section className={styles.postventa} aria-labelledby="home-postventa-title">
        <div className="container">
          <div className={styles.postventaBanner}>
            <img 
              src={imgPostventa}
              alt="Post-venta profesional: servicio y mantenimiento de tu vehículo"
              className={styles.postventaImage}
              decoding="async"
              loading="lazy"
            />
            <div className={styles.postventaContent}>
              <div className={styles.postventaCtaGroup}>
                <h2 id="home-postventa-title" className={styles.postventaTitle}>POST-VENTA</h2>
                <Link to="/postventa" className={styles.postventaButton} aria-label="Conocé más sobre Post-venta">
                  Conocé más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

export default Home 