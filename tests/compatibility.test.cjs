const test=require('node:test'),assert=require('node:assert/strict');
const d=require('../compatibility-data.js');
test('catalogue records reference known models, systems and primary sources',()=>{
  assert.equal(d.models.length,36);assert.equal(d.rows.length,50);
  assert.equal(new Set(d.models.map(m=>m.id)).size,d.models.length);
  for(const r of d.rows){
    assert.ok(d.models.some(m=>m.id===r.model));assert.ok(r.from<=r.to);
    assert.ok(r.refs.length);r.refs.forEach(ref=>assert.ok(d.sources[ref]?.url.startsWith('https://')));
    r.systems.forEach(s=>assert.ok(d.systems[s]));
  }
});
test('the two real demos are routed to the right researched platforms',()=>{
  assert.equal(d.assess('x5',2013).matches[0].chassis,'E70');
  assert.equal(d.assess('3gt',2015).matches[0].chassis,'F34');
});
test('boundary years, unknowns and overlaps never produce a guaranteed fit',()=>{
  for(const model of d.models)for(let year=1995;year<=2027;year++){
    const r=d.assess(model.id,year);
    assert.ok(!/^compatible|guaranteed|approved/i.test(r.title));
    for(const match of r.matches)assert.ok(year>=match.from&&year<=match.to);
  }
  assert.equal(d.assess('3',2013).matches.length,2);
  for(const [model,year] of [['other',2026],['x7',2020],['2gc',2021],['m8',2021],['x5',2001],['3',NaN]])assert.equal(d.assess(model,year).title,'Individual review needed');
});
test('actual system overrides model/year suggestions',()=>{
  assert.match(d.assess('x5',2013,'none').title,/different retrofit/);
  assert.match(d.assess('x5',2013,'aftermarket').title,/Modified system/);
  assert.match(d.assess('x5',2013,'mgu').title,/factory connectivity/);
  assert.match(d.assess('x5',2013,'evo').title,/does not match/);
  assert.match(d.assess('3',2013,'basic').detail,/CHAMP2[\s\S]*F3x/);
  assert.match(d.assess('i3',2016).detail,/6.5-inch/);
  assert.match(d.assess('5',2019).title,/Factory-system/);
});
test('customer results are simple, conditional and conservative for special cases',()=>{
  for(const [model,year] of [['x5',2013],['3gt',2015]])assert.equal(d.customerResult(model,year).title,'Potentially compatible');
  for(const [model,year] of [['other',NaN],['x5',2025],['5',2019],['i3',2016],['m2',2018]])assert.equal(d.customerResult(model,year).title,'Needs a manual check');
  for(const m of d.models)for(let y=1995;y<=2027;y++){
    const result=d.customerResult(m.id,y);assert.ok(['potential','manual'].includes(result.status));assert.match(result.detail,/photo/);
  }
});
