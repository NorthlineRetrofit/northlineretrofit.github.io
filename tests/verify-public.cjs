const assert = require('node:assert/strict');
const { chromium } = require('/home/kkk/contract-review-rag/node_modules/playwright');
const BASE = process.env.NORTHLINE_TEST_URL || 'http://127.0.0.1:8780';

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [], failures = [], localLinks = new Set();
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failures.push(r.url()); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const file of ['/', '/hosts.html', '/guest-guide.html']) {
      for (const width of [320, 390, 760, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(BASE + file);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file + ' overflow at ' + width);
        assert.equal(await page.locator('.preview-bar').count(), 0);
        if (file !== '/guest-guide.html') {
          assert.equal(await page.locator('meta[name=robots][content*=noindex]').count(), 0);
          assert.equal(await page.locator('link[rel=canonical]').count(), 1);
          assert(!(await page.title()).includes('concept'));
          assert.equal(await page.getByRole('link', { name: 'Review proposal' }).count(), 0);
        }
        await page.locator('img').evaluateAll(images => Promise.all(images.map(i => { i.loading = 'eager'; return i.decode(); })));
        const links = await page.locator('a[href],img[src],source[src],link[href],script[src]').evaluateAll(els => els.map(el => el.getAttribute('href') || el.getAttribute('src')));
        for (const link of links) {
          if (!link || /^(https?:|tel:|sms:|mailto:|#)/.test(link)) continue;
          localLinks.add(new URL(link, BASE + file).href);
        }
      }
    }
    for (const url of localLinks) assert.equal((await page.request.get(url)).status(), 200, url);
    for (const resource of ['/robots.txt', '/sitemap.xml']) assert.equal((await page.request.get(BASE + resource)).status(), 200);
    await page.setViewportSize({ width: 390, height: 950 });
    await page.goto(BASE + '/#demos');
    assert.equal(await page.locator('#demos').count(), 1);
    assert.equal(await page.locator('#demos').evaluate(el => el.closest('section').id), 'installs');
    for (const anchor of ['compatibility', 'contact', 'upgrade', 'how-it-works', 'questions']) assert.equal(await page.locator('#' + anchor).count(), 1);
    for (const file of ['/', '/hosts.html']) {
      await page.goto(BASE + file);
      assert.equal(await page.locator('.installation-panel').count(), 3);
      for (let i = 0; i < 3; i++) {
        await page.locator(`[data-installation="${i}"]`).click();
        await page.waitForFunction(index => document.querySelector(`[data-installation="${index}"]`).getAttribute('aria-pressed') === 'true', i);
        assert.equal(await page.locator('.installation-panel').nth(i).evaluate(el => el.inert), false);
      }
    }
    await page.goto(BASE + '/');
    await page.locator('#owner-form button[type=submit]').click();
    assert(!(await page.locator('#owner-result').isVisible()));
    await page.locator('#owner-make').selectOption('BMW');
    await page.locator('#owner-model').selectOption('X5');
    await page.locator('#owner-year').fill('2009');
    await page.locator('#owner-form button[type=submit]').click();
    assert.equal(await page.locator('#owner-verdict').textContent(), 'Yes — compatible*');
    assert.match(decodeURIComponent(await page.locator('#owner-result [data-sms]').getAttribute('href')), /2009 BMW X5/);
    await page.locator('[data-edit-owner]').click();
    await page.locator('#owner-make').selectOption('Volvo');
    assert.equal(await page.locator('#owner-model').inputValue(), '');
    await page.locator('#owner-model').selectOption('XC90');
    await page.locator('#owner-year').fill('2015');
    await page.locator('#owner-form button[type=submit]').click();
    assert.equal(await page.locator('#owner-verdict').textContent(), 'Needs a manual check');
    await page.goto(BASE + '/hosts.html');
    await page.locator('#make-1').selectOption('BMW');
    await page.locator('#model-1').selectOption('X5');
    await page.locator('#year-1').fill('2009');
    await page.locator('#add-vehicle').click();
    await page.locator('#make-2').selectOption('Mercedes-Benz');
    await page.locator('#model-2').selectOption('E-Class');
    await page.locator('#year-2').fill('2015');
    await page.locator('#fleet-location').fill('20878');
    await page.locator('#fleet-form button[type=submit]').click();
    assert.match(await page.locator('#fleet-message').inputValue(), /2015 Mercedes-Benz E-Class/);
    await page.locator('[data-edit-fleet]').click();
    assert.equal(await page.locator('#model-2').inputValue(), 'E-Class');
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log('PASS: production pages at five widths; all local links/media; SEO metadata; no proposal links; legacy QR anchors; gallery navigation; owner and fleet forms; guest guide/PDF; no JS or HTTP errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
