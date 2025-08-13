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
 * @version 4.6.0 - Performance optimizada
 */

import React, { memo, useMemo, useCallback, useRef } from 'react'
import { CardAuto } from '@vehicles'
import { Button } from '@ui'
import { ListAutosSkeleton } from '@shared'
import { Alert } from '@ui'
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
    isLoadingMore = false,
    onLoadMore = null
}) => {
    // ✅ Callback memoizado para loadMore
    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isLoadingMore && onLoadMore) {
            onLoadMore()
        }
    }, [hasNextPage, isLoadingMore, onLoadMore])

    // ✅ OPTIMIZADO: Memoizar el grid de vehículos con keys estables
    const vehiclesGrid = useMemo(() => {
        if (!vehicles || vehicles.length === 0) {
            return null
        }

        return vehicles.map((vehicle, index) => {
            // ✅ OPTIMIZADO: Key estable basada en ID o índice
            const stableKey = vehicle.id ? `vehicle-${vehicle.id}` : `vehicle-index-${index}`
            
            return (
                <MemoizedCardAuto 
                    key={stableKey}
                    vehicle={vehicle}
                />
            )
        })
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

            {/* ✅ BOTÓN "CARGAR MÁS" */}
            {hasNextPage && (
                <div className={styles.loadMoreSection}>
                    <button 
                        className={styles.loadMoreButton}
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? 'Cargando...' : 'Cargar más vehículos'}
                    </button>
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