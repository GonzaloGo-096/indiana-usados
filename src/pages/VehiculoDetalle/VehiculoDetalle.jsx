/**
 * VehiculoDetalle - Página de detalle de vehículo optimizada
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Performance optimizada
 */

import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useAutoDetail } from '@hooks'
import { CardDetalle } from '@vehicles'
import { ErrorState } from '@ui'
import { DetalleSkeleton } from '@shared'
import { useScrollPosition } from '@hooks/useScrollPosition'
import styles from './VehiculoDetalle.module.css'

const VehiculoDetalle = () => {
    const { id } = useParams()
    const { state } = useLocation()
    
    // ✅ OBTENER DATOS DEL NAVIGATE (cache)
    const vehicleDataFromCache = state?.vehicleData
    
    // Hook para preservar scroll
    const { navigateWithScroll } = useScrollPosition({
        key: 'vehicles-list',
        enabled: true
    })

    // Scroll hacia arriba al cargar la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ✅ USAR DATOS DEL CACHE SI ESTÁN DISPONIBLES
    const { 
        auto: autoFromAPI,
        formattedData,
        isLoading, 
        isError, 
        error 
    } = useAutoDetail(id, { 
        enabled: !vehicleDataFromCache // Solo hacer API call si no hay datos en cache
    })
    
    // ✅ PRIORIZAR DATOS DEL CACHE
    const auto = vehicleDataFromCache || autoFromAPI
    
    // ✅ DEBUG TEMPORALMENTE DESACTIVADO PARA INVESTIGAR BUCLE INFINITO

    // Función para volver preservando scroll
    const handleBack = () => {
        navigateWithScroll('/vehiculos')
    }

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
            {/* Botón de volver con preservación de scroll */}
            <div className={styles.backButton}>
                <button onClick={handleBack} className={styles.backLink}>
                    <span className={styles.backArrow}>←</span>
                    <span>Atrás</span>
                </button>
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