/**
 * useFilterReducer - Hook simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - Estado mínimo para filtros
 * - Integración directa con React Hook Form
 * - Manejo de drawer mobile
 * - 🚀 NUEVO: Estado de filtros y operaciones
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Expandido para lógica principal
 */

import { useReducer, useCallback } from 'react'

// 🚀 ESTADO INICIAL EXPANDIDO
const initialState = {
  // 🎯 ESTADO DE UI (EXISTENTE)
  isSubmitting: false,
  isDrawerOpen: false,
  
  // 🚀 NUEVO: ESTADO DE FILTROS
  currentFilters: {},
  pendingFilters: {},
  
  // 🚀 NUEVO: ESTADO DE OPERACIONES
  isLoading: false,
  isError: false,
  error: null
}

// 🚀 ACCIONES EXPANDIDAS
const ACTIONS = {
  // 🎯 ACCIONES DE UI (EXISTENTES)
  SET_SUBMITTING: 'SET_SUBMITTING',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  CLOSE_DRAWER: 'CLOSE_DRAWER',
  
  // 🚀 NUEVAS: ACCIONES DE FILTROS
  SET_PENDING_FILTERS: 'SET_PENDING_FILTERS',
  APPLY_FILTERS: 'APPLY_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  
  // 🚀 NUEVAS: ACCIONES DE OPERACIONES
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// 🚀 REDUCER EXPANDIDO
const filterReducer = (state, action) => {
  switch (action.type) {
    // 🎯 CASOS DE UI (EXISTENTES)
    case ACTIONS.SET_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      }
    
    case ACTIONS.TOGGLE_DRAWER:
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen
      }
    
    case ACTIONS.CLOSE_DRAWER:
      return {
        ...state,
        isDrawerOpen: false
      }
    
    // 🚀 NUEVOS: CASOS DE FILTROS
    case ACTIONS.SET_PENDING_FILTERS:
      return {
        ...state,
        pendingFilters: action.payload
      }
    
    case ACTIONS.APPLY_FILTERS:
      return {
        ...state,
        currentFilters: state.pendingFilters,
        pendingFilters: {},
        isSubmitting: false,
        isError: false,
        error: null
      }
    
    case ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        currentFilters: {},
        pendingFilters: {},
        isSubmitting: false,
        isError: false,
        error: null
      }
    
    // 🚀 NUEVOS: CASOS DE OPERACIONES
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        isError: true,
        error: action.payload,
        isSubmitting: false,
        isLoading: false
      }
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        isError: false,
        error: null
      }
    
    default:
      return state
  }
}

export const useFilterReducer = () => {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  // 🎯 ACCIONES DE UI (EXISTENTES - MANTENER COMPATIBILIDAD)
  const setSubmitting = useCallback((isSubmitting) => {
    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: isSubmitting })
  }, [])

  const toggleDrawer = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_DRAWER })
  }, [])

  const closeDrawer = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE_DRAWER })
  }, [])

  // 🚀 NUEVAS: ACCIONES DE FILTROS
  const setPendingFilters = useCallback((filters) => {
    dispatch({ type: ACTIONS.SET_PENDING_FILTERS, payload: filters })
  }, [])

  const applyFilters = useCallback(() => {
    dispatch({ type: ACTIONS.APPLY_FILTERS })
  }, [])

  const clearFilters = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_FILTERS })
  }, [])

  // 🚀 NUEVAS: ACCIONES DE OPERACIONES
  const setLoading = useCallback((isLoading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading })
  }, [])

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR })
  }, [])

  return {
    // 🎯 ESTADO (MANTENER COMPATIBILIDAD)
    ...state,
    
    // 🎯 ACCIONES DE UI (EXISTENTES)
    setSubmitting,
    toggleDrawer,
    closeDrawer,
    
    // 🚀 NUEVAS: ACCIONES DE FILTROS
    setPendingFilters,
    applyFilters,
    clearFilters,
    
    // 🚀 NUEVAS: ACCIONES DE OPERACIONES
    setLoading,
    setError,
    clearError
  }
} 