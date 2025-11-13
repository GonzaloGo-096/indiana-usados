/**
 * PublicRoutes - Rutas públicas de la aplicación
 * 
 * ✅ IMPLEMENTADO: Lazy loading para mejor performance
 * 
 * @author Indiana Usados
 * @version 2.1.0 - FCP Optimization: Home import non-lazy
 */

import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Nav, Footer } from '@layout'
import { LoadingSpinner } from '@ui'

// PERF: FCP Optimization - Home import non-lazy to prevent initial white screen
// Home es la página principal y debe renderizarse inmediatamente para mejorar FCP/LCP
import Home from '../pages/Home/Home'

// ✅ LAZY LOADING: Páginas cargadas bajo demanda (excepto Home)
const NotFound = lazy(() => import('../pages/NotFound/NotFound'))
const Vehiculos = lazy(() => import('../pages/Vehiculos'))
const VehiculoDetalle = lazy(() => import('../pages/VehiculoDetalle'))
const Nosotros = lazy(() => import('../pages/Nosotros'))
const Postventa = lazy(() => import('../pages/Postventa'))

// ✅ FALLBACK: Componente de carga para Suspense
const PageLoading = () => (
    <LoadingSpinner 
        message="Cargando página..." 
        size="medium" 
        fullScreen={false}
    />
)

const PublicRoutes = () => (
    <>
        <Nav />
        <main className="main-content">
            <Suspense fallback={<PageLoading />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vehiculos" element={<Vehiculos />} />
                    <Route path="/vehiculo/:id" element={<VehiculoDetalle />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/postventa" element={<Postventa />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </main>
        <Footer />
    </>
)

export default PublicRoutes 