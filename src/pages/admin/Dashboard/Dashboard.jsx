/**
 * Dashboard - Panel de administración
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import vehiclesApi from '../../../api/vehiclesApi'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    // Obtener estadísticas usando vehiclesApi
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => vehiclesApi.getAdminStats(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    })

    if (isLoading) return <div>Cargando estadísticas...</div>
    if (error) return <div>Error al cargar estadísticas: {error.message}</div>

    return (
        <div className={styles.dashboard}>
            <h1>Dashboard</h1>
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <h3>Total de Vehículos</h3>
                    <p>{stats?.totalVehicles || 0}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Vehículos Activos</h3>
                    <p>{stats?.activeVehicles || 0}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total de Vistas</h3>
                    <p>{stats?.totalViews || 0}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 