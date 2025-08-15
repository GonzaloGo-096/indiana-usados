import { test, expect } from '@playwright/test'

test.describe('Navegación Básica', () => {
  test('should load vehicles page', async ({ page }) => {
    // Navegar a la página de vehículos
    await page.goto('/vehiculos')
    
    // Verificar que la página cargó
    await expect(page).toHaveURL(/.*vehiculos/)
    
    // Verificar que hay contenido básico
    await expect(page.locator('body')).toBeVisible()
    
    // Verificar que no hay errores 404
    await expect(page.locator('text=404')).not.toBeVisible()
    await expect(page.locator('text=Not Found')).not.toBeVisible()
    
    console.log('✅ Página de vehículos cargó correctamente')
  })
}) 