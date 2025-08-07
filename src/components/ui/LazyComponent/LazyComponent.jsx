/**
 * LazyComponent - Wrapper para componentes con lazy loading
 * 
 * Características:
 * - Lazy loading de componentes pesados
 * - Error boundary integrado
 * - Loading states personalizables
 * - Fallback graceful
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { Suspense, useState, useEffect } from 'react'
import { LoadingSpinner } from '@ui'

/**
 * Componente LazyComponent
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.component - Componente lazy a cargar
 * @param {Object} props.fallback - Componente de carga personalizado
 * @param {string} props.loadingMessage - Mensaje de carga
 * @param {Object} props.componentProps - Props para el componente lazy
 * @param {number} props.timeout - Timeout para carga (ms)
 */
export const LazyComponent = ({ 
    component: LazyComponent,
    fallback,
    loadingMessage = 'Cargando componente...',
    componentProps = {},
    timeout = 5000
}) => {
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // ✅ TIMEOUT: Para evitar carga infinita
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('⚠️ Componente tardó demasiado en cargar')
                setHasError(true)
            }
        }, timeout)

        return () => clearTimeout(timer)
    }, [isLoading, timeout])

    // ✅ ERROR BOUNDARY: Manejo de errores
    if (hasError) {
        return (
            <div className="error-boundary">
                <p>Error al cargar el componente</p>
                <button onClick={() => window.location.reload()}>
                    Recargar página
                </button>
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
        <Suspense 
            fallback={
                <div onLoad={() => setIsLoading(false)}>
                    {LoadingFallback}
                </div>
            }
        >
            <LazyComponent {...componentProps} />
        </Suspense>
    )
}

export default LazyComponent 