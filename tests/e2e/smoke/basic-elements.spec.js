import { test, expect } from '@playwright/test'

test.describe('Elementos Básicos', () => {
  test('should have basic elements visible', async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
    
    // Verificar elementos básicos que sabemos que existen
    await expect(page.locator('[data-testid="catalog-grid"]')).toBeVisible()
    await expect(page.locator('[data-testid="filters-form"]')).toBeVisible()
    
    // Verificar que hay al menos una tarjeta de vehículo
    await expect(page.locator('[data-testid="vehicle-card"]').first()).toBeVisible()
    
    // Verificar que hay al menos un enlace de detalle
    await expect(page.locator('[data-testid="link-detalle"]').first()).toBeVisible()
    
    console.log('✅ Elementos básicos están presentes')
  })
}) 