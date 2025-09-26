/**
 * Postventa - Página de servicios de postventa
 * 
 * Estructura y estilos alineados a páginas existentes (e.g., Nosotros)
 */

import styles from './Postventa.module.css'

const Postventa = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Postventa</h1>
      <h2 className={styles.subtitle}>Servicios y atención</h2>
      <p className={styles.description}>
        Te acompañamos después de la compra con asesoramiento, gestoría, garantía
        y soporte. Contactanos para turnos, documentación o consultas sobre tu vehículo.
      </p>
    </div>
  )
}

export default Postventa




