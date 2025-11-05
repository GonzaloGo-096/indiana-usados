/**
 * Home - Página principal
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Hero carousel implementation
 */

import { Link } from 'react-router-dom'
import { Button } from '@ui/Button'
import HeroImageCarousel from '@ui/HeroImageCarousel'
import { FeaturedVehicles } from '@vehicles'
import styles from './Home.module.css'
import { heroImages } from '../../assets/home'
import imgPostventa from '../../assets/img-postventa-principal.webp'

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Sección A: Hero */}
      <section className={styles.hero}>
        <div className="container">
          <HeroImageCarousel 
            images={heroImages}
            autoplay={true}
            interval={8000}
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
  )
}

export default Home 