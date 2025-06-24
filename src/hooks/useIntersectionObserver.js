import { useRef, useCallback } from 'react'

export const useIntersectionObserver = (callback, options = {}) => {
    const observer = useRef()
    const { enabled = true, ...observerOptions } = options
    
    const ref = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        
        if (!node || !enabled) return
        
        observer.current = new IntersectionObserver(
            entries => entries[0].isIntersecting && callback(),
            { rootMargin: '300px', threshold: 0.1, ...observerOptions }
        )
        
        observer.current.observe(node)
    }, [callback, enabled, observerOptions])
    
    return ref
} 