import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración de Playwright para suite SMOKE - Testing rápido y eficiente
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e/smoke',
  
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  
  /* Fallar build en CI si se deja test.only */
  forbidOnly: !!process.env.CI,
  
  /* Reintentos solo en CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers optimizados para smoke */
  workers: 2,
  
  /* Reporter optimizado */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/smoke' }]
  ],
  
  /* Configuración compartida para todos los proyectos */
  use: {
    /* Base URL para acciones como `await page.goto('/')` */
    baseURL: 'http://localhost:4173',

    /* Trace solo en reintentos */
    trace: 'on-first-retry',
    
    /* Screenshot solo en fallos */
    screenshot: 'only-on-failure',
    
    /* Video desactivado para velocidad */
    video: 'off',
    
    /* Timeouts optimizados */
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  /* Solo Chromium para velocidad */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    }
  ],

  /* Servidor web optimizado */
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
}) 