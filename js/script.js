// Language translations object
let translations = {};

// Load translations from JSON files
async function loadTranslations() {
  try {
    const [enResponse, esResponse] = await Promise.all([
      fetch('./lang/en.json'),
      fetch('./lang/es.json')
    ]);

    const enData = await enResponse.json();
    const esData = await esResponse.json();

    translations = {
      en: enData,
      es: esData
    };
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fallback to empty objects if loading fails
    translations = { en: {}, es: {} };
  }
}

// Apply a language pack to all [data-i18n] nodes
function applyLang(lang) {
  const dict = translations[lang] || translations.en || {};

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  document.documentElement.lang = (lang === "es" ? "es" : "en");

  // Update CTA aria-label to keep it accessible in each language
  const callBtn = document.querySelector(".cta[href^='tel:']");
  if (callBtn) {
    callBtn.setAttribute("aria-label",
      (lang === "es" ? "Llamar ahora 111-111-1111" : "Call now 111-111-1111")
    );
  }
}

// Initialize the application
async function init() {
  // Load translations first
  await loadTranslations();

  // Set up language selector
  const select = document.getElementById("lang");
  if (select) {
    select.addEventListener("change", e => applyLang(e.target.value));
  }

  // Apply initial language (from URL parameter or default to English)
  const urlParams = new URLSearchParams(location.search);
  const initialLang = urlParams.get("lang") || "es";
  applyLang(initialLang);

  // Set the language selector to match
  if (select) {
    select.value = initialLang;
  }

  // Set current year in footer
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Project gallery scrolling
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.project-gallery');
    const leftBtn = document.querySelector('.scroll-left');
    const rightBtn = document.querySelector('.scroll-right');

    // Set initial scroll buttons visibility
    updateScrollButtonsVisibility();

    if (leftBtn && rightBtn && gallery) {
        leftBtn.addEventListener('click', () => {
            gallery.scrollBy({ left: -340, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            gallery.scrollBy({ left: 340, behavior: 'smooth' });
        });

        // Update button visibility on scroll
        gallery.addEventListener('scroll', updateScrollButtonsVisibility);
    }

    function updateScrollButtonsVisibility() {
        if (gallery.scrollLeft <= 0) {
            leftBtn.style.opacity = '0.4';
            leftBtn.style.pointerEvents = 'none';
        } else {
            leftBtn.style.opacity = '0.9';
            leftBtn.style.pointerEvents = 'auto';
        }

        if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 5) {
            rightBtn.style.opacity = '0.4';
            rightBtn.style.pointerEvents = 'none';
        } else {
            rightBtn.style.opacity = '0.9';
            rightBtn.style.pointerEvents = 'auto';
        }
    }

    // Handle touch scrolling for mobile
    let startX;
    let scrollLeft;

    gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - gallery.offsetLeft;
        const walk = (x - startX);
        gallery.scrollLeft = scrollLeft - walk;
    }, { passive: true });
});

// FAQ accordion logic
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', function() {
      // Close all items except the one clicked
      faqItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          i.querySelector('.faq-icon').innerHTML = '&#x25BC;';
        }
      });
      // Toggle the clicked item
      const isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
        questionBtn.querySelector('.faq-icon').innerHTML = '&#x25BC;';
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
        questionBtn.querySelector('.faq-icon').innerHTML = '&#x25B2;';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // ...existing code...
  initFAQAccordion();
});
