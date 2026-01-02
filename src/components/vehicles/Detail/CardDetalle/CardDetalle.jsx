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
import { formatValue, formatCaja, formatPrice, formatKilometraje } from '@utils/formatters'
import { getBrandLogo } from '@utils/getBrandLogo'
import { useCarouselImages } from '@hooks'
import { ImageCarousel } from '@ui/ImageCarousel'
import { WhatsAppContact } from '@ui'
import { CalendarIcon, RouteIcon, GearboxIcon } from '@components/ui/icons'
import styles from './CardDetalle.module.css'

/**
 * Componente CardDetalle basado en CardAuto
 */
export const CardDetalle = memo(({ auto, contactInfo }) => {
    // Logs de diagnóstico removidos para mantener consola limpia
    
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
            año: auto.anio || auto.año || '', // ✅ CORREGIDO: anio es el campo del backend
            kms: auto.kilometraje || auto.kms || '', // ✅ CORREGIDO: kilometraje es el campo del backend
            caja: formatCaja(auto.caja),
            color: auto.color || '',
            categoria: auto.segmento || auto.categoria || '', // ✅ CORREGIDO: segmento es el campo del backend
            combustible: auto.combustible || '',
            traccion: auto.traccion || '', // ✅ CORREGIDO: traccion (sin tilde)
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
    
    // ✅ MEMOIZAR LOGO DE MARCA
    const brandLogo = useMemo(() => {
        return getBrandLogo(vehicleData?.marca)
    }, [vehicleData?.marca])
    
    // Memoización de información de contacto
    const finalContactInfo = useMemo(() => {
        const defaultInfo = {
            email: 'info@indianausados.com',
            whatsapp: '543816295959', // Número de WhatsApp para usados
            whatsappMessage: `Hola, me interesa el vehículo ${formatValue(vehicleData?.marca || '')} ${formatValue(vehicleData?.modelo || '')}`
        }
        return contactInfo || defaultInfo
    }, [contactInfo, vehicleData?.marca, vehicleData?.modelo])

    // Validación
    if (!vehicleData) return null

    // ✅ USAR FORMATTERS CENTRALIZADOS (eliminadas funciones duplicadas)

    // Datos principales memoizados con iconos
    const mainData = useMemo(() => [
        { label: 'Año', value: vehicleData.año, icon: CalendarIcon },
        { label: 'Km', value: formatKilometraje(vehicleData.kms), icon: RouteIcon },
        { label: 'Caja', value: vehicleData.caja, icon: GearboxIcon }
    ], [vehicleData.año, vehicleData.kms, vehicleData.caja])

    // Información adicional memoizada con formatValue para mostrar "-" si vacío
    const additionalInfo = useMemo(() => [
        { label: 'Tracción', value: formatValue(vehicleData.traccion) },
        { label: 'Combustible', value: formatValue(vehicleData.combustible) },
        { label: 'Versión', value: formatValue(vehicleData.version) },
        { label: 'Cilindrada', value: formatValue(vehicleData.cilindrada) },
        { label: 'Segmento', value: formatValue(vehicleData.categoria) },
        { label: 'Tapizado', value: formatValue(vehicleData.tapizado) },
        { label: 'Color', value: formatValue(vehicleData.color) },
        { label: 'Categoría', value: formatValue(vehicleData.categoriaVehiculo) },
        { label: 'Frenos', value: formatValue(vehicleData.frenos) },
        { label: 'Turbo', value: formatValue(vehicleData.turbo) },
        { label: 'Llantas', value: formatValue(vehicleData.llantas) },
        { label: 'HP', value: formatValue(vehicleData.HP) }
    ], [vehicleData])

    return (
        <div className={styles.card} data-testid="vehicle-detail">
            <div className={styles.cardContent}>
                {/* Sección de carrusel de imágenes */}
                <div className={styles.imageSection} data-testid="vehicle-images">
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
                                <img 
                                    src={brandLogo.src} 
                                    alt={brandLogo.alt} 
                                    className={styles.card__brand_logo}
                                    width="120"
                                    height="120"
                                    loading="lazy"
                                />
                                <h3 className={styles.card__title}>
                                    {vehicleData.modelo}
                                </h3>
                            </div>
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
                            {mainData.map((item, index) => {
                                const IconComponent = item.icon
                                return (
                                    <div 
                                        key={item.label}
                                        className={`${styles.card__data_item} ${
                                            index === 1 ? styles.card__data_item_border : ''
                                        }`}
                                    >
                                        <div className={styles.card__data_icon}>
                                            <IconComponent size={16} color="currentColor" />
                                        </div>
                                        <span className={styles.card__data_label}>{item.label}</span>
                                        <span className={styles.card__data_value}>{item.value}</span>
                                    </div>
                                )
                            })}
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
                    
                    {/* Sección de contacto refactorizada */}
                    <div className={styles.contactSection}>
                        <WhatsAppContact 
                            text="Consultar este vehículo"
                            phone={finalContactInfo.whatsapp}
                            message={finalContactInfo.whatsappMessage}
                            className={styles.whatsappButtonSmall}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
})

CardDetalle.displayName = 'CardDetalle'

export default CardDetalle 