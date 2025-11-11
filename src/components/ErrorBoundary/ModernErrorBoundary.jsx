/**
 * ModernErrorBoundary - Error Boundary moderno consolidado
 * 
 * Características:
 * - Basado en react-error-boundary (hooks modernos)
 * - Lógica consolidada (elimina duplicaciones)
 * - UI consistente y optimizada
 * - Logging centralizado con logger
 * - Configuración flexible por props
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Modernizado y consolidado
 */

import { ErrorBoundary } from 'react-error-boundary'
import { logger } from '@utils/logger'
import styles from './ModernErrorBoundary.module.css'

/**
 * Componente de fallback unificado
 */
function ErrorFallback({ error, resetErrorBoundary, variant = 'default' }) {
  const isVehicles = variant === 'vehicles'
  const isGlobal = variant === 'global'
  
  return (
    <div className={`${styles.errorBoundary} ${styles[variant]}`}>
      <div className={styles.errorContainer}>
        {/* Icono de error */}
        <div className={styles.errorIcon}>
          {isVehicles ? '🚗💥' : isGlobal ? '🌐❌' : '⚠️'}
        </div>

        {/* Título específico */}
        <h2 className={styles.errorTitle}>
          {isVehicles && 'Problema con los vehículos'}
          {isGlobal && '¡Ups! Algo salió mal'}
          {!isVehicles && !isGlobal && 'Error inesperado'}
        </h2>

        {/* Descripción específica */}
        <p className={styles.errorDescription}>
          {isVehicles && 'No pudimos cargar los vehículos. Nuestro equipo ha sido notificado.'}
          {isGlobal && 'Ha ocurrido un error inesperado en la aplicación.'}
          {!isVehicles && !isGlobal && 'Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.'}
        </p>

        {/* Botones de acción */}
        <div className={styles.errorActions}>
          <button 
            onClick={resetErrorBoundary}
            className={styles.retryButton}
          >
            🔄 Reintentar
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className={styles.reloadButton}
          >
            🔄 Recargar página
          </button>
          
          {isVehicles && (
            <button 
              onClick={() => window.history.back()}
              className={styles.backButton}
            >
              ⬅️ Volver atrás
            </button>
          )}
        </div>

        {/* Detalles técnicos (solo desarrollo) */}
        {import.meta.env.DEV && error && (
          <details className={styles.errorDetails}>
            <summary>Detalles técnicos (desarrollo)</summary>
            <pre className={styles.errorStack}>
              {error.message}
              {'\n'}
              {error.stack}
            </pre>
          </details>
        )}

        {/* Información de contacto */}
        <div className={styles.errorContact}>
          <p>Si el problema persiste:</p>
          <a href="mailto:soporte@indianausados.com" className={styles.contactLink}>
            soporte@indianausados.com
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook para logging consolidado de errores
 */
function useErrorLogger(variant = 'default') {
  return (error, errorInfo) => {
    // Crear reporte de error consolidado
    const errorReport = {
      type: variant,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('sessionId') || 'unknown'
    }

    // Log con logger centralizado
    logger.error(`${variant.toUpperCase()} Error Boundary:`, errorReport)

    // Guardar localmente para debugging
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
      errors.push(errorReport)
      
      // Mantener solo los últimos 5 errores
      if (errors.length > 5) {
        errors.splice(0, errors.length - 5)
      }
      
      localStorage.setItem('app_errors', JSON.stringify(errors))
    } catch (e) {
      logger.warn('No se pudo guardar error localmente:', e)
    }

    // Error monitoring en producción - Ver docs/MEJORAS_FUTURAS.md
    // Sistema actual: Solo localStorage (suficiente para desarrollo)
    // Futuro: Integrar Sentry cuando haya tráfico real de usuarios
  }
}

/**
 * ModernErrorBoundary - Componente principal consolidado
 */
export function ModernErrorBoundary({ 
  children, 
  variant = 'default',
  fallback: CustomFallback,
  onReset,
  ...props 
}) {
  const logError = useErrorLogger(variant)
  
  return (
    <ErrorBoundary
      FallbackComponent={CustomFallback || ((props) => (
        <ErrorFallback {...props} variant={variant} />
      ))}
      onError={logError}
      onReset={onReset}
      {...props}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Variantes específicas para facilitar migración
 */
export const GlobalErrorBoundary = ({ children, ...props }) => (
  <ModernErrorBoundary variant="global" {...props}>
    {children}
  </ModernErrorBoundary>
)

export const VehiclesErrorBoundary = ({ children, ...props }) => (
  <ModernErrorBoundary variant="vehicles" {...props}>
    {children}
  </ModernErrorBoundary>
)

// Export por defecto
export default ModernErrorBoundary
