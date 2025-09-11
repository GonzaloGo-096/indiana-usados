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
import { useCarMutation } from '@hooks/useCarMutation'
import axiosInstance from '@api/axiosInstance'

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
    
    // ✅ DEBUG: Mostrar estructura de fotos extras
    if (v.id || v._id) {
        console.log('🔍 extractImageUrls:', { 
            id: v.id || v._id, 
            fotosExtraArray: v.fotosExtra ? `array de ${v.fotosExtra.length} elementos` : 'no encontrado',
            estructura: 'array fotosExtra[]'
        })
    }
    
    // ✅ NUEVA ESTRUCTURA: Pasar objetos completos con {url, public_id, original_name}
    const urls = {
        // Imágenes principales - pasar objeto completo del backend
        fotoPrincipal: v.fotoPrincipal || o.fotoPrincipal || null,
        fotoHover: v.fotoHover || o.fotoHover || null
    }
    
    // ✅ FOTOS EXTRAS - Mapear objetos completos desde array
    // El backend envía fotosExtra[] como array de objetos con {url, public_id, original_name}
    const fotosExtraArray = v.fotosExtra || o.fotosExtra || []
    console.log('🔍 DEBUG fotosExtraArray:', fotosExtraArray)
    
    // Mapear hasta 8 fotos extras desde el array - pasar objetos completos
    for (let i = 0; i < 8; i++) {
        const fieldName = `fotoExtra${i + 1}`
        const extraItem = fotosExtraArray[i]
        
        // Pasar el objeto completo (no solo la URL)
        urls[fieldName] = extraItem || null
        
        if (extraItem) {
            console.log(`✅ ${fieldName}:`, { 
                url: extraItem.url || extraItem, 
                public_id: extraItem.public_id,
                original_name: extraItem.original_name 
            })
        }
    }
    
    // ✅ DEBUG: Solo mostrar resumen final
    const hasImages = Object.values(urls).some(item => item && (typeof item === 'string' ? item.length > 0 : item.url))
    if (hasImages) {
        const imageCount = Object.values(urls).filter(item => item && (typeof item === 'string' ? item.length > 0 : item.url)).length
        console.log('🖼️ extractImageUrls:', { id: v.id || v._id, imageCount })
    }
    return urls
}

