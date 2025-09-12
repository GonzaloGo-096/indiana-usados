/**
 * LoadingSpinner - Componente de carga para lazy loading
 * 
 * Características:
 * - Spinner animado
 * - Mensaje personalizable
 * - Tamaños diferentes
 * - Responsive design
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import styles from './LoadingSpinner.module.css'

/**
 * Componente LoadingSpinner
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.size - Tamaño del spinner (small, medium, large)
 * @param {boolean} props.fullScreen - Si ocupar toda la pantalla
 */
export const LoadingSpinner = ({ 
    message = 'Cargando...', 
    size = 'medium',
    fullScreen = false 
}) => {
    return (
        <div className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}>
            <div className={`${styles.spinner} ${styles[size]}`}>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
            </div>
            {message && (
                <p className={styles.message}>{message}</p>
            )}
        </div>
    )
}

export default LoadingSpinner 