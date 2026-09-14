const {chromium,devices} = require('/home/kkk/contract-review-rag/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const BASE = process.env.NORTHLINE_TEST_URL || 'http://localhost:8780';
const OUT = process.env.NORTHLINE_PRINT_CHECKS || '/tmp/northline-print-checks';
fs.mkdirSync(OUT,{recursive:true});
function checkPDF(buffer) {
  const source=buffer.toString('latin1');
  assert.equal((source.match(/\/Type\s*\/Page\b/g)||[]).length,1,'must be exactly one PDF page');
  assert.match(source,/\/MediaBox\s*\[\s*0\s+0\s+612\s+792\s*\]/,'must be US Letter');
}
(async()=>{
  const browser=await chromium.launch();
  try {
    const errors=[];
    for(const [name,options] of [['desktop',{viewport:{width:1440,height:1000}}],['iphone15',devices['iPhone 15']],['small-phone',{viewport:{width:320,height:700},isMobile:true,deviceScaleFactor:1}]]){
      const context=await browser.newContext(options),page=await context.newPage();
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(BASE+'/guest-guide.html');
      await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
      const sheet=await page.locator('.guide-sheet').boundingBox();
      assert(Math.abs(sheet.width/sheet.height-8.5/11)<.001,'Letter-shaped screen preview');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'phone horizontal overflow');
      assert.equal(await page.getByRole('link',{name:'Open / print PDF'}).getAttribute('href'),'guides/northline-2009-bmw-x5-guest-guide.pdf');
      assert.equal(await page.locator('[onclick*="print"]').count(),0,'print action must open PDF, not print mobile HTML');
      await page.screenshot({path:path.join(OUT,name+'.png'),fullPage:true});
      const pdf=await page.pdf({format:'Letter',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0},tagged:true});
      checkPDF(pdf); fs.writeFileSync(path.join(OUT,name+'.pdf'),pdf);
      await page.goto(BASE+'/hosts.html');
      const links=await page.locator('a[href$="northline-2009-bmw-x5-guest-guide.pdf"]').count();
      assert.equal(links,3,'all host example links should open the PDF');
      await context.close();
    }
    const page=await browser.newPage();
    for(const file of ['northline-2009-bmw-x5-guest-guide.pdf','2009-x5-guest-guide-DRAFT.pdf']){
      const response=await page.request.get(BASE+'/guides/'+file);
      assert.equal(response.status(),200); assert.match(response.headers()['content-type'],/application\/pdf/);
      checkPDF(await response.body());
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: Letter proportions on desktop/iPhone 15/small phone; one 612 × 792pt page from every print context; direct PDF actions; canonical and legacy PDF links.');
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
