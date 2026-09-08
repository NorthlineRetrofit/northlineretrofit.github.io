(() => {
  const data=window.NORTHLINE_COMPATIBILITY,config=window.NORTHLINE;
  const form=document.querySelector('#compatibility-form');
  if(!data||!config||!form)return;
  const model=form.querySelector('#bmw-model'),year=form.querySelector('#bmw-year');
  const summary=form.querySelector('.compatibility-summary');
  const title=form.querySelector('#compatibility-result-title'),detail=form.querySelector('#compatibility-result-detail');
  const vehicle=form.querySelector('#compatibility-vehicle'),platforms=document.querySelector('#compatibility-platforms');
  const refs=document.querySelector('#compatibility-matched-sources');
  const mobileAction=document.querySelector('#mobile-compatibility-action'),mobileLabel=document.querySelector('#mobile-compatibility-label');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let checked=false;
  const groups=new Map();
  data.models.forEach(item=>{
    if(!groups.has(item.group)){const group=document.createElement('optgroup');group.label=item.group;groups.set(item.group,group);model.append(group);}
    groups.get(item.group).append(new Option(item.label,item.id));
  });
  // Do not exclude an enquiry just because its year is outside the researched windows.
  for(let y=new Date().getFullYear()+1;y>=1995;y--)year.add(new Option(String(y),String(y)));
  year.add(new Option('Earlier / not sure','unknown'));
  const selectedLabel=()=>data.models.find(item=>item.id===model.value)?.label||'Model to confirm';
  const vehicleLabel=()=>model.value==='other'?(year.value==='unknown'?'BMW model and year to confirm':`${year.value} BMW · model to confirm`):(year.value==='unknown'?`BMW ${selectedLabel()} · year to confirm`:`${year.value} BMW ${selectedLabel()}`);
  const message=()=>[
    'Hi Northline Retrofit! Please confirm CarPlay / Android Auto compatibility and mobile installation for my BMW.',
    `BMW: ${year.value==='unknown'?'Year to confirm':year.value} ${selectedLabel()}`,
    'I will attach a dashboard photo. Please check my factory system and confirm the right kit and quote.',
    'My location is: '
  ].join('\n');
  const contactLabel=config.primaryContact==='whatsapp'?'WhatsApp to confirm my BMW':config.primaryContact==='call'?'Call to confirm my BMW':'Text to confirm my BMW';
  form.querySelector('[data-compatibility-label]').textContent=contactLabel;
  if(config.primaryContact==='call')form.querySelector('.compatibility-photo-note').textContent='Opens your phone app. Have your model and year ready; we’ll explain how to send a dashboard photo.';
  function updateLinks(){
    const body=checked?message():config.enquiry;
    const sms=`sms:${config.phone}?body=${encodeURIComponent(body)}`;
    const wa=`https://wa.me/${config.phone.replace(/\D/g,'')}?text=${encodeURIComponent(body)}`;
    const href=config.primaryContact==='whatsapp'?wa:config.primaryContact==='call'?`tel:${config.phone}`:sms;
    document.querySelectorAll('[data-primary-contact]').forEach(link=>link.href=href);
    document.querySelectorAll('[data-whatsapp]').forEach(link=>link.href=wa);
    mobileAction.href=checked?href:'#compatibility';
    mobileLabel.textContent=checked?(config.primaryContact==='whatsapp'?'WhatsApp to confirm':config.primaryContact==='call'?'Call to confirm':'Text to confirm my BMW'):'Check your BMW';
  }
  function invalidate(){
    checked=false;summary.hidden=true;form.classList.remove('is-checked');
    refs.replaceChildren();platforms.hidden=true;platforms.textContent='';updateLinks();
  }
  function focusAndReveal(element){
    element.focus({preventScroll:true});
    element.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});
  }
  [model,year].forEach(field=>field.addEventListener('change',invalidate));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const result=data.assess(model.value,Number(year.value));
    const customer=data.customerResult(model.value,Number(year.value));
    title.textContent=customer.title;detail.textContent=customer.detail;
    vehicle.textContent=vehicleLabel();summary.dataset.status=customer.status;
    platforms.textContent=result.matches.length?'Technical platform references: '+result.matches.map(row=>row.chassis).join(' · '):'';
    platforms.hidden=!result.matches.length;refs.replaceChildren();
    if(result.refs.length){
      const label=document.createElement('p');label.textContent='Research references for this selection:';refs.append(label);
      result.refs.forEach(key=>{const source=data.sources[key],link=document.createElement('a');link.href=source.url;link.textContent=source.label+' ↗';link.target='_blank';link.rel='noopener noreferrer';refs.append(link);});
    }
    checked=true;summary.hidden=false;form.classList.add('is-checked');updateLinks();
    // Only explicit submission moves focus; selecting a value never scrolls the page.
    focusAndReveal(title);
  });
  form.querySelector('#compatibility-edit').addEventListener('click',()=>{invalidate();focusAndReveal(model);});
  document.querySelector('#compatibility-app').hidden=false;
  invalidate();
})();
