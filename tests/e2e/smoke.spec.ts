import { test, expect } from '@playwright/test'

/**
 * Smoke Tests - Validación básica de que las páginas principales cargan
 * 
 * Estos tests verifican que:
 * - La homepage carga correctamente
 * - La página de vehículos carga
 * - La navegación funciona
 */

test.describe('Smoke Tests', () => {
  test('TEST 1: Homepage carga correctamente', async ({ page }) => {
    await page.goto('/')
    
    // Verificar que la página carga
    await expect(page).toHaveURL('/')
    
    // Verificar elementos principales de la homepage
    // Ajustar según la estructura real de tu homepage
    const mainContent = page.locator('main, .main-content, [role="main"]').first()
    await expect(mainContent).toBeVisible()
    
    // Verificar que no hay errores críticos en consola
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    // Verificar que no hay errores críticos (permitir warnings)
    const criticalErrors = errors.filter(err => 
      !err.includes('Warning') && 
      !err.includes('Deprecation')
    )
    expect(criticalErrors.length).toBe(0)
  })

  test('TEST 2: Página de vehículos carga', async ({ page }) => {
    await page.goto('/vehiculos')
    
    // Verificar que la URL es correcta
    await expect(page).toHaveURL(/\/vehiculos/)
    
    // Verificar que el título está presente
    await expect(page.getByRole('heading', { name: /Nuestros Usados|Vehículos/i })).toBeVisible()
    
    // Verificar que hay contenido (grid o skeleton)
    const gridOrContent = page.locator('[class*="grid"], [class*="container"], main').first()
    await expect(gridOrContent).toBeVisible()
    
    // Verificar que no hay errores críticos
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    const criticalErrors = errors.filter(err => 
      !err.includes('Warning') && 
      !err.includes('Deprecation')
    )
    expect(criticalErrors.length).toBe(0)
  })

  test('TEST 3: Navegación funciona', async ({ page }) => {
    await page.goto('/')
    
    // Verificar que estamos en la homepage
    await expect(page).toHaveURL('/')
    
    // Buscar links de navegación (ajustar según tu estructura)
    // Puede ser en el nav, footer, o botones
    const navLinks = page.locator('nav a, header a, [role="navigation"] a')
    const linksCount = await navLinks.count()
    
    // Verificar que hay al menos un link de navegación
    expect(linksCount).toBeGreaterThan(0)
    
    // Intentar hacer click en el primer link que no sea el actual
    if (linksCount > 0) {
      const firstLink = navLinks.first()
      const href = await firstLink.getAttribute('href')
      
      if (href && href !== '/' && href !== '#') {
        await firstLink.click()
        
        // Esperar a que la navegación ocurra
        await page.waitForLoadState('networkidle')
        
        // Verificar que la URL cambió
        const currentUrl = page.url()
        const baseURL = process.env.BASE_URL || 'http://localhost:8080'
        expect(currentUrl).not.toBe(`${baseURL}/`)
      }
    }
    
    // Verificar que la navegación no rompió la página
    const mainContent = page.locator('main, .main-content, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })
})

