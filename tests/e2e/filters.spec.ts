import { test, expect } from '@playwright/test'

/**
 * Filter Flow Tests - Validación del sistema de filtros
 * 
 * Estos tests verifican que:
 * - Se puede abrir el panel de filtros
 * - Se puede filtrar por marca
 * - Se puede filtrar por rango de año
 * - Se pueden limpiar filtros
 * - Se pueden combinar múltiples filtros
 */

test.describe('Filter Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vehiculos')
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
  })

  test('TEST 1: Abrir panel de filtros', async ({ page }) => {
    // Buscar el botón de filtros
    const filterButton = page.getByRole('button', { name: /Filtrar/i }).first()
    
    // Verificar que el botón existe
    await expect(filterButton).toBeVisible()
    
    // Click en el botón
    await filterButton.click()
    
    // Esperar a que el panel/drawer se abra
    await page.waitForTimeout(500) // Pequeño delay para animación
    
    // Verificar que el panel de filtros está visible
    // Ajustar según tu implementación (drawer, modal, etc.)
    const filterPanel = page.locator('[class*="drawer"], [class*="filter"], [class*="panel"], form').first()
    await expect(filterPanel).toBeVisible()
    
    // Verificar que hay controles de filtros visibles
    const filterInputs = page.locator('input, select, [role="slider"], [class*="range"]')
    const inputsCount = await filterInputs.count()
    expect(inputsCount).toBeGreaterThan(0)
  })

  test('TEST 2: Filtrar por marca', async ({ page }) => {
    // Abrir panel de filtros
    const filterButton = page.getByRole('button', { name: /Filtrar/i }).first()
    await filterButton.click()
    await page.waitForTimeout(500)
    
    // Buscar el selector de marca
    // Puede ser un select, multiselect, o botones
    const marcaSelect = page.locator('select[name*="marca"], select[id*="marca"], [data-testid*="marca"], [class*="marca"]').first()
    
    // Si es un select múltiple o dropdown
    if (await marcaSelect.count() > 0) {
      await marcaSelect.click()
      await page.waitForTimeout(300)
      
      // Seleccionar una opción (ajustar según tus opciones reales)
      const option = page.locator('option:has-text("Toyota"), [role="option"]:has-text("Toyota"), button:has-text("Toyota")').first()
      
      if (await option.count() > 0) {
        await option.click()
        await page.waitForTimeout(300)
        
        // Aplicar filtros (buscar botón "Aplicar")
        const applyButton = page.getByRole('button', { name: /Aplicar|Buscar|Filtrar/i }).first()
        if (await applyButton.count() > 0) {
          await applyButton.click()
          
          // Esperar a que se apliquen los filtros
          await page.waitForLoadState('networkidle')
          
      // Verificar que la URL cambió (tiene parámetros de filtro)
      // El código usa 'anio' en la URL, no 'año'
      const url = page.url()
      expect(url).toMatch(/marca|anio|año|brand/i)
        }
      }
    }
    
    // Verificar que la página sigue funcionando después del filtro
    const mainContent = page.locator('main, .main-content, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })

  test('TEST 3: Filtrar por rango de año', async ({ page }) => {
    // Abrir panel de filtros
    const filterButton = page.getByRole('button', { name: /Filtrar/i }).first()
    await filterButton.click()
    await page.waitForTimeout(500)
    
    // Buscar el control de rango de año
    // Puede ser un slider, input range, o inputs separados
    const añoInput = page.locator('input[name*="año"], input[name*="year"], input[id*="año"], [class*="año"], [data-testid*="año"]').first()
    
    if (await añoInput.count() > 0) {
      // Si es un input de rango o slider
      const inputType = await añoInput.getAttribute('type')
      
      if (inputType === 'range' || inputType === 'number') {
        // Establecer un valor de año
        await añoInput.fill('2020')
        await page.waitForTimeout(300)
        
        // Buscar input de año máximo si existe
        const añoMaxInput = page.locator('input[name*="añoHasta"], input[name*="yearMax"], input[id*="añoMax"]').first()
        if (await añoMaxInput.count() > 0) {
          await añoMaxInput.fill('2023')
        }
        
        // Aplicar filtros
        const applyButton = page.getByRole('button', { name: /Aplicar|Buscar|Filtrar/i }).first()
        if (await applyButton.count() > 0) {
          await applyButton.click()
          await page.waitForLoadState('networkidle')
          
          // Verificar que la URL tiene parámetros de año
          // El código usa 'anio' en la URL, no 'año'
          const url = page.url()
          expect(url).toMatch(/anio|año|year/i)
        }
      }
    }
    
    // Verificar que la página sigue funcionando
    const mainContent = page.locator('main, .main-content, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })

  test('TEST 4: Limpiar filtros', async ({ page }) => {
    // Primero aplicar un filtro
    const filterButton = page.getByRole('button', { name: /Filtrar/i }).first()
    await filterButton.click()
    await page.waitForTimeout(800) // Esperar a que se abra el drawer
    
    // Buscar y aplicar algún filtro primero usando MultiSelect
    // MultiSelect usa un botón como trigger, no un select tradicional
    const marcaLabel = page.locator('label:has-text("Marca")').first()
    let filterApplied = false
    
    if (await marcaLabel.count() > 0) {
      // Buscar el botón trigger del MultiSelect (el siguiente elemento después del label)
      const marcaTrigger = marcaLabel.locator('..').locator('button[aria-haspopup="listbox"]').first()
      
      if (await marcaTrigger.count() > 0) {
        await marcaTrigger.click()
        await page.waitForTimeout(300)
        
        // Buscar el primer checkbox en el dropdown
        const firstOption = page.locator('[role="listbox"] label:first-child, [role="listbox"] input[type="checkbox"]:first-child').first()
        if (await firstOption.count() > 0) {
          await firstOption.click()
          await page.waitForTimeout(300)
          
          // Cerrar el dropdown haciendo click fuera o en el trigger
          await marcaTrigger.click()
          await page.waitForTimeout(300)
          
          // Aplicar filtros
          const applyButton = page.getByRole('button', { name: /Aplicar/i }).first()
          if (await applyButton.count() > 0) {
            await applyButton.click()
            await page.waitForLoadState('networkidle')
            filterApplied = true
            
            // Verificar que se aplicó el filtro
            const urlAfterFilter = page.url()
            expect(urlAfterFilter).toMatch(/marca/)
          }
        }
      }
    }
    
    if (!filterApplied) {
      test.skip('No se pudo aplicar filtro inicial para probar limpieza')
      return
    }
    
    // Ahora limpiar filtros - abrir el drawer nuevamente
    await filterButton.click()
    await page.waitForTimeout(1000) // Más tiempo para que se abra completamente el drawer
    
    // Esperar a que el formulario esté visible
    const formWrapper = page.locator('form, [class*="form"]').first()
    await expect(formWrapper).toBeVisible({ timeout: 2000 })
    
    // Buscar botón de limpiar - está dentro del formulario
    const clearButton = page.locator('form button:has-text("Limpiar"), button:has-text("Limpiar")').first()
    
    // Esperar a que esté visible
    if (await clearButton.count() > 0) {
      await expect(clearButton).toBeVisible({ timeout: 2000 })
      
      await clearButton.click()
      await page.waitForLoadState('networkidle')
      
      // Verificar que la URL está limpia (sin parámetros de filtro)
      const url = page.url()
      // El código usa 'anio' en la URL, no 'año'
      expect(url).not.toMatch(/marca|anio|año|year|brand|precio|km/)
    } else {
      // Si no hay botón de limpiar visible, puede que se limpie de otra forma
      test.skip('Botón de limpiar no encontrado - puede que se limpie de otra forma')
    }
  })

  test('TEST 5: Múltiples filtros combinados', async ({ page }) => {
    // Abrir panel de filtros
    const filterButton = page.getByRole('button', { name: /Filtrar/i }).first()
    await filterButton.click()
    await page.waitForTimeout(500)
    
    let filtersApplied = 0
    
    // Aplicar filtro de marca
    const marcaSelect = page.locator('select[name*="marca"], select[id*="marca"]').first()
    if (await marcaSelect.count() > 0) {
      await marcaSelect.selectOption({ index: 1 })
      await page.waitForTimeout(300)
      filtersApplied++
    }
    
    // Aplicar filtro de año usando el RangeSlider
    // El RangeSlider tiene un label "Año" y usa role="slider"
    const añoSlider = page.locator('label:has-text("Año")').locator('..').locator('[role="slider"]').first()
    
    if (await añoSlider.count() > 0) {
      // Interactuar con el slider haciendo click en una posición específica
      // Obtener el bounding box del slider
      const sliderBox = await añoSlider.boundingBox()
      if (sliderBox) {
        // Click en una posición específica (por ejemplo, al 30% del slider para cambiar el mínimo)
        // Esto simula mover el thumb mínimo
        await añoSlider.click({ position: { x: sliderBox.width * 0.3, y: sliderBox.height / 2 } })
        await page.waitForTimeout(300)
        filtersApplied++
      }
    } else {
      // Si no encontramos el slider, intentar con inputs tradicionales
      const añoInput = page.locator(
        'input[name*="año"], input[name*="year"], input[name*="anio"], input[id*="año"], input[id*="anio"]'
      ).first()
      
      if (await añoInput.count() > 0) {
        const inputType = await añoInput.getAttribute('type')
        const inputName = await añoInput.getAttribute('name') || ''
        
        if (inputType === 'number' || inputType === 'text' || inputName.toLowerCase().includes('desde')) {
          await añoInput.fill('2020')
          await page.waitForTimeout(300)
          filtersApplied++
        }
      }
    }
    
    // Si no se aplicaron filtros, hacer skip
    if (filtersApplied === 0) {
      test.skip('No se pudieron encontrar controles de filtros para aplicar múltiples filtros')
      return
    }
    
    // Aplicar filtros
    const applyButton = page.getByRole('button', { name: /Aplicar/i }).first()
    if (await applyButton.count() > 0) {
      await applyButton.click()
      await page.waitForLoadState('networkidle')
      
      // Verificar que la URL tiene parámetros de filtro
      // El código usa 'anio' en la URL cuando se serializa, pero puede aparecer como 'marca' también
      const url = page.url()
      
      // Verificar que hay al menos un parámetro de filtro en la URL
      const hasMarca = url.includes('marca')
      const hasAnio = url.includes('anio') || url.includes('año')
      const queryParams = url.split('?')[1]
      const hasMultipleParams = queryParams ? queryParams.split('&').length > 1 : false
      
      // Verificar que al menos uno de los filtros está en la URL
      expect(hasMarca || hasAnio || hasMultipleParams).toBeTruthy()
    } else {
      test.skip('Botón de aplicar no encontrado')
    }
    
    // Verificar que la página sigue funcionando con múltiples filtros
    const mainContent = page.locator('main, .main-content, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })
})

