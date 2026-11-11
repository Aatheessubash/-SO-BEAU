import { chromium } from 'playwright';
import path from 'path';

const ROUTES = [
  { name: 'homepage', path: '/' },
  { name: 'shop', path: '/collections/scrubs' },
  { name: 'product-detail', path: '/products/the-womens-nursing-scrub-set' },
  { name: 'our-story', path: '/pages/our-story' },
  { name: 'community', path: '/pages/community' },
  { name: 'contact', path: '/pages/contact' },
  { name: 'size-guide', path: '/pages/size-guide' },
  { name: 'shipping', path: '/pages/shipping' },
  { name: 'returns', path: '/pages/returns' },
  { name: 'faq', path: '/pages/faq' },
  { name: 'privacy', path: '/pages/privacy' },
  { name: 'terms', path: '/pages/terms' },
  { name: 'checkout', path: '/checkout' },
  { name: 'order-confirmation', path: '/orders/sb-demo-order' },
  { name: 'not-found', path: '/404' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to base first
  await page.goto('http://localhost:5190/');
  await page.waitForTimeout(1000);

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    for (const r of ROUTES) {
      try {
        await page.evaluate((url) => {
          window.history.pushState({}, '', url);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, r.path);
        
        await page.waitForTimeout(600);
        
        const filename = `ui-redesign/existing-screens/${r.name}-${vp.name}.png`;
        await page.screenshot({ path: filename, fullPage: false });
        console.log(`Saved: ${filename}`);
      } catch (err) {
        console.error(`Failed ${r.name} on ${vp.name}:`, err.message);
      }
    }
  }

  await browser.close();
  console.log('Finished capturing existing screens!');
}

capture().catch(console.error);
