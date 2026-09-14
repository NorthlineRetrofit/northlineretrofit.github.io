const assert = require('node:assert/strict');
const {chromium, webkit} = require('/home/kkk/contract-review-rag/node_modules/playwright');
const BASE = process.env.NORTHLINE_TEST_URL || 'http://127.0.0.1:8780';
const OUT = process.env.NORTHLINE_SCREENSHOTS;
(async () => {
 const browser = await (process.env.NORTHLINE_WEBKIT ? webkit : chromium).launch();
 const errors = [];
 try {
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const file of ['/', '/hosts.html']) {
   for (const width of [320,390,430,600,760,761,820,1024,1100,1101,1440]) {
    await page.setViewportSize({width,height:844});
    await page.goto(BASE+file);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${file} overflow ${width}`);
    const host = file.includes('hosts');
    if (width<=760) {
     assert(await page.locator('.hero-prices').isVisible());
     if (width<=430) assert((await page.locator('.hero-prices').boundingBox()).y<500);
     if (width===390 && !host) assert((await page.locator('h1').boundingBox()).height<100);
    } else assert(await page.locator('.nav-cta').isVisible(),`missing persistent CTA ${width}`);
    if (width===390 && OUT) await page.screenshot({path:`${OUT}/${host?'hosts':'owner'}-390-top.png`});
    if (width===1440 && OUT) {
     await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode()})));
     await page.screenshot({path:`${OUT}/${host?'hosts':'owner'}-1440.png`,fullPage:true});
     assert.equal(await page.locator('.hero-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2);
    }
    await page.locator(width<=760?'.mobile-bar .btn':'.nav-cta').click();
    const first = page.locator(host?'#make-1':'#owner-make');
    const bounds = await first.boundingBox();
    assert(bounds.y>60 && bounds.y<430,`${file} first field outside task landing ${width}: ${bounds.y}`);
    if (width===390 && OUT) await page.screenshot({path:`${OUT}/${host?'hosts':'owner'}-form.png`});
   }
  }
  await page.setViewportSize({width:844,height:390});
  await page.goto(BASE);
  assert(await page.locator('.nav-cta').isVisible());
  assert((await page.locator('.header').boundingBox()).height<=65);

  await page.setViewportSize({width:320,height:700});
  await page.goto(BASE);
  await page.locator('[data-manual-check]').click();
  assert.equal(await page.locator('#owner-verdict').textContent(),'Needs a manual check');
  assert.equal(await page.locator('#owner-result-title').textContent(),'Vehicle details to confirm');
  await page.locator('[data-edit-owner]').click();
  await page.locator('#owner-make').selectOption('Other / not sure');
  await page.locator('#owner-year').fill('2010');
  await page.locator('#owner-form [type=submit]').click();
  assert.equal(await page.locator('#owner-result-title').textContent(),'2010 vehicle — details to confirm');
  await page.locator('[data-copy-owner]').click();
  await page.waitForFunction(()=>document.querySelector('[data-owner-copy-status]').textContent.length>0);
  assert(await page.locator('[data-owner-copy-status]').textContent());
  assert.match(await page.locator('#owner-message').inputValue(),/2010 vehicle/);
  // Persistent contact now has an sms href; no anchor handler may parse it as CSS.
  const smsHref = await page.locator('.mobile-bar .btn').getAttribute('href');
  assert(smsHref.startsWith('sms:'));
  await page.evaluate(()=>{
   const link=document.querySelector('.mobile-bar .btn');
   link.addEventListener('click',e=>e.preventDefault(),{once:true});link.click();
  });

  await page.goto(BASE+'/hosts.html');
  await page.locator('#make-1').selectOption('BMW');
  await page.locator('#model-1').selectOption('X5');
  await page.locator('#year-1').fill('2009');
  await page.locator('#add-vehicle').click();
  assert(await page.locator('.fleet-row').first().evaluate(e=>e.classList.contains('is-collapsed')));
  assert.equal(await page.locator('.fleet-row-summary').first().textContent(),'2009 BMW X5');
  await page.locator('.fleet-edit').first().click();
  assert(await page.locator('#make-1').isVisible());
  assert.equal(await page.locator('#year-1').inputValue(),'2009');
  await page.locator('.fleet-edit').first().click();
  await page.locator('#make-2').selectOption('Mercedes-Benz');
  await page.locator('#model-2').selectOption('E-Class');
  await page.locator('#year-2').fill('2015');
  await page.locator('#fleet-location').fill('20878');
  await page.locator('#fleet-form [type=submit]').click();
  assert.match(await page.locator('#fleet-message').inputValue(),/2009 BMW X5/);
  assert(!(await page.locator('#fleet-message').isVisible()));
  assert((await page.locator('#fleet-result [data-sms]').boundingBox()).y<500);
  await page.locator('#copy-message').click();
  await page.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);
  assert(await page.locator('#copy-status').textContent());
  await page.locator('[data-edit-fleet]').click();
  assert.equal(await page.locator('#year-1').inputValue(),'2009');
  await page.locator('.remove-row').nth(1).click();
  assert.equal(await page.locator('.fleet-row').count(),1);

  for (const file of ['/', '/hosts.html']) {
   await page.setViewportSize({width:390,height:844});
   await page.goto(BASE+file);
   const nav=await page.locator('.installation-nav').boundingBox();
   const track=await page.locator('.installation-track').boundingBox();
   assert(nav.y<track.y);
   await page.locator('[data-installation="1"]').click();
   await page.locator('[data-installation="2"]').click();
   assert.equal(await page.locator('[data-installation="2"]').getAttribute('aria-pressed'),'true');
   await page.locator('.installation-track').evaluate(el=>el.scrollTo({left:0,behavior:'instant'}));
   await page.waitForFunction(()=>document.querySelector('[data-installation="0"]').getAttribute('aria-pressed')==='true');
   await page.locator('[data-compare="0"]').click();
   assert(await page.locator('#swap-before').isVisible());
   assert(!(await page.locator('#swap-after').isVisible()));
   await page.setViewportSize({width:1440,height:900});
   await page.waitForFunction(()=>!document.querySelector('#swap-after').hidden);
   assert(await page.locator('#swap-before').isVisible());
   assert(await page.locator('#swap-after').isVisible());
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: 11 widths, short landscape, direct form landing, early prices, manual/unknown check, contact/copy, collapsed fleet rows/edit/remove, gallery order/selection/resize; no JS errors.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
