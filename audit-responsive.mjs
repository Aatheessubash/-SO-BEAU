import { chromium } from 'playwright';

const BREAKPOINTS = [
  { name: 'mobile-small', width: 320, height: 667 },
  { name: 'mobile-standard', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 }
];

const ROUTES = [
  '/',
  '/collections/scrubs',
  '/products/the-signature-scrub-top',
  '/pages/our-story',
  '/pages/community',
  '/pages/contact',
  '/checkout',
  '/pages/size-guide',
  '/pages/shipping',
  '/pages/faq'
];

async function runAudit() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('--- STARTING RESPONSIVE AUDIT ---');

  const report = [];

  for (const route of ROUTES) {
    for (const bp of BREAKPOINTS) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(`http://localhost:5190${route}`, { waitUntil: 'networkidle' });
      // wait a bit for any dynamic renders
      await page.waitForTimeout(500);

      const pageAudit = await page.evaluate(({ bpWidth, bpName }) => {
        // Find if body or html overflows naturally when overflow-x is visible
        const prevHtmlOverflow = document.documentElement.style.overflowX;
        const prevBodyOverflow = document.body.style.overflowX;
        document.documentElement.style.overflowX = 'visible';
        document.body.style.overflowX = 'visible';

        const docScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasHorizontalScroll = docScrollWidth > bpWidth || bodyScrollWidth > bpWidth;

        // Find elements causing horizontal overflow
        const allElements = document.querySelectorAll('*');
        const overflowing = [];

        for (const el of allElements) {
          // ignore elements that are display none or inside overflow hidden containers
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          
          // Check if parent has overflow hidden
          let parent = el.parentElement;
          let insideClipped = false;
          while (parent && parent !== document.body && parent !== document.documentElement) {
            const style = window.getComputedStyle(parent);
            if (style.overflowX === 'hidden' || style.overflowX === 'clip' || style.overflow === 'hidden' || style.overflow === 'clip') {
              insideClipped = true;
              break;
            }
            parent = parent.parentElement;
          }

          if (!insideClipped && (rect.right > bpWidth + 2 || rect.left < -2)) {
            overflowing.push({
              tag: el.tagName,
              className: (typeof el.className === 'string' ? el.className : ''),
              id: el.id,
              text: (el.textContent || '').trim().slice(0, 35),
              rect: {
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              }
            });
          }
        }

        // Restore
        document.documentElement.style.overflowX = prevHtmlOverflow;
        document.body.style.overflowX = prevBodyOverflow;

        return {
          hasHorizontalScroll,
          docScrollWidth,
          bodyScrollWidth,
          overflowCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 8)
        };
      }, { bpWidth: bp.width, bpName: bp.name });

      if (pageAudit.hasHorizontalScroll || pageAudit.overflowCount > 0) {
        console.log(`[ISSUE] Route: ${route} @ ${bp.name} (${bp.width}px): docScroll=${pageAudit.docScrollWidth}, bodyScroll=${pageAudit.bodyScrollWidth}, overflows=${pageAudit.overflowCount}`);
        report.push({
          route,
          bp: bp.name,
          width: bp.width,
          ...pageAudit
        });
      } else {
        console.log(`[OK] Route: ${route} @ ${bp.name} (${bp.width}px)`);
      }
    }
  }

  console.log('\n--- SUMMARY REPORT ---');
  console.log(JSON.stringify(report, null, 2));

  await browser.close();
}

runAudit().catch(console.error);
