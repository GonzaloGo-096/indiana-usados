/**
 * CardAutoCompactSkeleton - Skeleton con estructura IDÉNTICA a CardAutoCompact
 * 
 * FASE 2: Elimina CLS (Cumulative Layout Shift) replicando exactamente
 * la estructura visual de CardAutoCompact.
 * 
 * Estructura replicada:
 * - Imagen (200px mobile, 240px SM, 260px tablet)
 * - Header 60/40 (título | precio)
 * - 3 datos (año, km, caja)
 * - SIN footer (CardAutoCompact no tiene footer)
 * 
 * Features:
 * - Animación shimmer suave
 * - Soporte prefers-reduced-motion
 * - Dimensiones responsive idénticas a card real
 * 
 * @author Indiana Usados
 * @version 1.0.0 - CLS = 0
 */

import styles from './CardAutoCompactSkeleton.module.css'

export const CardAutoCompactSkeleton = () => {
    return (
        <div className={styles.card} aria-hidden="true" role="presentation">
            {/* ===== IMAGEN (misma altura que card real) ===== */}
            <div className={styles.imageContainer}>
                <div className={styles.image} />
            </div>

            {/* ===== CUERPO (mismo padding que card real) ===== */}
            <div className={styles.body}>
                {/* ===== HEADER 60/40 (misma estructura que card real) ===== */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.title} />
                    </div>
                    
                    <div className={styles.headerRight}>
                        <div className={styles.priceContainer}>
                            <div className={styles.price} />
                        </div>
                    </div>
                </div>

                {/* ===== DETALLES - 3 DATOS (misma estructura que card real) ===== */}
                <div className={styles.details}>
                    <div className={styles.dataContainer}>
                        {/* Dato 1: Año */}
                        <div className={styles.dataItem}>
                            <div className={styles.dataIcon} />
                            <div className={styles.dataLabel} />
                            <div className={styles.dataValue} />
                        </div>
                        
                        {/* Dato 2: Km (con bordes) */}
                        <div className={`${styles.dataItem} ${styles.dataItemBorder}`}>
                            <div className={styles.dataIcon} />
                            <div className={styles.dataLabel} />
                            <div className={styles.dataValue} />
                        </div>
                        
                        {/* Dato 3: Caja */}
                        <div className={styles.dataItem}>
                            <div className={styles.dataIcon} />
                            <div className={styles.dataLabel} />
                            <div className={styles.dataValue} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardAutoCompactSkeleton

