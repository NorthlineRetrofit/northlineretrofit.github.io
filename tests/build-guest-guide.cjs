const {chromium} = require('/home/kkk/contract-review-rag/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const BASE = process.env.NORTHLINE_TEST_URL || 'http://localhost:8780';
const output = path.join(__dirname, '../guides/northline-2009-bmw-x5-guest-guide.pdf');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto(BASE + '/guest-guide.html');
    await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await page.emulateMedia({media:'print'});
    const dimensions = await page.locator('.guide-sheet').evaluate(sheet => {
      const r=sheet.getBoundingClientRect();
      const items=[...sheet.children].map(el=>({name:el.className,bottom:el.getBoundingClientRect().bottom}));
      return {width:r.width,height:r.height,scrollHeight:sheet.scrollHeight,items};
    });
    assert.equal(dimensions.width,816);
    assert.equal(dimensions.height,1056);
    assert(dimensions.scrollHeight<=1057,'Guide overflows the Letter sheet');
    for(const child of dimensions.items) assert(child.bottom<=1027,child.name+' extends into the bottom safe margin');
    await page.pdf({path:output,format:'Letter',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0},tagged:true});
    fs.copyFileSync(output,path.join(__dirname,'../guides/2009-x5-guest-guide-DRAFT.pdf'));
    console.log(JSON.stringify({output,dimensions}));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
