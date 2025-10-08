/**
 * Dashboard - Panel de administración optimizado
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Integrado con reducer simplificado para modal de autos
 */

import React, { useReducer, useCallback } from 'react'
import { useAuth, useVehiclesList, getVehicleImageUrl } from '@hooks'
import { useCarMutation } from '@hooks'
import axiosInstance from '@api/axiosInstance'
import vehiclesService from '@services/vehiclesApi'
import { normalizeDetailToFormInitialData, unwrapDetail } from '@components/admin/mappers/normalizeForForm'

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

// Helper: obtener string URL desde distintos formatos
const resolveUrlString = (val) => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (Array.isArray(val)) {
        for (const item of val) {
            const s = resolveUrlString(item)
            if (s) return s
        }
        return ''
    }
    if (typeof val === 'object') {
        // intentar campos comunes
        return (
            val.url || val.secure_url || val.path || val.src || val.href || ''
        )
    }
    return ''
}

// Helper: prefijar baseURL cuando no es absoluta
const withBaseUrl = (url) => {
    const s = resolveUrlString(url)
    if (!s) return ''
    if (s.startsWith('http://') || s.startsWith('https://')) return s
    const base = axiosInstance?.defaults?.baseURL || ''
    if (!base) return s
    // si es relativo (con o sin "/" inicial), unir correctamente
    const left = base.endsWith('/') ? base.slice(0, -1) : base
    const right = s.startsWith('/') ? s : `/${s}`
    return `${left}${right}`
}

const pickFirst = (...candidates) => {
    for (const c of candidates) {
        const s = resolveUrlString(c)
        if (s) return s
    }
    return ''
}

