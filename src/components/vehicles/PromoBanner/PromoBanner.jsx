/**
 * PromoBanner - Banner promocional responsive
 * 
 * Carga solo la imagen correspondiente al viewport usando <picture> nativo.
 * - Mobile: imagen vertical/story optimizada (solo imagen)
 * - Desktop: layout de dos columnas (contenido + imagen cuadrada/feed)
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Layout profesional con dos columnas en desktop
 */

import React from 'react'
import styles from './PromoBanner.module.css'

// URLs de las imágenes
const MOBILE_IMAGE_URL = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1769179977/promo2_q1avdi.webp'
const DESKTOP_IMAGE_URL = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1769179977/promo1_ea7fge.webp'

const PromoBanner = () => {
    return (
        <div className={styles.bannerContainer}>
            {/* ✅ Contenido promocional - Solo visible en desktop */}
            <div className={styles.contentSection}>
                <div className={styles.contentWrapper}>
                    <h2 className={styles.contentTitle}>
                        Ofertas Especiales
                    </h2>
                    <p className={styles.contentDescription}>
                        Descubrí las mejores oportunidades en autos usados. 
                        Calidad garantizada y las mejores condiciones de financiación.
                    </p>
                    <div className={styles.contentBadge}>
                        <span className={styles.badgeText}>Promoción Limitada</span>
                    </div>
                </div>
            </div>

            {/* ✅ Sección de imagen - Responsive con <picture> */}
            <div className={styles.imageSection}>
                <picture className={styles.bannerPicture}>
                    {/* Desktop: imagen cuadrada/feed (768px+) */}
                    <source 
                        media="(min-width: 768px)" 
                        srcSet={DESKTOP_IMAGE_URL}
                        type="image/webp"
                    />
                    {/* Mobile: imagen vertical/story (default) */}
                    <img 
                        src={MOBILE_IMAGE_URL}
                        alt="Promoción especial de autos usados"
                        className={styles.bannerImage}
                        loading="eager"
                        decoding="async"
                    />
                </picture>
            </div>
        </div>
    )
}

export default PromoBanner
