const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const header = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const mobileNav = window.matchMedia('(max-width: 760px)');
function syncNavVisibility() {
  if (siteNav) siteNav.inert = mobileNav.matches && menuButton?.getAttribute('aria-expanded') !== 'true';
}
syncNavVisibility();
mobileNav.addEventListener?.('change', syncNavVisibility);

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  siteNav?.classList.toggle('open', open);
  syncNavVisibility();
});
siteNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
  siteNav.classList.remove('open');
  syncNavVisibility();
}));

let scrollPending = false;
window.addEventListener('scroll', () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => {
    header?.classList.toggle('scrolled', window.scrollY > 18);
    scrollPending = false;
  });
}, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
  const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = Number(el.dataset.counter || 0);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const duration = 900;
    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      el.textContent = `${Math.round(end * (1 - Math.pow(1 - progress, 4)))}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  }), { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(item => counterObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
  document.querySelectorAll('[data-counter]').forEach(item => {
    item.textContent = `${item.dataset.counter}${item.dataset.suffix || ''}`;
  });
}

const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.toggle('active', item === button));
  const filter = button.dataset.filter;
  projects.forEach(project => { project.hidden = filter !== 'all' && project.dataset.category !== filter; });
}));

const planSelect = document.getElementById('planSelect');
document.querySelectorAll('[data-plan]').forEach(link => link.addEventListener('click', () => {
  const options = [...(planSelect?.options || [])];
  const match = options.find(option => option.value.toLowerCase().includes(link.dataset.plan.toLowerCase()));
  if (match) planSelect.value = match.value;
}));

document.querySelectorAll('.floating-note,.hero-proof,.pricing-card,.contact-form').forEach(surface => surface.classList.add('glass-surface'));

if (finePointer && !reducedMotion) {
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.055;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.07;
      button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
  const surfaces = document.querySelectorAll('.glass-surface');
  surfaces.forEach(surface => {
    surface.addEventListener('pointermove', event => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      surface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
    surface.addEventListener('pointerleave', () => {
      surface.style.setProperty('--spot-x', '50%');
      surface.style.setProperty('--spot-y', '50%');
    });
  });
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(x * 2.4).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(-y * 2.1).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
  const stage = document.querySelector('.hero-stage');
  const heroSection = document.querySelector('.hero-section');
  const preview = document.querySelector('.browser-window');
  const notes = [...document.querySelectorAll('.floating-note')];
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0;
  const animateStage = () => {
    currentX += (targetX - currentX) * 0.13;
    currentY += (targetY - currentY) * 0.13;
    const x = currentX.toFixed(2), y = currentY.toFixed(2);
    preview?.style.setProperty('--pointer-x', `${x}px`);
    preview?.style.setProperty('--pointer-y', `${y}px`);
    heroSection?.style.setProperty('--glow-x', `${(currentX * 0.45).toFixed(2)}px`);
    heroSection?.style.setProperty('--glow-y', `${(currentY * 0.45).toFixed(2)}px`);
    heroSection?.style.setProperty('--glow-reverse-x', `${(-currentX * 0.3).toFixed(2)}px`);
    heroSection?.style.setProperty('--glow-reverse-y', `${(-currentY * 0.3).toFixed(2)}px`);
    notes.forEach((note, index) => {
      const depth = index === 0 ? -0.65 : 0.8;
      note.style.setProperty('--note-x', `${(currentX * depth).toFixed(2)}px`);
      note.style.setProperty('--note-y', `${(currentY * depth).toFixed(2)}px`);
    });
    if (Math.abs(targetX - currentX) > 0.025 || Math.abs(targetY - currentY) > 0.025) frame = requestAnimationFrame(animateStage);
    else frame = 0;
  };
  stage?.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
    if (!frame) frame = requestAnimationFrame(animateStage);
  });
  stage?.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    if (!frame) frame = requestAnimationFrame(animateStage);
  });
}

const form = document.getElementById('quoteForm');
const status = document.getElementById('formOk');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = new FormData(form);
  const payload = {
    name: fields.get('name'),
    business_type: fields.get('biz'),
    contact: fields.get('contact'),
    plan: fields.get('plan'),
    message: fields.get('message')
  };
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.querySelector('span').textContent = '…';
  status.hidden = true;
  try {
    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'Please try again.');
    status.textContent = 'Thanks for reaching out. We’ll be in touch within one business day.';
    status.dataset.state = 'success';
    status.hidden = false;
    form.reset();
  } catch (error) {
    status.textContent = `We couldn’t send that just now. ${error.message}`;
    status.dataset.state = 'error';
    status.hidden = false;
  } finally {
    submit.disabled = false;
    submit.querySelector('span').textContent = '↗';
  }
});

const processGrid = document.querySelector('.process-grid');
if (processGrid && !reducedMotion && 'IntersectionObserver' in window) {
  let processActive = false;
  const updateProcess = () => {
    if (!processActive) return;
    const rect = processGrid.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.82 - rect.top) / (rect.height + window.innerHeight * 0.2)));
    processGrid.style.setProperty('--process-progress', progress.toFixed(3));
  };
  const processObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    processActive = true;
    updateProcess();
    window.addEventListener('scroll', updateProcess, { passive: true });
    processObserver.disconnect();
  }, { threshold: 0.05 });
  processObserver.observe(processGrid);
}

document.getElementById('yearNow').textContent = new Date().getFullYear();
