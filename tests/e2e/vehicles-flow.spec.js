import { test, expect } from '@playwright/test'

test.describe('Flujo de Vehículos', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de vehículos antes de cada test
    await page.goto('/vehiculos')
  })

  test('should display vehicles list', async ({ page }) => {
    // Verificar que la lista de vehículos se muestra
    await expect(page.locator('[data-testid="vehicles-grid"]')).toBeVisible()
    
    // Verificar que hay vehículos en la lista
    const vehicles = page.locator('[data-testid^="vehicle-"]')
    await expect(vehicles.first()).toBeVisible()
  })

  test('should apply filters correctly', async ({ page }) => {
    // Abrir formulario de filtros
    await page.click('[data-testid="filter-form"]')
    
    // Seleccionar marca Toyota
    await page.selectOption('select[name="marca"]', 'toyota')
    
    // Aplicar filtros
    await page.click('button[type="submit"]')
    
    // Verificar que se aplicaron los filtros
    await expect(page.locator('[data-testid="filter-form"]')).toBeVisible()
  })

  test('should navigate to vehicle detail', async ({ page }) => {
    // Hacer clic en el primer vehículo
    await page.click('[data-testid^="vehicle-"]:first-child')
    
    // Verificar que estamos en la página de detalle
    await expect(page).toHaveURL(/.*vehiculo\/\d+/)
    
    // Verificar elementos del detalle
    await expect(page.locator('[data-testid="vehicle-detail"]')).toBeVisible()
    await expect(page.locator('[data-testid="vehicle-images"]')).toBeVisible()
  })

  test('should load more vehicles', async ({ page }) => {
    // Hacer scroll hasta el botón de cargar más
    await page.locator('[data-testid="load-more-btn"]').scrollIntoViewIfNeeded()
    
    // Hacer clic en cargar más
    await page.click('[data-testid="load-more-btn"]')
    
    // Verificar que se cargaron más vehículos
    const vehicles = page.locator('[data-testid^="vehicle-"]')
    await expect(vehicles).toHaveCount({ min: 1 })
  })

  test('should handle search functionality', async ({ page }) => {
    // Buscar un vehículo específico
    await page.fill('input[placeholder*="buscar"]', 'Toyota')
    
    // Verificar que se muestra la búsqueda
    await expect(page.locator('input[placeholder*="buscar"]')).toHaveValue('Toyota')
  })
}) 