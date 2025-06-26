/**
 * PublicRoutes - Rutas públicas de la aplicación
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from '../layouts/Nav'
import Footer from '../layouts/Footer'
import Home from '../pages/Home/Home'
import Vehiculos from '../pages/Vehiculos'
import VehiculoDetalle from '../pages/VehiculoDetalle'
import Nosotros from '../pages/Nosotros'

const PublicRoutes = () => (
    <>
        <Nav />
        <main className="main-content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vehiculos" element={<Vehiculos />} />
                <Route path="/vehiculo/:id" element={<VehiculoDetalle />} />
                <Route path="/nosotros" element={<Nosotros />} />
            </Routes>
        </main>
        <Footer />
    </>
)

export default PublicRoutes 