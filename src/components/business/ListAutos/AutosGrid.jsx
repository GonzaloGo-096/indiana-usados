/**
 * AutosGrid - Componente para mostrar el grid de vehículos con infinite scroll
 * 
 * Responsabilidades:
 * - Renderizado del grid de autos
 * - Infinite scroll con Intersection Observer
 * - Estados de carga y error del grid
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useCallback } from 'react'
import { CardAuto } from '../CardAuto'
import { Button } from '../../ui/Button'
import { ListAutosSkeleton } from '../../skeletons/ListAutosSkeleton'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'
import { Alert } from '../../ui/Alert'
import styles from './ListAutos.module.css'

/**
 * Componente de error reutilizable
 */
const ErrorMessage = ({ message, onRetry }) => (
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
)

const AutosGrid = ({ 
    autos, 
    isLoading, 
    isError, 
    error, 
    isFetchingNextPage, 
    hasNextPage, 
    onRetry, 
    onLoadMore 
}) => {
    /**
     * Función para manejar la carga de más elementos
     */
    const handleLoadMore = useCallback(() => {
        if (!isError && hasNextPage) {
            setTimeout(() => {
                if (!isError && hasNextPage) {
                    onLoadMore()
                }
            }, 100)
        }
    }, [isError, hasNextPage, onLoadMore])

    /**
     * Hook personalizado para intersection observer
     */
    const lastElementRef = useIntersectionObserver(handleLoadMore, {
        enabled: !isLoading && !isFetchingNextPage && !isError && hasNextPage
    })

    // ===== GUARD CLAUSES - Estados de carga y error =====
    
    // Estado de carga inicial
    if (isLoading && !autos.length) {
        return <ListAutosSkeleton cantidad={6} />
    }

    // Estado de error inicial
    if (isError && !autos.length) {
        return (
            <ErrorMessage 
                message={error?.message || 'Error al cargar los vehículos'} 
                onRetry={onRetry}
            />
        )
    }

    // Estado de lista vacía
    if (!autos.length) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyContent}>
                    <h3>No hay vehículos disponibles</h3>
                    <p>Por favor, intente más tarde</p>
                    <Button 
                        onClick={onRetry}
                        variant="primary"
                        className={styles.retryButton}
                    >
                        Actualizar
                    </Button>
                </div>
            </div>
        )
    }

    // ===== RENDERIZADO PRINCIPAL =====
    
    return (
        <>
            {/* Banner de error para errores durante la carga */}
            {isError && (
                <div className={styles.errorBanner}>
                    <Alert variant="warning">
                        <h3>Error al cargar más vehículos</h3>
                        <p>{error?.message || 'Error al cargar más vehículos'}</p>
                        <Button 
                            onClick={onRetry}
                            variant="outline"
                            size="small"
                        >
                            Reintentar
                        </Button>
                    </Alert>
                </div>
            )}

            {/* Grid de vehículos */}
            <div className={styles.grid}>
                {autos.map((auto, index) => (
                    <div 
                        key={auto.id} 
                        className={styles.cardWrapper}
                        // Intersection Observer en el último elemento
                        ref={index === autos.length - 1 ? lastElementRef : null}
                    >
                        <CardAuto auto={auto} />
                    </div>
                ))}
            </div>
            
            {/* Contenedor de carga y fin de lista */}
            <div className={`${styles.loadingContainer} ${isFetchingNextPage ? styles.loading : ''}`}>
                {/* Skeleton mientras carga más elementos */}
                {isFetchingNextPage && (
                    <ListAutosSkeleton cantidad={3} />
                )}
                
                {/* Mensaje de fin de lista */}
                {!hasNextPage && autos.length > 0 && (
                    <div className={styles.endMessage}>
                        <p>No hay más vehículos para mostrar</p>
                        <Button 
                            onClick={onRetry}
                            variant="outline"
                            className={styles.retryButton}
                        >
                            Actualizar lista
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}

export default AutosGrid 