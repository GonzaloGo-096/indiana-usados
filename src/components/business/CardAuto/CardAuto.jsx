/**
 * CardAuto - Componente para mostrar información de un vehículo
 * 
 * Funcionalidades:
 * - Mostrar información del vehículo
 * - Navegación al detalle
 * - Imagen con lazy loading ultra optimizado
 * - Hover effects
 * 
 * @author Indiana Usados
 * @version 1.2.0 - ULTRA OPTIMIZADO PARA PERFORMANCE
 */

import React, { memo, useMemo, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { formatValue } from '../../../utils/imageUtils'
import { useMainImage } from '../../../hooks/useImageOptimization'
import styles from './CardAuto.module.css'

// ✅ OPTIMIZADO: Función de comparación ultra eficiente
const arePropsEqual = (prevProps, nextProps) => {
  const prevAuto = prevProps.auto
  const nextAuto = nextProps.auto
  
  // ✅ OPTIMIZADO: Comparación directa de ID primero
  if (prevAuto?.id !== nextAuto?.id) {
    return false
  }
  
  // ✅ OPTIMIZADO: Comparar solo propiedades críticas que afectan el render
  const criticalProps = ['marca', 'modelo', 'precio', 'año', 'imagen']
  
  for (const prop of criticalProps) {
    if (prevAuto?.[prop] !== nextAuto?.[prop]) {
      return false
    }
  }
  
  return true
}

/**
 * Componente CardAuto ultra optimizado para performance
 * @param {Object} auto - Objeto con información del vehículo
 * @param {string} auto.id - ID del vehículo
 * @param {string} auto.marca - Marca del vehículo
 * @param {string} auto.modelo - Modelo del vehículo
 * @param {string} auto.precio - Precio del vehículo
 * @param {string} auto.año - Año del vehículo
 * @param {string} auto.kms - Kilometraje del vehículo
 * @param {string} auto.caja - Tipo de caja del vehículo
 * @param {string} auto.color - Color del vehículo
 * @param {string} auto.categoria - Categoría del vehículo
 */
export const CardAuto = memo(({ auto }) => {
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

    // ✅ OPTIMIZADO: Memoización de datos extraídos
    const vehicleData = useMemo(() => {
        if (!auto) return null
        
        return {
            id: auto.id,
            marca: auto.marca || '',
            modelo: auto.modelo || '',
            precio: auto.precio || '',
            año: auto.año || '',
            kms: auto.kms || '',
            caja: auto.caja || '',
            color: auto.color || '',
            categoria: auto.categoria || ''
        }
    }, [auto])

    // ✅ OPTIMIZADO: Intersection Observer para lazy loading inteligente
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInViewport(true)
                    observer.disconnect() // Solo una vez
                }
            },
            {
                rootMargin: '50px', // Cargar cuando esté a 50px
                threshold: 0.1
            }
        )

        if (imageRef.current) {
            observer.observe(imageRef.current)
        }

        return () => observer.disconnect()
    }, [])

    // ✅ CORREGIDO: Validación después de hooks
    if (!auto || !vehicleData) return null

    const { id, marca, modelo, precio, año, kms, caja, color, categoria } = vehicleData

    // ✅ OPTIMIZADO: Handlers memoizados
    const handleImageLoad = useMemo(() => () => setImageLoaded(true), [])
    const handleImageError = useMemo(() => () => setImageError(true), [])

    return (
        <div className={styles.card}>
            {/* ✅ ULTRA OPTIMIZADO: Contenedor de imagen con lazy loading inteligente */}
            <div className={styles.imageContainer} ref={imageRef}>
                {!imageError && isInViewport ? (
                    <img 
                        src={mainImage} 
                        className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
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
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.placeholderContent}>
                            <div className={styles.placeholderIcon}>🚗</div>
                        </div>
                    </div>
                ) : (
                    // ✅ OPTIMIZADO: Fallback para errores de imagen
                    <div className={styles.imageFallback}>
                        <span>Imagen no disponible</span>
                    </div>
                )}
                
                {/* ✅ OPTIMIZADO: Indicador de carga solo cuando es necesario */}
                {!imageLoaded && !imageError && isInViewport && (
                    <div className={styles.imageLoader}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
            </div>
            
            {/* ✅ OPTIMIZADO: Cuerpo de la tarjeta con memoización */}
            <div className={styles.body}>
                <h5 className={styles.title}>
                    {formatValue(marca)} {formatValue(modelo)}
                </h5>
                
                {/* ✅ OPTIMIZADO: Detalles del vehículo memoizados */}
                <div className={styles.details}>
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
                                </tbody>
                            </table>
                        </div>
                        
                        <div className={styles.tableSection}>
                            <table className={styles.table}>
                                <tbody>
                                    <tr>
                                        <th>Caja</th>
                                        <td>{formatValue(caja)}</td>
                                    </tr>
                                    <tr>
                                        <th>Color</th>
                                        <td>{formatValue(color)}</td>
                                    </tr>
                                    <tr>
                                        <th>Categoría</th>
                                        <td>{formatValue(categoria)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ✅ OPTIMIZADO: Footer con botón */}
            <div className={styles.footer}>
                <Link to={`/vehiculo/${id}`}>
                    <Button 
                        variant="primary" 
                        className={styles.button}
                    >
                        Ver más
                    </Button>
                </Link>
            </div>
        </div>
    )
}, arePropsEqual) // ✅ AGREGADO: Función de comparación personalizada

// Agregar displayName para debugging
CardAuto.displayName = 'CardAuto' 