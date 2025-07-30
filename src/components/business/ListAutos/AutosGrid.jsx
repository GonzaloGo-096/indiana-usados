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

import React, { memo, useMemo, useCallback } from 'react'
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

    // ===== INTERSECTION OBSERVER PARA SCROLL INFINITO =====
    const loadMoreRef = useIntersectionObserver(
        handleLoadMore,
        {
            enabled: hasNextPage && !isFetchingNextPage,
            rootMargin: '100px', // ✅ OPTIMIZADO: Reducido para mejor performance
            threshold: 0.1
        }
    )

    // ===== MEMOIZACIÓN DE ELEMENTOS COSTOSOS =====
    
    // ✅ OPTIMIZADO: Memoizar el grid de autos
    const autosGrid = useMemo(() => {
        if (!autos?.length) return null
        
        return (
            <div className={styles.grid}>
                {autos.map((auto) => (
                    <MemoizedCardAuto 
                        key={auto.id} 
                        auto={auto} 
                    />
                ))}
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
            <div 
                ref={loadMoreRef}
                className={styles.scrollTrigger}
            >
                {/* ✅ OPTIMIZADO: Indicador de carga para paginación */}
                {isFetchingNextPage && (
                    <div className={styles.loadingMore}>
                        <div className={styles.spinner}></div>
                        <span>Cargando más vehículos...</span>
                    </div>
                )}
            </div>
        )
    }, [hasNextPage, isFetchingNextPage, loadMoreRef])

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