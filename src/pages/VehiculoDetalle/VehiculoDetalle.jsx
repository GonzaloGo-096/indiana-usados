/**
 * VehiculoDetalle - Página de detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAutoDetail } from '../../hooks'
import { CardDetalle } from '../../components/business/CardDetalle'
import { ErrorState } from '../../components/ui'
import DetalleSkeleton from '../../components/skeletons/DetalleSkeleton'
import styles from './VehiculoDetalle.module.css'

const VehiculoDetalle = () => {
    const { id } = useParams()

    const { 
        auto,
        formattedData,
        isLoading, 
        isError, 
        error 
    } = useAutoDetail(id)

    // Estado de carga
    if (isLoading) return <DetalleSkeleton />

    // Estado de error
    if (isError) {
        return (
            <ErrorState
                title="Error al cargar el vehículo"
                message={error?.message || 'No se pudo cargar la información del vehículo'}
                actionText="Volver a la lista de vehículos"
                actionLink="/vehiculos"
                variant="error"
            />
        )
    }

    // Vehículo no encontrado
    if (!auto) {
        return (
            <ErrorState
                title="Vehículo no encontrado"
                message="El vehículo que buscas no existe o ha sido removido."
                actionText="Volver a la lista de vehículos"
                actionLink="/vehiculos"
                variant="notFound"
            />
        )
    }

    return (
        <div className={styles.container}>
            {/* Botón de volver */}
            <div className={styles.backButton}>
                <Link to="/vehiculos" className={styles.backLink}>
                    ← Volver a vehículos
                </Link>
            </div>
            
            {/* Contenido principal */}
            <div className={styles.content}>
                <CardDetalle 
                    auto={auto}
                    contactInfo={formattedData?.contactInfo}
                />
            </div>
        </div>
    )
}

export default VehiculoDetalle 