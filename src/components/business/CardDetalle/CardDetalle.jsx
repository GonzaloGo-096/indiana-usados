/**
 * CardDetalle - Componente para mostrar información detallada de un vehículo
 * 
 * Funcionalidades:
 * - Mostrar información detallada del vehículo
 * - Imagen con lazy loading
 * - Secciones organizadas de información
 * - Botones de contacto
 * - Diseño responsivo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo, useMemo } from 'react'
import { EmailIconPNG, WhatsAppIconPNG } from '../../ui/icons'
import { ImageCarousel } from '../../ui/ImageCarousel'
import { formatValue } from '../../../utils/imageUtils'
import { useCarouselImages } from '../../../hooks/useImageOptimization'
import styles from './CardDetalle.module.css'

/**
 * Componente CardDetalle
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.auto - Objeto con información del vehículo
 * @param {string} props.auto.id - ID del vehículo
 * @param {string} props.auto.marca - Marca del vehículo
 * @param {string} props.auto.modelo - Modelo del vehículo
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
export const CardDetalle = memo(({ auto, contactInfo }) => {
    // ✅ CORREGIDO: Hooks siempre primero, antes de cualquier early return
    const carouselImages = useCarouselImages(auto)
    
    // ✅ OPTIMIZADO: Memoización del precio formateado
    const formattedPrice = useMemo(() => {
        if (!auto?.precio) return '-'
        const numericPrice = parseFloat(auto.precio.toString().replace(/[^\d]/g, ''))
        if (isNaN(numericPrice)) return auto.precio
        return `$${numericPrice.toLocaleString('es-AR')}`
    }, [auto?.precio])
    
    // ✅ OPTIMIZADO: Memoización del kilometraje formateado
    const formattedKms = useMemo(() => {
        if (!auto?.kms) return '-'
        const numericKms = parseInt(auto.kms)
        if (isNaN(numericKms)) return auto.kms
        return `${numericKms.toLocaleString('es-AR')} km`
    }, [auto?.kms])
    
    const defaultContactInfo = useMemo(() => ({
        email: 'info@indianausados.com',
        whatsapp: '5491112345678',
        whatsappMessage: `Hola, me interesa el vehículo ${formatValue(auto?.marca || '')} ${formatValue(auto?.modelo || '')}`
    }), [auto?.marca, auto?.modelo])
    
    const altText = useMemo(() => 
        `${formatValue(auto?.marca || '')} ${formatValue(auto?.modelo || '')}`, 
        [auto?.marca, auto?.modelo]
    )

    // ✅ CORREGIDO: Validación después de hooks
    if (!auto) return null

    // Extraer datos con valores por defecto
    const {
        marca = '',
        modelo = '',
        precio = '',
        año = '',
        kms = '',
        caja = '', // ✅ AGREGADO: Campo caja que faltaba
        color = '',
        categoria = '',
        combustible = '',
        detalle = '',
        version = '', // <-- Nuevo campo
        cilindrada = '' // <-- Nuevo campo
    } = auto

    const finalContactInfo = contactInfo || defaultContactInfo

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
                    {/* ✅ NUEVO: Header copiado de CardAuto */}
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
                                    {formatValue(version)}
                                </span>
                            )}
                        </div>
                        
                        {/* ✅ Segunda mitad: Precio destacado */}
                        <div className={styles.headerRight}>
                            <div className={styles.priceContainer}>
                                <span className={styles.card__price}>
                                    {formattedPrice}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* ✅ NUEVO: Detalles del vehículo en contenedor horizontal (copiado de CardAuto) */}
                    <div className={styles.card__details}>
                        <div className={styles.card__data_container}>
                            <div className={styles.card__data_item}>
                                <span className={styles.card__data_label}>Año</span>
                                <span className={styles.card__data_value}>{formatValue(año)}</span>
                            </div>
                            <div className={`${styles.card__data_item} ${styles.card__data_item_border}`}>
                                <span className={styles.card__data_label}>Kms</span>
                                <span className={styles.card__data_value}>{formattedKms}</span>
                            </div>
                            <div className={styles.card__data_item}>
                                <span className={styles.card__data_label}>Caja</span>
                                <span className={styles.card__data_value}>{formatValue(caja)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contenedores de información - 3 columnas con flexbox */}
                    <div className={styles.infoContainer}>
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Año</span>
                                <span className={styles.infoValue}>{formatValue(año)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Combustible</span>
                                <span className={styles.infoValue}>{formatValue(combustible)}</span>
                            </div>
                        </div>
                        
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Versión</span>
                                <span className={styles.infoValue}>{formatValue(version)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Color</span>
                                <span className={styles.infoValue}>{formatValue(color)}</span>
                            </div>
                        </div>
                        
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Categoría</span>
                                <span className={styles.infoValue}>{formatValue(categoria)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoKey}>Cilindrada</span>
                                <span className={styles.infoValue}>{formatValue(cilindrada)}</span>
                            </div>
                        </div>
                    </div>


                    
                    {/* Sección de contacto */}
                    <div className={styles.contactSection}>
                        <h4 className={styles.contactTitle}>Contacto</h4>
                        <div className={styles.contactButtons}>
                            <a 
                                href={`mailto:${finalContactInfo.email}`}
                                className={styles.contactButton}
                                title="Enviar email"
                            >
                                <span>Email</span>
                            </a>
                            <a 
                                href={`https://wa.me/${finalContactInfo.whatsapp}?text=${encodeURIComponent(finalContactInfo.whatsappMessage)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.contactButton}
                                title="Contactar por WhatsApp"
                            >
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}) 