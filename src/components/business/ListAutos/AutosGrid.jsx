/**
 * AutosGrid - Componente para mostrar el grid de vehículos
 * 
 * Responsabilidades:
 * - Renderizado del grid de autos
 * - Estados de carga y error del grid
 * - Paginación infinita con scroll automático optimizado
 * - Optimización de performance sin virtualización compleja
 * 
 * @author Indiana Usados
 * @version 4.3.0 - SIMPLIFICADO PARA ESTABILIDAD
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react'
import { CardAuto } from '../CardAuto'
import { Button } from '../../ui/Button'
import { ListAutosSkeleton } from '../../skeletons/ListAutosSkeleton'
import { Alert } from '../../ui/Alert'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'
import styles from './ListAutos.module.css'

/**
 * Componente de error reutilizable
 */
const ErrorMessage = memo(({ message, onRetry }) => (
    <div className={styles.error}>
        <div className={styles.errorContent}>
            <h3>¡Ups! Algo salió mal</h3>
            <p>{message}</p>    
            {onRetry && (
                <Button 
                    onClick={onRetry}
                    variant="primary"
                    className={styles.retryButton}
                >
                    Reintentar
                </Button>
            )}
        </div>
    </div>
))

ErrorMessage.displayName = 'ErrorMessage'

/**
 * ✅ OPTIMIZADO: Componente de tarjeta individual memoizado
 */
const MemoizedCardAuto = memo(({ auto }) => (
    <div className={styles.cardWrapper}>
        <CardAuto auto={auto} />
    </div>
))

MemoizedCardAuto.displayName = 'MemoizedCardAuto'