const Dashboard = () => {
    const { logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    // ✅ HOOK PERSONALIZADO: Carga y normalización de datos
    const { vehicles, isLoading, error, refetch } = useVehicleData({ 
        limit: 50, 
        enabled: isAuthenticated 
    })
    
    // ✅ HOOK PARA MUTACIONES DE AUTOS
    const { createCar, updateCar, deleteCar } = useCarMutation()

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
        // ✅ DEBUG TEMPORAL: Ver qué datos llegan exactamente
        console.log('🔍 VEHICLE DATA COMPLETO:', vehicle)
        console.log('🔍 FOTOS EN VEHICLE:', {
            fotoPrincipal: vehicle.fotoPrincipal,
            fotoHover: vehicle.fotoHover,
            fotoExtra1: vehicle.fotoExtra1,
            fotoExtra2: vehicle.fotoExtra2,
            fotoExtra3: vehicle.fotoExtra3,
            fotoExtra4: vehicle.fotoExtra4,
            fotoExtra5: vehicle.fotoExtra5,
            fotoExtra6: vehicle.fotoExtra6,
            fotoExtra7: vehicle.fotoExtra7,
            fotoExtra8: vehicle.fotoExtra8,
            allKeys: Object.keys(vehicle).filter(key => key.includes('foto'))
        })
        
        // ✅ DEBUG ESPECÍFICO: Verificar estructura de public_id
        console.log('🔍 ESTRUCTURA DE IMÁGENES CON PUBLIC_ID:')
        if (vehicle.fotoPrincipal) {
            console.log('fotoPrincipal:', {
                tipo: typeof vehicle.fotoPrincipal,
                estructura: vehicle.fotoPrincipal,
                hasUrl: !!vehicle.fotoPrincipal?.url,
                hasPublicId: !!vehicle.fotoPrincipal?.public_id,
                publicId: vehicle.fotoPrincipal?.public_id
            })
        }
        if (vehicle.fotoHover) {
            console.log('fotoHover:', {
                tipo: typeof vehicle.fotoHover,
                estructura: vehicle.fotoHover,
                hasUrl: !!vehicle.fotoHover?.url,
                hasPublicId: !!vehicle.fotoHover?.public_id,
                publicId: vehicle.fotoHover?.public_id
            })
        }
        
        // Verificar fotos extras
        for (let i = 1; i <= 8; i++) {
            const fotoKey = `fotoExtra${i}`
            if (vehicle[fotoKey]) {
                console.log(`${fotoKey}:`, {
                    tipo: typeof vehicle[fotoKey],
                    estructura: vehicle[fotoKey],
                    hasUrl: !!vehicle[fotoKey]?.url,
                    hasPublicId: !!vehicle[fotoKey]?.public_id,
                    publicId: vehicle[fotoKey]?.public_id
                })
            }
        }
        
        const urls = extractImageUrls(vehicle)
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
            anio: vehicle.anio || vehicle.año,
            combustible: vehicle.combustible || 'Gasolina',
            transmision: vehicle.transmision || 'CVT',
            kilometraje: vehicle.kilometraje || vehicle.kms,
            traccion: vehicle.traccion || 'Delantera',
            tapizado: vehicle.tapizado || 'Tela',
            categoriaVehiculo: vehicle.categoriaVehiculo || 'Particular',
            frenos: vehicle.frenos || 'ABS',
            turbo: vehicle.turbo || 'No',
            llantas: vehicle.llantas || 'Aleación 16"',
            HP: vehicle.HP || '150',
            detalle: vehicle.detalle || 'Vehículo en buen estado',
            urls
        }
        console.log('🔍 DEBUG Dashboard -> urls extraídas:', urls)
        dispatch(openEditForm(carData))
    }, [])

    const handleCloseModal = useCallback(() => {
        dispatch(closeModal())
    }, [])

    // ✅ MANEJADORES DE ACCIONES (PREPARADOS PARA FUTURAS MUTATIONS)
    const handleCreateVehicle = useCallback(async (formData) => {
        try {
            dispatch(setLoading())
            
            console.log('🚀 CREANDO VEHÍCULO:', { formData })
            
            // ✅ USAR LA FUNCIÓN REAL createCar
            const result = await createCar(formData)
            
            if (result.success) {
                console.log('✅ Vehículo creado exitosamente')
                // ✅ REFRESCAR LISTA Y CERRAR MODAL
                refetch()
                handleCloseModal()
            } else {
                console.error('❌ Error al crear vehículo:', result.error)
                dispatch(setError(`No se pudo crear el vehículo: ${result.error}`))
            }
            
        } catch (error) {
            console.error('❌ Error al crear vehículo:', error)
            dispatch(setError('Error inesperado al crear el vehículo'))
        }
    }, [refetch, handleCloseModal, dispatch])

    const handleUpdateVehicle = useCallback(async (formData, vehicleId) => {
        try {
            dispatch(setLoading())
            
            console.log('🚀 ACTUALIZANDO VEHÍCULO:', { vehicleId, formData })
            
            // ✅ USAR LA FUNCIÓN REAL updateCar
            const result = await updateCar(vehicleId, formData)
            
            if (result.success) {
                console.log('✅ Vehículo actualizado exitosamente')
                // ✅ REFRESCAR LISTA Y CERRAR MODAL
                refetch()
                handleCloseModal()
            } else {
                console.error('❌ Error al actualizar vehículo:', result.error)
                dispatch(setError(`No se pudo actualizar el vehículo: ${result.error}`))
            }
            
        } catch (error) {
            console.error('❌ Error al actualizar vehículo:', error)
            dispatch(setError('Error inesperado al actualizar el vehículo'))
        }
    }, [refetch, handleCloseModal, dispatch])

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
            // ✅ CONFIRMACIÓN ANTES DE ELIMINAR
            const confirmed = window.confirm('¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer.')
            if (!confirmed) {
                return
            }
            
            console.log('🗑️ ELIMINANDO VEHÍCULO:', vehicleId)
            
            // ✅ USAR LA FUNCIÓN deleteCar DEL HOOK
            const result = await deleteCar(vehicleId)
            
            if (result.success) {
                console.log('✅ Vehículo eliminado exitosamente')
                // ✅ REFRESCAR LISTA
                refetch()
            } else {
                console.error('❌ Error al eliminar vehículo:', result.error)
                alert(`Error al eliminar: ${result.error}`)
            }
            
        } catch (error) {
            console.error('❌ Error al eliminar vehículo:', error)
            alert('Error inesperado al eliminar el vehículo')
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