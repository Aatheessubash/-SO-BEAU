const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  console.log('Navigating to http://localhost:4225...');
  await page.goto('http://localhost:4225', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Initial State Screenshot at scroll 0
  const artifactDir = 'C:\\Users\\subashaathees\\.gemini\\antigravity\\brain\\ac5f56f2-f100-4296-abc2-ebfbfa8332a6';
  await page.screenshot({ path: path.join(artifactDir, 'verify-smooth-hero-0.png') });
  console.log('Captured verify-smooth-hero-0.png');

  // Check initial hero model visibility and cove center figure
  const heroModelVis = await page.evaluate(() => {
    const stage = document.querySelector('.hero-visual-stage');
    const cove = document.querySelector('.studio-cove-viewport');
    const centerCard = document.querySelector('.card-center-selected');
    const centerCardWrap = document.querySelector('.card-center-selected .model-image-wrap');
    return {
      heroStageVisible: stage ? window.getComputedStyle(stage).visibility : null,
      heroStageOpacity: stage ? window.getComputedStyle(stage).opacity : null,
      coveIsDocked: cove ? cove.classList.contains('is-docked') : false,
      centerCardImgOpacity: centerCardWrap ? window.getComputedStyle(centerCardWrap).opacity : null,
    };
  });
  console.log('Initial visibility state:', JSON.stringify(heroModelVis, null, 2));

  // 2. Test vertical wheel scrolling directly over the carousel viewport
  const carouselBox = await page.locator('.react-bits-circular-carousel-viewport').boundingBox();
  console.log('Carousel bounding box:', carouselBox);

  if (carouselBox) {
    const mouseX = carouselBox.x + carouselBox.width / 2;
    const mouseY = carouselBox.y + carouselBox.height / 2;

    // Move mouse over carousel
    await page.mouse.move(mouseX, mouseY);
    await page.waitForTimeout(200);

    // Dispatch vertical wheel scroll
    console.log('Dispatching vertical wheel events over carousel...');
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(600);
    const postWheelScrollY = await page.evaluate(() => window.scrollY);
    console.log(`Scroll Y before wheel: ${initialScrollY}, after vertical wheel: ${postWheelScrollY}`);

    const didScroll = postWheelScrollY > initialScrollY;
    console.log(`Vertical wheel scroll passed through cleanly without sticking: ${didScroll}`);
  }

  // 3. Scroll to docking position (y ~ 800)
  console.log('Scrolling down into Try the Look section to dock...');
  await page.evaluate(() => window.scrollTo({ top: 820, behavior: 'instant' }));
  await page.waitForTimeout(800);

  const dockedVis = await page.evaluate(() => {
    const stage = document.querySelector('.hero-visual-stage');
    const cove = document.querySelector('.studio-cove-viewport');
    const centerCardWrap = document.querySelector('.card-center-selected .model-image-wrap');
    return {
      scrollY: window.scrollY,
      heroStageVisible: stage ? window.getComputedStyle(stage).visibility : null,
      coveIsDocked: cove ? cove.classList.contains('is-docked') : false,
      centerCardImgOpacity: centerCardWrap ? window.getComputedStyle(centerCardWrap).opacity : null,
    };
  });
  console.log('Docked visibility state:', JSON.stringify(dockedVis, null, 2));
  await page.screenshot({ path: path.join(artifactDir, 'verify-smooth-docked-820.png') });
  console.log('Captured verify-smooth-docked-820.png');

  // 4. Test Carousel navigation (rotate to next look)
  console.log('Testing carousel navigation: clicking Next Look arrow...');
  await page.locator('.stage-nav-arrow.arrow-right').click();
  await page.waitForTimeout(600); // Wait for Apple spring animation to settle

  const postNavState = await page.evaluate(() => {
    const centerCard = document.querySelector('.card-center-selected');
    const pedestalLabel = document.querySelector('.active-look-pedestal .pedestal-label');
    const optionActive = document.querySelector('.option-active-value');
    return {
      pedestal: pedestalLabel ? pedestalLabel.textContent.trim() : null,
      activeColorName: optionActive ? optionActive.textContent.trim() : null,
    };
  });
  console.log('Post-navigation state:', JSON.stringify(postNavState, null, 2));
  await page.screenshot({ path: path.join(artifactDir, 'verify-smooth-after-rotation.png') });
  console.log('Captured verify-smooth-after-rotation.png');

  // 5. Scroll back up to Hero to verify smooth undocking & shared colorway
  console.log('Scrolling back up to Hero...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);

  const backUpVis = await page.evaluate(() => {
    const heroImg = document.querySelector('.hero-stage-image');
    const stage = document.querySelector('.hero-visual-stage');
    const cove = document.querySelector('.studio-cove-viewport');
    return {
      heroStageVisible: stage ? window.getComputedStyle(stage).visibility : null,
      heroStageOpacity: stage ? window.getComputedStyle(stage).opacity : null,
      coveIsDocked: cove ? cove.classList.contains('is-docked') : false,
      heroImgSrc: heroImg ? heroImg.getAttribute('src') : null,
    };
  });
  console.log('Back up at top visibility & colorway:', JSON.stringify(backUpVis, null, 2));
  await page.screenshot({ path: path.join(artifactDir, 'verify-smooth-hero-return.png') });
  console.log('Captured verify-smooth-hero-return.png');

  console.log('Total console/page errors detected:', errors.length);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  }

  await browser.close();
  console.log('Verification script completed successfully.');
})();
