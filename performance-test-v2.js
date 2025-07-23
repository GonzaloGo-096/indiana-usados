import puppeteer from 'puppeteer';
import { execSync } from 'child_process';

async function findDevServerPort() {
  try {
    // Try common ports
    const ports = [5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181];
    
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}`);
        if (response.ok) {
          return port;
        }
      } catch (error) {
        // Continue to next port
      }
    }
    
    // If no port found, return default
    return 5173;
  } catch (error) {
    return 5173;
  }
}

async function measurePerformance() {
  let browser;
  try {
    const port = await findDevServerPort();
    console.log(`🔍 Detectando puerto del servidor de desarrollo... Puerto encontrado: ${port}`);
    
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    console.log('🚀 Iniciando medición de rendimiento...');
    
    // Measure initial load time
    const startTime = Date.now();
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    console.log(`📊 Tiempo de carga inicial: ${loadTime}ms`);
    
    // Measure Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.CLS = entry.value;
            }
          });
          
          if (Object.keys(vitals).length > 0) {
            resolve(vitals);
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('📈 Web Vitals:');
    console.log(`  - LCP: ${webVitals.LCP ? Math.round(webVitals.LCP) + 'ms' : 'No disponible'}`);
    console.log(`  - FID: ${webVitals.FID ? Math.round(webVitals.FID) + 'ms' : 'No disponible'}`);
    console.log(`  - CLS: ${webVitals.CLS ? webVitals.CLS.toFixed(3) : 'No disponible'}`);
    
    // Wait a bit for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Measure navigation time - try different selectors
    const navStart = Date.now();
    try {
      await page.click('a[href="/vehiculos"]');
      // Try multiple possible selectors for the vehicles grid
      await page.waitForSelector('.autos-grid, .vehiculos-grid, [data-testid="vehiculos-grid"]', { timeout: 15000 });
    } catch (error) {
      console.log('⚠️ No se pudo navegar a la página de vehículos, continuando con otras mediciones...');
    }
    const navTime = Date.now() - navStart;
    
    console.log(`🔄 Tiempo de navegación: ${navTime}ms`);
    
    // Measure click response time - try different selectors
    const clickStart = Date.now();
    try {
      await page.click('.card-auto, .auto-card, [data-testid="auto-card"]');
      await page.waitForSelector('.detalle-container, .vehiculo-detalle, [data-testid="detalle-container"]', { timeout: 15000 });
    } catch (error) {
      console.log('⚠️ No se pudo hacer clic en una tarjeta de auto, continuando...');
    }
    const clickTime = Date.now() - clickStart;
    
    console.log(`🖱️ Tiempo de respuesta a clic: ${clickTime}ms`);
    
    // Measure memory usage
    const memory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }
      return null;
    });
    
    if (memory) {
      console.log('💾 Uso de memoria:');
      console.log(`  - Usado: ${memory.used}MB`);
      console.log(`  - Total: ${memory.total}MB`);
      console.log(`  - Límite: ${memory.limit}MB`);
    }
    
    // Measure component render time
    const renderTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const renderEntries = entries.filter(entry => 
            entry.name.includes('CardAuto') || 
            entry.name.includes('VehiculoDetalle') ||
            entry.name.includes('ListAutos')
          );
          
          if (renderEntries.length > 0) {
            const avgRenderTime = renderEntries.reduce((sum, entry) => sum + entry.duration, 0) / renderEntries.length;
            resolve(Math.round(avgRenderTime));
          } else {
            resolve(null);
          }
        });
        
        observer.observe({ entryTypes: ['measure'] });
        
        setTimeout(() => resolve(null), 3000);
      });
    });
    
    if (renderTime) {
      console.log(`⚡ Tiempo promedio de renderizado de componentes: ${renderTime}ms`);
    }
    
    console.log('\n📋 RESUMEN DE RENDIMIENTO:');
    console.log(`✅ Carga inicial: ${loadTime}ms ${loadTime < 2000 ? '(Excelente)' : loadTime < 3000 ? '(Bueno)' : '(Necesita mejora)'}`);
    console.log(`✅ Navegación: ${navTime}ms ${navTime < 1500 ? '(Excelente)' : navTime < 2500 ? '(Bueno)' : '(Necesita mejora)'}`);
    console.log(`✅ Respuesta a clic: ${clickTime}ms ${clickTime < 1500 ? '(Excelente)' : clickTime < 2500 ? '(Bueno)' : '(Necesita mejora)'}`);
    
    if (memory) {
      console.log(`✅ Memoria: ${memory.used}MB ${memory.used < 50 ? '(Excelente)' : memory.used < 100 ? '(Bueno)' : '(Necesita mejora)'}`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la medición:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

measurePerformance(); 