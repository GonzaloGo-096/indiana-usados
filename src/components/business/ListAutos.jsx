import React, { useRef, useCallback, memo } from 'react'
import { CardAuto } from './cardAuto'
import { ListAutosSkeleton } from '../skeletons/ListAutosSkeleton'
import { useGetCars } from '../../hooks/useGetCars'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import '../../styles/listAutos.css'

// Componente de error
const ErrorMessage = ({ message, onRetry }) => (
    <div className="list-autos__error">
        <div className="list-autos__error-content">
            <h3>¡Ups! Algo salió mal</h3>
            <p>{message}</p>    
            {onRetry && (
                <button 
                    onClick={onRetry}
                    className="btn btn-primary mt-3"
                >
                    Reintentar
                </button>
            )}
        </div>
    </div>
)

export const ListAutos = () => {
    const { 
        autos, 
        loadMore, 
        hasNextPage, 
        isLoading, 
        isError, 
        error, 
        isFetchingNextPage,
        refetch
    } = useGetCars()

    // Función para manejar la carga
    const handleLoadMore = useCallback(() => {
        if (!isError && hasNextPage) {
            setTimeout(() => {
                if (!isError && hasNextPage) {
                    loadMore()
                }
            }, 100)
        }
    }, [isError, hasNextPage, loadMore])

    // Hook personalizado para intersection observer
    const lastElementRef = useIntersectionObserver(handleLoadMore, {
        enabled: !isLoading && !isFetchingNextPage && !isError && hasNextPage
    })

    // Función para manejar el reintento
    const handleRetry = useCallback(() => {
        refetch()
        if (autos.length > 0) {
            loadMore()
        }
    }, [refetch, loadMore, autos.length])

    // Guard clauses para estados de carga y error
    if (isLoading && !autos.length) {
        return <ListAutosSkeleton cantidad={6} />
    }

    if (isError && !autos.length) {
        return (
            <ErrorMessage 
                message={error?.message || 'Error al cargar los vehículos'} 
                onRetry={handleRetry}
            />
        )
    }

    if (!autos.length) {
        return (
            <div className="list-autos__empty">
                <div className="list-autos__empty-content">
                    <h3>No hay vehículos disponibles</h3>
                    <p>Por favor, intente más tarde</p>
                    <button 
                        onClick={handleRetry}
                        className="btn btn-primary mt-3"
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        )
    }

    // Renderizado principal
    return (
        <div className="list-autos">
            {isError && (
                <div className="list-autos__error-banner">
                    <ErrorMessage 
                        message={error?.message || 'Error al cargar más vehículos'} 
                        onRetry={handleRetry}
                    />
                </div>
            )}

            <div className="list-autos__grid">
                {autos.map((auto, index) => (
                    <div 
                        key={auto.id} 
                        className="list-autos__card-wrapper"
                        ref={index === autos.length - 1 ? lastElementRef : null}
                    >
                        <CardAuto auto={auto} />
                    </div>
                ))}
            </div>
            
            <div className={`list-autos__loading-container ${isFetchingNextPage ? 'loading' : ''}`}>
                {isFetchingNextPage && (
                    <ListAutosSkeleton cantidad={3} />
                )}
                
                {!hasNextPage && autos.length > 0 && (
                    <div className="list-autos__end-message">
                        <p>No hay más vehículos para mostrar</p>
                        <button 
                            onClick={handleRetry}
                            className="btn btn-outline-primary mt-2"
                        >
                            Actualizar lista
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