const AutosGrid = memo(({ 
    autos, 
    isLoading, 
    isError, 
    error, 
    onRetry,
    // Props para paginación
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore = null
}) => {
    // ✅ OPTIMIZADO: Callback memoizado para loadMore
    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage && onLoadMore) {
            onLoadMore()
        }
    }, [hasNextPage, isFetchingNextPage, onLoadMore])

    // ✅ NUEVA FUNCIÓN: Análisis de performance del scroll
    useEffect(() => {
        if (hasNextPage && autos?.length) {
            const startTime = performance.now()
            
            // ✅ MONITOREO: Performance del scroll
            const measureScrollPerformance = () => {
                const endTime = performance.now()
                const scrollTime = endTime - startTime
                
                console.log(`📊 Performance del scroll:
                    - Tiempo de render: ${scrollTime.toFixed(2)}ms
                    - Elementos renderizados: ${autos.length}
                    - FPS estimado: ${(1000 / scrollTime).toFixed(1)}
                    - Memoria usada: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB
                `)
            }
            
            // ✅ MEDICIÓN: Después de que se complete el render
            requestAnimationFrame(measureScrollPerformance)
        }
    }, [hasNextPage, autos?.length])

    // ✅ NUEVA FUNCIÓN: Debugging para monitorear carga automática
    useEffect(() => {
        if (hasNextPage && autos?.length) {
            console.log(`📊 Estado de carga automática:
                - Elementos actuales: ${autos.length}
                - Hay más contenido: ${hasNextPage}
                - Cargando: ${isFetchingNextPage}
                - Último elemento observado: ${lastAutoRef.current ? 'Sí' : 'No'}
            `)
        }
    }, [hasNextPage, autos?.length, isFetchingNextPage])

    // ✅ OPTIMIZADO: Solo el último elemento tiene observer
    const lastAutoRef = useRef(null)
    
    // ✅ NUEVA FUNCIÓN: Detectar automáticamente el último elemento
    const handleLastAutoIntersection = useCallback((entries) => {
        const [entry] = entries
        
        // ✅ AUTOMÁTICO: Si el último elemento es visible y hay más contenido
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log('🔄 Último elemento visible - Cargando más contenido...')
            onLoadMore()
        }
    }, [hasNextPage, isFetchingNextPage, onLoadMore])

    // ✅ ULTRA OPTIMIZADO: Observer con configuración minimalista
    useEffect(() => {
        // ✅ SOLO CREAR OBSERVER SI HAY MÁS CONTENIDO
        if (!hasNextPage || !autos?.length) return

        const observer = new IntersectionObserver(handleLastAutoIntersection, {
            threshold: 0.01, // ✅ REDUCIDO: Solo 1% del elemento
            rootMargin: '25px' // ✅ REDUCIDO: Solo 25px de precarga
        })

        if (lastAutoRef.current) {
            observer.observe(lastAutoRef.current)
            console.log('👁️ Observer activado en último elemento')
        }

        return () => {
            observer.disconnect()
            console.log('🔌 Observer desconectado')
        }
    }, [handleLastAutoIntersection, autos?.length, hasNextPage])

    // ✅ OPTIMIZADO: Memoizar el grid con ref en último elemento
    const autosGrid = useMemo(() => {
        if (!autos?.length) return null
        
        return (
            <div className={styles.grid}>
                {autos.map((auto, index) => {
                    const isLastElement = index === autos.length - 1
                    
                    return (
                        <MemoizedCardAuto 
                            key={auto.id} 
                            auto={auto}
                            ref={isLastElement ? lastAutoRef : null}
                        />
                    )
                })}
            </div>
        )
    }, [autos]) // ✅ Solo se recalcula si cambia el array de autos

    // ✅ OPTIMIZADO: Memoizar el banner de error
    const errorBanner = useMemo(() => {
        if (!isError) return null
        
        return (
            <div className={styles.errorBanner}>
                <Alert variant="warning">
                    <h3>Error al cargar vehículos</h3>
                    <p>{error?.message || 'Error al cargar los vehículos'}</p>
                    <Button 
                        onClick={onRetry}
                        variant="outline"
                        size="small"
                    >
                        Reintentar
                    </Button>
                </Alert>
            </div>
        )
    }, [isError, error?.message, onRetry])

    // ✅ OPTIMIZADO: Memoizar el trigger de scroll infinito
    const scrollTrigger = useMemo(() => {
        if (!hasNextPage) return null
        
        return (
            <div className={styles.scrollTrigger}>
                {/* ✅ MEJORADO: Indicador de carga automática */}
                {isFetchingNextPage && (
                    <div className={styles.loadingMore}>
                        <div className={styles.spinner}></div>
                        <span>🔄 Cargando más vehículos automáticamente...</span>
                    </div>
                )}
            </div>
        )
    }, [hasNextPage, isFetchingNextPage])

    // ✅ OPTIMIZADO: Memoizar el mensaje de "no más resultados"
    const noMoreResults = useMemo(() => {
        if (hasNextPage || !autos?.length) return null
        
        return (
            <div className={styles.noMoreResults}>
                <p>No hay más vehículos para mostrar</p>
            </div>
        )
    }, [hasNextPage, autos?.length])

    // ===== RENDERIZADO CONDICIONAL OPTIMIZADO =====
    
    // ✅ OPTIMIZADO: Estados de carga
    if (isLoading) {
        return <ListAutosSkeleton />
    }

    // ✅ OPTIMIZADO: Estado de error
    if (isError) {
        return <ErrorMessage message={error?.message} onRetry={onRetry} />
    }

    // ✅ OPTIMIZADO: Estado vacío
    if (!autos?.length) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyContent}>
                    <h3>No se encontraron vehículos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            </div>
        )
    }

    // ✅ OPTIMIZADO: Renderizado principal
    return (
        <div className={styles.gridContainer}>
            {errorBanner}
            {autosGrid}
            {scrollTrigger}
            {noMoreResults}
        </div>
    )
})

// ✅ AGREGADO: Display name para debugging
AutosGrid.displayName = 'AutosGrid'

export default AutosGrid 