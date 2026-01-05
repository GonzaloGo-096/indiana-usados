/**
 * PublicRoutes - Rutas públicas de la aplicación
 * 
 * ✅ IMPLEMENTADO: Lazy loading para mejor performance
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Refactor: Rutas principales /usados y /0km con redirects de compatibilidad
 */

import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

// ✅ 0KM: Páginas de autos nuevos
const CeroKilometros = lazy(() => import('../pages/CeroKilometros'))
const CeroKilometroDetalle = lazy(() => import('../pages/CeroKilometros/CeroKilometroDetalle'))

// ✅ PLANES: Página de planes de financiación
const Planes = lazy(() => import('../pages/Planes'))
const PlanDetalle = lazy(() => import('../pages/Planes/PlanDetalle'))

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
                    {/* ✅ NUEVAS RUTAS PRINCIPALES */}
                    <Route path="/usados" element={<Vehiculos />} />
                    <Route path="/0km" element={<CeroKilometros />} />
                    <Route path="/0km/:autoSlug" element={<CeroKilometroDetalle />} />
                    <Route path="/planes" element={<Planes />} />
                    <Route path="/planes/:planId" element={<PlanDetalle />} />
                    {/* ✅ REDIRECTS: Mantener compatibilidad con rutas antiguas */}
                    <Route path="/autos/usados" element={<Navigate to="/usados" replace />} />
                    <Route path="/autos/0km" element={<Navigate to="/0km" replace />} />
                    <Route path="/vehiculos" element={<Navigate to="/usados" replace />} />
                    {/* Otras rutas */}
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