/**
 * AdminRoutes - Rutas del panel de administración
 * 
 * ✅ IMPLEMENTADO: Lazy loading para mejor performance
 * 
 * @author Indiana Usados
 * @version 2.0.0 - CODE SPLITTING IMPLEMENTADO
 */

import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoadingSpinner } from '@ui'
const NotFound = lazy(() => import('../pages/NotFound/NotFound'))
import { RequireAuth } from '@components/auth/RequireAuth'

// ✅ LAZY LOADING: Páginas de admin cargadas bajo demanda
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const Login = lazy(() => import('../pages/admin/Login'))

// ✅ FALLBACK: Componente de carga para admin
const AdminLoading = () => (
    <LoadingSpinner 
        message="Cargando panel de administración..." 
        size="medium" 
        fullScreen={false}
    />
)

const AdminRoutes = () => (
    <div className="admin-container">
        <Suspense fallback={<AdminLoading />}>
            <Routes>
                {/* Ruta de login - sin protección */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas */}
                <Route path="/" element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    </div>
)

export default AdminRoutes 