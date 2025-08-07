/**
 * Dashboard - Panel de administración optimizado
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Optimizado para rendimiento
 */

import React, { useState, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { mockVehicles } from '@api/mockData'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [vehicles] = useState(mockVehicles) // Sin setState, datos estáticos

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    const handleEdit = (vehicleId) => {
        console.log('Editar vehículo:', vehicleId)
    }

    const handlePause = (vehicleId) => {
        console.log('Pausar vehículo:', vehicleId)
    }

    const handleDelete = (vehicleId) => {
        console.log('Eliminar vehículo:', vehicleId)
    }

    const handleAddVehicle = () => {
        console.log('Agregar vehículo')
    }

    const handleGoBack = () => {
        navigate('/')
    }

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Panel de Administración</h1>
                    <div className={styles.userInfo}>
                        <span>Admin</span>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className={styles.content}>
                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button onClick={handleAddVehicle} className={styles.addButton}>
                        + Agregar Vehículo
                    </button>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        ← Volver a la Página
                    </button>
                </div>

                {/* Vehicles List */}
                <div className={styles.vehiclesList}>
                    <h2>Lista de Vehículos ({vehicles.length})</h2>
                    
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className={styles.vehicleItem}>
                            <div className={styles.vehicleInfo}>
                                <div className={styles.vehicleImage}>
                                    <img 
                                        src={vehicle.imagen} 
                                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.vehicleDetails}>
                                    <h3>{vehicle.marca} {vehicle.modelo}</h3>
                                    <p>Año: {vehicle.año} | Km: {vehicle.kms?.toLocaleString()}</p>
                                    <p>Precio: ${vehicle.precio?.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className={styles.vehicleActions}>
                                <button 
                                    onClick={() => handleEdit(vehicle.id)} 
                                    className={styles.editButton}
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handlePause(vehicle.id)} 
                                    className={styles.pauseButton}
                                >
                                    Pausar
                                </button>
                                <button 
                                    onClick={() => handleDelete(vehicle.id)} 
                                    className={styles.deleteButton}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard 