import { chromium } from 'playwright';

async function captureIndividualModals() {
  const browser = await chromium.launch();

  // 1. Cart Drawer
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5190/collections/scrubs', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      // trigger open cart directly from context or click
      const btn = document.getElementById('navbar-cart-btn');
      if (btn) btn.click();
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'ui-redesign/existing-screens/modal-cart-drawer.png' });
    await page.close();
  }

  // 2. Quick View Modal
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5190/collections/scrubs', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const qv = document.querySelector('.quick-view-btn');
      if (qv) qv.click();
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'ui-redesign/existing-screens/modal-quick-view.png' });
    await page.close();
  }

  // 3. Fit Finder Modal
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5190/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ff = document.querySelector('.fit-finder-nav-btn');
      if (ff) ff.click();
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'ui-redesign/existing-screens/modal-fit-finder.png' });
    await page.close();
  }

  // 4. Custom Embroidery Modal
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5190/products/the-womens-nursing-scrub-set', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      // Find embroidery button on PDP
      const btns = Array.from(document.querySelectorAll('button'));
      const emb = btns.find(b => b.textContent && b.textContent.includes('Add Hospital Embroidery'));
      if (emb) emb.click();
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'ui-redesign/existing-screens/modal-embroidery.png' });
    await page.close();
  }

  await browser.close();
  console.log('Individual modals captured!');
}

captureIndividualModals().catch(console.error);
