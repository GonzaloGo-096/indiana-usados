import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'
import { Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Vehiculos from './pages/Vehiculos'    
import Nosotros from './pages/Nosotros'
import VehiculoDetalle from './pages/VehiculoDetalle'
import Nav from './components/Nav'
import Footer from './components/footer'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            cacheTime: 1000 * 60 * 30, // 30 minutos
        },
    },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Nav />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route path="/vehiculo/:id" element={<VehiculoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="*" element={<Navigate to="/" />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
