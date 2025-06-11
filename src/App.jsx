import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Componentes de autenticación
import { RequireAuth } from './components/auth/RequireAuth'

// Páginas del admin
import Login from './pages/admin/Login'

// Crear una nueva instancia de QueryClient
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/*" element={<PublicLayout />} />

                        {/* Ruta de login */}
                        <Route path="/admin/login" element={<Login />} />

                        {/* Rutas protegidas del admin */}
                        <Route path="/admin/*" element={
                            <RequireAuth>
                                <AdminLayout />
                            </RequireAuth>
                        } />

                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    )
}

export default App
