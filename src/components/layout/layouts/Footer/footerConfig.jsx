/**
 * Footer Configuration - Data-driven content
 * 
 * Configuración centralizada del footer para fácil mantenimiento
 * 
 * Nota sobre WhatsApp:
 * - Los mensajes se incluyen en la URL pero WhatsApp Web puede no pre-llenarlos automáticamente
 * - Esto es una limitación de seguridad de WhatsApp para prevenir spam
 * - El usuario debe hacer clic en "Enviar" después de que se abra la conversación
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Configuración completa con datos reales
 */

// ✅ CONFIGURACIÓN DE MÓDULOS INFORMATIVOS (Cards 2-4)
// Orden: WhatsApp → Instagram → Teléfono → Ubicación

// Función helper para crear items con WhatsApp, Instagram, teléfono y ubicación personalizados
const createModuleItems = (whatsappNumber, message = '', instagramUser = '', phone = '', location = '') => {
  // Construir URL de WhatsApp con mensaje codificado
  // Remover el + y espacios si están presentes en el número
  const cleanNumber = whatsappNumber.replace(/^\+/, '').replace(/\s/g, '').replace(/-/g, '')
  
  // Usar api.whatsapp.com para mejor compatibilidad con mensajes predefinidos
  // Nota: WhatsApp Web puede no pre-llenar el mensaje automáticamente por seguridad
  // El mensaje se incluye en la URL pero el usuario debe hacer clic en enviar
  let whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}`
  
  if (message && message.trim() !== '') {
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message.trim())
    whatsappUrl += `&text=${encodedMessage}`
  }
  
  // Crear item de Instagram personalizado
  const instagramItem = {
    icon: 'instagram',
    text: instagramUser ? `@${instagramUser.replace('@', '')}` : '@indianausados',
    href: `https://instagram.com/${instagramUser.replace('@', '')}`,
    type: 'link',
    external: true
  }
  
  // Crear item de teléfono personalizado
  // Convertir el formato (0381) 421-2000 a tel:+543814212000
  const phoneText = phone || '(011) 1234-5678'
  const phoneNumber = phoneText.replace(/[^\d]/g, '') // Remover todo excepto dígitos
  const phoneItem = {
    icon: 'phone',
    text: phoneText,
    href: `tel:+54${phoneNumber}`,
    type: 'link'
  }
  
  // Crear items de ubicación personalizados
  // Si hay múltiples direcciones (separadas por \n), crear un item separado para cada una
  const locationText = location || 'Av. Principal 1234, Ciudad'
  const locations = locationText.split('\n').map(addr => addr.trim()).filter(addr => addr !== '')
  
  // Crear un item de ubicación para cada dirección
  const locationItems = locations.map((loc, index) => ({
    icon: 'location',
    text: loc,
    href: `https://maps.google.com/maps?q=${encodeURIComponent(loc)}`,
    type: 'link',
    external: true
  }))
  
  return [
    {
      icon: 'whatsapp',
      text: 'WhatsApp',
      href: whatsappUrl,
      type: 'link',
      external: true
    },
    instagramItem,
    phoneItem,
    ...locationItems
  ]
}

// Crear módulos con mensajes, Instagram, teléfonos y ubicaciones personalizadas
// Para 0km: dos direcciones separadas por salto de línea
const peugeotLocation = 'Salta 160, San Miguel de Tucumán\nAv. Aconquija y Bascary, Yerba Buena'
const peugeotItems = createModuleItems('543816295959', 'Hola, estoy interesado en vehículos 0KM', 'peugeotindiana', '(0381) 421-2000', peugeotLocation)
const usadosItems = createModuleItems('543816295959', 'Hola, estoy interesado en autos usados', 'usadosindiana', '(0381) 231-3107', 'Santa Fe 2145, San Miguel de Tucumán')
const postventaItems = createModuleItems('543816295959', 'Hola, quiero información sobre servicios de postventa', 'peugeotindiana', '(0381) 434-7700', 'Italia 2945, San Miguel de Tucumán')

export const footerModules = [
  {
    id: 'peugeot-oficial',
    title: 'Peugeot oficial | 0 km',
    items: peugeotItems
  },
  {
    id: 'multimarca-usados',
    title: 'Multimarca | Usados',
    items: usadosItems
  },
  {
    id: 'posventa-taller',
    title: 'Posventa / Taller',
    items: postventaItems
  }
]

// ✅ CONFIGURACIÓN DE ÍCONOS SVG (Inline, optimizados)
export const footerIcons = {
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.65-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
    </svg>
  ),
  whatsapp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  )
}
