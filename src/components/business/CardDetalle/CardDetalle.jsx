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
import { GmailIcon, WhatsAppIcon } from '../../ui/icons'
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
    // Validación de props
    if (!auto) return null

    // Extraer datos con valores por defecto
    const {
        id,
        marca = '',
        modelo = '',
        precio = '',
        año = '',
        kms = '',
        caja = '',
        color = '',
        categoria = '',
        combustible = '',
        detalle = '',
        imagen = '',
        imagenes = [],
        version = '', // <-- Nuevo campo
        cilindrada = '' // <-- Nuevo campo
    } = auto

    // ✅ AGREGADO: Memoizar imágenes del carrusel
    const carouselImages = useCarouselImages(auto)

    // ✅ AGREGADO: Memoizar información de contacto
    const defaultContactInfo = useMemo(() => ({
        email: 'info@indianausados.com',
        whatsapp: '5491112345678',
        whatsappMessage: `Hola, me interesa el vehículo ${formatValue(marca)} ${formatValue(modelo)}`
    }), [marca, modelo])

    const finalContactInfo = contactInfo || defaultContactInfo

    // ✅ AGREGADO: Memoizar texto alternativo
    const altText = useMemo(() => 
        `${formatValue(marca)} ${formatValue(modelo)}`, 
        [marca, modelo]
    )

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
                    <h2 className={styles.title}>
                        {formatValue(marca)} {formatValue(modelo)}
                    </h2>
                    
                    {/* Tablas de información */}
                    <div className={styles.tablesContainer}>
                        <div className={styles.tableSection}>
                            <table className={styles.table}>
                                <tbody>
                                    <tr>
                                        <th>Precio</th>
                                        <td>{precio ? `$${precio}` : '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Año</th>
                                        <td>{formatValue(año)}</td>
                                    </tr>
                                    <tr>
                                        <th>Kms</th>
                                        <td>{formatValue(kms)}</td>
                                    </tr>
                                    <tr>
                                        <th>Versión</th>
                                        <td>{formatValue(version)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div className={styles.tableSection}>
                            <table className={styles.table}>
                                <tbody>
                                    <tr>
                                        <th>Combustible</th>
                                        <td>{formatValue(combustible)}</td>
                                    </tr>
                                    <tr>
                                        <th>Color</th>
                                        <td>{formatValue(color)}</td>
                                    </tr>
                                    <tr>
                                        <th>Categoría</th>
                                        <td>{formatValue(categoria)}</td>
                                    </tr>
                                    <tr>
                                        <th>Cilindrada</th>
                                        <td>{formatValue(cilindrada)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detalles adicionales */}
                    {detalle && (
                        <div className={styles.additionalDetails}>
                            <h4 className={styles.detailsTitle}>Detalles adicionales</h4>
                            <p className={styles.detailsText}>{formatValue(detalle)}</p>
                        </div>
                    )}
                    
                    {/* Sección de contacto */}
                    <div className={styles.contactSection}>
                        <h4 className={styles.contactTitle}>Contacto</h4>
                        <div className={styles.contactButtons}>
                            <a 
                                href={`mailto:${finalContactInfo.email}`}
                                className={styles.contactButton}
                                title="Enviar email"
                            >
                                <GmailIcon />
                                <span>Email</span>
                            </a>
                            <a 
                                href={`https://wa.me/${finalContactInfo.whatsapp}?text=${encodeURIComponent(finalContactInfo.whatsappMessage)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.contactButton}
                                title="Contactar por WhatsApp"
                            >
                                <WhatsAppIcon />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}) 