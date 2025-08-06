/**
 * AutosGrid - Componente para mostrar el grid de vehículos optimizado
 * 
 * Responsabilidades:
 * - Renderizado del grid de autos
 * - Estados de carga y error del grid
 * - Paginación infinita con scroll automático optimizado
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 4.5.0 - Performance optimizada
 */

import React, { memo, useMemo, useCallback, useRef } from 'react'
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
 * Componente de tarjeta individual optimizado
 */
const MemoizedCardAuto = memo(React.forwardRef(({ vehicle }, ref) => (
    <div className={styles.cardWrapper} ref={ref}>
        <CardAuto auto={vehicle} />
    </div>
)))

MemoizedCardAuto.displayName = 'MemoizedCardAuto'

const AutosGrid = memo(({ 
    vehicles, 
    isLoading, 
    isError, 
    error, 
    onRetry,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore = null
}) => {
    // Callback memoizado para loadMore
    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage && onLoadMore) {
            onLoadMore()
        }
    }, [hasNextPage, isFetchingNextPage, onLoadMore])

    // Ref para el elemento de carga
    const loadMoreRef = useRef(null)

    // Intersection observer para carga automática
    const { isIntersecting } = useIntersectionObserver(loadMoreRef, {
        threshold: 0.1,
        rootMargin: '100px'
    })

    // Cargar más cuando el elemento es visible
    React.useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage) {
            handleLoadMore()
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, handleLoadMore])

    // Memoizar el grid de vehículos
    const vehiclesGrid = useMemo(() => {
        if (!vehicles || vehicles.length === 0) {
            return null
        }

        return vehicles.map((vehicle, index) => (
            <MemoizedCardAuto 
                key={`vehicle-${vehicle.id || index}`}
                vehicle={vehicle}
                ref={index === vehicles.length - 1 ? loadMoreRef : null}
            />
        ))
    }, [vehicles])

    // Estado de carga inicial
    if (isLoading && (!vehicles || vehicles.length === 0)) {
        return <ListAutosSkeleton />
    }

    // Estado de error
    if (isError) {
        return (
            <ErrorMessage 
                message={error?.message || 'Error al cargar los vehículos'}
                onRetry={onRetry}
            />
        )
    }

    // Sin vehículos
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyContent}>
                    <h3>No se encontraron vehículos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.gridContainer}>
            {/* Grid de vehículos */}
            <div className={styles.grid}>
                {vehiclesGrid}
            </div>

            {/* Indicador de carga más */}
            {hasNextPage && (
                <div className={styles.loadMoreIndicator}>
                    {isFetchingNextPage ? (
                        <div className={styles.loadingMore}>
                            <span>Cargando más vehículos...</span>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleLoadMore}
                            variant="secondary"
                            className={styles.loadMoreButton}
                        >
                            Cargar más
                        </Button>
                    )}
                </div>
            )}

            {/* Alertas */}
            {isError && (
                <Alert 
                    type="error"
                    title="Error"
                    message={error?.message || 'Error al cargar los vehículos'}
                    onClose={onRetry}
                />
            )}
        </div>
    )
})

AutosGrid.displayName = 'AutosGrid'

export default AutosGrid 