/**
 * Nosotros - Página sobre nosotros
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import styles from './Nosotros.module.css'

const Nosotros = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nosotros</h1>
      <h2 className={styles.subtitle}>Indiana Autos usados</h2>
      <p className={styles.description}>
        Somos una empresa dedicada a la venta de vehículos usados de alta calidad.
        Con años de experiencia en el mercado, ofrecemos garantía y financiamiento
        para que encuentres el auto de tus sueños.
      </p>
    </div>
  )
}

export default Nosotros 