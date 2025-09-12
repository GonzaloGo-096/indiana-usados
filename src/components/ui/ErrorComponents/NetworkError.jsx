/**
 * NetworkError - Componente para errores de red
 * 
 * Responsabilidades:
 * - Mostrar UI específica para errores de red
 * - Opciones de recuperación
 * - Mensajes amigables
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { Button } from '@ui'
import styles from './ErrorComponents.module.css'

/**
 * Componente para errores de red
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onRetry - Función para reintentar
 * @param {Function} props.onReload - Función para recargar página
 * @param {string} props.message - Mensaje personalizado
 */
export const NetworkError = ({ 
    onRetry, 
    onReload, 
    message = 'Problema de conexión. Verifica tu internet.' 
}) => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <div className={styles.errorIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path 
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                            fill="currentColor"
                        />
                    </svg>
                </div>
                
                <h3 className={styles.errorTitle}>Error de Conexión</h3>
                <p className={styles.errorMessage}>{message}</p>
                
                <div className={styles.errorActions}>
                    {onRetry && (
                        <Button 
                            onClick={onRetry}
                            variant="primary"
                            className={styles.retryButton}
                        >
                            Reintentar
                        </Button>
                    )}
                    
                    {onReload && (
                        <Button 
                            onClick={onReload}
                            variant="secondary"
                            className={styles.reloadButton}
                        >
                            Recargar página
                        </Button>
                    )}
                </div>
                
                <div className={styles.errorHelp}>
                    <p>
                        Si el problema persiste:
                    </p>
                    <ul>
                        <li>Verifica tu conexión a internet</li>
                        <li>Intenta recargar la página</li>
                        <li>Contacta soporte si el problema continúa</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NetworkError 