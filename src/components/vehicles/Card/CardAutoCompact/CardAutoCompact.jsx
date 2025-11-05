/**
 * CardAutoCompact - Versión compacta de CardAuto para preview
 * 
 * Características:
 * - Sin footer (sin botón "Ver más")
 * - Solo una foto (sin hover)
 * - Mantiene identidad visual de CardAuto
 * - Diseño minimalista y elegante
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Versión compacta
 */

import React, { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    formatPrice, 
    formatKilometraje, 
    formatYear, 
    formatCaja,
    formatBrandModel
} from '@utils/formatters'
import styles from './CardAutoCompact.module.css'
import { CalendarIcon, RouteIcon, GearboxIcon } from '@components/ui/icons'
import CloudinaryImage from '@/components/ui/CloudinaryImage/CloudinaryImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@constants/imageSizes'

/**
 * Componente CardAutoCompact - Versión sin footer y sin hover
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.auto - Objeto con información del vehículo
 */
export const CardAutoCompact = memo(({ auto }) => {
    const navigate = useNavigate()
    
    // ✅ VALIDAR DATOS DEL VEHÍCULO
    if (!auto || (!auto.id && !auto._id)) {
        return null
    }

    // Normalizar ID para compatibilidad
    const vehicleId = auto.id || auto._id

    // ✅ MEMOIZAR DATOS FORMATEADOS
    const formattedData = useMemo(() => ({
        price: formatPrice(auto.precio),
        kilometers: formatKilometraje(auto.kilometraje || auto.kms),
        year: formatYear(auto.anio || auto.año),
        caja: formatCaja(auto.caja),
        brandModel: formatBrandModel(auto.marca, auto.modelo)
    }), [auto.precio, auto.kilometraje, auto.kms, auto.anio, auto.año, auto.caja, auto.marca, auto.modelo])

    // ✅ MEMOIZAR ALT TEXT
    const altText = useMemo(() => {
        return `${formattedData.brandModel} - ${formattedData.year}`
    }, [formattedData.brandModel, formattedData.year])

    // ✅ HANDLER PARA CLICK EN CARD (navega al detalle)
    const handleCardClick = () => {
        if (!vehicleId) return
        navigate(`/vehiculo/${vehicleId}`)
    }

    return (
        <div 
            className={styles.card} 
            data-testid="vehicle-card-compact"
            data-vehicle-id={vehicleId}
            onClick={handleCardClick}
        >
            {/* ===== IMAGEN SIMPLE (SIN HOVER) ===== */}
            <div className={styles['card__image-container']}>
                <CloudinaryImage
                    image={auto?.fotoPrincipal || auto?.imagen || '/auto1.jpg'}
                    alt={altText}
                    variant="fluid"
                    widths={IMAGE_WIDTHS.card}
                    sizes={IMAGE_SIZES.card}
                    loading="lazy"
                    fetchpriority="low"
                    qualityMode="eco"
                    className={`${styles['card__image']} ${styles['card__image_primary']}`}
                />
            </div>

            {/* ===== CONTENIDO ===== */}
            <div className={styles['card__body']}>
                {/* ===== HEADER 60/40 ===== */}
                <div className={styles.cardHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles['card__title_container']}>
                            <h3 className={styles['card__title']}>
                                {auto.marca} {auto.modelo}
                            </h3>
                        </div>
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
                            <div className={styles['card__data_icon']}>
                                <CalendarIcon size={16} color="currentColor" />
                            </div>
                            <span className={styles['card__data_label']}>Año</span>
                            <span className={styles['card__data_value']}>{formattedData.year}</span>
                        </div>
                        
                        <div className={`${styles['card__data_item']} ${styles['card__data_item_border']}`}>
                            <div className={styles['card__data_icon']}>
                                <RouteIcon size={16} color="currentColor" />
                            </div>
                            <span className={styles['card__data_label']}>Km</span>
                            <span className={styles['card__data_value']}>{formattedData.kilometers}</span>
                        </div>
                        
                        <div className={styles['card__data_item']}>
                            <div className={styles['card__data_icon']}>
                                <GearboxIcon size={16} color="currentColor" />
                            </div>
                            <span className={styles['card__data_label']}>Caja</span>
                            <span className={styles['card__data_value']}>{formattedData.caja}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

CardAutoCompact.displayName = 'CardAutoCompact'

export default CardAutoCompact

