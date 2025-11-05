import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración de Playwright para tests E2E
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Timeout máximo para cada test */
  timeout: 30 * 1000,
  
  /* Timeout máximo para cada expect */
  expect: {
    timeout: 5000
  },
  
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  
  /* Falla el build si hay tests rotos */
  forbidOnly: !!process.env.CI,
  
  /* Reintentar en CI si falla */
  retries: process.env.CI ? 2 : 0,
  
  /* Número de workers */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter a usar */
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github']] : [])
  ],
  
  /* Configuración compartida para todos los proyectos */
  use: {
    /* Base URL para usar en navegación */
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    
    /* Collect trace cuando se repite por fallo */
    trace: 'on-first-retry',
    
    /* Screenshot solo en fallos */
    screenshot: 'only-on-failure',
    
    /* Video solo en fallos */
    video: 'retain-on-failure'
  },

  /* Configurar proyectos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },

    /* Tests móviles opcionales */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] }
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] }
    // }
  ],

  /* Servidor de desarrollo - ejecutar antes de los tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe'
  }
})

