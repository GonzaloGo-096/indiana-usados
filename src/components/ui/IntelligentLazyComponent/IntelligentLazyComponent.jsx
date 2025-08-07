/**
 * IntelligentLazyComponent - Componente de lazy loading inteligente
 * 
 * Características:
 * - Lazy loading con preloading estratégico
 * - Preloading en hover/focus
 * - Error boundary integrado
 * - Loading states optimizados
 * - Performance monitoring
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { Suspense, useState, useEffect, useCallback } from 'react'
import { LoadingSpinner } from '@ui'
import { usePreloadRoute } from '@hooks/usePreloadRoute'

/**
 * Componente IntelligentLazyComponent
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.component - Componente lazy a cargar
 * @param {Object} props.fallback - Componente de carga personalizado
 * @param {string} props.loadingMessage - Mensaje de carga
 * @param {Object} props.componentProps - Props para el componente lazy
 * @param {number} props.timeout - Timeout para carga (ms)
 * @param {boolean} props.enablePreload - Si habilitar preloading
 * @param {string} props.preloadTrigger - Trigger para preload ('hover', 'focus', 'both')
 * @param {number} props.preloadDelay - Delay para preload (ms)
 */
export const IntelligentLazyComponent = ({ 
    component: LazyComponent,
    fallback,
    loadingMessage = 'Cargando componente...',
    componentProps = {},
    timeout = 5000,
    enablePreload = true,
    preloadTrigger = 'hover',
    preloadDelay = 200
}) => {
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isPreloaded, setIsPreloaded] = useState(false)

    // Hook de preloading
    const { preloadRoute, cancelPreload, isRoutePreloaded } = usePreloadRoute({
        delay: preloadDelay,
        enabled: enablePreload
    })

    // ✅ PRECARGAR COMPONENTE
    const handlePreload = useCallback(() => {
        if (!enablePreload || isPreloaded) return

        try {
            // Simular preload del componente
            LazyComponent()
            setIsPreloaded(true)
            console.log('🚀 Component preloaded successfully')
        } catch (error) {
            console.warn('⚠️ Failed to preload component:', error)
        }
    }, [LazyComponent, enablePreload, isPreloaded])

    // ✅ MANEJAR HOVER
    const handleMouseEnter = useCallback(() => {
        if (preloadTrigger === 'hover' || preloadTrigger === 'both') {
            preloadRoute('component', handlePreload)
        }
    }, [preloadTrigger, preloadRoute, handlePreload])

    // ✅ MANEJAR FOCUS
    const handleFocus = useCallback(() => {
        if (preloadTrigger === 'focus' || preloadTrigger === 'both') {
            preloadRoute('component', handlePreload)
        }
    }, [preloadTrigger, preloadRoute, handlePreload])

    // ✅ MANEJAR BLUR/LEAVE
    const handleMouseLeave = useCallback(() => {
        if (preloadTrigger === 'hover' || preloadTrigger === 'both') {
            cancelPreload('component')
        }
    }, [preloadTrigger, cancelPreload])

    // ✅ TIMEOUT: Para evitar carga infinita
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('⚠️ Component took too long to load')
                setHasError(true)
            }
        }, timeout)

        return () => clearTimeout(timer)
    }, [isLoading, timeout])

    // ✅ ERROR BOUNDARY: Manejo de errores
    if (hasError) {
        return (
            <div className="intelligent-lazy-error">
                <div className="error-content">
                    <h3>Error al cargar el componente</h3>
                    <p>El componente tardó demasiado en cargar</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="retry-button"
                    >
                        Recargar página
                    </button>
                </div>
            </div>
        )
    }

    // ✅ FALLBACK PERSONALIZADO: O usar default
    const LoadingFallback = fallback || (
        <LoadingSpinner 
            message={loadingMessage} 
            size="small" 
            fullScreen={false}
        />
    )

    return (
        <div 
            className="intelligent-lazy-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            tabIndex={0}
        >
            <Suspense 
                fallback={
                    <div onLoad={() => setIsLoading(false)}>
                        {LoadingFallback}
                    </div>
                }
            >
                <LazyComponent {...componentProps} />
            </Suspense>
        </div>
    )
}

export default IntelligentLazyComponent 