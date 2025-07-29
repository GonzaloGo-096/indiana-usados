/**
 * useFilterReducer - Hook simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - Estado mínimo para filtros
 * - Integración directa con React Hook Form
 * - Manejo de drawer mobile
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import { useReducer, useCallback } from 'react'

// Estado inicial simplificado
const initialState = {
  isSubmitting: false,
  isDrawerOpen: false
}

// Tipos de acciones
const ACTIONS = {
  SET_SUBMITTING: 'SET_SUBMITTING',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  CLOSE_DRAWER: 'CLOSE_DRAWER'
}

// Reducer simplificado
const filterReducer = (state, action) => {
  switch (action.type) {
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
    
    default:
      return state
  }
}

export const useFilterReducer = () => {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  // Acciones memoizadas
  const setSubmitting = useCallback((isSubmitting) => {
    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: isSubmitting })
  }, [])

  const toggleDrawer = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_DRAWER })
  }, [])

  const closeDrawer = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE_DRAWER })
  }, [])

  return {
    // Estado
    ...state,
    
    // Acciones
    setSubmitting,
    toggleDrawer,
    closeDrawer
  }
} 