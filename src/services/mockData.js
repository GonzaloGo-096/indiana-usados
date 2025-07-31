/**
 * mockData.js - Datos mock para simular backend con filtros
 * 
 * Simula una API que maneja filtros correctamente
 * 
 * @author Indiana Usados
 * @version 2.1.0 - LIMPIEZA DE DUPLICADOS
 */

// Importar función de filtrado centralizada
import { filterVehicles } from '../utils/filterUtils'

// Datos mock de vehículos con múltiples imágenes
const mockVehicles = [
    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        version: "XSE",
        año: 2020,
        precio: 10000000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 50000,
        kms: 50000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "2.0", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Full", // ✅ AGREGADO: Campo categoría
        color: "Blanco",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo en excelente estado, único dueño, mantenimiento al día",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 2,
        marca: "Toyota",
        modelo: "Camry",
        version: "XLE",
        año: 2021,
        precio: 8594987,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 30000,
        kms: 30000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "2.5", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Semi Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Intermedia", // ✅ AGREGADO: Campo categoría
        color: "Negro",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo premium, equipamiento completo, garantía extendida",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 3,
        marca: "Honda",
        modelo: "Civic",
        version: "Sport",
        año: 2019,
        precio: 7500000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 70000,
        kms: 70000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "1.8", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Pana", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Base", // ✅ AGREGADO: Campo categoría
        color: "Azul",
        categoria: "Sedán",
        caja: "Manual",
        detalle: "Vehículo deportivo, bien mantenido, ideal para ciudad",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 4,
        marca: "Honda",
        modelo: "Accord",
        version: "Touring",
        año: 2020,
        precio: 9200000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 45000,
        kms: 45000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "2.0", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x4", // ✅ AGREGADO: Campo tracción
        tapizado: "Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Full", // ✅ AGREGADO: Campo categoría
        color: "Gris",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo familiar, espacioso y confortable",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 5,
        marca: "Ford",
        modelo: "Focus",
        version: "SE",
        año: 2018,
        precio: 6500000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 80000,
        kms: 80000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "1.6", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Pana", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Base", // ✅ AGREGADO: Campo categoría
        color: "Rojo",
        categoria: "Sedán",
        caja: "Manual",
        detalle: "Vehículo económico, ideal para ciudad",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 6,
        marca: "Ford",
        modelo: "Mustang",
        version: "GT",
        año: 2022,
        precio: 15000000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 15000,
        kms: 15000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "5.0", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Full", // ✅ AGREGADO: Campo categoría
        color: "Negro",
        categoria: "Deportivo",
        caja: "Automática",
        detalle: "Vehículo deportivo de alto rendimiento",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 7,
        marca: "Chevrolet",
        modelo: "Cruze",
        version: "Premier",
        año: 2021,
        precio: 8500000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 35000,
        kms: 35000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "1.4", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Semi Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Intermedia", // ✅ AGREGADO: Campo categoría
        color: "Blanco",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo confortable y eficiente",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 8,
        marca: "Chevrolet",
        modelo: "Camaro",
        version: "SS",
        año: 2023,
        precio: 18000000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 5000,
        kms: 5000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "6.2", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Full", // ✅ AGREGADO: Campo categoría
        color: "Amarillo",
        categoria: "Deportivo",
        caja: "Manual",
        detalle: "Vehículo deportivo legendario",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 9,
        marca: "Nissan",
        modelo: "Sentra",
        version: "SR",
        año: 2020,
        precio: 7800000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 40000,
        kms: 40000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "2.0", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Pana", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Base", // ✅ AGREGADO: Campo categoría
        color: "Gris",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo confiable y económico",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 10,
        marca: "Nissan",
        modelo: "Altima",
        version: "SL",
        año: 2022,
        precio: 11000000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 20000,
        kms: 20000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "2.5", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x4", // ✅ AGREGADO: Campo tracción
        tapizado: "Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Full", // ✅ AGREGADO: Campo categoría
        color: "Azul",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo premium con tecnología avanzada",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 11,
        marca: "Peugeot",
        modelo: "208",
        version: "Feline",
        año: 2021,
        precio: 7200000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 35000,
        kms: 35000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "1.6", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x2", // ✅ AGREGADO: Campo tracción
        tapizado: "Semi Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Intermedia", // ✅ AGREGADO: Campo categoría
        color: "Blanco",
        categoria: "Hatchback",
        caja: "Automática",
        detalle: "Vehículo compacto y elegante, ideal para ciudad",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 12,
        marca: "Peugeot",
        modelo: "3008",
        version: "GT Line",
        año: 2022,
        precio: 12500000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 25000,
        kms: 25000, // ✅ AGREGADO: Campo kms para vehículo detalle
        cilindrada: "1.6", // ✅ AGREGADO: Campo cilindrada
        traccion: "4x4", // ✅ AGREGADO: Campo tracción
        tapizado: "Cuero", // ✅ AGREGADO: Campo tapizado
        categoriaVehiculo: "Full", // ✅ AGREGADO: Campo categoría
        color: "Gris",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV compacto con diseño moderno y tecnología avanzada",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 13,
        marca: "Volkswagen",
        modelo: "Golf",
        version: "GTI 2.0",
        año: 2021,
        precio: 9500000, // ✅ ACTUALIZADO: 9.5 millones
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 30000,
        color: "Rojo",
        categoria: "Hatchback",
        caja: "Manual",
        detalle: "Hatchback deportivo con excelente manejo",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 14,
        marca: "BMW",
        modelo: "Serie 3",
        version: "320i 2.0",
        año: 2022,
        precio: 16000000, // ✅ ACTUALIZADO: 16 millones
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 15000,
        color: "Negro",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Sedán premium con tecnología de vanguardia",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 15,
        marca: "Mercedes-Benz",
        modelo: "Clase A",
        version: "AMG Line 1.3",
        año: 2023,
        precio: 13500000, // ✅ ACTUALIZADO: 13.5 millones
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 8000,
        color: "Blanco",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Sedán compacto premium con diseño elegante",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 9,
        marca: "Nissan",
        modelo: "Sentra",
        año: 2021,
        precio: 22000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 35000,
        color: "Gris",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo económico y confiable, ideal para ciudad",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 10,
        marca: "Nissan",
        modelo: "Altima",
        año: 2020,
        precio: 28000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 42000,
        color: "Negro",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo premium con tecnología avanzada",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 11,
        marca: "Volkswagen",
        modelo: "Golf",
        año: 2019,
        precio: 20000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 65000,
        color: "Blanco",
        categoria: "Hatchback",
        caja: "Manual",
        detalle: "Vehículo alemán, calidad superior, bien mantenido",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 12,
        marca: "Volkswagen",
        modelo: "Passat",
        año: 2021,
        precio: 32000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 25000,
        color: "Azul",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo ejecutivo, confort y elegancia",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 13,
        marca: "BMW",
        modelo: "Serie 3",
        año: 2020,
        precio: 45000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 30000,
        color: "Negro",
        categoria: "Lujo",
        caja: "Automática",
        detalle: "Vehículo de lujo, deportivo y elegante",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 14,
        marca: "BMW",
        modelo: "X3",
        año: 2021,
        precio: 52000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 20000,
        color: "Blanco",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV de lujo, versátil y potente",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 15,
        marca: "Mercedes-Benz",
        modelo: "Clase C",
        año: 2021,
        precio: 48000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 18000,
        color: "Gris",
        categoria: "Lujo",
        caja: "Automática",
        detalle: "Vehículo premium, tecnología de vanguardia",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 16,
        marca: "Mercedes-Benz",
        modelo: "GLC",
        año: 2020,
        precio: 55000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 28000,
        color: "Negro",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV de lujo, confort y seguridad",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 17,
        marca: "Audi",
        modelo: "A4",
        año: 2021,
        precio: 42000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 22000,
        color: "Blanco",
        categoria: "Lujo",
        caja: "Automática",
        detalle: "Vehículo alemán, elegancia y rendimiento",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 18,
        marca: "Audi",
        modelo: "Q5",
        año: 2020,
        precio: 48000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 35000,
        color: "Azul",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV premium, versátil y elegante",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 19,
        marca: "Hyundai",
        modelo: "Elantra",
        año: 2020,
        precio: 19000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 48000,
        color: "Rojo",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo económico, garantía extendida",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 20,
        marca: "Hyundai",
        modelo: "Tucson",
        año: 2021,
        precio: 28000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 32000,
        color: "Gris",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV compacto, ideal para familia",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 21,
        marca: "Kia",
        modelo: "Forte",
        año: 2019,
        precio: 17000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 72000,
        color: "Negro",
        categoria: "Sedán",
        caja: "Manual",
        detalle: "Vehículo económico, bajo consumo",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 22,
        marca: "Kia",
        modelo: "Sportage",
        año: 2020,
        precio: 26000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 41000,
        color: "Blanco",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV confiable, perfecto para aventuras",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 23,
        marca: "Mazda",
        modelo: "3",
        año: 2021,
        precio: 23000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 28000,
        color: "Rojo",
        categoria: "Sedán",
        caja: "Automática",
        detalle: "Vehículo deportivo, diseño elegante",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 24,
        marca: "Mazda",
        modelo: "CX-5",
        año: 2020,
        precio: 29000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 38000,
        color: "Azul",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV premium, tecnología avanzada",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 25,
        marca: "Subaru",
        modelo: "Impreza",
        año: 2019,
        precio: 21000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 58000,
        color: "Gris",
        categoria: "Sedán",
        caja: "Manual",
        detalle: "Vehículo con tracción integral, seguridad superior",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 26,
        marca: "Subaru",
        modelo: "Forester",
        año: 2021,
        precio: 31000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 25000,
        color: "Verde",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV aventurero, tracción integral",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 27,
        marca: "Jeep",
        modelo: "Wrangler",
        año: 2020,
        precio: 38000,
        combustible: "Gasolina",
        transmision: "Manual",
        kilometraje: 35000,
        color: "Negro",
        categoria: "4x4",
        caja: "Manual",
        detalle: "Vehículo todoterreno, aventura garantizada",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 28,
        marca: "Jeep",
        modelo: "Grand Cherokee",
        año: 2021,
        precio: 45000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 20000,
        color: "Blanco",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV de lujo, capacidad todoterreno",
        imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 29,
        marca: "Lexus",
        modelo: "ES",
        año: 2021,
        precio: 52000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 18000,
        color: "Gris",
        categoria: "Lujo",
        caja: "Automática",
        detalle: "Vehículo de lujo, confort excepcional",
        imagen: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
        ]
    },
    {
        id: 30,
        marca: "Lexus",
        modelo: "RX",
        año: 2020,
        precio: 58000,
        combustible: "Gasolina",
        transmision: "Automática",
        kilometraje: 28000,
        color: "Negro",
        categoria: "SUV",
        caja: "Automática",
        detalle: "SUV de lujo, tecnología híbrida",
        imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        imagenes: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
        ]
    }
]

/**
 * Función para paginar resultados
 * @param {Array} vehicles - Array de vehículos
 * @param {number} page - Página actual
 * @param {number} limit - Elementos por página
 * @returns {Object} - Datos paginados
 */
const paginateVehicles = (vehicles, page = 1, limit = 6) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVehicles = vehicles.slice(startIndex, endIndex)
    
    return {
        items: paginatedVehicles,
        total: vehicles.length,
        currentPage: page,
        hasMore: endIndex < vehicles.length,
        nextPage: endIndex < vehicles.length ? page + 1 : undefined
    }
}

/**
 * Simula una petición HTTP con delay
 * @param {number} ms - Milisegundos de delay
 * @returns {Promise} - Promise que se resuelve después del delay
 */
const simulateNetworkDelay = (ms = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export {
    mockVehicles,
    filterVehicles, // ✅ Ahora usa la función centralizada de filterUtils
    paginateVehicles,
    simulateNetworkDelay
} 