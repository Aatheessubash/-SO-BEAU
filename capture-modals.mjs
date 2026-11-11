import { chromium } from 'playwright';

async function captureModals() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:5190/collections/scrubs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Search Modal
  try {
    const searchBtn = await page.$('.header-actions button[title="Search"], button[aria-label="Search collection"]');
    if (searchBtn) {
      await searchBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: 'ui-redesign/existing-screens/modal-search-desktop.png' });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (e) {
    console.error('Search modal capture error:', e.message);
  }

  // 2. Cart Drawer
  try {
    const cartBtn = await page.$('#navbar-cart-btn, .cart-btn');
    if (cartBtn) {
      await cartBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: 'ui-redesign/existing-screens/modal-cart-drawer-desktop.png' });
      // Close cart
      const closeCart = await page.$('.close-drawer-btn');
      if (closeCart) await closeCart.click();
      else await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (e) {
    console.error('Cart drawer capture error:', e.message);
  }

  // 3. Quick View Modal
  try {
    const quickViewBtn = await page.$('.product-card .quick-view-btn, .product-card button[title="Quick View"]');
    if (quickViewBtn) {
      await quickViewBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: 'ui-redesign/existing-screens/modal-quick-view-desktop.png' });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (e) {
    console.error('Quick view capture error:', e.message);
  }

  // 4. Fit Quiz Modal
  try {
    const fitQuizBtn = await page.$('.fit-finder-nav-btn');
    if (fitQuizBtn) {
      await fitQuizBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: 'ui-redesign/existing-screens/modal-fit-finder-desktop.png' });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (e) {
    console.error('Fit quiz capture error:', e.message);
  }

  await browser.close();
  console.log('Modals captured successfully!');
}

captureModals().catch(console.error);
