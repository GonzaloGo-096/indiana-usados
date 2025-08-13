/**
 * PerformanceMetrics - Componente para mostrar métricas de performance
 * 
 * ✅ IMPLEMENTADO: Monitoreo en tiempo real de métricas de performance
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react'
import './PerformanceMetrics.module.css'

/**
 * Componente para mostrar métricas de performance
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Si mostrar las métricas
 * @param {boolean} props.autoHide - Si ocultar automáticamente
 * @param {number} props.hideDelay - Delay para ocultar (ms)
 */
const PerformanceMetrics = ({ 
    show = false, 
    autoHide = true, 
    hideDelay = 5000 
}) => {
    const [metrics, setMetrics] = useState({})
    const [isVisible, setIsVisible] = useState(show)
    const [isExpanded, setIsExpanded] = useState(false)

    // ✅ MÉTRICAS DE PERFORMANCE: Capturar métricas en tiempo real
    const captureMetrics = useCallback(() => {
        if (!window.performance) return

        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        const resource = performance.getEntriesByType('resource')

        const newMetrics = {
            // ✅ NAVIGATION TIMING
            dns: navigation?.domainLookupEnd - navigation?.domainLookupStart || 0,
            tcp: navigation?.connectEnd - navigation?.connectStart || 0,
            ttfb: navigation?.responseStart - navigation?.requestStart || 0,
            domLoad: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
            windowLoad: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
            total: navigation?.loadEventEnd - navigation?.fetchStart || 0,

            // ✅ PAINT TIMING
            fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            lcp: paint.find(p => p.name === 'largest-contentful-paint')?.startTime || 0,

            // ✅ RESOURCE TIMING
            resourceCount: resource.length,
            resourceSize: resource.reduce((acc, r) => acc + (r.transferSize || 0), 0),

            // ✅ MEMORY (si está disponible)
            memory: window.performance.memory ? {
                used: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null
        }

        setMetrics(newMetrics)
    }, [])

    // ✅ CAPTURAR MÉTRICAS: En intervalos regulares
    useEffect(() => {
        if (!isVisible) return

        // Capturar métricas iniciales
        captureMetrics()

        // Capturar métricas cada 2 segundos
        const interval = setInterval(captureMetrics, 2000)

        return () => clearInterval(interval)
    }, [isVisible, captureMetrics])

    // ✅ AUTO-HIDE: Ocultar automáticamente después del delay
    useEffect(() => {
        if (!autoHide || !isVisible) return

        const timer = setTimeout(() => {
            setIsVisible(false)
        }, hideDelay)

        return () => clearTimeout(timer)
    }, [autoHide, hideDelay, isVisible])

    // ✅ TOGGLE VISIBILIDAD: Mostrar/ocultar métricas
    const toggleVisibility = useCallback(() => {
        setIsVisible(prev => !prev)
    }, [])

    // ✅ TOGGLE EXPANDED: Expandir/contraer métricas
    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev)
    }, [])

    // ✅ FORMATEAR TIEMPO: Convertir ms a formato legible
    const formatTime = (ms) => {
        if (ms < 1000) return `${Math.round(ms)}ms`
        return `${(ms / 1000).toFixed(2)}s`
    }

    // ✅ FORMATEAR TAMAÑO: Convertir bytes a formato legible
    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes}B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    }

    // ✅ CALCULAR SCORE: Score de performance basado en métricas
    const calculateScore = () => {
        let score = 100

        // Penalizar por tiempos altos
        if (metrics.ttfb > 600) score -= 20
        if (metrics.fcp > 1800) score -= 20
        if (metrics.lcp > 2500) score -= 20

        // Penalizar por recursos grandes
        if (metrics.resourceCount > 50) score -= 10
        if (metrics.resourceSize > 1024 * 1024 * 2) score -= 10

        return Math.max(0, score)
    }

    if (!isVisible) {
        return (
            <button 
                className="performance-toggle"
                onClick={toggleVisibility}
                title="Mostrar métricas de performance"
            >
                📊
            </button>
        )
    }

    const score = calculateScore()
    const scoreColor = score >= 90 ? '#22c55e' : score >= 70 ? '#eab308' : '#ef4444'

    return (
        <div className={`performance-metrics ${isExpanded ? 'expanded' : ''}`}>
            <div className="metrics-header">
                <h4>📊 Performance Metrics</h4>
                <div className="metrics-actions">
                    <button 
                        onClick={toggleExpanded}
                        className="expand-btn"
                        title={isExpanded ? 'Contraer' : 'Expandir'}
                    >
                        {isExpanded ? '−' : '+'}
                    </button>
                    <button 
                        onClick={toggleVisibility}
                        className="close-btn"
                        title="Cerrar"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="metrics-content">
                {/* Score de Performance */}
                <div className="performance-score">
                    <div className="score-circle" style={{ borderColor: scoreColor }}>
                        <span style={{ color: scoreColor }}>{score}</span>
                    </div>
                    <div className="score-label">
                        <strong>Performance Score</strong>
                        <small>{score >= 90 ? 'Excelente' : score >= 70 ? 'Bueno' : 'Necesita mejora'}</small>
                    </div>
                </div>

                {/* Métricas de Navegación */}
                <div className="metrics-section">
                    <h5>🌐 Navegación</h5>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <span className="metric-label">DNS:</span>
                            <span className="metric-value">{formatTime(metrics.dns)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">TCP:</span>
                            <span className="metric-value">{formatTime(metrics.tcp)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">TTFB:</span>
                            <span className="metric-value">{formatTime(metrics.ttfb)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">DOM Load:</span>
                            <span className="metric-value">{formatTime(metrics.domLoad)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Window Load:</span>
                            <span className="metric-value">{formatTime(metrics.windowLoad)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Total:</span>
                            <span className="metric-value">{formatTime(metrics.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Métricas de Paint */}
                <div className="metrics-section">
                    <h5>🎨 Paint</h5>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <span className="metric-label">FCP:</span>
                            <span className="metric-value">{formatTime(metrics.fcp)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">LCP:</span>
                            <span className="metric-value">{formatTime(metrics.lcp)}</span>
                        </div>
                    </div>
                </div>

                {/* Métricas de Recursos */}
                <div className="metrics-section">
                    <h5>📦 Recursos</h5>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <span className="metric-label">Cantidad:</span>
                            <span className="metric-value">{metrics.resourceCount || 0}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Tamaño:</span>
                            <span className="metric-value">{formatSize(metrics.resourceSize || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Métricas de Memoria */}
                {metrics.memory && (
                    <div className="metrics-section">
                        <h5>💾 Memoria</h5>
                        <div className="metrics-grid">
                            <div className="metric-item">
                                <span className="metric-label">Usada:</span>
                                <span className="metric-value">{metrics.memory.used}MB</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Total:</span>
                                <span className="metric-value">{metrics.memory.total}MB</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Límite:</span>
                                <span className="metric-value">{metrics.memory.limit}MB</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Información del Sistema */}
                <div className="metrics-section">
                    <h5>ℹ️ Sistema</h5>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <span className="metric-label">User Agent:</span>
                            <span className="metric-value">{navigator.userAgent.split(' ')[0]}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Plataforma:</span>
                            <span className="metric-value">{navigator.platform}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Conexión:</span>
                            <span className="metric-value">
                                {navigator.connection ? navigator.connection.effectiveType : 'Desconocida'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer con información */}
            <div className="metrics-footer">
                <small>
                    📊 Métricas actualizadas cada 2s | 
                    🕐 Última actualización: {new Date().toLocaleTimeString()}
                </small>
            </div>
        </div>
    )
}

export default PerformanceMetrics 