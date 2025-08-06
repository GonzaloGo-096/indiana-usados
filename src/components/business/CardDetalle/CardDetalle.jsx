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
 * @version 3.0.0 - Basado en CardAuto con mejoras
 */

import React, { memo, useMemo } from 'react'
import { GmailIconOptimized, WhatsAppIconOptimized } from '../../ui/icons'
import { formatValue } from '../../../utils/imageUtils'
import { useCarouselImages } from '../../../hooks/useImageOptimization'
import { ImageCarousel } from '../../ui/ImageCarousel'
import styles from './CardDetalle.module.css'

/**
 * Componente CardDetalle basado en CardAuto
 */
export const CardDetalle = memo(({ auto, contactInfo }) => {
    // Hooks
    const carouselImages = useCarouselImages(auto)
    
    // Debug: Log de imágenes del carrusel
    console.log('🖼️ CARRUSEL DEBUG: Imágenes recibidas:', carouselImages)
    console.log('🖼️ CARRUSEL DEBUG: Cantidad de imágenes:', carouselImages?.length)
    console.log('🖼️ CARRUSEL DEBUG: Objeto auto completo:', auto)
    
    // Memoización de datos del vehículo
    const vehicleData = useMemo(() => {
        console.log('🔍 CARD DEBUG: Objeto auto recibido:', auto)
        
        if (!auto) {
            console.log('❌ CARD DEBUG: auto es null/undefined')
            return null
        }
        
        const data = {
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
        
        console.log('📊 CARD DEBUG: Datos procesados:', data)
        console.log('🔍 CARD DEBUG: Campos especiales:', {
            frenos: data.frenos,
            turbo: data.turbo,
            llantas: data.llantas,
            HP: data.HP
        })
        
        return data
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

    // Funciones de formateo
    const formatPrice = (price) => {
        if (!price) return '-'
        const numericPrice = parseFloat(price.toString().replace(/[^\d]/g, ''))
        if (isNaN(numericPrice)) return price
        return `$${numericPrice.toLocaleString('es-AR')}`
    }
    
    const formatKilometraje = (kms) => {
        if (!kms) return '-'
        const numericKms = parseInt(kms)
        if (isNaN(numericKms)) return kms
        return numericKms.toLocaleString('es-AR')
    }

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
                    {/* Header 60/40 (COMO CARD AUTO) */}
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
                    
                    {/* Datos principales (CLAVE ARRIBA, VALOR ABAJO) */}
                    <div className={styles.card__details}>
                        <div className={styles.card__data_container}>
                            <div className={styles.card__data_item}>
                                <span className={styles.card__data_label}>Año</span>
                                <span className={styles.card__data_value}>{vehicleData.año}</span>
                            </div>
                            <div className={`${styles.card__data_item} ${styles.card__data_item_border}`}>
                                <span className={styles.card__data_label}>Km</span>
                                <span className={styles.card__data_value}>{formatKilometraje(vehicleData.kms)}</span>
                            </div>
                            <div className={styles.card__data_item}>
                                <span className={styles.card__data_label}>Caja</span>
                                <span className={styles.card__data_value}>{vehicleData.caja}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Información adicional */}
                    <div className={styles.infoContainer}>
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Tracción</span>
                                <span className={styles.infoValue}>{vehicleData.traccion}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Combustible</span>
                                <span className={styles.infoValue}>{vehicleData.combustible}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Versión</span>
                                <span className={styles.infoValue}>{vehicleData.version}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Cilindrada</span>
                                <span className={styles.infoValue}>{vehicleData.cilindrada}</span>
                            </div>
                        </div>
                        
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Segmento</span>
                                <span className={styles.infoValue}>{vehicleData.categoria}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Tapizado</span>
                                <span className={styles.infoValue}>{vehicleData.tapizado}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Color</span>
                                <span className={styles.infoValue}>{vehicleData.color}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Categoría</span>
                                <span className={styles.infoValue}>{vehicleData.categoriaVehiculo}</span>
                            </div>
                        </div>
                        
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Frenos</span>
                                <span className={styles.infoValue}>{vehicleData.frenos}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Turbo</span>
                                <span className={styles.infoValue}>{vehicleData.turbo}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Llantas</span>
                                <span className={styles.infoValue}>{vehicleData.llantas}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>HP</span>
                                <span className={styles.infoValue}>{vehicleData.HP}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sección de contacto con iconos coloridos */}
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