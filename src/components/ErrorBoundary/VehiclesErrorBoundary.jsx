/**
 * VehiclesErrorBoundary - Error boundary específico para vehículos
 * 
 * Características:
 * - Captura errores en componentes de vehículos
 * - Recuperación graceful con opciones de retry
 * - Logging detallado para debugging
 * - UI amigable para el usuario
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import styles from './VehiclesErrorBoundary.module.css'

class VehiclesErrorBoundary extends React.Component {
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
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('🚨 VehiclesErrorBoundary caught:', error, errorInfo)
        this.setState({ errorInfo })
        
        // ✅ REPORTAR A SERVICIO DE MONITORING
        this.reportError(error, errorInfo)
    }

    reportError = (error, errorInfo) => {
        // ✅ ENVIAR A SERVICIO DE MONITORING (Sentry, LogRocket, etc.)
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        }
        
        console.log('📊 Error reported to monitoring service:', errorReport)
        
        // ✅ FUTURO: Integrar con servicio real
        // sendToMonitoringService(errorReport)
    }

    handleRetry = () => {
        console.log('🔄 Retrying after error...')
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null,
            retryCount: this.state.retryCount + 1
        })
    }

    handleReload = () => {
        console.log('🔄 Reloading page...')
        window.location.reload()
    }

    handleGoBack = () => {
        console.log('⬅️ Going back...')
        window.history.back()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorBoundary}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>🚨</div>
                        <h2 className={styles.errorTitle}>
                            Algo salió mal con los vehículos
                        </h2>
                        <p className={styles.errorMessage}>
                            Hemos detectado un problema inesperado al cargar los vehículos.
                        </p>
                        
                        {this.state.retryCount < 3 && (
                            <p className={styles.retryInfo}>
                                Intento {this.state.retryCount + 1} de 3
                            </p>
                        )}
                        
                        <div className={styles.errorActions}>
                            {this.state.retryCount < 3 ? (
                                <button 
                                    onClick={this.handleRetry}
                                    className={styles.retryButton}
                                >
                                    🔄 Intentar de nuevo
                                </button>
                            ) : (
                                <button 
                                    onClick={this.handleReload}
                                    className={styles.reloadButton}
                                >
                                    🔄 Recargar página
                                </button>
                            )}
                            
                            <button 
                                onClick={this.handleGoBack}
                                className={styles.backButton}
                            >
                                ⬅️ Volver atrás
                            </button>
                        </div>
                        
                        {process.env.NODE_ENV === 'development' && (
                            <details className={styles.errorDetails}>
                                <summary>Detalles técnicos (solo desarrollo)</summary>
                                <pre className={styles.errorStack}>
                                    {this.state.error?.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default VehiclesErrorBoundary 