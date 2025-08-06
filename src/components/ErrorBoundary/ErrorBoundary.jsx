/**
 * ErrorBoundary - Componente para capturar errores de React
 * 
 * Responsabilidades:
 * - Capturar errores JavaScript en componentes hijos
 * - Registrar errores para debugging
 * - Mostrar UI de fallback
 * - Permitir recuperación automática
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import styles from './ErrorBoundary.module.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        
        // Estado para manejar errores
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            lastErrorTime: null
        }
        
        // Bind de métodos
        this.handleRetry = this.handleRetry.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.logError = this.logError.bind(this)
    }

    /**
     * Método estático que determina si el error debe ser capturado
     * @param {Error} error - Error que ocurrió
     * @returns {boolean} - Si el error debe ser capturado
     */
    static getDerivedStateFromError(error) {
        // Actualizar estado para mostrar UI de fallback
        return {
            hasError: true,
            lastErrorTime: new Date().toISOString()
        }
    }

    /**
     * Método que se ejecuta después de que se captura un error
     * @param {Error} error - Error que ocurrió
     * @param {Object} errorInfo - Información adicional del error
     */
    componentDidCatch(error, errorInfo) {
        // Actualizar estado con información del error
        this.setState({
            error: error,
            errorInfo: errorInfo,
            retryCount: this.state.retryCount + 1
        })

        // Registrar error profesionalmente
        this.logError(error, errorInfo)
    }

    /**
     * Registrar error con información detallada
     * @param {Error} error - Error que ocurrió
     * @param {Object} errorInfo - Información adicional del error
     */
    logError(error, errorInfo) {
        const errorData = {
            // Información del error
            message: error.message,
            stack: error.stack,
            name: error.name,
            
            // Información del componente
            componentStack: errorInfo.componentStack,
            
            // Información del contexto
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            
            // Información de la app
            appVersion: process.env.VITE_APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV,
            
            // Información del usuario (si está disponible)
            userId: this.getUserId(),
            
            // Información de retry
            retryCount: this.state.retryCount,
            lastErrorTime: this.state.lastErrorTime
        }

        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Error Boundary - Error Capturado')
            console.error('Error:', error)
            console.error('Error Info:', errorInfo)
            console.error('Error Data:', errorData)
            console.groupEnd()
        }

        // Log en producción (enviar a servicio de monitoreo)
        if (process.env.NODE_ENV === 'production') {
            this.sendErrorToMonitoring(errorData)
        }

        // Log local para debugging
        this.saveErrorLocally(errorData)
    }

    /**
     * Enviar error a servicio de monitoreo (Sentry, LogRocket, etc.)
     * @param {Object} errorData - Datos del error
     */
    sendErrorToMonitoring(errorData) {
        try {
            // Ejemplo con Sentry (si está configurado)
            if (window.Sentry) {
                window.Sentry.captureException(errorData.error, {
                    extra: errorData
                })
            }

            // Ejemplo con LogRocket (si está configurado)
            if (window.LogRocket) {
                window.LogRocket.captureException(errorData.error)
            }

            // Enviar a endpoint personalizado
            this.sendToCustomEndpoint(errorData)
        } catch (monitoringError) {
            console.error('Error al enviar error a monitoreo:', monitoringError)
        }
    }

    /**
     * Enviar error a endpoint personalizado
     * @param {Object} errorData - Datos del error
     */
    async sendToCustomEndpoint(errorData) {
        try {
            await fetch('/api/errors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorData)
            })
        } catch (error) {
            console.error('Error al enviar a endpoint personalizado:', error)
        }
    }

    /**
     * Guardar error localmente para debugging
     * @param {Object} errorData - Datos del error
     */
    saveErrorLocally(errorData) {
        try {
            const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
            errors.push(errorData)
            
            // Mantener solo los últimos 10 errores
            if (errors.length > 10) {
                errors.splice(0, errors.length - 10)
            }
            
            localStorage.setItem('app_errors', JSON.stringify(errors))
        } catch (error) {
            console.error('Error al guardar error localmente:', error)
        }
    }

    /**
     * Obtener ID del usuario (si está disponible)
     * @returns {string|null} - ID del usuario
     */
    getUserId() {
        try {
            // Ejemplo: obtener de localStorage, context, etc.
            return localStorage.getItem('user_id') || null
        } catch (error) {
            return null
        }
    }

    /**
     * Manejar reintento automático
     */
    handleRetry() {
        const { retryCount } = this.state
        const maxRetries = this.props.maxRetries || 3

        if (retryCount < maxRetries) {
            // Reintento automático
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null
            })
        } else {
            // Máximo de reintentos alcanzado
            this.handleReset()
        }
    }

    /**
     * Manejar reset completo
     */
    handleReset() {
        // Limpiar estado
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            lastErrorTime: null
        })

        // Recargar página si es necesario
        if (this.props.reloadOnMaxRetries) {
            window.location.reload()
        }
    }

    /**
     * Renderizar UI de fallback
     * @returns {JSX.Element} - Componente de error
     */
    renderErrorUI() {
        const { error, retryCount } = this.state
        const { 
            fallback: FallbackComponent,
            maxRetries = 3,
            showDetails = process.env.NODE_ENV === 'development'
        } = this.props

        // Si hay un componente de fallback personalizado
        if (FallbackComponent) {
            return (
                <FallbackComponent
                    error={error}
                    retryCount={retryCount}
                    maxRetries={maxRetries}
                    onRetry={this.handleRetry}
                    onReset={this.handleReset}
                />
            )
        }

        // UI de fallback por defecto
        return (
            <div className={styles.errorBoundary}>
                <div className={styles.errorContainer}>
                    {/* Icono de error */}
                    <div className={styles.errorIcon}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                        </svg>
                    </div>

                    {/* Título del error */}
                    <h2 className={styles.errorTitle}>
                        Algo salió mal
                    </h2>

                    {/* Descripción */}
                    <p className={styles.errorDescription}>
                        Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                    </p>

                    {/* Información técnica (solo en desarrollo) */}
                    {showDetails && error && (
                        <details className={styles.errorDetails}>
                            <summary>Detalles técnicos</summary>
                            <pre className={styles.errorStack}>
                                {error.message}
                                {'\n'}
                                {error.stack}
                            </pre>
                        </details>
                    )}

                    {/* Botones de acción */}
                    <div className={styles.errorActions}>
                        <button 
                            onClick={this.handleRetry}
                            className={styles.retryButton}
                            disabled={retryCount >= maxRetries}
                        >
                            {retryCount >= maxRetries ? 'Máximo de reintentos' : 'Reintentar'}
                        </button>

                        <button 
                            onClick={this.handleReset}
                            className={styles.resetButton}
                        >
                            Recargar página
                        </button>
                    </div>

                    {/* Información de contacto */}
                    <div className={styles.errorContact}>
                        <p>Si el problema persiste, contacta soporte:</p>
                        <a href="mailto:soporte@indianausados.com" className={styles.contactLink}>
                            soporte@indianausados.com
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        // Si hay un error, mostrar UI de fallback
        if (this.state.hasError) {
            return this.renderErrorUI()
        }

        // Si no hay error, renderizar children normalmente
        return this.props.children
    }
}

export default ErrorBoundary 