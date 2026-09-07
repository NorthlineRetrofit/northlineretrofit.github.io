(() => {
  const c = window.NORTHLINE;
  if (!c) return;
  const digits = c.phone.replace(/\D/g, '');
  const sms = `sms:${c.phone}?body=${encodeURIComponent(c.enquiry)}`;
  const whatsapp = `https://wa.me/${digits}?text=${encodeURIComponent(c.enquiry)}`;
  const call = `tel:${c.phone}`;
  const choices = {
    sms: { href: sms, label: 'Text to check compatibility' },
    whatsapp: { href: whatsapp, label: 'Check compatibility on WhatsApp' },
    call: { href: call, label: 'Call to check compatibility' }
  };
  const primary = choices[c.primaryContact] || choices.sms;
  document.querySelectorAll('[data-primary-contact]').forEach(a => a.href = primary.href);
  document.querySelectorAll('[data-primary-label]').forEach(n => n.textContent = primary.label);
  document.querySelectorAll('[data-call]').forEach(a => a.href = call);
  document.querySelectorAll('[data-whatsapp]').forEach(a => a.href = whatsapp);
  document.querySelectorAll('[data-phone]').forEach(n => n.textContent = c.phoneDisplay);
  document.querySelectorAll('[data-price]').forEach(n => n.textContent = c.startingPrice);
  if (c.serviceArea) {
    const area = document.querySelector('[data-service-area]');
    area.textContent = `Serving ${c.serviceArea}${c.serviceMode ? ' · ' + c.serviceMode : ''}`;
    area.hidden = false;
  }
})();
