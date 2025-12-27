/**
 * useModeloSelector - Hook para manejar estado de versión y color
 * 
 * Centraliza la lógica de selección para cualquier modelo 0km.
 * Maneja versión activa, color activo, y reglas de cambio.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useCallback, useMemo } from 'react'
import { getModelo, getColoresVersion, getImagenVersionColor } from '@data/modelos'

/**
 * Hook para manejar selección de versión y color de un modelo
 * 
 * @param {string} modeloSlug - Slug del modelo (ej: '2008')
 * @returns {Object} - Estado y funciones de selección
 */
export const useModeloSelector = (modeloSlug) => {
  const modelo = useMemo(() => getModelo(modeloSlug), [modeloSlug])
  
  // Si no existe el modelo, retornar estado vacío
  if (!modelo) {
    return {
      modelo: null,
      versiones: [],
      versionActiva: null,
      colorActivo: null,
      coloresDisponibles: [],
      imagenActual: null,
      cambiarVersion: () => {},
      cambiarColor: () => {},
      irAVersionAnterior: () => {},
      irAVersionSiguiente: () => {},
      indiceVersionActiva: 0,
      totalVersiones: 0,
      error: `Modelo "${modeloSlug}" no encontrado`
    }
  }
  
  const { versiones } = modelo
  const versionInicial = versiones[0]
  
  // Estado: versión y color activos
  const [versionActivaId, setVersionActivaId] = useState(versionInicial?.id)
  const [colorActivoKey, setColorActivoKey] = useState(versionInicial?.colorDefault)
  
  // Versión activa (objeto completo)
  const versionActiva = useMemo(() => {
    return versiones.find(v => v.id === versionActivaId) || versionInicial
  }, [versiones, versionActivaId, versionInicial])
  
  // Colores disponibles para la versión activa
  const coloresDisponibles = useMemo(() => {
    return getColoresVersion(versionActivaId)
  }, [versionActivaId])
  
  // Color activo (objeto completo)
  const colorActivo = useMemo(() => {
    return coloresDisponibles.find(c => c.key === colorActivoKey) || coloresDisponibles[0]
  }, [coloresDisponibles, colorActivoKey])
  
  // Imagen actual basada en versión y color
  const imagenActual = useMemo(() => {
    return getImagenVersionColor(versionActivaId, colorActivoKey)
  }, [versionActivaId, colorActivoKey])
  
  // Índice de versión activa (para navegación)
  const indiceVersionActiva = useMemo(() => {
    return versiones.findIndex(v => v.id === versionActivaId)
  }, [versiones, versionActivaId])
  
  /**
   * Cambiar versión activa
   * - Resetea el color al default de la nueva versión
   */
  const cambiarVersion = useCallback((versionId) => {
    const nuevaVersion = versiones.find(v => v.id === versionId)
    if (!nuevaVersion) return
    
    setVersionActivaId(versionId)
    
    // Verificar si el color actual es válido en la nueva versión
    const colorValido = nuevaVersion.coloresPermitidos.includes(colorActivoKey)
    if (!colorValido) {
      // Resetear al color default de la nueva versión
      setColorActivoKey(nuevaVersion.colorDefault)
    }
  }, [versiones, colorActivoKey])
  
  /**
   * Cambiar versión por índice (para swipe en mobile)
   */
  const cambiarVersionPorIndice = useCallback((indice) => {
    const version = versiones[indice]
    if (version) {
      cambiarVersion(version.id)
    }
  }, [versiones, cambiarVersion])
  
  /**
   * Cambiar color activo
   * - Solo permite colores válidos para la versión actual
   */
  const cambiarColor = useCallback((colorKey) => {
    const colorValido = versionActiva?.coloresPermitidos.includes(colorKey)
    if (colorValido) {
      setColorActivoKey(colorKey)
    }
  }, [versionActiva])
  
  /**
   * Ir a versión anterior (para navegación)
   */
  const irAVersionAnterior = useCallback(() => {
    const nuevoIndice = Math.max(0, indiceVersionActiva - 1)
    cambiarVersionPorIndice(nuevoIndice)
  }, [indiceVersionActiva, cambiarVersionPorIndice])
  
  /**
   * Ir a versión siguiente (para navegación)
   */
  const irAVersionSiguiente = useCallback(() => {
    const nuevoIndice = Math.min(versiones.length - 1, indiceVersionActiva + 1)
    cambiarVersionPorIndice(nuevoIndice)
  }, [versiones.length, indiceVersionActiva, cambiarVersionPorIndice])
  
  return {
    // Data del modelo
    modelo,
    versiones,
    
    // Estado actual
    versionActiva,
    colorActivo,
    coloresDisponibles,
    imagenActual,
    
    // Navegación
    indiceVersionActiva,
    totalVersiones: versiones.length,
    puedeIrAnterior: indiceVersionActiva > 0,
    puedeIrSiguiente: indiceVersionActiva < versiones.length - 1,
    
    // Acciones
    cambiarVersion,
    cambiarVersionPorIndice,
    cambiarColor,
    irAVersionAnterior,
    irAVersionSiguiente,
    
    // Estado de error
    error: null
  }
}

export default useModeloSelector


