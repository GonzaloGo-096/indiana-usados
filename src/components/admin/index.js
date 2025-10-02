/**
 * Admin Components - Exportaciones centralizadas
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Reorganización desde features/cars
 */

// ===== COMPONENTES DE FORMULARIO =====
export { default as CarFormRHF } from './CarForm/CarFormRHF'

// ===== HOOKS =====
export { useImageReducer, IMAGE_FIELDS } from './hooks/useImageReducer'
export { 
    carModalReducer, 
    initialCarModalState, 
    openCreateForm,
    openEditForm,
    closeModal,
    setLoading,
    setError,
    clearError
} from './hooks/useCarModal.reducer'

// ===== MAPPERS =====
export { normalizeDetailToFormInitialData, unwrapDetail } from './mappers/normalizeForForm'
