/**
 * VehiculoDetalle - Página de detalle de vehículo optimizada
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Performance optimizada
 */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useVehicleDetail } from '@hooks/vehicles'
import { CardDetalle } from '@vehicles'
import { ErrorState } from '@ui'
import { DetalleSkeleton } from '@shared'
import { useScrollPosition } from '@hooks'
import { VehicleSEOHead, SEOHead } from '@components/SEO'
import styles from './VehiculoDetalle.module.css'

const VehiculoDetalle = () => {
    const { id } = useParams()
    
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
        auto,
        isLoading, 
        isError, 
        error 
    } = useVehicleDetail(id, { enabled: true })

    // Función para volver preservando scroll
    const handleBack = () => {
        navigateWithScroll('/usados')
    }

    // Estado de carga
    if (isLoading) return <DetalleSkeleton />

    // Estado de error
    if (isError) {
        return (
            <>
                <SEOHead
                    title="Error al cargar el vehículo"
                    description="No se pudo cargar la información del vehículo solicitado."
                    noindex={true}
                />
                <ErrorState
                    title="Error al cargar el vehículo"
                    message={error?.message || 'No se pudo cargar la información del vehículo'}
                    actionText="Volver a la lista de vehículos"
                    actionLink="/usados"
                    variant="error"
                />
            </>
        )
    }

    // Vehículo no encontrado
    if (!auto) {
        return (
            <>
                <VehicleSEOHead vehicle={null} />
                <ErrorState
                    title="Vehículo no encontrado"
                    message="El vehículo que buscas no existe o ha sido removido."
                    actionText="Volver a la lista de vehículos"
                    actionLink="/usados"
                    variant="notFound"
                />
            </>
        )
    }

    return (
        <>
            <VehicleSEOHead vehicle={auto} />
            <div className={styles.container}>
            {/* Botón de volver con preservación de scroll */}
            <div className={styles.backButton}>
                <button onClick={handleBack} className={styles.backLink}>
                    <span className={styles.backArrow}>←</span>
                    <span>Volver a la lista</span>
                </button>
            </div>
            
            {/* Contenido principal */}
            <div className={styles.content}>
                <CardDetalle auto={auto} />
            </div>
            </div>
        </>
    )
}

export default VehiculoDetalle 