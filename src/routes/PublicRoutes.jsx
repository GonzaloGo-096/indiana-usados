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
import Nav from '../layouts/Nav'
import Footer from '../layouts/Footer'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// ✅ LAZY LOADING: Páginas cargadas bajo demanda
const Home = lazy(() => import('../pages/Home/Home'))
const Vehiculos = lazy(() => import('../pages/Vehiculos'))
const VehiculoDetalle = lazy(() => import('../pages/VehiculoDetalle'))
const Nosotros = lazy(() => import('../pages/Nosotros'))

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
                </Routes>
            </Suspense>
        </main>
        <Footer />
    </>
)

export default PublicRoutes 