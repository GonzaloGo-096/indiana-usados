import { test, expect } from '@playwright/test'

test.describe('Navegación Principal', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal antes de cada test
    await page.goto('/')
  })

  test('should navigate to home page', async ({ page }) => {
    // Verificar que estamos en la página principal
    await expect(page).toHaveTitle(/Indiana Usados/)
    
    // Verificar elementos principales
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate to vehicles page', async ({ page }) => {
    // Hacer clic en el enlace de vehículos
    await page.click('a[href="/vehiculos"]')
    
    // Verificar que estamos en la página de vehículos
    await expect(page).toHaveURL(/.*vehiculos/)
    
    // Verificar elementos de la página de vehículos
    await expect(page.locator('[data-testid="filter-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="vehicles-grid"]')).toBeVisible()
  })

  test('should navigate to about page', async ({ page }) => {
    // Hacer clic en el enlace de nosotros
    await page.click('a[href="/nosotros"]')
    
    // Verificar que estamos en la página de nosotros
    await expect(page).toHaveURL(/.*nosotros/)
    
    // Verificar contenido de la página
    await expect(page.locator('h1')).toContainText(/nosotros/i)
  })

  test('should have working navigation menu', async ({ page }) => {
    // Verificar que el menú de navegación está visible
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Verificar enlaces principales
    await expect(nav.locator('a[href="/"]')).toBeVisible()
    await expect(nav.locator('a[href="/vehiculos"]')).toBeVisible()
    await expect(nav.locator('a[href="/nosotros"]')).toBeVisible()
  })
}) 