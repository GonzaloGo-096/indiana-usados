/**
 * CardDetalle - Componente para mostrar información detallada de un vehículo
 * 
 * Características:
 * - Header 60/40 como CardAuto
 * - Datos principales con clave arriba, valor abajo
 * - Información adicional con mismo estilo
 * - Botones con fondo gris claro e iconos coloridos
 * 
 * @author Indiana Usados
 * @version 4.0.0 - Optimizado y limpio
 */

import React, { memo, useMemo, useCallback } from 'react'
import { GmailIconOptimized, WhatsAppIconOptimized } from '@ui/icons'
import { formatValue } from '@utils/imageUtils'
import { useCarouselImages } from '@hooks/useImageOptimization'
import { ImageCarousel } from '@ui/ImageCarousel'
import styles from './CardDetalle.module.css'

/**
 * Componente CardDetalle basado en CardAuto
 */
export const CardDetalle = memo(({ auto, contactInfo }) => {
    // Hooks
    const carouselImages = useCarouselImages(auto)
    
    // Memoización de datos del vehículo
    const vehicleData = useMemo(() => {
        if (!auto) return null
        
        return {
            marca: auto.marca || '',
            modelo: auto.modelo || '',
            version: auto.version || '',
            cilindrada: auto.cilindrada || '',
            precio: auto.precio || '',
            año: auto.año || '',
            kms: auto.kms || '',
            caja: auto.caja || auto.transmisión || '',
            color: auto.color || '',
            categoria: auto.categoria || '',
            combustible: auto.combustible || '',
            traccion: auto.tracción || '',
            tapizado: auto.tapizado || '',
            categoriaVehiculo: auto.categoriaVehiculo || '',
            frenos: auto.frenos || '',
            turbo: auto.turbo || '',
            llantas: auto.llantas || '',
            HP: auto.HP || ''
        }
    }, [auto])
    
    // Memoización del alt text
    const altText = useMemo(() => {
        if (!vehicleData?.marca || !vehicleData?.modelo) return 'Vehículo'
        return `${formatValue(vehicleData.marca)} ${formatValue(vehicleData.modelo)}`
    }, [vehicleData?.marca, vehicleData?.modelo])
    
    // Memoización de información de contacto
    const finalContactInfo = useMemo(() => {
        const defaultInfo = {
            email: 'info@indianausados.com',
            whatsapp: '5491112345678',
            whatsappMessage: `Hola, me interesa el vehículo ${formatValue(vehicleData?.marca || '')} ${formatValue(vehicleData?.modelo || '')}`
        }
        return contactInfo || defaultInfo
    }, [contactInfo, vehicleData?.marca, vehicleData?.modelo])

    // Validación
    if (!vehicleData) return null

    // Funciones de formateo optimizadas con useCallback
    const formatPrice = useCallback((price) => {
        if (!price) return '-'
        const numericPrice = parseFloat(price.toString().replace(/[^\d]/g, ''))
        if (isNaN(numericPrice)) return price
        return `$${numericPrice.toLocaleString('es-AR')}`
    }, [])
    
    const formatKilometraje = useCallback((kms) => {
        if (!kms) return '-'
        const numericKms = parseInt(kms)
        if (isNaN(numericKms)) return kms
        return numericKms.toLocaleString('es-AR')
    }, [])

    // Datos principales memoizados
    const mainData = useMemo(() => [
        { label: 'Año', value: vehicleData.año },
        { label: 'Km', value: formatKilometraje(vehicleData.kms) },
        { label: 'Caja', value: vehicleData.caja }
    ], [vehicleData.año, vehicleData.kms, vehicleData.caja, formatKilometraje])

    // Información adicional memoizada
    const additionalInfo = useMemo(() => [
        { label: 'Tracción', value: vehicleData.traccion },
        { label: 'Combustible', value: vehicleData.combustible },
        { label: 'Versión', value: vehicleData.version },
        { label: 'Cilindrada', value: vehicleData.cilindrada },
        { label: 'Segmento', value: vehicleData.categoria },
        { label: 'Tapizado', value: vehicleData.tapizado },
        { label: 'Color', value: vehicleData.color },
        { label: 'Categoría', value: vehicleData.categoriaVehiculo },
        { label: 'Frenos', value: vehicleData.frenos },
        { label: 'Turbo', value: vehicleData.turbo },
        { label: 'Llantas', value: vehicleData.llantas },
        { label: 'HP', value: vehicleData.HP }
    ], [vehicleData])

    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                {/* Sección de carrusel de imágenes */}
                <div className={styles.imageSection}>
                    <ImageCarousel 
                        images={carouselImages}
                        altText={altText}
                        showArrows={true}
                        showIndicators={true}
                        autoPlay={false}
                    />
                </div>
                
                {/* Sección de detalles */}
                <div className={styles.detailsSection}>
                    {/* Header 60/40 */}
                    <div className={styles.cardHeader}>
                        <div className={styles.headerLeft}>
                            <div className={styles.card__title_container}>
                                <h3 className={styles.card__title}>
                                    {vehicleData.marca}
                                </h3>
                                <h3 className={styles.card__title}>
                                    {vehicleData.modelo}
                                </h3>
                            </div>
                            {vehicleData.version && (
                                <p className={styles.card__version}>
                                    {vehicleData.version}
                                    {vehicleData.cilindrada && ` ${vehicleData.cilindrada}`}
                                </p>
                            )}
                        </div>
                        
                        <div className={styles.headerRight}>
                            <div className={styles.priceContainer}>
                                <span className={styles.card__price}>
                                    {formatPrice(vehicleData.precio)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Datos principales */}
                    <div className={styles.card__details}>
                        <div className={styles.card__data_container}>
                            {mainData.map((item, index) => (
                                <div 
                                    key={item.label}
                                    className={`${styles.card__data_item} ${
                                        index === 1 ? styles.card__data_item_border : ''
                                    }`}
                                >
                                    <span className={styles.card__data_label}>{item.label}</span>
                                    <span className={styles.card__data_value}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Información adicional */}
                    <div className={styles.infoContainer}>
                        {additionalInfo.map((item) => (
                            <div key={item.label} className={styles.infoItem}>
                                <span className={styles.infoKey}>{item.label}</span>
                                <span className={styles.infoValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Sección de contacto */}
                    <div className={styles.contactSection}>
                        <h4 className={styles.contactTitle}>Contacto Directo</h4>
                        <div className={styles.contactButtons}>
                            <a 
                                href={`mailto:${finalContactInfo.email}`}
                                className={styles.contactButton}
                                title="Enviar email"
                            >
                                <GmailIconOptimized className={styles.buttonIcon} size={20} />
                                <span className={styles.buttonText}>Email</span>
                            </a>
                            <a 
                                href={`https://wa.me/${finalContactInfo.whatsapp}?text=${encodeURIComponent(finalContactInfo.whatsappMessage)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.contactButton}
                                title="Contactar por WhatsApp"
                            >
                                <WhatsAppIconOptimized className={styles.buttonIcon} size={20} />
                                <span className={styles.buttonText}>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

CardDetalle.displayName = 'CardDetalle'

export default CardDetalle 