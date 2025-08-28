/**
 * AdminPanel - Panel de administración completo para vehículos
 * 
 * Características:
 * - CRUD completo de vehículos
 * - Filtros avanzados
 * - Paginación robusta
 * - Gestión de imágenes
 * - Estados de publicación
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Admin Panel completo
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useCarMutation } from '@hooks/useCarMutation'
import { useVehicleData } from '@hooks/useVehicleData'
import { VEHICLE_TYPES, validateVehicle, normalizeVehicle } from '@types/vehicle'
import { logger } from '@utils'
import styles from './AdminPanel.module.css'

// ✅ COMPONENTES DEL ADMIN PANEL
import AdminHeader from './components/AdminHeader'
import AdminFilters from './components/AdminFilters'
import AdminTable from './components/AdminTable'
import AdminForm from './components/AdminForm'
import AdminPagination from './components/AdminPagination'
import AdminStats from './components/AdminStats'

const AdminPanel = () => {
    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    
    // ✅ ESTADOS PRINCIPALES
    const [vehicles, setVehicles] = useState([])
    const [filteredVehicles, setFilteredVehicles] = useState([])
    const [currentVehicle, setCurrentVehicle] = useState(null)
    const [formMode, setFormMode] = useState('view') // 'view', 'create', 'edit'
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // ✅ ESTADOS DE FILTROS Y PAGINACIÓN
    const [filters, setFilters] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    
    // ✅ ESTADOS DE BÚSQUEDA
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('createdAt')
    const [sortDirection, setSortDirection] = useState('desc')
    
    // ✅ HOOKS PERSONALIZADOS
    const { vehicles: apiVehicles, isLoading: isLoadingVehicles, error: vehiclesError, refetch } = useVehicleData({
        limit: 1000, // Obtener todos para filtrado local
        enabled: isAuthenticated
    })
    
    const { 
        createCar, 
        updateCar, 
        deleteCar, 
        getCarById,
        isLoading: isMutationLoading,
        error: mutationError,
        success: mutationSuccess,
        resetState 
    } = useCarMutation()
    
    // ✅ EFECTO: Cargar vehículos cuando cambie la autenticación
    useEffect(() => {
        if (isAuthenticated && apiVehicles) {
            const normalizedVehicles = apiVehicles.map(normalizeVehicle).filter(Boolean)
            setVehicles(normalizedVehicles)
            setTotalItems(normalizedVehicles.length)
            setTotalPages(Math.ceil(normalizedVehicles.length / itemsPerPage))
        }
    }, [isAuthenticated, apiVehicles, itemsPerPage])
    
    // ✅ EFECTO: Aplicar filtros y búsqueda
    useEffect(() => {
        if (vehicles.length === 0) return
        
        let filtered = [...vehicles]
        
        // ✅ APLICAR FILTROS
        if (Object.keys(filters).length > 0) {
            filtered = filtered.filter(vehicle => {
                return Object.entries(filters).every(([key, value]) => {
                    if (!value || value === '') return true
                    
                    if (Array.isArray(value)) {
                        return value.length === 0 || value.includes(vehicle[key])
                    }
                    
                    if (typeof value === 'number') {
                        if (key.includes('Desde')) {
                            return vehicle[key.replace('Desde', '')] >= value
                        }
                        if (key.includes('Hasta')) {
                            return vehicle[key.replace('Hasta', '')] <= value
                        }
                        return vehicle[key] === value
                    }
                    
                    if (typeof value === 'boolean') {
                        return vehicle[key] === value
                    }
                    
                    return vehicle[key]?.toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        
        // ✅ APLICAR BÚSQUEDA
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(vehicle => 
                vehicle.marca?.toLowerCase().includes(searchLower) ||
                vehicle.modelo?.toLowerCase().includes(searchLower) ||
                vehicle.version?.toLowerCase().includes(searchLower) ||
                vehicle.color?.toLowerCase().includes(searchLower) ||
                vehicle.combustible?.toLowerCase().includes(searchLower)
            )
        }
        
        // ✅ APLICAR ORDENAMIENTO
        filtered.sort((a, b) => {
            const aValue = a[sortField] || ''
            const bValue = b[sortField] || ''
            
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })
        
        setFilteredVehicles(filtered)
        setTotalItems(filtered.length)
        setTotalPages(Math.ceil(filtered.length / itemsPerPage))
        setCurrentPage(1) // Resetear a primera página
    }, [vehicles, filters, searchTerm, sortField, sortDirection, itemsPerPage])
    
    // ✅ EFECTO: Manejar errores de vehículos
    useEffect(() => {
        if (vehiclesError) {
            setError(`Error al cargar vehículos: ${vehiclesError.message}`)
        }
    }, [vehiclesError])
    
    // ✅ EFECTO: Manejar errores de mutación
    useEffect(() => {
        if (mutationError) {
            setError(`Error en operación: ${mutationError}`)
        }
    }, [mutationError])
    
    // ✅ EFECTO: Manejar éxito de mutación
    useEffect(() => {
        if (mutationSuccess) {
            setError(null)
            refetch() // Recargar vehículos
            resetState()
        }
    }, [mutationSuccess, refetch, resetState])
    
    // ✅ MANEJADORES DE ACCIONES
    const handleCreateVehicle = useCallback(() => {
        setCurrentVehicle(null)
        setFormMode('create')
        setIsFormOpen(true)
        setError(null)
    }, [])
    
    const handleEditVehicle = useCallback((vehicle) => {
        setCurrentVehicle(vehicle)
        setFormMode('edit')
        setIsFormOpen(true)
        setError(null)
    }, [])
    
    const handleViewVehicle = useCallback((vehicle) => {
        setCurrentVehicle(vehicle)
        setFormMode('view')
        setIsFormOpen(true)
        setError(null)
    }, [])
    
    const handleDeleteVehicle = useCallback(async (vehicleId) => {
        try {
            setIsLoading(true)
            setError(null)
            
            const result = await deleteCar(vehicleId)
            
            if (result.success) {
                logger.success('Vehículo eliminado exitosamente')
                refetch() // Recargar lista
            } else {
                setError(result.error)
            }
        } catch (err) {
            logger.error('Error al eliminar vehículo:', err)
            setError('Error inesperado al eliminar el vehículo')
        } finally {
            setIsLoading(false)
        }
    }, [deleteCar, refetch])
    
    const handleFormSubmit = useCallback(async (formData, mode) => {
        try {
            setIsLoading(true)
            setError(null)
            
            let result
            
            if (mode === 'create') {
                result = await createCar(formData)
            } else if (mode === 'edit') {
                result = await updateCar(currentVehicle.id, formData)
            }
            
            if (result.success) {
                logger.success(`Vehículo ${mode === 'create' ? 'creado' : 'actualizado'} exitosamente`)
                setIsFormOpen(false)
                refetch() // Recargar lista
            } else {
                setError(result.error)
            }
        } catch (err) {
            logger.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} vehículo:`, err)
            setError(`Error inesperado al ${mode === 'create' ? 'crear' : 'actualizar'} el vehículo`)
        } finally {
            setIsLoading(false)
        }
    }, [createCar, updateCar, currentVehicle, refetch])
    
    const handleFormClose = useCallback(() => {
        setIsFormOpen(false)
        setCurrentVehicle(null)
        setFormMode('view')
        setError(null)
    }, [])
    
    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }, [])
    
    const handleSearchChange = useCallback((term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }, [])
    
    const handleSortChange = useCallback((field, direction) => {
        setSortField(field)
        setSortDirection(direction)
    }, [])
    
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
    }, [])
    
    // ✅ CALCULAR VEHÍCULOS DE LA PÁGINA ACTUAL
    const currentVehicles = filteredVehicles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )
    
    // ✅ CALCULAR ESTADÍSTICAS
    const stats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.isActive).length,
        published: vehicles.filter(v => v.isPublished).length,
        draft: vehicles.filter(v => !v.isPublished).length
    }
    
    // ✅ VERIFICAR AUTENTICACIÓN
    if (!isAuthenticated) {
        return (
            <div className={styles.authRequired}>
                <h2>🔐 Acceso Requerido</h2>
                <p>Debes iniciar sesión para acceder al panel de administración.</p>
                <button onClick={() => navigate('/login')} className={styles.loginButton}>
                    Iniciar Sesión
                </button>
            </div>
        )
    }
    
    return (
        <div className={styles.adminPanel}>
            {/* ✅ HEADER DEL ADMIN PANEL */}
            <AdminHeader 
                onLogout={logout}
                onCreateVehicle={handleCreateVehicle}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            
            {/* ✅ ESTADÍSTICAS */}
            <AdminStats stats={stats} />
            
            {/* ✅ FILTROS AVANZADOS */}
            <AdminFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortField={sortField}
                sortDirection={sortDirection}
            />
            
            {/* ✅ TABLA DE VEHÍCULOS */}
            <AdminTable 
                vehicles={currentVehicles}
                isLoading={isLoadingVehicles}
                onEdit={handleEditVehicle}
                onView={handleViewVehicle}
                onDelete={handleDeleteVehicle}
                onToggleStatus={(vehicleId, field) => {
                    // ✅ TOGGLE DE ESTADO (ACTIVO/PUBLICADO)
                    const vehicle = vehicles.find(v => v.id === vehicleId)
                    if (vehicle) {
                        const updatedVehicle = { ...vehicle, [field]: !vehicle[field] }
                        handleFormSubmit(new FormData(), 'edit')
                    }
                }}
            />
            
            {/* ✅ PAGINACIÓN */}
            <AdminPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
            
            {/* ✅ FORMULARIO MODAL */}
            {isFormOpen && (
                <AdminForm 
                    mode={formMode}
                    vehicle={currentVehicle}
                    isOpen={isFormOpen}
                    isLoading={isLoading}
                    onSubmit={handleFormSubmit}
                    onClose={handleFormClose}
                />
            )}
            
            {/* ✅ MENSAJES DE ERROR */}
            {error && (
                <div className={styles.errorMessage}>
                    <span>❌ {error}</span>
                    <button onClick={() => setError(null)} className={styles.closeError}>
                        ×
                    </button>
                </div>
            )}
            
            {/* ✅ INDICADOR DE CARGA */}
            {(isLoading || isMutationLoading) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Procesando...</p>
                </div>
            )}
        </div>
    )
}

export default AdminPanel
