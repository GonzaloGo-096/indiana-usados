/**
 * GlobalErrorBoundary - Error boundary global de la aplicación
 * 
 * Responsabilidades:
 * - Capturar errores de JavaScript no manejados
 * - Mostrar UI de error amigable
 * - Logging de errores para debugging
 * - Recuperación automática cuando sea posible
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { config } from '../../config'

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        }
    }

    static getDerivedStateFromError(error) {
        // Actualizar estado para mostrar UI de error
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error, errorInfo) {
        // Logging del error
        this.logError(error, errorInfo)
        
        // Actualizar estado con información del error
        this.setState({
            error,
            errorInfo
        })

        // Reportar a servicios de monitoreo (futuro)
        this.reportToMonitoring(error, errorInfo)
    }

    logError = (error, errorInfo) => {
        if (config.isDevelopment && config.features.debug) {
            console.error('❌ ERROR GLOBAL CAPTURADO:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            })
        }
    }

    reportToMonitoring = (error, errorInfo) => {
        // ✅ FUTURO: Integrar con servicios como Sentry, LogRocket, etc.
        const report = {
            type: 'global-error',
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: sessionStorage.getItem('sessionId') || 'unknown'
        }

        if (config.isDevelopment) {
            console.log('📊 Error reportado a monitoreo:', report)
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }))
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="global-error-boundary">
                    <div className="error-container">
                        <div className="error-content">
                            <h1>¡Ups! Algo salió mal</h1>
                            <p>
                                Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                            </p>
                            
                            {config.isDevelopment && this.state.error && (
                                <details className="error-details">
                                    <summary>Detalles del error (solo desarrollo)</summary>
                                    <pre>{this.state.error.message}</pre>
                                    <pre>{this.state.error.stack}</pre>
                                </details>
                            )}

                            <div className="error-actions">
                                <button 
                                    onClick={this.handleRetry}
                                    className="retry-button"
                                    disabled={this.state.retryCount >= 3}
                                >
                                    {this.state.retryCount >= 3 ? 'Máximo de intentos alcanzado' : 'Reintentar'}
                                </button>
                                
                                <button 
                                    onClick={this.handleReload}
                                    className="reload-button"
                                >
                                    Recargar página
                                </button>
                            </div>

                            <div className="error-help">
                                <p>
                                    Si el problema persiste, contacta a soporte:
                                    <br />
                                    <a href={`mailto:${config.contact.email}`}>
                                        {config.contact.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default GlobalErrorBoundary 