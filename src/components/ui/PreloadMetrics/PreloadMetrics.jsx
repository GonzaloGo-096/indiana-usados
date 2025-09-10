/**
 * PreloadMetrics - Componente para mostrar métricas de preload
 * 
 * Funcionalidades:
 * - Muestra estadísticas de preload
 * - Métricas en tiempo real
 * - Debug de performance
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import styles from './PreloadMetrics.module.css'

/**
 * Componente PreloadMetrics
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Si mostrar el componente
 * @param {Function} props.getStats - Función para obtener estadísticas
 */
export const PreloadMetrics = ({ show = false, getStats }) => {
  const [stats, setStats] = useState({
    preloadedCount: 0,
    preloadedUrls: []
  })

  const [isVisible, setIsVisible] = useState(show)

  // Actualizar estadísticas cada segundo
  useEffect(() => {
    if (!isVisible || !getStats) return

    const interval = setInterval(() => {
      const newStats = getStats()
      setStats(newStats)
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, getStats])

  if (!isVisible) return null

  return (
    <div className={styles.metrics}>
      <div className={styles.header}>
        <h3>🚀 Preload Metrics</h3>
        <button 
          className={styles.closeBtn}
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.stat}>
          <span className={styles.label}>Imágenes Preload:</span>
          <span className={styles.value}>{stats.preloadedCount}</span>
        </div>
        
        <div className={styles.stat}>
          <span className={styles.label}>URLs Preload:</span>
          <div className={styles.urls}>
            {stats.preloadedUrls.map((url, index) => (
              <div key={index} className={styles.url}>
                {url.split('/').pop()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreloadMetrics
