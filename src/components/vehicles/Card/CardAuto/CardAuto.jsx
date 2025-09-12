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

import React, { memo, useMemo, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    formatPrice, 
    formatKilometraje, 
    formatYear, 
    formatCaja,
    formatBrandModel
} from '@utils/formatters'
import axiosInstance from '@api/axiosInstance'
import styles from './CardAuto.module.css'
import { CalendarIcon, RouteIcon, GearboxIcon } from '@components/ui/icons'
import ResponsiveImage from '@/components/ui/ResponsiveImage/ResponsiveImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@/constants/imageSizes'
import { usePreloadImages } from '@hooks/usePreloadImages'

/**
 * Componente CardAuto optimizado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.auto - Objeto con información del vehículo
 */
export const CardAuto = memo(({ auto }) => {
    const navigate = useNavigate()
    
    // ✅ EFECTO HOVER DEFINITIVO: Dos imágenes con fade
    const [isHovering, setIsHovering] = useState(false)
    
    // ✅ PRELOAD DE IMÁGENES CRÍTICAS
    const { preloadVehicle, getStats } = usePreloadImages([auto], {
        preloadDistance: 300,
        maxPreload: 2,
        enablePreload: true
    })
    
    // ✅ URLs de imágenes optimizadas con useMemo
    const images = useMemo(() => ({
        primary: auto.fotoPrincipal || 
                auto.imagen || 
                '/src/assets/auto1.jpg',
        hover: auto.fotoHover
    }), [auto.fotoPrincipal, auto.imagen, auto.fotoHover])
    
    const { primary: primaryImage, hover: hoverImage } = images
    
    // ✅ HANDLERS OPTIMIZADOS
    const handleMouseEnter = useCallback(() => setIsHovering(true), [])
    const handleMouseLeave = useCallback(() => setIsHovering(false), [])
    
    // ✅ PRELOAD AUTOMÁTICO AL MONTAR - ELIMINADO
    // El preload ahora se maneja por el IntersectionObserver en usePreloadImages
    // useEffect(() => {
    //     if (auto) {
    //         preloadVehicle(auto)
    //     }
    // }, [auto, preloadVehicle])
    
    // ✅ DEBUG LIMPIO: Verificar que el campo caja llegue correctamente
    if (!window._cardAutoDebugCount) {
      window._cardAutoDebugCount = 0
    }
    
    


    // ✅ FUNCIÓN SIMPLE PARA "VER MÁS"
    const handleVerMas = useCallback(async () => {
        console.log('🚀 CardAuto: handleVerMas ejecutándose')
        console.log('📋 CardAuto: Datos del auto:', auto)
        
        try {
            const vehicleId = auto.id || auto._id
            console.log('🆔 CardAuto: ID del vehículo:', vehicleId)
            
            if (!vehicleId) {
                console.error('❌ CardAuto: ID del vehículo no válido')
                return
            }
            
            // ✅ DEBUG: Solo para vehículos sin imagen
            
            // ✅ HACER GET AL ENDPOINT
            const response = await axiosInstance.get(`/photos/getonephoto/${vehicleId}`)
            
            // ✅ DEBUG: Solo para vehículos sin imagen
            
            // ✅ EXTRAER DATOS DE LA ESTRUCTURA CORRECTA
            let vehicleData = response.data
            
                         // ✅ SI LA RESPUESTA TIENE ESTRUCTURA {error: null, getOnePhoto: {...}}
             if (response.data && response.data.getOnePhoto) {
                 vehicleData = response.data.getOnePhoto
                 // ✅ DEBUG: Solo para vehículos sin imagen
             }
            
            // ✅ NAVEGAR CON LOS DATOS COMPLETOS
            navigate(`/vehiculo/${vehicleId}`, { 
                state: { vehicleData: vehicleData }
            })
            
        } catch (error) {
            console.error('❌ CardAuto: Error completo:', error)
            console.error('❌ CardAuto: Mensaje de error:', error.message)
            
            if (error.response) {
                console.error('📡 CardAuto: Error del servidor:', error.response.data)
            }
            
            // ✅ FALLBACK: Navegar con datos básicos
            const vehicleId = auto.id || auto._id
            navigate(`/vehiculo/${vehicleId}`, { 
                state: { vehicleData: auto }
            })
        }
    }, [auto, navigate])
    
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

    // ✅ OPTIMIZADO: Memoizar URL de navegación
    const vehicleUrl = useMemo(() => `/vehiculo/${vehicleId}`, [vehicleId])

    return (
        <div 
            className={styles.card} 
            data-testid="vehicle-card"
            data-vehicle-id={auto?.id || auto?._id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ===== IMAGEN CON FADE DEFINITIVO ===== */}
            <div className={styles['card__image-container']}>
                {/* Imagen principal - siempre visible */}
                <ResponsiveImage
                    publicId={typeof auto?.fotoPrincipal === 'object' ? auto?.fotoPrincipal?.public_id : null}
                    fallbackUrl={typeof auto?.fotoPrincipal === 'object' ? auto?.fotoPrincipal?.url : auto?.fotoPrincipal || primaryImage}
                    alt={altText}
                    variant="fluid"
                    widths={IMAGE_WIDTHS.card}
                    sizes={IMAGE_SIZES.card}
                    loading="lazy"
                    isCritical={true}
                    className={`${styles['card__image']} ${styles['card__image_primary']}`}
                />
                
                {/* Imagen hover - solo si existe y es diferente */}
                {hoverImage && hoverImage !== primaryImage && (
                    <ResponsiveImage
                        publicId={typeof auto?.fotoHover === 'object' ? auto?.fotoHover?.public_id : null}
                        fallbackUrl={typeof auto?.fotoHover === 'object' ? auto?.fotoHover?.url : auto?.fotoHover || hoverImage}
                        alt={altText}
                        variant="fluid"
                        widths={IMAGE_WIDTHS.card}
                        sizes={IMAGE_SIZES.card}
                        loading="lazy"
                        isCritical={true}
                        className={`${styles['card__image']} ${styles['card__image_hover']} ${isHovering ? styles['card__image_hover_active'] : ''}`}
                    />
                )}
                
                {/* ✅ INDICADORES SUTILES - Solo si hay 2 imágenes */}
                {hoverImage && hoverImage !== primaryImage && (
                    <div className={styles['card__indicators']}>
                        <div className={`${styles['card__indicator']} ${!isHovering ? styles['card__indicator_active'] : ''}`}></div>
                        <div className={`${styles['card__indicator']} ${isHovering ? styles['card__indicator_active'] : ''}`}></div>
                    </div>
                )}
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

                {/* ===== BOTÓN VER DETALLE ===== */}
                <div className={styles['card__footer']}>
                    <div className={styles['card__footer_border']}></div>
                    <button 
                        onClick={handleVerMas}
                        className={styles['card__button']}
                        data-testid="link-detalle"
                    >
                        Ver más
                    </button>
                </div>
            </div>
        </div>
    )
})

CardAuto.displayName = 'CardAuto'

export default CardAuto 