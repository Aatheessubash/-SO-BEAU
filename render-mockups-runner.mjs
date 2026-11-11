import { chromium } from 'playwright';
import { wrapDocument } from '../ui-redesign/prototype-builder.mjs';
import {
  HOMEPAGE_HTML,
  SHOP_PAGE_HTML,
  PDP_PAGE_HTML,
  CHECKOUT_PAGE_HTML
} from '../ui-redesign/pages-templates.mjs';
import {
  CONTACT_PAGE_HTML,
  OUR_STORY_PAGE_HTML,
  COMMUNITY_PAGE_HTML,
  SIZE_GUIDE_PAGE_HTML,
  FAQ_PAGE_HTML,
  ORDER_CONFIRMATION_PAGE_HTML,
  NOT_FOUND_PAGE_HTML
} from '../ui-redesign/pages-templates-part2.mjs';
import {
  NAVBAR_MOCKUP_HTML,
  CART_DRAWER_MOCKUP_HTML,
  QUICK_VIEW_MODAL_MOCKUP_HTML,
  FIT_FINDER_MOCKUP_HTML,
  EMBROIDERY_MOCKUP_HTML,
  PRODUCT_CARD_MOCKUP_HTML,
  SEARCH_MODAL_MOCKUP_HTML
} from '../ui-redesign/component-templates.mjs';
import { COMMON_CSS } from '../ui-redesign/generate-mockups.mjs';

const PAGES = [
  { name: 'homepage', title: 'Home', html: HOMEPAGE_HTML, route: '/' },
  { name: 'shop', title: 'Shop Scrubs Collection', html: SHOP_PAGE_HTML, route: '/collections/scrubs' },
  { name: 'product-detail', title: "The Women's Scrub Set", html: PDP_PAGE_HTML, route: '/products/the-womens-nursing-scrub-set' },
  { name: 'our-story', title: 'Our Story & Heritage', html: OUR_STORY_PAGE_HTML, route: '/pages/our-story' },
  { name: 'community', title: 'Community & Clinician Stories', html: COMMUNITY_PAGE_HTML, route: '/pages/community' },
  { name: 'contact', title: 'Contact Melbourne Concierge', html: CONTACT_PAGE_HTML, route: '/pages/contact' },
  { name: 'size-guide', title: 'Australian Sizing Guide', html: SIZE_GUIDE_PAGE_HTML, route: '/pages/size-guide' },
  { name: 'faq', title: 'Frequently Asked Questions', html: FAQ_PAGE_HTML, route: '/pages/faq' },
  { name: 'checkout', title: 'Secure Checkout', html: CHECKOUT_PAGE_HTML, route: '/checkout' },
  { name: 'order-confirmation', title: 'Order Confirmation', html: ORDER_CONFIRMATION_PAGE_HTML, route: '/orders/confirmation' },
  { name: 'not-found', title: '404 - Silhouette Not Found', html: NOT_FOUND_PAGE_HTML, route: '/404' }
];

const COMPONENTS = [
  { name: 'navbar-header-redesign', html: NAVBAR_MOCKUP_HTML, width: 1200, height: 750 },
  { name: 'cart-drawer-redesign', html: CART_DRAWER_MOCKUP_HTML, width: 1200, height: 850 },
  { name: 'quick-view-modal-redesign', html: QUICK_VIEW_MODAL_MOCKUP_HTML, width: 1100, height: 750 },
  { name: 'fit-finder-wizard-redesign', html: FIT_FINDER_MOCKUP_HTML, width: 900, height: 700 },
  { name: 'custom-embroidery-modal-redesign', html: EMBROIDERY_MOCKUP_HTML, width: 1000, height: 700 },
  { name: 'product-card-redesign', html: PRODUCT_CARD_MOCKUP_HTML, width: 800, height: 800 },
  { name: 'search-modal-redesign', html: SEARCH_MODAL_MOCKUP_HTML, width: 900, height: 650 }
];

async function generateAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('--- GENERATING DESKTOP MOCKUPS (1440x900) ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const p of PAGES) {
    const fullHtml = wrapDocument(p.title, p.html, '', p.route);
    await page.setContent(fullHtml, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const dest = `../ui-redesign/mockups/desktop/${p.name}-desktop.png`;
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`✓ Generated ${dest}`);
  }

  console.log('--- GENERATING TABLET MOCKUPS (768x1024) ---');
  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletPages = PAGES.filter(p => ['homepage', 'shop', 'product-detail', 'contact', 'checkout', 'size-guide'].includes(p.name));
  for (const p of tabletPages) {
    const fullHtml = wrapDocument(p.title, p.html, '', p.route);
    await page.setContent(fullHtml, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const dest = `../ui-redesign/mockups/tablet/${p.name}-tablet.png`;
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`✓ Generated ${dest}`);
  }

  console.log('--- GENERATING MOBILE MOCKUPS (375x812) ---');
  await page.setViewportSize({ width: 375, height: 812 });
  const mobilePages = PAGES.filter(p => ['homepage', 'shop', 'product-detail', 'contact', 'checkout', 'size-guide', 'faq', 'not-found'].includes(p.name));
  for (const p of mobilePages) {
    const fullHtml = wrapDocument(p.title, p.html, '', p.route);
    await page.setContent(fullHtml, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const dest = `../ui-redesign/mockups/mobile/${p.name}-mobile.png`;
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`✓ Generated ${dest}`);
  }

  console.log('--- GENERATING COMPONENT CLOSE-UPS ---');
  for (const c of COMPONENTS) {
    await page.setViewportSize({ width: c.width, height: c.height });
    await page.setContent(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${COMMON_CSS}</style></head><body>${c.html}</body></html>`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const dest = `../ui-redesign/component-mockups/${c.name}.png`;
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`✓ Generated ${dest}`);
  }

  await browser.close();
  console.log('--- ALL VISUAL MOCKUPS SUCCESSFULLY CREATED! ---');
}

generateAll().catch(console.error);
