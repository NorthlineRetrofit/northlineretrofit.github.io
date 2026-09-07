(() => {
  const data=window.NORTHLINE_COMPATIBILITY,config=window.NORTHLINE;
  const form=document.querySelector('#compatibility-form');
  if(!data||!config||!form)return;
  const model=form.querySelector('#bmw-model'),year=form.querySelector('#bmw-year');
  const variant=form.querySelector('#bmw-variant'),location=form.querySelector('#bmw-location'),system=form.querySelector('#bmw-system');
  const send=form.querySelector('#compatibility-send'),whatsapp=form.querySelector('#compatibility-whatsapp');
  const title=form.querySelector('#compatibility-result-title'),detail=form.querySelector('#compatibility-result-detail'),platforms=form.querySelector('#compatibility-platforms');
  const refs=document.querySelector('#compatibility-matched-sources');
  const groups=new Map();
  data.models.forEach(item=>{
    if(!groups.has(item.group)){const group=document.createElement('optgroup');group.label=item.group;groups.set(item.group,group);model.append(group);}
    groups.get(item.group).append(new Option(item.label,item.id));
  });
  // Do not exclude an enquiry just because its year is outside the researched windows.
  for(let y=new Date().getFullYear()+1;y>=1995;y--)year.add(new Option(String(y),String(y)));
  year.add(new Option('Earlier / not sure','unknown'));
  Object.entries(data.systems).filter(([key])=>key!=='unknown').forEach(([key,label])=>system.add(new Option(label,key)));
  const selectedLabel=()=>data.models.find(item=>item.id===model.value)?.label||'Not selected';
  const message=()=>[
    'Hi Northline Retrofit! I would like to confirm CarPlay / Android Auto compatibility and mobile installation.',
    `BMW: ${year.value==='unknown'?'Year to confirm':year.value||'Year to confirm'} ${selectedLabel()}`,
    ...(variant.value.trim()?[`Exact model / body: ${variant.value.trim()}`]:[]),
    `Factory system: ${data.systems[system.value]}`,
    `My location is: ${location.value.trim()||'To confirm'}`,
    'Please confirm the correct interface, availability and quote. I will attach a dashboard photo.'
  ].join('\n');
  function updateLinks(){
    const body=model.value&&year.value?message():config.enquiry;
    const sms=`sms:${config.phone}?body=${encodeURIComponent(body)}`;
    const wa=`https://wa.me/${config.phone.replace(/\D/g,'')}?text=${encodeURIComponent(body)}`;
    const href=config.primaryContact==='whatsapp'?wa:config.primaryContact==='call'?`tel:${config.phone}`:sms;
    document.querySelectorAll('[data-primary-contact]').forEach(link=>link.href=href);
    document.querySelectorAll('[data-whatsapp]').forEach(link=>link.href=wa);
  }
  function updateResult(){
    refs.replaceChildren();
    if(!model.value||!year.value){
      title.textContent='Let’s check your setup.';detail.textContent='Choose a model and year. We’ll use the research as a starting point, then confirm your individual BMW.';
      platforms.hidden=true;platforms.textContent='';updateLinks();return;
    }
    const result=data.assess(model.value,Number(year.value),system.value);
    title.textContent=result.title;detail.textContent=result.detail;
    platforms.textContent=result.matches.length?'Platforms to check: '+result.matches.map(row=>row.chassis).join(' · '):'';
    platforms.hidden=!result.matches.length;
    if(result.refs.length){
      const label=document.createElement('p');label.textContent='Research references for this selection:';refs.append(label);
      result.refs.forEach(key=>{const source=data.sources[key],link=document.createElement('a');link.href=source.url;link.textContent=source.label+' ↗';link.target='_blank';link.rel='noopener noreferrer';refs.append(link);});
    }
    updateLinks();
  }
  [model,year,system].forEach(field=>field.addEventListener('change',updateResult));
  [variant,location].forEach(field=>field.addEventListener('input',updateLinks));
  [send,whatsapp].forEach(link=>link.addEventListener('click',event=>{
    if(!form.reportValidity()){event.preventDefault();return;}
    updateLinks();
  }));
  // Prevent a text-field Enter key from submitting private details to static hosting.
  form.addEventListener('submit',event=>{event.preventDefault();send.click();});
  document.querySelector('#compatibility-app').hidden=false;
  updateResult();
})();
