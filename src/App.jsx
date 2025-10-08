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
import { Navigate } from 'react-router-dom'
import './App.module.css'
import { DeviceProvider } from '@hooks'

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
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/*" element={<PublicRoutes />} />

                        {/* Rutas del admin */}
                        <Route path="/admin/*" element={<AdminRoutes />} />

                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </DeviceProvider>
        </Router>
    )
}

export default App
