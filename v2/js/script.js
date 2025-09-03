// v2 i18n + UI logic
let translations = {};

async function loadTranslations() {
  try {
    const [enRes, esRes] = await Promise.all([
      fetch('./lang/en.json'),
      fetch('./lang/es.json')
    ]);
    translations.en = await enRes.json();
    translations.es = await esRes.json();
  } catch (e) {
    console.error('Translation load failed', e);
    translations = { en: {}, es: {} };
  }
}

function applyLang(lang) {
  const dict = translations[lang] || translations.en || {};
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.getAttribute('data-i18n');
    if (dict[key] !== undefined) node.textContent = dict[key];
  });
  document.documentElement.lang = (lang === 'es' ? 'es' : 'en');
  const phoneBtn = document.querySelector('.cta[href^="tel:"]');
  if (phoneBtn) {
    phoneBtn.setAttribute('aria-label', lang === 'es' ? 'Llamar ahora' : 'Call now');
  }
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function setupLanguageSwitcher() {
  const switcher = document.querySelector('.lang-switch');
  if (!switcher) return;
  switcher.addEventListener('click', e => {
    switcher.classList.toggle('open');
    e.stopPropagation();
  });
  switcher.querySelectorAll('[data-lang]').forEach(opt => {
    opt.addEventListener('click', e => {
      const code = opt.getAttribute('data-lang');
      switcher.querySelectorAll('[data-lang]').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      switcher.querySelector('.lang-current').textContent = code === 'es' ? 'Español' : 'English';
      applyLang(code);
      switcher.classList.remove('open');
      e.stopPropagation();
    });
  });
  document.addEventListener('click', () => switcher.classList.remove('open'));
}

function setupAccordions() {
  document.querySelectorAll('.faq-item summary').forEach(s => {
    s.addEventListener('click', e => {
      const details = s.parentElement;
      if (details.hasAttribute('open')) {
        // allow native close
      } else {
        // close others
        document.querySelectorAll('.faq-item[open]').forEach(d => {
          if (d !== details) d.removeAttribute('open');
        });
      }
    });
  });
}

async function init() {
  await loadTranslations();
  // Default language detection (query param or browser)
  const urlLang = new URLSearchParams(location.search).get('lang');
  const initial = (urlLang === 'es' || urlLang === 'en') ? urlLang : (navigator.language.startsWith('es') ? 'es' : 'en');
  applyLang(initial);
  const switcher = document.querySelector(`.lang-switch [data-lang="${initial}"]`);
  if (switcher) switcher.classList.add('active');
  const current = document.querySelector('.lang-current');
  if (current) current.textContent = initial === 'es' ? 'Español' : 'English';
  setupLanguageSwitcher();
  setupAccordions();
  setYear();
}

document.addEventListener('DOMContentLoaded', init);

