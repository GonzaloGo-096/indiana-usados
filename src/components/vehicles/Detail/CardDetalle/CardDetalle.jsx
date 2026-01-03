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

import React, { memo, useMemo, useCallback, useState } from 'react'
import { formatValue, formatCaja, formatPrice, formatKilometraje, formatCilindradaDisplay, formatHPDisplay } from '@utils/formatters'
import { getBrandLogo } from '@utils/getBrandLogo'
import { useCarouselImages } from '@hooks'
import { ImageCarousel } from '@ui/ImageCarousel'
import { WhatsAppContact } from '@ui'
import { AnioIcon, KmIcon, CajaIconDetalle } from '@components/ui/icons'
import { GalleryModal } from '@components/ceroKm/ModelGallery'
import styles from './CardDetalle.module.css'

/**
 * Componente CardDetalle basado en CardAuto
 */
export const CardDetalle = memo(({ auto, contactInfo }) => {
    // Logs de diagnóstico removidos para mantener consola limpia
    
    // Hooks
    const carouselImages = useCarouselImages(auto)
    
    // Estado del modal de galería
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    
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

    // Transformar imágenes al formato que espera GalleryModal { url, alt }
    const galleryImages = useMemo(() => {
        if (!carouselImages || carouselImages.length === 0) return []
        return carouselImages.map((img, index) => {
            // img puede ser string o objeto { url, public_id, original_name }
            const url = typeof img === 'string' ? img : (img?.url || '')
            return {
                url,
                alt: `${altText} - Imagen ${index + 1}`
            }
        }).filter(img => img.url && img.url.trim() !== '')
    }, [carouselImages, altText])
    
    // Handlers del modal
    const handleImageClick = useCallback((index = 0) => {
        setActiveIndex(index)
        setIsModalOpen(true)
    }, [])
    
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
    }, [])
    
    const handleIndexChange = useCallback((newIndex) => {
        setActiveIndex(newIndex)
    }, [])

    // Validación
    if (!vehicleData) return null

    // ✅ USAR FORMATTERS CENTRALIZADOS (eliminadas funciones duplicadas)

    // Datos principales memoizados con iconos
    const mainData = useMemo(() => [
        { label: 'Año', value: vehicleData.año, icon: AnioIcon },
        { label: 'Km', value: formatKilometraje(vehicleData.kms), icon: KmIcon },
        { label: 'Caja', value: formatCaja(vehicleData.caja), icon: CajaIconDetalle }
    ], [vehicleData.año, vehicleData.kms, vehicleData.caja])

    // Información adicional memoizada con formatValue para mostrar "-" si vacío
    // Removidos: Versión, Cilindrada, HP, Tracción, Llantas, Frenos, Turbo, Categoría, Segmento
    const additionalInfo = useMemo(() => [
        { label: 'Combustible', value: formatValue(vehicleData.combustible) },
        { label: 'Tapizado', value: formatValue(vehicleData.tapizado) },
        { label: 'Color', value: formatValue(vehicleData.color) }
    ], [vehicleData])

    return (
        <div className={styles.cardContent} data-testid="vehicle-detail">
                {/* Sección de carrusel de imágenes */}
                <div className={styles.imageSection} data-testid="vehicle-images">
                    <ImageCarousel 
                        images={carouselImages}
                        altText={altText}
                        showArrows={true}
                        showIndicators={true}
                        autoPlay={false}
                        onMainImageClick={handleImageClick}
                    />
                </div>
                
                {/* Sección de detalles */}
                <div className={styles.detailsSection}>
                    {/* CONTENEDOR 1: Layout en T - Logo + Modelo/Versión/HP/Cilindrada */}
                    <div className={styles.container1}>
                        <div className={styles.container1_left}>
                            <img 
                                src={brandLogo.src} 
                                alt={brandLogo.alt} 
                                className={styles.brand_logo}
                                width="120"
                                height="120"
                                loading="lazy"
                            />
                        </div>
                        <div className={styles.container1_right}>
                            {/* Línea 1: Modelo Versión (sin separador) */}
                            <div className={styles.container1_top}>
                                <h2 className={styles.modelo_title}>
                                    {vehicleData.modelo}
                                </h2>
                                {formatValue(vehicleData.version) !== '-' && (
                                    <span className={styles.version_text}>{formatValue(vehicleData.version)}</span>
                                )}
                            </div>
                            {/* Línea 2: Cilindrada | HP | Tracción (siempre los 3) */}
                            <div className={styles.container1_bottom}>
                                <span className={styles.spec_value}>
                                    {formatCilindradaDisplay(vehicleData.cilindrada) || '-'}
                                </span>
                                <span className={styles.spec_separator}>|</span>
                                <span className={styles.spec_value}>
                                    {formatHPDisplay(vehicleData.HP) || '-'}
                                </span>
                                <span className={styles.spec_separator}>|</span>
                                <span className={styles.spec_value}>
                                    {formatValue(vehicleData.traccion) !== '-' ? formatValue(vehicleData.traccion) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* CONTENEDOR 2: Datos principales (Año | Km | Caja) - Con barras separadoras */}
                    <div className={styles.container2}>
                        <div className={styles.main_data_container}>
                            {mainData.map((item, index) => {
                                const IconComponent = item.icon
                                // ✅ Año (index 0) cede más espacio, Caja (index 2) cede menos
                                const flexClass = index === 0 
                                    ? styles.main_data_item_flex_shrink 
                                    : index === 2 
                                    ? styles.main_data_item_flex_rigid 
                                    : styles.main_data_item
                                return (
                                    <React.Fragment key={item.label}>
                                        <div className={flexClass}>
                                            <div className={styles.main_data_content}>
                                                <div className={styles.main_data_label_group}>
                                                    <div className={styles.main_data_icon}>
                                                        <IconComponent size={28} color="currentColor" />
                                                    </div>
                                                    <span className={styles.main_data_label}>{item.label}</span>
                                                </div>
                                                <span className={styles.main_data_value}>{item.value}</span>
                                            </div>
                                        </div>
                                        {index < mainData.length - 1 && (
                                            <span className={styles.main_data_separator}>|</span>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* CONTENEDOR 3: Información adicional (grid) */}
                    <div className={styles.container3}>
                        <div className={styles.infoContainer}>
                            {additionalInfo.map((item) => (
                                <div key={item.label} className={styles.infoItem}>
                                    <span className={styles.infoKey}>{item.label}</span>
                                    <span className={styles.infoValue}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* CONTENEDOR 4: Precio (30% placeholder / 70% precio) */}
                    <div className={styles.container4}>
                        <div className={styles.price_placeholder}>
                            {/* Espacio reservado para futuro */}
                        </div>
                        <div className={styles.price_display}>
                            <span className={styles.price_value}>
                                {formatPrice(vehicleData.precio)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Botón de contacto WhatsApp */}
                    <div className={styles.contactSection}>
                        <WhatsAppContact 
                            text="Consultar este vehículo"
                            phone={finalContactInfo.whatsapp}
                            message={finalContactInfo.whatsappMessage}
                            className={styles.whatsappButtonSmall}
                        />
                    </div>
                </div>
                
                {/* Modal de galería */}
                {galleryImages.length > 0 && (
                    <GalleryModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        images={galleryImages}
                        activeIndex={activeIndex}
                        onIndexChange={handleIndexChange}
                        modelName={altText}
                    />
                )}
        </div>
    )
})

CardDetalle.displayName = 'CardDetalle'

export default CardDetalle 