/**
 * CardAuto - Componente para mostrar información de un vehículo
 * 
 * Rediseño Premium v6.0.0:
 * - Jerarquía visual clara y profesional
 * - Diseño limpio, respirable y consistente
 * - Paleta sobria (blancos, grises, negro)
 * - Color de acento solo para precio
 * - Performance optimizada
 * - Escalable a futuro (favoritos, badges, etc.)
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Rediseño Premium
 */

import React, { memo, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    formatPrice, 
    formatKilometraje, 
    formatYear, 
    formatCaja,
    formatBrandModel,
    formatValue,
    formatCilindradaDisplay,
    formatHPDisplay
} from '@utils/formatters'
import { logger } from '@utils/logger'
import { getBrandLogo } from '@utils/getBrandLogo'
import styles from './CardAuto.module.css'
import { AnioIcon, KmIcon, CajaIconDetalle } from '@components/ui/icons'
import CloudinaryImage from '@/components/ui/CloudinaryImage/CloudinaryImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@constants/imageSizes'
import { usePreloadImages, useVehiclePrefetch } from '@hooks'

/**
 * Componente CardAuto optimizado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.auto - Objeto con información del vehículo
 */
export const CardAuto = memo(({ auto }) => {
    const navigate = useNavigate()
    const { prefetchVehicleDetail } = useVehiclePrefetch()
    
    // ✅ PRELOAD DE IMÁGENES CRÍTICAS - Mejorado para cache borrado
    const { preloadVehicle, getStats } = usePreloadImages([auto], {
        preloadDistance: 400,
        maxPreload: 2,
        enablePreload: true
    })
    
    // ✅ URL de imagen principal optimizada con useMemo
    const primaryImage = useMemo(() => {
        return auto.fotoPrincipal || auto.imagen || '/auto1.jpg'
    }, [auto.fotoPrincipal, auto.imagen])
    
    // ✅ PRELOAD AUTOMÁTICO AL MONTAR - ELIMINADO
    // El preload ahora se maneja por el IntersectionObserver en usePreloadImages
    // useEffect(() => {
    //     if (auto) {
    //         preloadVehicle(auto)
    //     }
    // }, [auto, preloadVehicle])

    // ✅ HANDLER: Click en toda la tarjeta para abrir detalle
    const handleCardClick = useCallback(() => {
        const vehicleId = auto.id || auto._id
        if (!vehicleId) {
            logger.error('ui:card-auto', 'ID del vehículo no válido')
            return
        }
        navigate(`/vehiculo/${vehicleId}`)
    }, [auto, navigate])

    // ✅ OPTIMIZADO: Prefetch al hover (mejora percepción de velocidad)
    const handleMouseEnter = useCallback(() => {
        const vehicleId = auto.id || auto._id
        if (vehicleId) {
            prefetchVehicleDetail(vehicleId)
        }
    }, [auto, prefetchVehicleDetail])
    
    // ✅ VALIDAR DATOS DEL VEHÍCULO
    if (!auto || (!auto.id && !auto._id)) {
        return null
    }

    // Normalizar ID para compatibilidad
    const vehicleId = auto.id || auto._id

    // ✅ MEMOIZAR DATOS FORMATEADOS
    const formattedData = useMemo(() => {
        const cajaFormateada = formatCaja(auto.caja)
        // ✅ Mostrar "Automática" completo (sin abreviar)
        
        return {
            price: formatPrice(auto.precio),
            kilometers: formatKilometraje(auto.kilometraje || auto.kms),
            year: formatYear(auto.anio || auto.año),
            caja: cajaFormateada,
            brandModel: formatBrandModel(auto.marca, auto.modelo),
            version: formatValue(auto.version || ''),
            cilindrada: formatCilindradaDisplay(auto.cilindrada || ''),
            HP: formatHPDisplay(auto.HP || ''),
            traccion: formatValue(auto.traccion || '')
        }
    }, [auto.precio, auto.kilometraje, auto.kms, auto.anio, auto.año, auto.caja, auto.marca, auto.modelo, auto.version, auto.cilindrada, auto.HP, auto.traccion])
    
    // ✅ Detectar si es "Automática" para aplicar estilos especiales
    const isAutomatica = useMemo(() => {
        return formattedData.caja === 'Automática'
    }, [formattedData.caja])
    
    // ✅ MEMOIZAR LOGO DE MARCA
    const brandLogo = useMemo(() => {
        return getBrandLogo(auto?.marca || '')
    }, [auto?.marca])
    
    // ✅ DATOS PRINCIPALES CON ICONOS (Caja, Km, Año)
    const mainData = useMemo(() => [
        { label: 'Caja', value: formattedData.caja, icon: CajaIconDetalle },
        { label: 'Km', value: formattedData.kilometers, icon: KmIcon },
        { label: 'Año', value: formattedData.year, icon: AnioIcon }
    ], [formattedData.year, formattedData.kilometers, formattedData.caja])

    // ✅ MEMOIZAR ALT TEXT
    const altText = useMemo(() => {
        return `${formattedData.brandModel} - ${formattedData.year}`
    }, [formattedData.brandModel, formattedData.year])

    return (
        <div 
            className={styles.card} 
            data-testid="vehicle-card"
            data-vehicle-id={auto?.id || auto?._id}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick()
                }
            }}
            aria-label={`Ver detalles de ${formattedData.brandModel}`}
        >
            {/* ===== IMAGEN PRINCIPAL ===== */}
            <div className={styles['card__image-container']}>
                <CloudinaryImage
                    image={primaryImage}
                    alt={altText}
                    variant="fluid"
                    widths={IMAGE_WIDTHS.card}
                    sizes={IMAGE_SIZES.card}
                    loading="lazy"
                    fetchpriority="auto"
                    qualityMode="eco"
                    className={styles['card__image']}
                />
            </div>

            {/* ===== CONTENIDO ===== */}
            <div className={styles['card__body']}>
                {/* CONTENEDOR 1: Datos primero + Logo después (orden invertido) */}
                <div className={styles.container1}>
                    {/* Bloque de datos primero */}
                    <div className={styles.container1_right}>
                        {/* Fila 1: Marca + Modelo */}
                        <div className={styles.container1_row1}>
                            <span className={styles.marca_text}>{auto.marca}</span>
                            <span className={styles.marca_modelo_separator}>|</span>
                            <h3 className={styles.modelo_title}>
                                {auto.modelo}
                            </h3>
                        </div>
                        
                        {/* Fila 2: Caja, Km, Año (sin separadores) */}
                        <div className={`${styles.container1_row3} ${isAutomatica ? styles.container1_row3_automatica : ''}`}>
                            {mainData.map((item) => {
                                const isCajaItem = item.label === 'Caja'
                                const isCajaAutomatica = isCajaItem && isAutomatica
                                
                                return (
                                    <div 
                                        key={item.label} 
                                        className={`${styles.row2_data_item} ${isCajaAutomatica ? styles.row2_data_item_automatica : ''}`}
                                    >
                                        <div className={styles.row2_data_content}>
                                            <span className={styles.row2_data_label}>{item.label}</span>
                                            <span className={styles.row2_data_value}>{item.value}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Logo después de los datos */}
                    <div className={styles.container1_left}>
                        <img 
                            src={brandLogo.src} 
                            alt={brandLogo.alt} 
                            className={`${styles.brand_logo} ${brandLogo.size === 'small' ? styles.brand_logo_small : ''} ${brandLogo.size === 'large' ? styles.brand_logo_large : ''}`}
                            width="60"
                            height="60"
                            loading="lazy"
                        />
                    </div>
                </div>
                
                {/* CONTENEDOR 4: Precio dividido en 2 contenedores */}
                <div className={styles.container4}>
                    {/* Contenedor izquierda: "Desde:" con contenido futuro */}
                    <div className={styles.price_label_container}>
                        <span className={styles.price_label}>desde:</span>
                    </div>
                    
                    {/* Contenedor derecha: Precio alineado a la derecha */}
                    <div className={styles.price_display}>
                        <span className={styles.price_value}>
                            {formattedData.price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
})

CardAuto.displayName = 'CardAuto'

export default CardAuto 