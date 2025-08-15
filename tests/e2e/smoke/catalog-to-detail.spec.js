import { test, expect } from '@playwright/test'

test.describe('Flujo Catálogo → Detalle', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
  })

  test('should navigate from catalog to vehicle detail', async ({ page }) => {
    // Verificar página de vehículos
    await expect(page.locator('[data-testid="catalog-grid"]')).toBeVisible()
    await expect(page.locator('[data-testid="vehicle-card"]').first()).toBeVisible()
    
    // Click en enlace de detalle
    const detailLink = page.locator('[data-testid="link-detalle"]').first()
    await detailLink.click()
    
    // Verificar navegación (preparado para API)
    await expect(page).toHaveURL(/.*vehiculo\/\d+/)
    await expect(page.locator('[data-testid="vehicle-detail"]')).toBeVisible()
  })
}) 