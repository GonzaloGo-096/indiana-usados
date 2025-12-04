/**
 * Postventa - Página de servicios de postventa
 * 
 * Estructura profesional con hero section y service cards
 * Diseño moderno y responsive
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Hero section implementation
 */

import PostventaServiceCard from '@components/PostventaServiceCard'
import { SEOHead } from '@components/SEO'
import styles from './Postventa.module.css'
import imgPostventa from '../../assets/postventa/hero-postventa.webp'

// Datos de los servicios actualizados según referencia
const servicesData = [
  {
    id: 'service',
    title: 'SERVICE',
    description: 'Contamos con técnicos certificados, diagnóstico oficial y mantenimiento por plan, con turnos ágiles y seguimiento.',
    image: 'taller-3-jpeg',
    alt: 'Técnico realizando diagnóstico computarizado en vehículo',
    buttonText: 'Reservá tu turno',
    whatsappMessage: '¡Hola! Quiero reservar un turno para el service de mi vehículo. ¿Cuál es la disponibilidad más cercana?'
  },
  {
    id: 'chapa-pintura',
    title: 'CHAPA Y PINTURA',
    description: 'Ofrecemos reparación integral con cabina presurizada, colorimetría precisa y entrega prolija, apto aseguradoras.',
    image: 'taller-2',
    alt: 'Especialista trabajando en chapa y pintura de vehículo',
    buttonText: 'Cotizá con nosotros',
    whatsappMessage: '¡Hola! Necesito una cotización para trabajo de chapa y pintura. ¿Podrían enviarme información de precios?'
  },
  {
    id: 'repuestos',
    title: 'REPUESTOS',
    description: 'Piezas originales con garantía; stock habitual, pedidos rápidos e instalación profesional.',
    image: 'taller-motor',
    alt: 'Repuestos originales y batería de vehículo',
    buttonText: 'Consultá productos',
    whatsappMessage: '¡Hola! Necesito información sobre repuestos para mi vehículo. ¿Tienen stock disponible?'
  }
]

const Postventa = () => {
  return (
    <>
      <SEOHead
        title="Servicios Postventa"
        description="Servicios postventa profesionales: service, chapa y pintura, repuestos originales. Técnicos certificados y garantía en todos nuestros servicios."
        keywords="service autos usados, mantenimiento vehículos, chapa y pintura autos, repuestos originales"
        url="/postventa"
        type="website"
      />
      <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="postventa-hero-title">
        <div className="container">
          <div className={styles.heroBanner}>
            <img 
              src={imgPostventa}
              alt="Postventa profesional: servicio y mantenimiento de tu vehículo"
              className={styles.heroImage}
              decoding="async"
              loading="lazy"
            />
            <div className={styles.heroContent}>
              <h1 id="postventa-hero-title" className={styles.heroTitle}>POST-VENTA</h1>
              <p className={styles.heroDescription}>
                Elegís tranquilidad. Nosotros nos ocupamos del resto: diagnóstico preciso, 
                mano de obra experta y una experiencia de servicio premium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.servicesContainer}>
          {servicesData.map((service) => (
            <PostventaServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              alt={service.alt}
              buttonText={service.buttonText}
              whatsappMessage={service.whatsappMessage}
            />
          ))}
        </div>
      </section>
      </div>
    </>
  )
}

export default Postventa




