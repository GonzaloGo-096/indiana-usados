/**
 * Home - Página principal
 * 
 * Nuevo diseño con Hero principal y CTAs
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Migración a Cloudinary
 */

import { Link } from 'react-router-dom'
import Hero from '@components/Hero'
import { FeaturedVehicles } from '@vehicles'
import { SEOHead, StructuredData } from '@components/SEO'
import { SEO_CONFIG } from '@config/seo'
import styles from './Home.module.css'
import { staticImages } from '@config/cloudinaryStaticImages'

const Home = () => {
  // Structured Data: Organization + LocalBusiness + AutomotiveBusiness
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SEO_CONFIG.siteUrl}/#organization`,
        name: SEO_CONFIG.business.name,
        legalName: SEO_CONFIG.business.legalName,
        url: SEO_CONFIG.siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${SEO_CONFIG.siteUrl}/assets/logos/logos-indiana/desktop/azul-chico-desktop.webp`
        },
        sameAs: [
          // Agregar redes sociales si existen
        ]
      },
      {
        '@type': ['AutomotiveBusiness', 'LocalBusiness'],
        '@id': `${SEO_CONFIG.siteUrl}/#business`,
        name: SEO_CONFIG.business.name,
        image: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
        url: SEO_CONFIG.siteUrl,
        telephone: '+543816295959', // WhatsApp desde código existente
        address: {
          '@type': 'PostalAddress',
          addressCountry: SEO_CONFIG.business.address.addressCountry,
          addressLocality: SEO_CONFIG.business.address.addressLocality,
          addressRegion: SEO_CONFIG.business.address.addressRegion
        },
        priceRange: '$$',
        brand: {
          '@type': 'Brand',
          name: SEO_CONFIG.business.brand
        },
        areaServed: {
          '@type': 'City',
          name: 'Tucumán'
        }
      }
    ]
  }

  return (
    <>
      <SEOHead
        title="Indiana Peugeot – Concesionaria Oficial en Tucumán | 0km y Usados"
        description="Indiana Peugeot es concesionaria oficial Peugeot en Tucumán. Autos 0km Peugeot y amplia selección de vehículos usados multimarca con garantía, financiamiento y servicio postventa profesional."
        keywords="Indiana Peugeot, concesionaria Peugeot Tucumán, autos 0km Peugeot, autos usados Tucumán, concesionaria oficial Peugeot, vehículos usados con garantía"
        url="/"
        type="website"
      />
      <StructuredData schema={structuredData} id="home-structured-data" />
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
                src={staticImages.postventa.hero.src}
                alt={staticImages.postventa.hero.alt}
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