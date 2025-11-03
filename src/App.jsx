/**
 * App.jsx - Componente principal de la aplicación
 * 
 * Configuración:
 * - React Router
 * - Rutas públicas y admin
 * - Autenticación
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import './App.module.css'
import { DeviceProvider } from '@hooks'
import ScrollOnRouteChange from '@ui/ScrollOnRouteChange'
import AuthUnauthorizedListener from '@components/auth/AuthUnauthorizedListener'

// Routes
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'


function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <DeviceProvider>
                <div className="app">
                    <AuthUnauthorizedListener />
                    <ScrollOnRouteChange behavior="smooth" />
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/*" element={<PublicRoutes />} />

                        {/* Rutas del admin */}
                        <Route path="/admin/*" element={<AdminRoutes />} />
                    </Routes>
                </div>
            </DeviceProvider>
        </Router>
    )
}

export default App
