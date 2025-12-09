/**
 * Home - Página principal
 * 
 * Nuevo diseño con Hero principal y CTAs
 * 
 * @author Indiana Usados
 * @version 5.0.0 - Nuevo Hero con CTAs
 */

import { Link } from 'react-router-dom'
import Hero from '@components/Hero'
import { FeaturedVehicles } from '@vehicles'
import { SEOHead } from '@components/SEO'
import styles from './Home.module.css'
import imgPostventa from '../../assets/postventa/hero-postventa.webp'

const Home = () => {
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
        {/* Sección A: Hero principal con CTAs */}
        <Hero />

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