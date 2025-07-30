/**
 * CardAuto - Componente para mostrar información de un vehículo
 * 
 * Funcionalidades:
 * - Mostrar información del vehículo
 * - Navegación al detalle
 * - Imagen con lazy loading ultra optimizado
 * - Hover effects
 * - BEM methodology implementada
 * 
 * @author Indiana Usados
 * @version 2.3.0 - OPTIMIZACIÓN FINAL
 */

import React, { useMemo, useState, useRef, useEffect, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { formatValue } from '../../../utils/imageUtils'
import { useMainImage } from '../../../hooks/useImageOptimization'
import styles from './CardAuto.module.css'

/**
 * Componente CardAuto ultra optimizado para performance
 * @param {Object} auto - Objeto con información del vehículo
 * @param {string} auto.id - ID del vehículo
 * @param {string} auto.marca - Marca del vehículo
 * @param {string} auto.modelo - Modelo del vehículo
 * @param {string} auto.version - Versión del vehículo
 * @param {string} auto.precio - Precio del vehículo
 * @param {string} auto.año - Año del vehículo
 * @param {string} auto.kms - Kilometraje del vehículo
 * @param {string} auto.caja - Tipo de caja del vehículo
 * @param {string} auto.color - Color del vehículo
 * @param {string} auto.categoria - Categoría del vehículo
 */
export const CardAuto = forwardRef(({ auto }, ref) => {
    // ✅ OPTIMIZADO: Estado para manejo de carga de imagen
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isInViewport, setIsInViewport] = useState(false)
    const imageRef = useRef(null)
    
    // ✅ CORREGIDO: Hooks siempre primero, antes de cualquier early return
    const mainImage = useMainImage(auto)
    
    // ✅ OPTIMIZADO: Memoización más eficiente del alt text
    const altText = useMemo(() => {
        if (!auto?.marca || !auto?.modelo) return 'Vehículo'
        return `${formatValue(auto.marca)} ${formatValue(auto.modelo)}`
    }, [auto?.marca, auto?.modelo])

    // ✅ OPTIMIZADO: Función para formatear precio con puntos de miles
    const formatPrice = useMemo(() => (price) => {
        if (!price) return '-'
        
        // Convertir a número y formatear con puntos de miles
        const numericPrice = parseFloat(price.toString().replace(/[^\d]/g, ''))
        if (isNaN(numericPrice)) return price
        
        return `$${numericPrice.toLocaleString('es-AR')}`
    }, [])

    // ✅ NUEVA FUNCIÓN: Formatear kilometraje
    const formatKilometraje = useMemo(() => (kms) => {
        if (!kms) return '-'
        
        const numericKms = parseInt(kms)
        if (isNaN(numericKms)) return kms
        
        // Formatear con puntos de miles
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
            precio: auto.precio || '',
            año: auto.año || '',
            kilometraje: auto.kilometraje || '', // ✅ CORREGIDO: De kms a kilometraje
            caja: auto.caja || '',
            color: auto.color || '',
            categoria: auto.categoria || ''
        }
    }, [auto])

    // ✅ ULTRA OPTIMIZADO: Intersection Observer para lazy loading
    useEffect(() => {
        if (!imageRef.current) return
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInViewport(true)
                    observer.disconnect() // ✅ DESCONECTAR INMEDIATAMENTE
                }
            },
            {
                threshold: 0.05, // ✅ REDUCIDO: Solo 5% visible
                rootMargin: '50px' // ✅ REDUCIDO: Solo 50px de precarga
            }
        )
        
        observer.observe(imageRef.current)
        
        return () => observer.disconnect()
    }, [])

    // ✅ OPTIMIZADO: Manejo de carga de imagen simplificado
    const handleImageLoad = () => {
        setImageLoaded(true)
        setImageError(false)
    }

    const handleImageError = () => {
        setImageError(true)
        setImageLoaded(false)
    }

    // ✅ CORREGIDO: Validación después de hooks
    if (!vehicleData) {
        return null
    }

    // ✅ OPTIMIZADO: Destructuring con nombres correctos
    const { 
        id, 
        marca, 
        modelo, 
        version, 
        precio, 
        año, 
        kilometraje, // ✅ CORREGIDO: De kms a kilometraje
        caja, 
        color, 
        categoria 
    } = vehicleData

    // ✅ OPTIMIZADO: Handlers memoizados
    // const handleImageLoad = useMemo(() => () => setImageLoaded(true), [])
    // const handleImageError = useMemo(() => () => setImageError(true), [])

    return (
        <div className={styles.card} ref={ref}>
            {/* ✅ ULTRA OPTIMIZADO: Contenedor de imagen con lazy loading inteligente */}
            <div className={styles.card__image_container} ref={imageRef}>
                {!imageError && isInViewport ? (
                    <img 
                        src={mainImage} 
                        className={`${styles.card__image} ${imageLoaded ? styles['card__image--loaded'] : ''}`}
                        alt={altText}
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        // ✅ ULTRA OPTIMIZADO: Atributos para mejor performance
                        decoding="async"
                        fetchPriority="low"
                        width="400"
                        height="300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        // ✅ OPTIMIZADO: Preload para imágenes críticas (primeras 6)
                        {...(auto.id <= 6 && { fetchPriority: "high" })}
                    />
                ) : !isInViewport ? (
                    // ✅ OPTIMIZADO: Placeholder mientras no está en viewport
                    <div className={styles.card__image_placeholder}>
                        <div className={styles.card__placeholder_content}>
                            <div className={styles.card__placeholder_icon}>🚗</div>
                        </div>
                    </div>
                ) : (
                    // ✅ OPTIMIZADO: Fallback para errores de imagen
                    <div className={styles.card__image_fallback}>
                        <span>Imagen no disponible</span>
                    </div>
                )}
                
                {/* ✅ OPTIMIZADO: Indicador de carga solo cuando es necesario */}
                {!imageLoaded && !imageError && isInViewport && (
                    <div className={styles.card__image_loader}>
                        <div className={styles.card__spinner}></div>
                    </div>
                )}
            </div>
            
            {/* ✅ OPTIMIZADO: Cuerpo de la tarjeta con memoización */}
            <div className={styles.card__body}>
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
                                {formatValue(version)}
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
                            <span className={styles.card__data_value}>{formatKilometraje(kilometraje)}</span>
                        </div>
                        <div className={styles.card__data_item}>
                            <span className={styles.card__data_label}>Caja</span>
                            <span className={styles.card__data_value}>{formatValue(caja)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ✅ OPTIMIZADO: Footer con botón */}
            <div className={styles.card__footer}>
                {/* ✅ NUEVO: Border centrado arriba del botón */}
                <div className={styles.card__footer_border}></div>
                <Link to={`/vehiculo/${id}`}>
                    <Button 
                        variant="black" 
                        className={styles.card__button}
                    >
                        Ver más
                    </Button>
                </Link>
            </div>
        </div>
    )
})

// Agregar displayName para debugging
CardAuto.displayName = 'CardAuto' 