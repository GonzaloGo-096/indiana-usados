/**
 * useAutoDetail - Hook para obtener detalles de un vehículo específico
 * 
 * Responsabilidades:
 * - Obtener detalles de un vehículo por ID
 * - Manejar estados de carga y error
 * - Proporcionar datos formateados
 * - Cache inteligente con React Query
 * 
 * Preparado para:
 * - Conectar con endpoints reales del backend
 * - Manejo robusto de errores
 * - Cache inteligente con React Query
 * - Formateo de datos consistente
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import autoService, { queryKeys } from '../services/service'
import vehiclesApi from '../api/vehiclesApi'

// Función helper memoizada para formatear valores
const formatValue = (value) => {
    if (!value || value === '' || value === 'null' || value === 'undefined') {
        return '-'
    }
    return value
}

/**
 * Hook para obtener detalles de un vehículo específico
 * 
 * @param {string} id - ID del vehículo
 * @param {Object} options - Opciones adicionales del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo en ms antes de considerar datos obsoletos
 * @param {number} options.cacheTime - Tiempo en ms para mantener en cache
 * @param {number} options.retry - Número de reintentos en caso de error
 * 
 * @returns {Object} - Objeto con datos y estados del hook
 * @returns {Object} returns.auto - Datos del vehículo
 * @returns {boolean} returns.isLoading - Si está cargando
 * @returns {boolean} returns.isError - Si hay error
 * @returns {Error} returns.error - Objeto de error si existe
 * @returns {Function} returns.refetch - Función para recargar datos
 * @returns {Object} returns.formattedData - Datos formateados para la UI
 */
export const useAutoDetail = (id, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 5, // 5 minutos
        cacheTime = 1000 * 60 * 30, // 30 minutos
        retry = 1,
        refetchOnWindowFocus = false
    } = options

    // Query principal para obtener el vehículo
    const {
        data: auto,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: queryKeys.auto(id),
        queryFn: async () => {
            // Intentar usar la nueva API primero
            try {
                console.log(`🔍 Intentando obtener vehículo ${id} desde backend real...`);
                return await vehiclesApi.getVehicleById(id);
            } catch (error) {
                console.log(`⚠️ Fallback a mock data para vehículo ${id}:`, error.message);
                // Fallback al servicio mock si la API real falla
                return await autoService.getAutoById(id);
            }
        },
        staleTime,
        gcTime: cacheTime, // cacheTime fue renombrado a gcTime en v5
        retry,
        refetchOnWindowFocus,
        enabled: enabled && !!id
    })

    // Datos formateados para la UI - OPTIMIZADO
    const formattedData = useMemo(() => {
        if (!auto) return null

        // Extraer datos con valores por defecto
        const {
            marca = '',
            modelo = '',
            precio = '',
            año = '',
            color = '',
            combustible = '',
            categoria = '',
            detalle = '',
            kms = '',
            caja = '',
            imagen = '',
            imagenes = []
        } = auto

        // Formatear valores una sola vez
        const marcaFormatted = formatValue(marca)
        const modeloFormatted = formatValue(modelo)
        const titulo = `${marcaFormatted} ${modeloFormatted}`

        return {
            // Datos básicos
            id: auto.id,
            marca: marcaFormatted,
            modelo: modeloFormatted,
            precio: precio ? `$${precio}` : '-',
            año: formatValue(año),
            color: formatValue(color),
            combustible: formatValue(combustible),
            categoria: formatValue(categoria),
            detalle: formatValue(detalle),
            kms: formatValue(kms),
            caja: formatValue(caja),
            imagen: imagen || null,
            imagenes: imagenes || [],
            
            // Datos calculados
            titulo,
            altText: titulo,
            
            // Datos para contacto
            contactInfo: {
                email: 'info@indianausados.com',
                whatsapp: '5491112345678',
                whatsappMessage: `Hola, me interesa el vehículo ${titulo}`
            }
        }
    }, [auto])

    // Estados memoizados para evitar recálculos
    const hasData = useMemo(() => !!auto, [auto])
    const hasFormattedData = useMemo(() => !!formattedData, [formattedData])

    return {
        // Datos
        auto,
        formattedData,
        
        // Estados
        isLoading,
        isError,
        error,
        
        // Funciones
        refetch,
        
        // Estados adicionales
        hasData,
        hasFormattedData
    }
} 