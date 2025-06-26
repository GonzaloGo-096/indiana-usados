/**
 * AdminRoutes - Rutas del panel de administración
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'
import Login from '../pages/admin/Login'

const AdminRoutes = () => (
    <div className="admin-container">
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/autos" element={<div>Lista de Autos Admin</div>} />
            <Route path="/autos/:id/editar" element={<div>Editar Auto</div>} />
        </Routes>
    </div>
)

export default AdminRoutes 