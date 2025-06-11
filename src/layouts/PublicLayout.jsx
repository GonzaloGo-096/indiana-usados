import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/footer'
import Home from '../pages/Home'
import Vehiculos from '../pages/Vehiculos'
import VehiculoDetalle from '../pages/VehiculoDetalle'
import Nosotros from '../pages/Nosotros'

const PublicLayout = () => (
    <>
        <Nav />
        <main className="flex-grow-1">
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

export default PublicLayout 