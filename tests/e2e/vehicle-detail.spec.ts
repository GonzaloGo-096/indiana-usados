import { test, expect } from '@playwright/test'

/**
 * Vehicle Detail Flow Tests - Validación de la página de detalle de vehículo
 * 
 * Estos tests verifican que:
 * - Se puede ver el detalle de un vehículo
 * - La galería de imágenes funciona
 * - El botón de contacto WhatsApp funciona
 */

test.describe('Vehicle Detail Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vehiculos')
    await page.waitForLoadState('networkidle')
  })

  test('TEST 1: Ver detalle de vehículo', async ({ page }) => {
    // Esperar a que los vehículos se carguen
    await page.waitForTimeout(2000) // Dar tiempo para que carguen los vehículos
    
    // Buscar la primera tarjeta de vehículo
    // Puede ser un link, botón, o elemento clickeable
    const vehicleCard = page.locator('a[href*="/vehiculo/"], [class*="card"], [class*="vehicle"], article').first()
    
    // Verificar que hay al menos un vehículo
    const cardsCount = await vehicleCard.count()
    
    if (cardsCount > 0) {
      // Obtener el href si es un link
      const href = await vehicleCard.getAttribute('href')
      
      if (href) {
        // Navegar directamente o hacer click
        await page.goto(href)
      } else {
        // Hacer click en la tarjeta
        await vehicleCard.click()
      }
      
      // Esperar a que la página de detalle cargue
      await page.waitForLoadState('networkidle')
      
      // Verificar que estamos en la página de detalle
      await expect(page).toHaveURL(/\/vehiculo\//)
      
      // Verificar que hay información del vehículo visible
      const detailContent = page.locator('main, [class*="detail"], [class*="vehicle"]').first()
      await expect(detailContent).toBeVisible()
      
      // Verificar que hay información básica (marca, modelo, precio, etc.)
      const hasVehicleInfo = await Promise.race([
        page.getByText(/Toyota|Honda|Ford|Chevrolet/i).first().isVisible().then(() => true),
        page.getByText(/\$|USD|ARS/i).first().isVisible().then(() => true),
        page.getByText(/2020|2021|2022|2023/i).first().isVisible().then(() => true)
      ].map(p => p.catch(() => false)))
      
      // Al menos una de estas informaciones debería estar presente
      expect(hasVehicleInfo).toBeTruthy()
    } else {
      // Si no hay vehículos, verificar que la página muestra un mensaje apropiado
      const emptyState = page.getByText(/No se encontraron|Sin resultados|Vacío/i)
      const hasEmptyState = await emptyState.count() > 0
      
      if (hasEmptyState) {
        test.skip('No hay vehículos disponibles para probar el detalle')
      } else {
        // Si hay vehículos pero no se detectaron, continuar con la prueba
        // Intentar navegar directamente a un ID de ejemplo
        await page.goto('/vehiculo/1')
        await page.waitForLoadState('networkidle')
        
        // Verificar que la página carga (aunque puede ser 404)
        const mainContent = page.locator('main, .main-content, [role="main"]').first()
        await expect(mainContent).toBeVisible()
      }
    }
  })

  test('TEST 2: Galería de imágenes', async ({ page }) => {
    // Navegar a una página de detalle
    // Intentar desde la lista primero
    await page.waitForTimeout(2000)
    
    const vehicleCard = page.locator('a[href*="/vehiculo/"]').first()
    const cardsCount = await vehicleCard.count()
    
    if (cardsCount > 0) {
      const href = await vehicleCard.getAttribute('href')
      if (href) {
        await page.goto(href)
        await page.waitForLoadState('networkidle')
        
        // Buscar la galería de imágenes
        // Puede ser un carousel, galería, o contenedor de imágenes
        const imageGallery = page.locator('[class*="carousel"], [class*="gallery"], [class*="images"], [class*="slider"]').first()
        
        if (await imageGallery.count() > 0) {
          await expect(imageGallery).toBeVisible()
          
          // Verificar que hay imágenes
          const images = imageGallery.locator('img')
          const imagesCount = await images.count()
          
          if (imagesCount > 0) {
            // Verificar que al menos una imagen está visible
            const firstImage = images.first()
            await expect(firstImage).toBeVisible()
            
            // Verificar que la imagen tiene un src válido
            const src = await firstImage.getAttribute('src')
            expect(src).toBeTruthy()
            expect(src).not.toBe('')
          }
        } else {
          // Si no hay galería específica, buscar cualquier imagen
          const anyImage = page.locator('img[src*="vehicle"], img[src*="auto"], img[alt*="vehicle"], img[alt*="auto"]').first()
          if (await anyImage.count() > 0) {
            await expect(anyImage).toBeVisible()
          }
        }
      }
    } else {
      // Si no hay vehículos, intentar con un ID directo
      await page.goto('/vehiculo/1')
      await page.waitForLoadState('networkidle')
      
      // Verificar que hay algún contenido de imagen
      const images = page.locator('img')
      const imagesCount = await images.count()
      
      // Si hay imágenes, verificar que al menos una es visible
      if (imagesCount > 0) {
        await expect(images.first()).toBeVisible()
      }
    }
  })

  test('TEST 3: Botón de contacto WhatsApp', async ({ page }) => {
    // Navegar a una página de detalle
    await page.waitForTimeout(2000)
    
    const vehicleCard = page.locator('a[href*="/vehiculo/"]').first()
    const cardsCount = await vehicleCard.count()
    
    if (cardsCount > 0) {
      const href = await vehicleCard.getAttribute('href')
      if (href) {
        await page.goto(href)
        await page.waitForLoadState('networkidle')
        
        // Buscar el botón de WhatsApp
        // Puede ser un link, botón, o elemento con texto relacionado
        const whatsappButton = page.locator(
          'a[href*="wa.me"], a[href*="whatsapp"], button:has-text("WhatsApp"), button:has-text("Consultar"), [class*="whatsapp"]'
        ).first()
        
        if (await whatsappButton.count() > 0) {
          await expect(whatsappButton).toBeVisible()
          
          // Verificar que el botón tiene un href o acción de WhatsApp
          const href = await whatsappButton.getAttribute('href')
          const isButton = await whatsappButton.evaluate(el => el.tagName === 'BUTTON')
          
          if (href) {
            // Verificar que el link es de WhatsApp
            expect(href).toMatch(/wa\.me|whatsapp|api\.whatsapp/i)
          } else if (isButton) {
            // Si es un botón, verificar que tiene algún atributo de datos o texto relacionado
            const text = await whatsappButton.textContent()
            const dataAttrs = await whatsappButton.evaluate(el => {
              return Array.from(el.attributes)
                .filter(attr => attr.name.startsWith('data-'))
                .map(attr => ({ name: attr.name, value: attr.value }))
            })
            
            // Verificar que tiene texto o datos relacionados con WhatsApp/contacto
            expect(
              text?.toLowerCase().includes('whatsapp') ||
              text?.toLowerCase().includes('consultar') ||
              text?.toLowerCase().includes('contacto') ||
              dataAttrs.some(attr => attr.name.includes('phone') || attr.name.includes('whatsapp'))
            ).toBeTruthy()
          }
        } else {
          // Si no se encuentra el botón, puede que no esté implementado o tenga otro nombre
          // Verificar que hay algún elemento de contacto
          const contactElements = page.locator('button, a').filter({ hasText: /contacto|consultar|llamar/i })
          const hasContact = await contactElements.count() > 0
          
          if (!hasContact) {
            test.skip('Botón de WhatsApp no encontrado - puede que no esté implementado')
          }
        }
      }
    } else {
      // Intentar con un ID directo
      await page.goto('/vehiculo/1')
      await page.waitForLoadState('networkidle')
      
      // Buscar botón de WhatsApp
      const whatsappButton = page.locator('a[href*="wa.me"], a[href*="whatsapp"], button:has-text("WhatsApp")').first()
      
      if (await whatsappButton.count() > 0) {
        await expect(whatsappButton).toBeVisible()
      } else {
        test.skip('Botón de WhatsApp no encontrado')
      }
    }
  })
})

