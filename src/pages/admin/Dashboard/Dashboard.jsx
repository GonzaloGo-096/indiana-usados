/**
 * Dashboard - Panel de administración
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGetCars } from '../../../hooks/useGetCars'
import { AUTH_CONFIG } from '../../../config/auth'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const navigate = useNavigate()
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
                    <button onClick={handleLogout} className={styles.logoutButton}>
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
                                    <th>ID</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Año</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {autos.map(auto => (
                                    <tr key={auto.id}>
                                        <td>{auto.id}</td>
                                        <td>{auto.marca}</td>
                                        <td>{auto.modelo}</td>
                                        <td>{auto.año}</td>
                                        <td>${auto.precio?.toLocaleString()}</td>
                                        <td>
                                            <span className={`${styles.badge} ${auto.activo ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {auto.activo ? 'Activo' : 'Pausado'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.buttonGroup}>
                                                <Link 
                                                    to={`/admin/vehiculos/${auto.id}/editar`}
                                                    className={styles.outlineButton}
                                                >
                                                    Editar
                                                </Link>
                                                <button 
                                                    className={`${styles.outlineButton} ${styles.dangerButton}`}
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
                    
                    {/* Botón para cargar más vehículos si hay más páginas */}
                    {hasNextPage && (
                        <div className={styles.loadMore}>
                            <button 
                                onClick={loadMore}
                                disabled={isFetchingNextPage}
                                className={styles.loadMoreButton}
                            >
                                {isFetchingNextPage ? 'Cargando...' : 'Cargar más vehículos'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard 