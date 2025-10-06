/**
 * Postventa - Página de servicios de postventa
 * 
 * Estructura y estilos alineados a páginas existentes (e.g., Nosotros)
 * Incluye 3 secciones principales: Service, Chapa y Pintura, Motor
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import { ServiceCard } from '@components/ServiceCard'
import styles from './Postventa.module.css'

// Datos de los servicios
const servicesData = [
  {
    id: 'service',
    title: 'Service',
    subtitle: 'Mantenimiento integral',
    description: 'Realizamos el mantenimiento completo de tu vehículo con repuestos originales y técnicos especializados. Incluye cambio de aceite, filtros, revisión de frenos, suspensión y sistema eléctrico.',
    image: 'taller-3-jpeg',
    alt: 'Taller de service y mantenimiento de vehículos'
  },
  {
    id: 'chapa-pintura',
    title: 'Chapa y Pintura',
    subtitle: 'Restauración estética',
    description: 'Especialistas en chapa y pintura para devolverle el aspecto original a tu vehículo. Trabajamos con materiales de primera calidad y técnicas profesionales para un resultado impecable.',
    image: 'taller-2',
    alt: 'Taller de chapa y pintura automotriz',
    reverse: true
  },
  {
    id: 'motor',
    title: 'Motor',
    subtitle: 'Reparación y diagnóstico',
    description: 'Diagnóstico computarizado y reparación de motores con tecnología de última generación. Nuestros mecánicos especializados garantizan el funcionamiento óptimo de tu vehículo.',
    image: 'taller-motor',
    alt: 'Taller especializado en reparación de motores'
  }
]

const Postventa = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Postventa</h1>
        <h2 className={styles.subtitle}>Servicios especializados</h2>
        <p className={styles.description}>
          Te acompañamos después de la compra con servicios de mantenimiento, 
          reparación y restauración. Nuestro taller cuenta con técnicos especializados 
          y equipamiento de última generación. <strong>¡Reserva tu turno ahora y mantén tu vehículo en perfecto estado!</strong>
        </p>
      </header>

      <section className={styles.services}>
        {servicesData.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            image={service.image}
            alt={service.alt}
            reverse={service.reverse}
          />
        ))}
      </section>
    </div>
  )
}

export default Postventa




