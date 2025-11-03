/**
 * PublicRoutes - Rutas públicas de la aplicación
 * 
 * ✅ IMPLEMENTADO: Lazy loading para mejor performance
 * 
 * @author Indiana Usados
 * @version 2.0.0 - CODE SPLITTING IMPLEMENTADO
 */

import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Nav, Footer } from '@layout'
import { LoadingSpinner } from '@ui'
const NotFound = lazy(() => import('../pages/NotFound/NotFound'))

// ✅ LAZY LOADING: Páginas cargadas bajo demanda
const Home = lazy(() => import('../pages/Home/Home'))
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