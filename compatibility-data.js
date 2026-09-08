/* Research-backed enquiry catalogue, reviewed 2026-09-07.
 * These are screening windows, NOT guaranteed fitment or production-year tables.
 * Model year, build month, market, screen, head unit and the selected box must be checked.
 * Engine badges (328i, 535d, xDrive, etc.) do not determine MMI compatibility.
 * Keep source references on every row; see COMPATIBILITY-RESEARCH.md for limitations.
 */
(function(root){
  const sources={
    ccc:{label:'Mr12Volt: CCC / M-ASK interface',url:'https://www.mr12volt.com/collections/bmw/products/p3000-bmcc'},
    cic:{label:'Mr12Volt: CIC interface',url:'https://www.mr12volt.com/collections/bmw/products/p3000-bmci'},
    nbt:{label:'Mr12Volt: NBT / ID4 interface',url:'https://www.mr12volt.com/collections/bmw/products/p3000-bmid'},
    evo:{label:'Mr12Volt: EVO ID5 / ID6 interface',url:'https://www.mr12volt.com/collections/bmw/products/p3000-bmev'},
    i3:{label:'Mr12Volt: i3 interface',url:'https://www.mr12volt.com/collections/bmw/products/p3000-bmi3'},
    road:{label:'Road Top: NBT / EVO fitment',url:'https://roadtop.com/products/bmw-nbt-evo-wireless-carplay'},
    pro:{label:'BimmerTech: professional head-unit guide',url:'https://www.bimmer-tech.net/blog/item/54-bmw-cic-nbt-nbtevo'},
    basic:{label:'BimmerTech: basic head-unit guide',url:'https://www.bimmer-tech.net/blog/item/101-basic-bmw-navigation'},
    mmi:{label:'BimmerTech: MMI retrofit requirements',url:'https://www.bimmer-tech.net/blog/item/49-how-to-retrofit-carplay'},
    andream:{label:'Andream: CIC / NBT / EVO MMI catalogue',url:'https://andream-eu.com/product/ewm-bmcp/'},
    tourer:{label:'Integrated Automotive: 2 Series Tourers',url:'https://integratedautomotive.co.uk/product/2014-2019-bmw-2-series-all-body-shapes-f22-f45-and-f46-carplay-and-android-auto-retrofit-multimedia-interface/'}
  };
  const models=[
    ['1','1 Series','BMW Series'],['2','2 Series Coupe / Convertible','BMW Series'],
    ['2at','2 Series Active Tourer','BMW Series'],['2gt','2 Series Gran Tourer','BMW Series'],
    ['2gc','2 Series Gran Coupe','BMW Series'],['3','3 Series (not GT)','BMW Series'],
    ['3gt','3 Series Gran Turismo (GT)','BMW Series'],['4','4 Series','BMW Series'],
    ['5','5 Series (not GT)','BMW Series'],['5gt','5 Series Gran Turismo (GT)','BMW Series'],
    ['6','6 Series (not GT)','BMW Series'],['6gt','6 Series Gran Turismo (GT)','BMW Series'],
    ['7','7 Series','BMW Series'],['8','8 Series','BMW Series'],
    ['x1','X1','BMW X models'],['x2','X2','BMW X models'],['x3','X3','BMW X models'],
    ['x4','X4','BMW X models'],['x5','X5','BMW X models'],['x6','X6','BMW X models'],['x7','X7','BMW X models'],
    ['1m','1 Series M Coupe (1M)','BMW M models'],['m2','M2','BMW M models'],['m3','M3','BMW M models'],
    ['m4','M4','BMW M models'],['m5','M5','BMW M models'],['m6','M6','BMW M models'],['m8','M8','BMW M models'],
    ['x3m','X3 M','BMW M models'],['x4m','X4 M','BMW M models'],['x5m','X5 M','BMW M models'],['x6m','X6 M','BMW M models'],
    ['z4','Z4','BMW Z / i models'],['i3','i3 / i3s','BMW Z / i models'],['i8','i8','BMW Z / i models'],
    ['other','Other BMW / not sure','Other']
  ].map(([id,label,group])=>({id,label,group}));
  // model, chassis, research window, possible system families, source IDs, extra review flag.
  const rows=[
    ['1','E81 / E82 / E87 / E88',2008,2013,['cic'],['cic','pro']],
    ['1','F20 / F21',2011,2019,['cic','nbt','evo','basic'],['pro','road','basic']],
    ['2','F22 / F23',2014,2021,['nbt','evo','basic'],['nbt','evo','pro','basic']],
    ['2at','F45',2014,2019,['evo','basic'],['tourer','evo','basic']],
    ['2gt','F46',2015,2019,['evo','basic'],['tourer','evo','basic']],
    ['3','E90 / E91 / E92 / E93',2005,2013,['ccc','cic'],['ccc','cic','pro']],
    ['3','F30 / F31 / F35',2012,2019,['cic','nbt','evo','basic'],['road','nbt','evo','basic']],
    ['3','G20 / G21',2019,2022,['basic'],['basic','mmi'],'mixed'],
    ['3gt','F34',2013,2020,['nbt','evo','basic'],['road','pro','basic']],
    ['4','F32 / F33 / F36',2013,2020,['nbt','evo','basic'],['nbt','evo','road','basic']],
    ['5','E60 / E61',2003,2010,['ccc','cic'],['ccc','cic','pro']],
    ['5','F10 / F11 / F18',2010,2017,['cic','nbt','basic'],['cic','nbt','pro','basic']],
    ['5','G30 / G31 / G38',2017,2020,['evo','basic'],['evo','pro','basic'],'mixed'],
    ['5gt','F07',2009,2017,['cic','nbt','evo','basic'],['cic','road','evo','basic']],
    ['6','E63 / E64',2004,2010,['ccc','cic'],['ccc','cic','pro']],
    ['6','F06 / F12 / F13',2011,2018,['cic','nbt','evo'],['cic','nbt','evo','pro']],
    ['6gt','G32',2017,2020,['evo','basic'],['pro','basic'],'mixed'],
    ['7','F01 / F02 / F03 / F04',2009,2015,['cic','nbt'],['cic','nbt','pro']],
    ['7','G11 / G12',2016,2020,['evo','basic'],['evo','road','basic'],'mixed'],
    ['8','G14 / G15 / G16',2019,2022,['basic'],['basic','mmi'],'mixed'],
    ['x1','E84',2009,2015,['cic'],['cic','pro']],
    ['x1','F48 / F49',2016,2022,['evo','basic'],['road','pro','basic'],'regional'],
    ['x2','F39',2018,2023,['evo','basic'],['pro','basic']],
    ['x3','F25',2011,2017,['cic','nbt','evo','basic'],['cic','nbt','evo','basic']],
    ['x3','G01 / G08',2018,2020,['evo','basic'],['road','evo','basic'],'mixed'],
    ['x4','F26',2014,2018,['nbt','evo','basic'],['nbt','evo','basic']],
    ['x4','G02',2019,2020,['evo'],['evo','pro'],'mixed'],
    ['x5','E70',2007,2013,['ccc','cic'],['ccc','cic','pro','basic']],
    ['x5','F15',2014,2018,['nbt','evo'],['nbt','road','evo']],
    ['x5','G05',2019,2020,['evo','basic'],['evo','basic'],'mixed'],
    ['x6','E71 / E72',2008,2014,['ccc','cic'],['ccc','cic','pro'],'regional'],
    ['x6','F16',2015,2019,['nbt','evo'],['nbt','evo','road']],
    ['z4','E89',2009,2016,['cic'],['cic']],
    ['z4','G29',2019,2022,['basic'],['basic','mmi'],'mixed'],
    ['i3','I01',2014,2022,['nbt','evo','basic'],['i3','pro','basic'],'screen'],
    ['i8','I12 / I15',2014,2020,['nbt','evo'],['nbt','road','pro'],'regional'],
    ['1m','E82',2011,2012,['cic'],['cic','pro'],'derivative'],
    ['m2','F87',2016,2021,['nbt','evo'],['andream','pro'],'derivative'],
    ['m3','E90 / E92 / E93',2008,2013,['ccc','cic'],['ccc','cic','pro'],'derivative'],
    ['m3','F80',2014,2018,['nbt','evo','basic'],['andream','road','pro']],
    ['m4','F82 / F83',2015,2020,['nbt','evo'],['andream','pro'],'derivative'],
    ['m5','E60 / E61',2005,2010,['ccc','cic'],['ccc','cic','pro'],'derivative'],
    ['m5','F10',2012,2016,['cic','nbt'],['andream','cic','nbt'],'derivative'],
    ['m5','F90',2018,2020,['evo'],['andream','pro'],'mixed'],
    ['m6','E63 / E64',2006,2010,['ccc','cic'],['ccc','cic'],'derivative'],
    ['m6','F06 / F12 / F13',2012,2018,['cic','nbt','evo'],['cic','nbt','evo'],'derivative'],
    ['x5m','E70',2010,2013,['cic'],['cic','pro'],'derivative'],
    ['x5m','F85',2015,2018,['nbt','evo'],['road','pro']],
    ['x6m','E71',2010,2014,['cic'],['cic','pro'],'derivative'],
    ['x6m','F86',2015,2019,['nbt','evo'],['road','pro']]
  ].map(([model,chassis,from,to,systems,refs,review])=>({model,chassis,from,to,systems,refs,review:review||null}));
  const systems={unknown:'Not sure — check my dashboard photo',ccc:'CCC / M-ASK',cic:'CIC / CIC-MID',nbt:'NBT / NBT EVO ID4',evo:'NBT EVO ID5 / ID6',basic:'CHAMP2 / ENTRY / ENTRYNAV / ENAVEVO',mgu:'iDrive 7 / 8 / 9 or newer (MGU)',none:'No factory screen / iDrive',aftermarket:'Aftermarket screen or swapped head unit'};
  function assess(model,year,system='unknown'){
    const matches=rows.filter(r=>r.model===model&&year>=r.from&&year<=r.to);
    let title='Individual review needed',detail='This model/year is outside our documented MMI screening windows. That does not rule out an upgrade. Send your exact model and a dashboard photo so we can check the right approach.';
    if(matches.length){title='Possible MMI route — confirmation needed';detail='Supplier documentation covers these platforms with certain factory systems. Model and year alone do not confirm fitment; we still need your dashboard photo, build details and the correct box.';}
    if(matches.some(r=>r.review==='mixed')){title='Factory-system check needed';detail='This generation can have different infotainment hardware. Some configurations may use a suitable interface; others may already offer factory CarPlay or need a different solution. We must identify your system first.';}
    if(matches.some(r=>r.review==='screen'))detail+=' Screen size is especially important on the i3; some interfaces exclude the 6.5-inch screen.';
    if(matches.some(r=>['regional','derivative'].includes(r.review)))detail+=' This entry also needs a market/variant-specific check; shared platform names are not a fitment guarantee.';
    if(system==='basic'){title='Exact basic head unit needs checking';detail='CHAMP2, ENTRY, ENTRYNAV and ENAVEVO are not interchangeable. Support depends on the exact box and screen; for example, some CHAMP2 support is limited to F3x cars. Please send a dashboard photo.';}
    else if(system==='mgu'){title='Check factory connectivity first';detail='Do not assume a CCC/CIC/NBT/EVO MMI box fits iDrive 7 or newer. We will check existing CarPlay/Android Auto support and any suitable alternative for your exact system.';}
    else if(system==='none'){title='A different retrofit may be needed';detail='The advertised MMI installation uses an existing factory screen and iDrive controls. A vehicle without them needs a separate assessment; this is not confirmed for the standard installation.';}
    else if(system==='aftermarket'){title='Modified system — individual review';detail='Previous screen or head-unit changes can override model/year guidance. Send a photo and any hardware details so we can assess your current setup.';}
    else if(system!=='unknown'&&matches.length&&!matches.some(r=>r.systems.includes(system))){title='System does not match our screening data';detail='Your selected system differs from the systems documented here for this model/year. A retrofit or regional variation may explain it. We will verify the hardware from your dashboard photo.';}
    return{title,detail,matches,refs:[...new Set(matches.flatMap(r=>r.refs))]};
  }
  function customerResult(model,year){
    const result=assess(model,year);
    if(result.matches.length&&!result.matches.some(row=>row.review))return{status:'potential',title:'Compatible*',detail:'We have installed CarPlay on this model. A photo of your center console / main iDrive menu will help us choose the right installation kit.'};
    let detail='We can’t confirm this model/year from the guide. Send a dashboard photo and we’ll check your options—an upgrade may still be possible.';
    if(result.matches.some(row=>row.review==='mixed'))detail='Your BMW may have different factory systems or already have CarPlay. Send a dashboard photo so we can check the right option for you.';
    else if(result.matches.some(row=>row.review==='screen'))detail='Screen size changes the options for this BMW. Send a dashboard photo so we can check your display before confirming compatibility.';
    else if(result.matches.length)detail='We need to check your exact version of this BMW. Send a dashboard photo so we can confirm the factory system and a suitable kit.';
    return{status:'manual',title:'Needs a manual check',detail};
  }
  const api={reviewed:'2026-09-07',models,rows,sources,systems,assess,customerResult};
  root.NORTHLINE_COMPATIBILITY=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
