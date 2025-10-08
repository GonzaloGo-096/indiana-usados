import { useCallback, useRef } from 'react'
import { logger } from '@utils/logger'

export const usePreloadRoute = (options = {}) => {
    const {
        delay = 200, // 200ms de delay
        enabled = true
    } = options

    const preloadTimeouts = useRef(new Map())
    const preloadedRoutes = useRef(new Set())

    // ✅ PRECARGAR RUTA CON DELAY
    const preloadRoute = useCallback((routePath, importFn) => {
        if (!enabled || preloadedRoutes.current.has(routePath)) {
            return
        }

        // Cancelar preload anterior si existe
        if (preloadTimeouts.current.has(routePath)) {
            clearTimeout(preloadTimeouts.current.get(routePath))
        }

        // Programar preload con delay
        const timeoutId = setTimeout(() => {
            try {
                importFn()
                preloadedRoutes.current.add(routePath)
                logger.debug('hooks:preload', `Preloaded route: ${routePath}`)
            } catch (error) {
                logger.warn('hooks:preload', `Failed to preload route: ${routePath}`, error)
            }
        }, delay)

        preloadTimeouts.current.set(routePath, timeoutId)
    }, [delay, enabled])

    // ✅ PRECARGAR RUTA INMEDIATAMENTE
    const preloadRouteImmediate = useCallback((routePath, importFn) => {
        if (!enabled || preloadedRoutes.current.has(routePath)) {
            return
        }

        try {
            importFn()
            preloadedRoutes.current.add(routePath)
            logger.debug('hooks:preload', `Immediately preloaded route: ${routePath}`)
        } catch (error) {
            logger.warn('hooks:preload', `Failed to preload route immediately: ${routePath}`, error)
        }
    }, [enabled])

    // ✅ CANCELAR PRECARGA
    const cancelPreload = useCallback((routePath) => {
        if (preloadTimeouts.current.has(routePath)) {
            clearTimeout(preloadTimeouts.current.get(routePath))
            preloadTimeouts.current.delete(routePath)
        }
    }, [])

    // ✅ LIMPIAR TIMEOUTS
    const clearAllPreloads = useCallback(() => {
        preloadTimeouts.current.forEach(timeoutId => {
            clearTimeout(timeoutId)
        })
        preloadTimeouts.current.clear()
    }, [])

    // ✅ VERIFICAR SI RUTA ESTÁ PRECARGADA
    const isRoutePreloaded = useCallback((routePath) => {
        return preloadedRoutes.current.has(routePath)
    }, [])

    return {
        preloadRoute,
        preloadRouteImmediate,
        cancelPreload,
        clearAllPreloads,
        isRoutePreloaded
    }
}


