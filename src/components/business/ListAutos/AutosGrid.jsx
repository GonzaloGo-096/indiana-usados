/**
 * AutosGrid - Componente para mostrar el grid de vehículos
 * 
 * Responsabilidades:
 * - Renderizado del grid de autos
 * - Estados de carga y error del grid
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React from 'react'
import { CardAuto } from '../CardAuto'
import { Button } from '../../ui/Button'
import { ListAutosSkeleton } from '../../skeletons/ListAutosSkeleton'
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
    onRetry
}) => {
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
                    <p>Intente ajustar los filtros o vuelva más tarde</p>
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
            )}

            {/* Grid de vehículos */}
            <div className={styles.grid}>
                {autos.map((auto) => (
                    <div 
                        key={auto.id} 
                        className={styles.cardWrapper}
                    >
                        <CardAuto auto={auto} />
                    </div>
                ))}
            </div>
            
            {/* Mensaje de fin de lista */}
            {autos.length > 0 && (
                <div className={styles.endMessage}>
                    <p>Mostrando {autos.length} vehículo{autos.length !== 1 ? 's' : ''}</p>
                    <Button 
                        onClick={onRetry}
                        variant="outline"
                        className={styles.retryButton}
                    >
                        Actualizar lista
                    </Button>
                </div>
            )}
        </>
    )
}

export default AutosGrid 