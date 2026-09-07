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
  const demos = [...document.querySelectorAll('.demo-video')];
  demos.forEach(video => video.addEventListener('play', () => {
    demos.forEach(other => { if (other !== video) other.pause(); });
  }));

  // Native scroll snapping keeps touch swipes working without a carousel library.
  const track = document.querySelector('#demo-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.demo-card')];
  const navigation = document.querySelector('.demo-navigation');
  const modelButtons = [...navigation.querySelectorAll('[data-demo-index]')];
  const status = navigation.querySelector('[data-demo-status]');
  const mobile = window.matchMedia('(max-width: 760px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let frame = 0;
  navigation.hidden = false;

  const update = () => {
    frame = 0;
    if (!mobile.matches) return;
    const left = track.getBoundingClientRect().left;
    const distances = cards.map(card => Math.abs(card.getBoundingClientRect().left - left));
    const index = distances.indexOf(Math.min(...distances));
    if (index === active) return;
    active = index;
    cards.forEach((card, i) => {
      // Offscreen slides must not expose hidden playback controls to keyboard users.
      card.inert = i !== active;
      if (i !== active) card.querySelector('video').pause();
    });
    modelButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
    status.textContent = `${active + 1} / ${cards.length}`;
  };
  const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  const goTo = index => {
    if (!mobile.matches) return;
    const card = cards[Math.max(0, Math.min(index, cards.length - 1))];
    const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  modelButtons.forEach(button => button.addEventListener('click', () => goTo(Number(button.dataset.demoIndex))));
  track.addEventListener('scroll', scheduleUpdate, { passive: true });
  track.addEventListener('keydown', event => {
    // Leave native video-control keyboard shortcuts alone.
    if (event.target !== track || !mobile.matches) return;
    const targets = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    goTo(targets[event.key]);
  });
  const syncLayout = () => {
    track.tabIndex = mobile.matches ? 0 : -1;
    cards.forEach(card => { card.inert = false; });
    active = -1;
    scheduleUpdate();
  };
  mobile.addEventListener('change', syncLayout);
  new ResizeObserver(syncLayout).observe(track);
  syncLayout();
})();