const extractImageUrls = (vehicle) => {
    const v = vehicle || {}
    const o = v._original || {}
    
    // Helper mínimo: obtener URL desde string u objeto { url }
    const getUrlFromAny = (item) => {
        if (!item) return ''
        if (typeof item === 'string') return item
        if (typeof item === 'object') return item.url || item.secure_url || ''
        return ''
    }

    // Estructura limpia: pasar objetos con {url, public_id, original_name}
    const urls = {
        // Imágenes principales - pasar objeto completo del backend
        fotoPrincipal: v.fotoPrincipal || o.fotoPrincipal || null,
        fotoHover: v.fotoHover || o.fotoHover || null
    }
    
    // Fuente contractual: fotosExtra(s) del backend (array)
    const fotosExtraArray = 
        (Array.isArray(v.fotosExtra) && v.fotosExtra) ||
        (Array.isArray(v.fotosExtras) && v.fotosExtras) ||
        (Array.isArray(o.fotosExtra) && o.fotosExtra) ||
        (Array.isArray(o.fotosExtras) && o.fotosExtras) ||
        []

    // Mapear hasta 8 fotos extras desde el array; fallback a legacy fotoExtraN si existe
    for (let i = 0; i < 8; i++) {
        const fieldName = `fotoExtra${i + 1}`
        const extraItem = fotosExtraArray[i]

        if (extraItem) {
            // ESTRUCTURA: string u objeto con {url}
            const resolvedUrl = getUrlFromAny(extraItem)
            urls[fieldName] = resolvedUrl
                ? {
                    url: resolvedUrl,
                    public_id: extraItem.public_id || '',
                    original_name: extraItem.original_name || ''
                }
                : null
            continue
        }

        // FALLBACK LEGADO: usar v.fotoExtraN / o.fotoExtraN si existen
        const legacy = v[fieldName] || o[fieldName] || null
        if (legacy) {
            const resolvedUrl = getUrlFromAny(legacy)
            urls[fieldName] = resolvedUrl
                ? { url: resolvedUrl, public_id: legacy.public_id || '', original_name: legacy.original_name || '' }
                : null
        } else {
            urls[fieldName] = null
        }
    }
    return urls
}

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
    
    // ✅ AUTO-LOGOUT: Integrado en useAuth (no necesita hook separado)

    // ✅ MANEJADORES DE AUTENTICACIÓN
    const handleLogout = useCallback(() => {
        logout()
        navigate('/admin/login')
    }, [logout, navigate])

    // ✅ MANEJADORES DEL MODAL DE AUTOS (SIMPLE)
    const handleOpenCreateForm = useCallback(() => {
        dispatch(openCreateForm())
    }, [])

    const handleOpenEditForm = useCallback(async (vehicle) => {
        try {
            const id = vehicle._id || vehicle.id
            // logger.debug('admin:dashboard', '[EDIT] abrir', { id })
            dispatch(setLoading())

            // logger.debug('admin:dashboard', '[EDIT] GET detalle', { id })
            const detail = await vehiclesService.getVehicleById(id)

            const unwrapped = unwrapDetail(detail)
            const carData = normalizeDetailToFormInitialData(unwrapped)

            if (!carData || typeof carData !== 'object') {
                // logger.warn('admin:dashboard', '[EDIT] detalle vacío o inválido')
                dispatch(setError('Respuesta de detalle inválida'))
                return
            }

            // logger.debug('admin:dashboard', '[EDIT] initialData listo', { id: carData?._id, anio: carData?.anio })
            dispatch(openEditForm(carData))
        } catch (err) {
            // logger.error('admin:dashboard', 'Error al cargar detalle para Edit', err)
            dispatch(setError('No se pudo cargar el detalle del vehículo'))
        }
    }, [dispatch])

    const handleCloseModal = useCallback(() => {
        dispatch(closeModal())
    }, [])

    // ✅ MANEJADORES DE ACCIONES (PREPARADOS PARA FUTURAS MUTATIONS)
    const handleCreateVehicle = useCallback(async (formData) => {
        try {
            dispatch(setLoading())
            
            // logger.info('admin:dashboard', 'CREANDO VEHÍCULO', { formDataKeys: Object.keys(formData || {}) })
            
            // ✅ USAR LA MUTATION DIRECTA
            await createMutation.mutateAsync(formData)
            
            // ✅ REFRESCAR LISTA Y CERRAR MODAL
            refetch()
            handleCloseModal()
            
        } catch (error) {
            // logger.error('admin:dashboard', 'Error al crear vehículo', error)
            dispatch(setError(`No se pudo crear el vehículo: ${error.message}`))
        }
    }, [refetch, handleCloseModal, dispatch, createMutation])

    const handleUpdateVehicle = useCallback(async (formData, vehicleId) => {
        try {
            dispatch(setLoading())
            
            // logger.info('admin:dashboard', 'ACTUALIZANDO VEHÍCULO', { vehicleId, formDataKeys: Object.keys(formData || {}) })
            
            // ✅ USAR LA MUTATION DIRECTA
            await updateMutation.mutateAsync({ id: vehicleId, formData })
            
            // ✅ REFRESCAR LISTA Y CERRAR MODAL
            refetch()
            handleCloseModal()
            
        } catch (error) {
            // logger.error('admin:dashboard', 'Error al actualizar vehículo', error)
            dispatch(setError(`No se pudo actualizar el vehículo: ${error.message}`))
        }
    }, [refetch, handleCloseModal, dispatch, updateMutation])

    // ✅ MANEJADORES DE ACCIONES ADICIONALES (PREPARADOS PARA FUTURAS MUTATIONS)
    const handlePauseVehicle = useCallback(async (vehicleId) => {
        try {
            // ✅ SIMULAR LLAMADA A API (REEMPLAZAR CON useMutation)
            // logger.info('admin:dashboard', 'PAUSAR VEHÍCULO', { vehicleId })
            
            // ✅ SIMULAR ÉXITO
            await new Promise(resolve => setTimeout(resolve, 500))
            // logger.info('admin:dashboard', 'Vehículo pausado exitosamente')
            
            // ✅ REFRESCAR LISTA
            refetch()
            
        } catch (error) {
            // logger.error('admin:dashboard', 'Error al pausar vehículo', error)
        }
    }, [refetch])

    const handleDeleteVehicle = useCallback(async (vehicleId) => {
        try {
            // ✅ CONFIRMACIÓN ANTES DE ELIMINAR
            const confirmed = window.confirm('¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer.')
            if (!confirmed) {
                return
            }
            
            // logger.info('admin:dashboard', 'ELIMINANDO VEHÍCULO', { vehicleId })
            
            // ✅ USAR LA MUTATION DIRECTA
            await deleteMutation.mutateAsync(vehicleId)
            
            // ✅ REFRESCAR LISTA
            refetch()
            
        } catch (error) {
            // logger.error('admin:dashboard', 'Error al eliminar vehículo', error)
            alert(`Error al eliminar: ${error.message}`)
        }
    }, [refetch, deleteMutation])



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