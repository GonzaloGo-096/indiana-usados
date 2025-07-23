/**
 * Dashboard - Panel de administración
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import autoService from '../../../services/service'
import { AUTH_CONFIG } from '../../../config/auth'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const navigate = useNavigate()
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin-all-autos'],
        queryFn: () => autoService.getAutos({ all: true }),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    })
    const autos = data?.items || []

    const handleLogout = () => {
        localStorage.removeItem(AUTH_CONFIG.storage.key)
        navigate(AUTH_CONFIG.routes.login)
    }

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>Cargando...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className={styles.error}>
                <div className={styles.alert}>
                    <h4 className={styles.alertTitle}>¡Error!</h4>
                    <p className={styles.alertMessage}>{error?.message || 'Error al cargar los vehículos'}</p>
                    <button 
                        onClick={() => refetch()} 
                        className={styles.retryButton}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Panel de Administración</h1>
                    <Link to="/" className={styles.secondaryButton}>
                        Ver Sitio Público
                    </Link>
                </div>
                <div className={styles.headerRight}>
                    <Link to="/admin/vehiculos/nuevo" className={styles.primaryButton}>
                        Agregar Vehículo
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton} type="button">
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.vehiclesList}>
                    <h2>Lista de Vehículos</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.centeredHeader}>ID</th>
                                    <th className={styles.centeredHeader}>Marca</th>
                                    <th className={styles.centeredHeader}>Modelo</th>
                                    <th className={styles.centeredHeader}>Año</th>
                                    <th className={styles.centeredHeader}>Kms</th>
                                    <th className={styles.centeredHeader}>Precio</th>
                                    <th className={styles.centeredHeader}>Estado</th>
                                    <th className={styles.centeredHeader}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {autos.map(auto => (
                                    <tr key={auto.id}>
                                        <td className={styles.centeredCell}>{auto.id}</td>
                                        <td className={styles.centeredCell}>{auto.marca}</td>
                                        <td className={styles.centeredCell}>{auto.modelo}</td>
                                        <td className={styles.centeredCell}>{auto.año}</td>
                                        <td className={styles.centeredCell}>{auto.kilometraje?.toLocaleString() ?? '-'}</td>
                                        <td className={styles.centeredCell}>${auto.precio?.toLocaleString()}</td>
                                        <td className={styles.centeredCell}>
                                            <span className={`${styles.badge} ${auto.activo ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {auto.activo ? 'Activo' : 'Pausado'}
                                            </span>
                                        </td>
                                        <td className={styles.centeredCell}>
                                            <div className={styles.buttonGroup}>
                                                <Link 
                                                    to={`/admin/vehiculos/${auto.id}/editar`}
                                                    className={`${styles.outlineButton} ${styles.smallButton}`}
                                                >
                                                    Editar
                                                </Link>
                                                <button 
                                                    className={`${styles.outlineButton} ${styles.dangerButton} ${styles.smallButton}`}
                                                    onClick={() => {/* TODO: Implementar eliminación */}}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 