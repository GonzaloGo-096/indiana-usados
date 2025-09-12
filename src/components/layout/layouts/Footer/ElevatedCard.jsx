/**
 * ElevatedCard - Card 1 elevada sobre el footer
 * 
 * Características:
 * - Solo texto "Indiana Usados"
 * - Angosta y centrada
 * - Elevación visual sobre el footer
 * - Optimizada para performance
 * - Responsive y accesible
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Optimizada sin imagen
 */

import styles from './ElevatedCard.module.css'

const ElevatedCard = () => {

  return (
    <div className={styles.elevatedCardWrapper}>
      <div className={styles.elevatedCard}>
        {/* Contenido con fondo blanco - sin imagen */}
        <div className={styles.cardContent}>
          <div className={styles.placeholderContent}>
            <span className={styles.placeholderText}>Indiana Usados</span>
          </div>
        </div>
        {/* Barra de acento superior */}
        <div className={styles.accentBar} />
      </div>
    </div>
  )
}

export default ElevatedCard
