import { test, expect } from '@playwright/test'

test.describe('Flujo de Filtros', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
  })

  test('should apply and clear filters', async ({ page }) => {
    // Verificar formulario
    await expect(page.locator('[data-testid="filters-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="apply-filters"]')).toBeVisible()
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible()
    
    // Aplicar filtros (preparado para API)
    await page.locator('[data-testid="apply-filters"]').click()
    
    // Verificar grilla (preparado para API)
    await expect(page.locator('[data-testid="catalog-grid"]')).toBeVisible()
    
    // Limpiar filtros (preparado para API)
    await page.locator('[data-testid="clear-filters"]').click()
  })
}) 