/**
 * App.jsx - Componente principal de la aplicación
 * 
 * Configuración:
 * - React Router
 * - Rutas públicas y admin
 * - Autenticación
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import './App.module.css'

// Context
import { FilterProvider } from './contexts/FilterContext'

// Routes
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'

// Componentes de autenticación
import { RequireAuth } from './components/auth/RequireAuth'

// Páginas del admin
import Login from './pages/admin/Login'

function App() {
    return (
        <FilterProvider>
            <Router>
                <div className="app">
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/*" element={<PublicRoutes />} />

                        {/* Ruta de login */}
                        <Route path="/admin/login" element={<Login />} />

                        {/* Rutas protegidas del admin */}
                        <Route path="/admin/*" element={
                            <RequireAuth>
                                <AdminRoutes />
                            </RequireAuth>
                        } />

                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </FilterProvider>
    )
}

export default App
