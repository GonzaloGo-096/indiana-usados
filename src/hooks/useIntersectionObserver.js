import { useRef, useCallback, useEffect } from 'react'

export const useIntersectionObserver = (callback, options = {}) => {
    const observer = useRef()
    const { enabled = true, ...observerOptions } = options
    
    const ref = useCallback(node => {
        if (observer.current) {
            observer.current.disconnect()
        }
        
        if (!node || !enabled) {
            if (import.meta.env.DEV) {
                console.log('🎯 Intersection Observer:', enabled ? 'Node not provided' : 'Disabled')
            }
            return
        }
        
        try {
            observer.current = new IntersectionObserver(
                entries => {
                    const entry = entries[0]
                    if (entry.isIntersecting) {
                        if (import.meta.env.DEV) {
                            console.log('🎯 Intersection Observer triggered!', {
                                isIntersecting: entry.isIntersecting,
                                intersectionRatio: entry.intersectionRatio,
                                boundingClientRect: entry.boundingClientRect
                            })
                        }
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
            
            if (import.meta.env.DEV) {
                console.log('🎯 Intersection Observer initialized with options:', {
                    rootMargin: observerOptions.rootMargin || '300px',
                    threshold: observerOptions.threshold || 0.1,
                    enabled
                })
            }
        } catch (error) {
            console.error('❌ Error initializing Intersection Observer:', error)
        }
    }, [callback, enabled, observerOptions])
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect()
                if (import.meta.env.DEV) {
                    console.log('🎯 Intersection Observer disconnected')
                }
            }
        }
    }, [])
    
    return ref
} 