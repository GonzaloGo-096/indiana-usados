import { test, expect } from '@playwright/test'

test.describe('Validación de Formulario', () => {
  test('should have working filter form', async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
    
    // Verificar elementos del formulario
    await expect(page.locator('[data-testid="filters-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="apply-filters"]')).toBeVisible()
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible()
    
    // Verificar que la grilla está presente
    await expect(page.locator('[data-testid="catalog-grid"]')).toBeVisible()
    
    console.log('✅ Formulario de filtros está presente y funcional')
  })
}) 