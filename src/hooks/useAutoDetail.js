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
import { useMemo } from 'react'
import autoService, { queryKeys } from '../services/service'

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
        queryFn: () => autoService.getAutoById(id),
        staleTime,
        cacheTime,
        retry,
        refetchOnWindowFocus,
        enabled: enabled && !!id
    })

    // Datos formateados para la UI
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

        // Función helper para formatear valores
        const formatValue = (value) => {
            if (!value || value === '' || value === 'null' || value === 'undefined') {
                return '-'
            }
            return value
        }

        return {
            // Datos básicos
            id: auto.id,
            marca: formatValue(marca),
            modelo: formatValue(modelo),
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
            titulo: `${formatValue(marca)} ${formatValue(modelo)}`,
            altText: `${formatValue(marca)} ${formatValue(modelo)}`,
            
            // Datos para contacto
            contactInfo: {
                email: 'info@indianausados.com',
                whatsapp: '5491112345678',
                whatsappMessage: `Hola, me interesa el vehículo ${formatValue(marca)} ${formatValue(modelo)}`
            }
        }
    }, [auto])

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
        hasData: !!auto,
        hasFormattedData: !!formattedData
    }
} 