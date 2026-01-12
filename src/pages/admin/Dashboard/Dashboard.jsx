/**
 * Dashboard - Panel de administración optimizado
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Integrado con reducer simplificado para modal de autos
 */

import React, { useReducer, useCallback, useState, useEffect } from 'react'
import { defaultCarImage as fallbackImage } from '@assets'
import { useAuth, useVehiclesList } from '@hooks'
import { useCarMutation } from '@hooks'
import vehiclesService from '@services/vehiclesApi'
import { toAdminListItem } from '@mappers'
import { normalizeDetailToFormInitialData, unwrapDetail } from '@components/admin/mappers/normalizeForForm'
import { Alert, ConfirmModal } from '@ui'
import DashboardFilters from '@components/admin/DashboardFilters'

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
    const { logout } = useAuth()
    const navigate = useNavigate()
    
    // ✅ ESTADO DE FILTROS
    const [filters, setFilters] = useState({})
    
    // ✅ HOOK UNIFICADO: React Query con cache, retry y abort signal
    const { vehicles, isLoading, error, refetch, hasNextPage, loadMore, isLoadingMore } = useVehiclesList(
        filters, // filtros dinámicos
        { pageSize: 50 } // carga 50 vehículos para admin
    )
    
    // ✅ CARGAR TODAS LAS PÁGINAS AUTOMÁTICAMENTE PARA EL PANEL ADMINISTRATIVO
    useEffect(() => {
        if (!isLoading && hasNextPage && !isLoadingMore) {
            loadMore()
        }
    }, [isLoading, hasNextPage, isLoadingMore, loadMore])
    
    // ✅ HOOK PARA MUTACIONES DE AUTOS (versión simple)
    const { createMutation, updateMutation, deleteMutation } = useCarMutation()

    // ✅ ESTADO DEL MODAL CON REDUCER SIMPLIFICADO
    const [modalState, dispatch] = useReducer(carModalReducer, initialCarModalState)
    
    // ✅ ESTADO PARA ERRORES DE ELIMINACIÓN (fuera del modal)
    const [deleteError, setDeleteError] = useState(null)
    
    // ✅ ESTADO PARA MENSAJE DE ÉXITO
    const [successMessage, setSuccessMessage] = useState(null)
    
    // ✅ ESTADO PARA MODAL DE CONFIRMACIÓN
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        vehicleId: null
    })
    
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
            
            // ✅ MOSTRAR MENSAJE DE ÉXITO
            setSuccessMessage('Vehículo creado exitosamente')
            setTimeout(() => setSuccessMessage(null), 4000)
            
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
            
            // ✅ MOSTRAR MENSAJE DE ÉXITO
            setSuccessMessage('Vehículo actualizado exitosamente')
            setTimeout(() => setSuccessMessage(null), 4000)
            
        } catch (error) {
            dispatch(setError(`No se pudo actualizar el vehículo: ${error.message}`))
        }
    }, [refetch, handleCloseModal, dispatch, updateMutation])

    // ✅ MANEJADOR DE ELIMINACIÓN (ABRIR MODAL DE CONFIRMACIÓN)
    const handleDeleteClick = useCallback((vehicleId) => {
        setConfirmModal({
            isOpen: true,
            vehicleId
        })
    }, [])
    
    // ✅ MANEJADOR DE CONFIRMACIÓN DE ELIMINACIÓN
    const handleConfirmDelete = useCallback(async () => {
        const vehicleId = confirmModal.vehicleId
        setConfirmModal({ isOpen: false, vehicleId: null })
        
        try {
            // Limpiar error previo
            setDeleteError(null)
            
            // ✅ USAR LA MUTATION DIRECTA
            await deleteMutation.mutateAsync(vehicleId)
            
            // ✅ REFRESCAR LISTA
            refetch()
            
            // ✅ MOSTRAR MENSAJE DE ÉXITO
            setSuccessMessage('Vehículo eliminado exitosamente')
            setTimeout(() => setSuccessMessage(null), 4000)
            
        } catch (error) {
            setDeleteError(`Error al eliminar: ${error.message}`)
        }
    }, [confirmModal.vehicleId, deleteMutation, refetch])
    
    // ✅ CANCELAR ELIMINACIÓN
    const handleCancelDelete = useCallback(() => {
        setConfirmModal({ isOpen: false, vehicleId: null })
    }, [])



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
                    <div className={styles.loadingContent}>
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
                    <div className={styles.errorContent}>
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
                
                {/* ✅ INDICADOR DE CARGA DURANTE AUTO-CARGA */}
                {isLoadingMore && (
                    <div className={styles.loadingIndicator}>
                        Cargando todos los vehículos... ({vehicles.length} cargados)
                    </div>
                )}
                
                {/* ✅ ALERT DE ÉXITO */}
                {successMessage && (
                    <div className={styles.alertWrapper}>
                        <Alert 
                            variant="success" 
                            dismissible 
                            onDismiss={() => setSuccessMessage(null)}
                        >
                            {successMessage}
                        </Alert>
                    </div>
                )}
                
                {/* ✅ ALERT DE ERROR DE ELIMINACIÓN */}
                {deleteError && (
                    <div className={styles.alertWrapper}>
                        <Alert 
                            variant="error" 
                            dismissible 
                            onDismiss={() => setDeleteError(null)}
                        >
                            {deleteError}
                        </Alert>
                    </div>
                )}

                {/* ✅ FILTROS DEL DASHBOARD */}
                <DashboardFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                {/* Vehicles List */}
                <div className={styles.vehiclesList}>
                    <h2>Lista de Vehículos ({vehicles.length})</h2>
                    
                    {vehicles.length === 0 ? (
                        <div className={styles.emptyState}>
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
                                    <div className={styles.vehicleTitle}>
                                        <h3>{item.marca} {item.modelo}</h3>
                                    </div>
                                    <div className={styles.vehicleData}>
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>Año</span>
                                            <span className={styles.dataValue}>{item.anio}</span>
                                        </div>
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>Kilometraje</span>
                                            <span className={styles.dataValue}>{item.kilometraje.toLocaleString()} km</span>
                                        </div>
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>Precio</span>
                                            <span className={styles.dataValuePrice}>${item.precio.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.vehicleActions}>
                                <button 
                                    onClick={() => handleOpenEditForm(item._original)} 
                                    className={styles.editButton}
                                    aria-label="Editar vehículo"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(item.id)} 
                                    className={styles.deleteButton}
                                    aria-label="Eliminar vehículo"
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
            
            {/* ✅ MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Confirmar eliminación"
                message="¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    )
}

export default Dashboard 