/**
 * CardDetalle - Componente para mostrar información detallada de un vehículo
 * 
 * Funcionalidades:
 * - Mostrar información detallada del vehículo
 * - Imagen con lazy loading ultra optimizado
 * - Secciones organizadas de información
 * - Botones de contacto optimizados
 * - Diseño responsivo y performance
 * 
 * @author Indiana Usados
 * @version 2.0.0 - OPTIMIZACIÓN FINAL
 */

import React, { memo, useMemo, forwardRef } from 'react'
import { ImageCarousel } from '../../ui/ImageCarousel'
import { GmailIconOptimized, WhatsAppIconOptimized } from '../../ui/icons'
import { formatValue } from '../../../utils/imageUtils'
import { useCarouselImages } from '../../../hooks/useImageOptimization'
import styles from './CardDetalle.module.css'

/**
 * Componente CardDetalle ultra optimizado para performance
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.auto - Objeto con información del vehículo
 * @param {string} props.auto.id - ID del vehículo
 * @param {string} props.auto.marca - Marca del vehículo
 * @param {string} props.auto.modelo - Modelo del vehículo
 * @param {string} props.auto.version - Versión del vehículo
 * @param {string} props.auto.cilindrada - Cilindrada del vehículo
 * @param {string} props.auto.precio - Precio del vehículo
 * @param {string} props.auto.año - Año del vehículo
 * @param {string} props.auto.kms - Kilometraje del vehículo
 * @param {string} props.auto.caja - Tipo de caja del vehículo
 * @param {string} props.auto.color - Color del vehículo
 * @param {string} props.auto.categoria - Categoría del vehículo
 * @param {string} props.auto.combustible - Tipo de combustible
 * @param {string} props.auto.detalle - Detalles adicionales
 * @param {string} props.auto.imagen - URL de la imagen
 * @param {Array} props.auto.imagenes - Array de URLs de imágenes
 * @param {Object} props.contactInfo - Información de contacto
 * @param {string} props.contactInfo.email - Email de contacto
 * @param {string} props.contactInfo.whatsapp - Número de WhatsApp
 * @param {string} props.contactInfo.whatsappMessage - Mensaje predefinido para WhatsApp
 */
