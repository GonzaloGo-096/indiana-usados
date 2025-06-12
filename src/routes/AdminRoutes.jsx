import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'

const AdminRoutes = () => (
    <div className="container-fluid py-4">
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/autos" element={<div>Lista de Autos Admin</div>} />
            <Route path="/autos/:id/editar" element={<div>Editar Auto</div>} />
        </Routes>
    </div>
)

export default AdminRoutes 