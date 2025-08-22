/**
 * Dashboard - Panel de administración optimizado
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Integrado con reducer simplificado para modal de autos
 */

import React, { useReducer, useCallback } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useAutoLogout } from '@hooks/useAutoLogout'
import { useVehicleData } from '@hooks/useVehicleData'
import { getVehicleImageUrl } from '@hooks/useVehicleImage'

import { useNavigate } from 'react-router-dom'
import CarFormRHF from '../../../features/cars/ui/CarFormRHF'
import { 
    carModalReducer, 
    initialCarModalState, 
    openCreateForm,
    openEditForm,
    closeModal,
    setLoading,
    setError,
    clearError
} from '../../../features/cars/ui/useCarModal.reducer'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const { logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    // ✅ HOOK PERSONALIZADO: Carga y normalización de datos
    const { vehicles, isLoading, error, refetch } = useVehicleData({ 
        limit: 50, 
        enabled: isAuthenticated 
    })

    // ✅ ESTADO DEL MODAL CON REDUCER SIMPLIFICADO
    const [modalState, dispatch] = useReducer(carModalReducer, initialCarModalState)
    
    // ✅ AUTO-LOGOUT: Se activa cuando el usuario sale de la página
    useAutoLogout(isAuthenticated)

    // ✅ MANEJADORES DE AUTENTICACIÓN
    const handleLogout = useCallback(() => {
        logout()
        navigate('/admin/login')
    }, [logout, navigate])

    // ✅ MANEJADORES DEL MODAL DE AUTOS (SIMPLE)
    const handleOpenCreateForm = useCallback(() => {
        dispatch(openCreateForm())
    }, [])

    const handleOpenEditForm = useCallback((vehicle) => {
        // ✅ CONVERTIR VEHICLE A FORMATO DE AUTO
        const carData = {
            _id: vehicle.id,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            version: vehicle.version || 'Standard',
            precio: vehicle.precio,
            caja: vehicle.caja || 'Automática',
            segmento: vehicle.segmento || 'Sedán',
            cilindrada: vehicle.cilindrada || 2000,
            color: vehicle.color || 'Blanco',
            anio: vehicle.año,
            combustible: vehicle.combustible || 'Gasolina',
            transmision: vehicle.transmision || 'CVT',
            kilometraje: vehicle.kms,
            traccion: vehicle.traccion || 'Delantera',
            tapizado: vehicle.tapizado || 'Tela',
            categoriaVehiculo: vehicle.categoriaVehiculo || 'Particular',
            frenos: vehicle.frenos || 'ABS',
            turbo: vehicle.turbo || 'No',
            llantas: vehicle.llantas || 'Aleación 16"',
            HP: vehicle.HP || '150',
            detalle: vehicle.detalle || 'Vehículo en buen estado',
            urls: {
                fotoFrontal: '/src/assets/auto1.jpg',
                fotoTrasera: '/src/assets/auto1.jpg',
                fotoLateralIzquierda: '/src/assets/auto1.jpg',
                fotoLateralDerecha: '/src/assets/auto1.jpg',
                fotoInterior: '/src/assets/auto1.jpg'
            }
        }
        
        dispatch(openEditForm(carData))
    }, [])

    const handleCloseModal = useCallback(() => {
        dispatch(closeModal())
    }, [])

    // ✅ MANEJADORES DE ACCIONES (PREPARADOS PARA FUTURAS MUTATIONS)
    const handleCreateVehicle = useCallback(async (formData) => {
        try {
            dispatch(setLoading())
            
            // ✅ SIMULAR LLAMADA A API (REEMPLAZAR CON useMutation)
            console.log('🚀 CREAR VEHÍCULO:', { formData })
            console.log('📋 FORMDATA ENTRIES:')
            
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`📁 ${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    })
                } else {
                    console.log(`📝 ${key}:`, value)
                }
            }
            
            // ✅ SIMULAR ÉXITO
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
            console.log('✅ Vehículo creado exitosamente')
            
            // ✅ REFRESCAR LISTA Y CERRAR MODAL
            setTimeout(() => {
                refetch()
                handleCloseModal()
            }, 1500)
            
        } catch (error) {
            console.error('❌ Error al crear vehículo:', error)
            dispatch(setError('No se pudo crear el vehículo. Intente nuevamente.'))
        }
    }, [refetch, handleCloseModal])

    const handleUpdateVehicle = useCallback(async (formData, vehicleId) => {
        try {
            dispatch(setLoading())
            
            // ✅ SIMULAR LLAMADA A API (REEMPLAZAR CON useMutation)
            console.log('🚀 ACTUALIZAR VEHÍCULO:', { vehicleId, formData })
            console.log('📋 FORMDATA ENTRIES:')
            
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`📁 ${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    })
                } else {
                    console.log(`📝 ${key}:`, value)
                }
            }
            
            // ✅ SIMULAR ÉXITO
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
            console.log('✅ Vehículo actualizado exitosamente')
            
            // ✅ REFRESCAR LISTA Y CERRAR MODAL
            setTimeout(() => {
                refetch()
                handleCloseModal()
            }, 1500)
            
        } catch (error) {
            console.error('❌ Error al actualizar vehículo:', error)
            dispatch(setError('No se pudo actualizar el vehículo. Intente nuevamente.'))
        }
    }, [refetch, handleCloseModal])

    // ✅ MANEJADORES DE ACCIONES ADICIONALES (PREPARADOS PARA FUTURAS MUTATIONS)
    const handlePauseVehicle = useCallback(async (vehicleId) => {
        try {
            // ✅ SIMULAR LLAMADA A API (REEMPLAZAR CON useMutation)
            console.log('⏸️ PAUSAR VEHÍCULO:', vehicleId)
            
            // ✅ SIMULAR ÉXITO
            await new Promise(resolve => setTimeout(resolve, 500))
            console.log('✅ Vehículo pausado exitosamente')
            
            // ✅ REFRESCAR LISTA
            refetch()
            
        } catch (error) {
            console.error('❌ Error al pausar vehículo:', error)
        }
    }, [refetch])

    const handleDeleteVehicle = useCallback(async (vehicleId) => {
        try {
            // ✅ SIMULAR LLAMADA A API (REEMPLAZAR CON useMutation)
            console.log('🗑️ ELIMINAR VEHÍCULO:', vehicleId)
            
            // ✅ SIMULAR ÉXITO
            await new Promise(resolve => setTimeout(resolve, 500))
            console.log('✅ Vehículo eliminado exitosamente')
            
            // ✅ REFRESCAR LISTA
            refetch()
            
        } catch (error) {
            console.error('❌ Error al eliminar vehículo:', error)
        }
    }, [refetch])

    // ✅ MANEJADOR DE NAVEGACIÓN
    const handleGoBack = useCallback(() => {
        navigate('/')
    }, [navigate])

    // ✅ MANEJADOR DE SUBMIT DEL FORMULARIO
    const handleFormSubmit = useCallback(async (formData) => {
        const mode = modalState.mode
        const vehicleId = modalState.initialData?._id
        
        if (mode === 'create') {
            await handleCreateVehicle(formData)
        } else {
            await handleUpdateVehicle(formData, vehicleId)
        }
    }, [modalState, handleCreateVehicle, handleUpdateVehicle])

    // ✅ LOADING STATE
    if (isLoading) {
        return (
            <div className={styles.dashboard}>
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
                
                <div className={styles.content}>
                    <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
                        Cargando vehículos del servidor...
                    </div>
                </div>
            </div>
        )
    }

    // ✅ ERROR STATE
    if (error) {
        return (
            <div className={styles.dashboard}>
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
                
                <div className={styles.content}>
                    <div style={{ textAlign: 'center', padding: '50px', color: '#dc3545' }}>
                        <h3>Error al cargar vehículos</h3>
                        <p>{error}</p>
                        <button onClick={refetch} className={styles.addButton}>
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        )
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
                    <button onClick={handleOpenCreateForm} className={styles.addButton}>
                        + Agregar Vehículo
                    </button>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        ← Volver a la Página
                    </button>
                </div>

                {/* Vehicles List */}
                <div className={styles.vehiclesList}>
                    <h2>Lista de Vehículos ({vehicles.length})</h2>
                    
                    {vehicles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                            No hay vehículos disponibles
                        </div>
                    ) : (
                        vehicles.map((vehicle) => (
                        <div key={vehicle.id} className={styles.vehicleItem}>
                            <div className={styles.vehicleInfo}>
                                <div className={styles.vehicleImage}>
                                    <img 
                                            src={getVehicleImageUrl(vehicle)}
                                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                                        loading="lazy"
                                            onError={(e) => {
                                                e.target.src = '/src/assets/auto1.jpg'
                                            }}
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
                                        onClick={() => handleOpenEditForm(vehicle)} 
                                    className={styles.editButton}
                                >
                                    Editar
                                </button>
                                <button 
                                        onClick={() => handlePauseVehicle(vehicle.id)} 
                                    className={styles.pauseButton}
                                >
                                    Pausar
                                </button>
                                <button 
                                        onClick={() => handleDeleteVehicle(vehicle.id)} 
                                    className={styles.deleteButton}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

                        {/* ✅ MODAL DE GESTIÓN DE AUTOS */}
            {modalState.isOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {/* ✅ BOTÓN DE CERRAR EN EL BORDE */}
                        <button 
                            onClick={handleCloseModal}
                            className={styles.modalCloseButton}
                            aria-label="Cerrar modal"
                        >
                            ✕
                        </button>
                        
                        <div className={styles.modalBody}>
                            {/* ✅ FEEDBACK DE ESTADO */}
                            {modalState.error && (
                                <div className={styles.errorMessage}>
                                    {modalState.error}
                                </div>
                            )}
                            
                            <CarFormRHF
                                mode={modalState.mode}
                                initialData={modalState.initialData}
                                onSubmitFormData={handleFormSubmit}
                                isLoading={modalState.loading}
                                onClose={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard 