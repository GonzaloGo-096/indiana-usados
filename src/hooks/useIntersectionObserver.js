import { useRef, useCallback, useEffect } from 'react'

export const useIntersectionObserver = (callback, options = {}) => {
    const observer = useRef()
    const callbackRef = useRef(callback)
    const { enabled = true, ...observerOptions } = options
    
    // ✅ OPTIMIZADO: Throttling para evitar múltiples llamadas
    const throttledCallback = useCallback(() => {
        if (callbackRef.current) {
            callbackRef.current()
        }
    }, [])
    
    // ✅ OPTIMIZADO: Actualizar callback ref cuando cambie
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])
    
    const ref = useCallback(node => {
        if (observer.current) {
            observer.current.disconnect()
        }
        
        if (!node || !enabled) {
            return
        }
        
        try {
            observer.current = new IntersectionObserver(
                entries => {
                    const entry = entries[0]
                    if (entry.isIntersecting) {
                        // ✅ OPTIMIZADO: Usar requestAnimationFrame para throttling
                        requestAnimationFrame(throttledCallback)
                    }
                },
                { 
                    // ✅ OPTIMIZADO: Reducir rootMargin para mejor performance
                    rootMargin: '100px', // Reducido de 300px a 100px
                    threshold: 0.1, 
                    ...observerOptions 
                }
            )
            
            observer.current.observe(node)
        } catch (error) {
            console.error('❌ Error initializing Intersection Observer:', error)
        }
    }, [enabled, observerOptions, throttledCallback])
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [])
    
    return ref
} 