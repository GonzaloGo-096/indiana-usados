/**
 * CardAuto - Componente para mostrar información de un vehículo
 * 
 * Responsabilidades:
 * - Mostrar información del vehículo
 * - Imagen con lazy loading
 * - Botón de ver detalle
 * - Diseño responsivo
 * 
 * @author Indiana Usados
 * @version 5.1.0 - Performance optimizada
 */

import React, { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
    formatPrice, 
    formatKilometraje, 
    formatYear, 
    formatTransmission,
    formatBrandModel
} from '@utils/formatters'
import styles from './CardAuto.module.css'

/**
 * Componente CardAuto optimizado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.auto - Objeto con información del vehículo
 */
export const CardAuto = memo(({ auto }) => {
    // ✅ VALIDAR DATOS DEL VEHÍCULO
    if (!auto || !auto.id) {
        console.warn('⚠️ CardAuto: Datos de vehículo inválidos', auto)
        return null
    }

    // ✅ MEMOIZAR DATOS FORMATEADOS
    const formattedData = useMemo(() => ({
        price: formatPrice(auto.precio),
        kilometers: formatKilometraje(auto.kms),
        year: formatYear(auto.año),
        transmission: formatTransmission(auto.transmisión),
        brandModel: formatBrandModel(auto.marca, auto.modelo)
    }), [auto.precio, auto.kms, auto.año, auto.transmisión, auto.marca, auto.modelo])

    // ✅ MEMOIZAR ALT TEXT
    const altText = useMemo(() => {
        return `${formattedData.brandModel} - ${formattedData.year}`
    }, [formattedData.brandModel, formattedData.year])

    // ✅ OPTIMIZADO: Memoizar URL de navegación
    const vehicleUrl = useMemo(() => `/vehiculo/${auto.id}`, [auto.id])

    return (
        <div className={styles.card}>
            {/* ===== IMAGEN ===== */}
            <div className={styles['card__image-container']}>
                <img 
                    src={auto.imagen || '/src/assets/auto1.jpg'} 
                    alt={altText}
                    className={styles['card__image']}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            {/* ===== CONTENIDO ===== */}
            <div className={styles['card__body']}>
                {/* ===== HEADER 60/40 ===== */}
                <div className={styles.cardHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles['card__title_container']}>
                            <h3 className={styles['card__title']}>
                                {auto.marca}
                            </h3>
                            <h3 className={styles['card__title']}>
                                {auto.modelo}
                            </h3>
                        </div>
                        {auto.version && (
                            <p className={styles['card__version']}>
                                {auto.version}
                            </p>
                        )}
                    </div>
                    
                    <div className={styles.headerRight}>
                        <div className={styles.priceContainer}>
                            <span className={styles['card__price']}>
                                {formattedData.price}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ===== DETALLES - SOLO 3 DATOS ===== */}
                <div className={styles['card__details']}>
                    <div className={styles['card__data_container']}>
                        <div className={styles['card__data_item']}>
                            <span className={styles['card__data_label']}>Año</span>
                            <span className={styles['card__data_value']}>{formattedData.year}</span>
                        </div>
                        
                        <div className={`${styles['card__data_item']} ${styles['card__data_item_border']}`}>
                            <span className={styles['card__data_label']}>Km</span>
                            <span className={styles['card__data_value']}>{formattedData.kilometers}</span>
                        </div>
                        
                        <div className={styles['card__data_item']}>
                            <span className={styles['card__data_label']}>Caja</span>
                            <span className={styles['card__data_value']}>{formattedData.transmission}</span>
                        </div>
                    </div>
                </div>

                {/* ===== BOTÓN VER DETALLE ===== */}
                <div className={styles['card__footer']}>
                    <div className={styles['card__footer_border']}></div>
                    <Link 
                        to={vehicleUrl}
                        className={styles['card__button']}
                    >
                        Ver más
                    </Link>
                </div>
            </div>
        </div>
    )
})

CardAuto.displayName = 'CardAuto'

export default CardAuto 