export const CardDetalle = memo(forwardRef(({ auto, contactInfo }, ref) => {
    // ✅ OPTIMIZADO: Hooks siempre primero, antes de cualquier early return
    const carouselImages = useCarouselImages(auto)
    
    // ✅ OPTIMIZADO: Memoización del precio formateado con función reutilizable
    const formatPrice = useMemo(() => (price) => {
        if (!price) return '-'
        const numericPrice = parseFloat(price.toString().replace(/[^\d]/g, ''))
        if (isNaN(numericPrice)) return price
        return `$${numericPrice.toLocaleString('es-AR')}`
    }, [])
    
    // ✅ OPTIMIZADO: Memoización del kilometraje formateado con función reutilizable
    const formatKilometraje = useMemo(() => (kms) => {
        if (!kms) return '-'
        const numericKms = parseInt(kms)
        if (isNaN(numericKms)) return kms
        return `${numericKms.toLocaleString('es-AR')} km`
    }, [])
    
    // ✅ OPTIMIZADO: Memoización de datos extraídos
    const vehicleData = useMemo(() => {
        if (!auto) return null
        
        return {
            id: auto.id,
            marca: auto.marca || '',
            modelo: auto.modelo || '',
            version: auto.version || '',
            cilindrada: auto.cilindrada || '',
            precio: auto.precio || '',
            año: auto.año || '',
            kms: auto.kms || '',
            caja: auto.caja || '',
            color: auto.color || '',
            categoria: auto.categoria || '',
            combustible: auto.combustible || '',
            traccion: auto.traccion || '', // ✅ AGREGADO: Campo tracción
            tapizado: auto.tapizado || '', // ✅ AGREGADO: Campo tapizado
            categoriaVehiculo: auto.categoriaVehiculo || '', // ✅ AGREGADO: Campo categoría (nuevo)
            detalle: auto.detalle || ''
        }
    }, [auto])
    
    // ✅ OPTIMIZADO: Memoización del alt text
    const altText = useMemo(() => {
        if (!vehicleData?.marca || !vehicleData?.modelo) return 'Vehículo'
        return `${formatValue(vehicleData.marca)} ${formatValue(vehicleData.modelo)}`
    }, [vehicleData?.marca, vehicleData?.modelo])
    
    // ✅ OPTIMIZADO: Memoización de información de contacto
    const finalContactInfo = useMemo(() => {
        const defaultInfo = {
            email: 'info@indianausados.com',
            whatsapp: '5491112345678',
            whatsappMessage: `Hola, me interesa el vehículo ${formatValue(vehicleData?.marca || '')} ${formatValue(vehicleData?.modelo || '')}`
        }
        return contactInfo || defaultInfo
    }, [contactInfo, vehicleData?.marca, vehicleData?.modelo])

    // ✅ CORREGIDO: Validación después de hooks
    if (!vehicleData) return null

    // ✅ OPTIMIZADO: Destructuring con nombres correctos
    const { 
        marca, 
        modelo, 
        version, 
        cilindrada,
        precio, 
        año, 
        kms, 
        caja, 
        color, 
        categoria, 
        combustible,
        traccion, // ✅ AGREGADO: Campo tracción
        tapizado, // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo // ✅ AGREGADO: Campo categoría (nuevo)
    } = vehicleData

    return (
        <div className={styles.card} ref={ref}>
            <div className={styles.cardContent}>
                {/* ✅ ULTRA OPTIMIZADO: Sección de carrusel de imágenes */}
                <div className={styles.imageSection}>
                    <ImageCarousel 
                        images={carouselImages}
                        altText={altText}
                        showArrows={true}
                        showIndicators={true}
                        autoPlay={false}
                    />
                </div>
                
                {/* ✅ OPTIMIZADO: Sección de detalles */}
                <div className={styles.detailsSection}>
                    {/* ✅ Header dividido con diagonal */}
                    <div className={styles.cardHeader}>
                        {/* ✅ Primera mitad: Marca, modelo y versión */}
                        <div className={styles.headerLeft}>
                            <div className={styles.card__title_container}>
                                <h3 className={styles.card__title}>
                                    {formatValue(marca)}
                                </h3>
                                <h3 className={styles.card__title}>
                                    {formatValue(modelo)}
                                </h3>
                            </div>
                            {version && (
                                <span className={styles.card__version}>
                                    {formatValue(version)}{cilindrada && ` ${formatValue(cilindrada)}`}
                                </span>
                            )}
                        </div>
                        
                        {/* ✅ Segunda mitad: Precio destacado */}
                        <div className={styles.headerRight}>
                            <div className={styles.priceContainer}>
                                <span className={styles.card__price}>
                                    {formatPrice(precio)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* ✅ OPTIMIZADO: Detalles del vehículo en contenedor horizontal */}
                    <div className={styles.card__details}>
                        <div className={styles.card__data_container}>
                            <div className={styles.card__data_item}>
                                <span className={styles.card__data_label}>Año</span>
                                <span className={styles.card__data_value}>{formatValue(año)}</span>
                            </div>
                            <div className={`${styles.card__data_item} ${styles.card__data_item_border}`}>
                                <span className={styles.card__data_label}>Kms</span>
                                <span className={styles.card__data_value}>{formatKilometraje(kms)}</span>
                            </div>
                            <div className={styles.card__data_item}>
                                <span className={styles.card__data_label}>Caja</span>
                                <span className={styles.card__data_value}>{formatValue(caja)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* ✅ OPTIMIZADO: Contenedores de información - 2 filas de 4 elementos con flexbox */}
                    <div className={styles.infoContainer}>
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Tracción</span>
                                <span className={styles.infoValue}>{formatValue(traccion)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Combustible</span>
                                <span className={styles.infoValue}>{formatValue(combustible)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Versión</span>
                                <span className={styles.infoValue}>{formatValue(version)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Cilindrada</span>
                                <span className={styles.infoValue}>{formatValue(cilindrada)}</span>
                            </div>
                        </div>
                        
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Segmento</span>
                                <span className={styles.infoValue}>{formatValue(categoria)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Tapizado</span>
                                <span className={styles.infoValue}>{formatValue(tapizado)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Color</span>
                                <span className={styles.infoValue}>{formatValue(color)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Categoría</span>
                                <span className={styles.infoValue}>{formatValue(categoriaVehiculo)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* ✅ OPTIMIZADO: Sección de contacto con iconos reales */}
                    <div className={styles.contactSection}>
                        <h4 className={styles.contactTitle}>Contacto Directo</h4>
                        <div className={styles.contactButtons}>
                            <a 
                                href={`mailto:${finalContactInfo.email}`}
                                className={styles.contactButton}
                                title="Enviar email"
                            >
                                <GmailIconOptimized className={styles.buttonIcon} size={18} />
                                <span className={styles.buttonText}>Email</span>
                            </a>
                            <a 
                                href={`https://wa.me/${finalContactInfo.whatsapp}?text=${encodeURIComponent(finalContactInfo.whatsappMessage)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.contactButton}
                                title="Contactar por WhatsApp"
                            >
                                <WhatsAppIconOptimized className={styles.buttonIcon} size={18} />
                                <span className={styles.buttonText}>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}))

// ✅ OPTIMIZADO: Agregar displayName para debugging
CardDetalle.displayName = 'CardDetalle' 