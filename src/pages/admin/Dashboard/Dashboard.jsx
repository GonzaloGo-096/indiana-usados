/**
 * Dashboard - Panel de administración optimizado
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Integrado con reducer simplificado para modal de autos
 */

import React, { useReducer, useCallback, useState } from 'react'
import fallbackImage from '@assets/vehicles/fallback-vehicle.jpg'
import { useAuth, useVehiclesList } from '@hooks'
import { useCarMutation } from '@hooks'
import vehiclesService from '@services/vehiclesApi'
import { toAdminListItem } from '@mappers'
import { normalizeDetailToFormInitialData, unwrapDetail } from '@components/admin/mappers/normalizeForForm'
import { Alert } from '@ui'

import { useNavigate } from 'react-router-dom'
import LazyCarForm from '@components/admin/CarForm/LazyCarForm'
import { 
    carModalReducer, 
    initialCarModalState, 
    openCreateForm,
    openEditForm,
    closeModal,
    setLoading,
    setError,
    clearError
} from '@components/admin/hooks/useCarModal.reducer'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const { logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    // ✅ HOOK UNIFICADO: React Query con cache, retry y abort signal
    const { vehicles, isLoading, error, refetch } = useVehiclesList(
        {}, // sin filtros - Dashboard muestra todos los vehículos
        { pageSize: 50 } // carga 50 vehículos para admin
    )
    
    // ✅ HOOK PARA MUTACIONES DE AUTOS (versión simple)
    const { createMutation, updateMutation, deleteMutation } = useCarMutation()

    // ✅ ESTADO DEL MODAL CON REDUCER SIMPLIFICADO
    const [modalState, dispatch] = useReducer(carModalReducer, initialCarModalState)
    
    // ✅ ESTADO PARA ERRORES DE ELIMINACIÓN (fuera del modal)
    const [deleteError, setDeleteError] = useState(null)
    
    // ✅ AUTO-LOGOUT: Integrado en useAuth (no necesita hook separado)

    // ✅ MANEJADORES DE AUTENTICACIÓN
    const handleLogout = useCallback(() => {
        logout()
        navigate('/admin/login')
    }, [logout, navigate])

    // ✅ MANEJADORES DEL MODAL DE AUTOS (SIMPLE)
    const handleOpenCreateForm = useCallback(() => {
        dispatch(openCreateForm())
    }, [dispatch])

    const handleOpenEditForm = useCallback(async (vehicle) => {
        try {
            const id = vehicle._id || vehicle.id
            dispatch(setLoading())

            // ✅ GET público por diseño: el endpoint /photos/getonephoto no requiere auth
            // Mutations (create/update/delete) van por vehiclesAdminService (requiere auth)
            const detail = await vehiclesService.getVehicleById(id)

            const unwrapped = unwrapDetail(detail)
            const carData = normalizeDetailToFormInitialData(unwrapped)

            if (!carData || typeof carData !== 'object') {
                dispatch(setError('Respuesta de detalle inválida'))
                return
            }

            dispatch(openEditForm(carData))
        } catch (err) {
            dispatch(setError('No se pudo cargar el detalle del vehículo'))
        }
    }, [dispatch])

    const handleCloseModal = useCallback(() => {
        dispatch(closeModal())
    }, [dispatch])

    // ✅ MANEJADORES DE ACCIONES (PREPARADOS PARA FUTURAS MUTATIONS)
    const handleCreateVehicle = useCallback(async (formData) => {
        try {
            dispatch(setLoading())
            
            // ✅ USAR LA MUTATION DIRECTA
            await createMutation.mutateAsync(formData)
            
            // ✅ REFRESCAR LISTA Y CERRAR MODAL
            refetch()
            handleCloseModal()
            
        } catch (error) {
            dispatch(setError(`No se pudo crear el vehículo: ${error.message}`))
        }
    }, [refetch, handleCloseModal, dispatch, createMutation])

    const handleUpdateVehicle = useCallback(async (formData, vehicleId) => {
        try {
            dispatch(setLoading())
            
            // ✅ USAR LA MUTATION DIRECTA
            await updateMutation.mutateAsync({ id: vehicleId, formData })
            
            // ✅ REFRESCAR LISTA Y CERRAR MODAL
            refetch()
            handleCloseModal()
            
        } catch (error) {
            dispatch(setError(`No se pudo actualizar el vehículo: ${error.message}`))
        }
    }, [refetch, handleCloseModal, dispatch, updateMutation])

    // ✅ MANEJADOR DE ELIMINACIÓN
    const handleDeleteVehicle = useCallback(async (vehicleId) => {
        try {
            // Limpiar error previo
            setDeleteError(null)
            
            // ✅ CONFIRMACIÓN ANTES DE ELIMINAR
            const confirmed = window.confirm('¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer.')
            if (!confirmed) {
                return
            }
            
            // ✅ USAR LA MUTATION DIRECTA
            await deleteMutation.mutateAsync(vehicleId)
            
            // ✅ REFRESCAR LISTA
            refetch()
            
        } catch (error) {
            setDeleteError(`Error al eliminar: ${error.message}`)
        }
    }, [refetch, deleteMutation, setDeleteError])



    // ✅ MANEJADOR DE NAVEGACIÓN
    const handleGoBack = useCallback(() => {
        navigate('/')
    }, [navigate])

    // ✅ MANEJADOR DE SUBMIT DEL FORMULARIO
    const handleFormSubmit = useCallback(async (formData) => {
        // Limpiar error previo del modal antes de reintentar
        if (modalState.error) {
            dispatch(clearError())
        }
        const mode = modalState.mode
        const vehicleId = modalState.initialData?._id
        
        if (mode === 'create') {
            await handleCreateVehicle(formData)
        } else {
            await handleUpdateVehicle(formData, vehicleId)
        }
    }, [modalState, handleCreateVehicle, handleUpdateVehicle, dispatch])

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
                
                {/* ✅ ALERT DE ERROR DE ELIMINACIÓN */}
                {deleteError && (
                    <div style={{ marginBottom: '20px' }}>
                        <Alert 
                            variant="error" 
                            dismissible 
                            onDismiss={() => setDeleteError(null)}
                        >
                            {deleteError}
                        </Alert>
                    </div>
                )}

                {/* Vehicles List */}
                <div className={styles.vehiclesList}>
                    <h2>Lista de Vehículos ({vehicles.length})</h2>
                    
                    {vehicles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                            No hay vehículos disponibles
                        </div>
                    ) : (
                        vehicles.map((vehicle) => {
                        const item = toAdminListItem(vehicle)
                        return (
                        <div key={item.id} className={styles.vehicleItem}>
                            <div className={styles.vehicleInfo}>
                                <div className={styles.vehicleImage}>
                                    {/* Importar fallback para build robusto */}
                                    <img 
                                        src={item.firstImageUrl}
                                        alt={`${item.marca} ${item.modelo}`}
                                        loading="lazy"
                                        onError={(e) => {
                                            // Fallback importado estáticamente (resuelve correctamente en build)
                                            e.target.src = fallbackImage
                                        }}
                                    />
                                </div>
                                <div className={styles.vehicleDetails}>
                                    <h3>{item.marca} {item.modelo}</h3>
                                    <p>Año: {item.anio} | Km: {item.kilometraje.toLocaleString()}</p>
                                    <p>Precio: ${item.precio.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className={styles.vehicleActions}>
                                <button 
                                    onClick={() => handleOpenEditForm(item._original)} 
                                    className={styles.editButton}
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDeleteVehicle(item.id)} 
                                    className={styles.deleteButton}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        )})
                    )}
                </div>
            </div>

                        {/* ✅ MODAL DE GESTIÓN DE AUTOS */}
            {modalState.isOpen && (
                <div 
                    className={styles.modalOverlay} 
                    onClick={modalState.loading ? undefined : handleCloseModal}
                >
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {/* ✅ BOTÓN DE CERRAR EN EL BORDE */}
                        <button 
                            onClick={handleCloseModal}
                            disabled={modalState.loading}
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
                            
                            <LazyCarForm
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