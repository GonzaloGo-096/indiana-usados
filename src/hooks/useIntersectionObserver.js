import { useRef, useCallback, useEffect } from 'react'

export const useIntersectionObserver = (callback, options = {}) => {
    const observer = useRef()
    const { enabled = true, ...observerOptions } = options
    
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
                        callback()
                    }
                },
                { 
                    rootMargin: '300px', 
                    threshold: 0.1, 
                    ...observerOptions 
                }
            )
            
            observer.current.observe(node)
        } catch (error) {
            console.error('❌ Error initializing Intersection Observer:', error)
        }
    }, [callback, enabled, observerOptions])
    
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