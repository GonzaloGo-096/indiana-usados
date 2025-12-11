import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para observar tarjetas de vehículos con IntersectionObserver
 * 
 * Crea un único IntersectionObserver compartido para observar múltiples elementos DOM.
 * Expone funciones para conectar y desconectar elementos individuales.
 * 
 * @param {Object} options - Opciones del observer
 * @param {Function} options.onVisible - Callback que se ejecuta cuando un elemento se hace visible
 * @returns {Object} - { observe, unobserve } Funciones para conectar/desconectar elementos
 */
export const useVehicleCardsObserver = ({ onVisible }) => {
    const observerRef = useRef(null);

    /**
     * Conecta un elemento DOM al observer
     * @param {Element|null} element - Elemento DOM a observar
     */
    const observe = useCallback((element) => {
        if (element && observerRef.current) {
            observerRef.current.observe(element);
        }
    }, []);

    /**
     * Desconecta un elemento DOM del observer
     * @param {Element|null} element - Elemento DOM a dejar de observar
     */
    const unobserve = useCallback((element) => {
        if (element && observerRef.current) {
            observerRef.current.unobserve(element);
        }
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    onVisible(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '400px 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [onVisible]);

    return { observe, unobserve };
};

