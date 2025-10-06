/**
 * LazyCarForm - Wrapper lazy loading para CarFormRHF
 * 
 * Optimización: Carga CarFormRHF solo cuando se necesita
 * Beneficio: -32.4 KB en bundle inicial
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Lazy loading implementado
 */

import React, { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@ui'

// ✅ LAZY LOADING: CarFormRHF cargado bajo demanda
const CarFormRHF = lazy(() => import('./CarFormRHF'))

// ✅ FALLBACK: Spinner específico para formulario
const FormLoading = () => (
    <LoadingSpinner 
        message="Cargando formulario..." 
        size="medium" 
        fullScreen={false}
    />
)

/**
 * LazyCarForm - Componente con lazy loading
 */
const LazyCarForm = (props) => (
    <Suspense fallback={<FormLoading />}>
        <CarFormRHF {...props} />
    </Suspense>
)

export default LazyCarForm
