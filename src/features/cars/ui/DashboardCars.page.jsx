/**
 * DashboardCars.page - Dashboard para gestión de autos
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Dashboard with modal integration
 */

import React, { useReducer } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useAutoLogout } from '@hooks/useAutoLogout'
import { useNavigate } from 'react-router-dom'
import CarFormRHF from './CarFormRHF'
import { 
    carModalReducer, 
    initialCarModalState, 
    openCreate, 
    openEdit, 
    closeModal 
} from './useCarModal.reducer'
import styles from './DashboardCars.module.css'

const DashboardCars = () => {
    const { logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    // ✅ ESTADO DEL MODAL CON REDUCER
    const [modalState, dispatch] = useReducer(carModalReducer, initialCarModalState)
    
    // ✅ AUTO-LOGOUT
    useAutoLogout(isAuthenticated)

    // ✅ DATOS MOCK PARA DEMOSTRACIÓN
    const mockCars = [
        {
            _id: '1',
            marca: 'Toyota',
            modelo: 'Corolla',
            version: 'XSE',
            precio: 25000,
            caja: 'Automática',
            segmento: 'Sedán',
            cilindrada: 2000,
            color: 'Blanco',
            anio: 2023,
            combustible: 'Gasolina',
            transmision: 'CVT',
            kilometraje: 15000,
            traccion: 'Delantera',
            tapizado: 'Cuero',
            categoriaVehiculo: 'Particular',
            frenos: 'ABS',
            turbo: 'No',
            llantas: 'Aleación 17"',
            HP: '169',
            detalle: 'Vehículo en excelente estado',
            urls: {
                fotoPrincipal: '/src/assets/auto1.jpg',
                fotoHover: '/src/assets/auto1.jpg',
                fotosExtras: ['/src/assets/auto1.jpg', '/src/assets/auto1.jpg', '/src/assets/auto1.jpg'],
            }
        },
        {
            _id: '2',
            marca: 'Honda',
            modelo: 'Civic',
            version: 'Sport',
            precio: 28000,
            caja: 'Manual',
            segmento: 'Sedán',
            cilindrada: 1800,
            color: 'Negro',
            anio: 2022,
            combustible: 'Gasolina',
            transmision: '6 velocidades',
            kilometraje: 25000,
            traccion: 'Delantera',
            tapizado: 'Tela deportiva',
            categoriaVehiculo: 'Particular',
            frenos: 'ABS + EBD',
            turbo: 'Sí',
            llantas: 'Aleación 18"',
            HP: '158',
            detalle: 'Civic deportivo con turbo',
            urls: {
                fotoPrincipal: '/src/assets/auto1.jpg',
                fotoHover: '/src/assets/auto1.jpg',
                fotosExtras: ['/src/assets/auto1.jpg', '/src/assets/auto1.jpg', '/src/assets/auto1.jpg'],
            }
        }
    ]

    // ✅ MANEJADORES DE EVENTOS
    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    const handleNewCar = () => {
        dispatch(openCreate())
    }

    const handleEditCar = (car) => {
        dispatch(openEdit(car._id, car))
    }

    const handleCloseModal = () => {
        dispatch(closeModal())
    }

    // ✅ MANEJADOR DE SUBMIT DEL FORMULARIO
    const handleSubmitFormData = async (formData, mode, editingId) => {
        try {
            console.log('🚀 SUBMIT FORMULARIO:', { mode, editingId })
            console.log('📋 FORMDATA ENTRIES:')
            
            // ✅ LOGUEAR TODAS LAS ENTRIES DEL FORMDATA
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
            console.log('✅ Formulario enviado exitosamente')
            
            // ✅ CERRAR MODAL
            handleCloseModal()
            
        } catch (error) {
            console.error('❌ Error en submit:', error)
        }
    }

    const handleGoBack = () => {
        navigate('/admin')
    }

    return (
        <div className={styles.dashboard}>
            {/* ✅ HEADER */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Gestión de Autos</h1>
                    <div className={styles.userInfo}>
                        <span>Admin</span>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
            
            {/* ✅ CONTENT */}
            <div className={styles.content}>
                {/* ✅ BOTONES DE ACCIÓN */}
                <div className={styles.actionButtons}>
                    <button onClick={handleNewCar} className={styles.addButton}>
                        + Nuevo Auto
                    </button>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        ← Volver al Dashboard
                    </button>
                </div>

                {/* ✅ TABLA DE AUTOS */}
                <div className={styles.carsTable}>
                    <h2>Lista de Autos ({mockCars.length})</h2>
                    
                    {mockCars.length === 0 ? (
                        <div className={styles.emptyState}>
                            No hay autos disponibles
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Marca</th>
                                        <th>Modelo</th>
                                        <th>Versión</th>
                                        <th>Precio</th>
                                        <th>Año</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockCars.map((car) => (
                                        <tr key={car._id}>
                                            <td>
                                                <div className={styles.carImage}>
                                                    <img 
                                                        src={car.urls?.fotoPrincipal || '/src/assets/auto1.jpg'}
                                                        alt={`${car.marca} ${car.modelo}`}
                                                        className={styles.carThumbnail}
                                                    />
                                                </div>
                                            </td>
                                            <td>{car.marca}</td>
                                            <td>{car.modelo}</td>
                                            <td>{car.version}</td>
                                            <td>${car.precio?.toLocaleString()}</td>
                                            <td>{car.anio}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleEditCar(car)} 
                                                    className={styles.editButton}
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ MODAL */}
            {modalState.isOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {modalState.mode === 'create' ? 'Crear Nuevo Auto' : 'Editar Auto'}
                            </h2>
                            <button 
                                onClick={handleCloseModal} 
                                className={styles.closeButton}
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        </div>
                        
                                                 <div className={styles.modalBody}>
                             <CarFormRHF
                                 mode={modalState.mode}
                                 initialData={modalState.initialData}
                                 onClose={handleCloseModal}
                             />
                         </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardCars
