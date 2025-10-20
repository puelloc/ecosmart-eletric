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
      (lang === "es" ? "Llamar ahora 786-778-6654" : "Call now 786-778-6654")
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

// Minimize promotional banner function
function minimizePromoBanner() {
  const promoBanner = document.getElementById('promo-banner');
  const promoBannerMinimized = document.getElementById('promo-banner-minimized');

  if (promoBanner && promoBannerMinimized) {
    promoBanner.classList.add('minimized');
    promoBannerMinimized.classList.add('visible');
    // Store preference in localStorage
    localStorage.setItem('promoBannerState', 'minimized');
  }
}

// Expand promotional banner function
function expandPromoBanner() {
  const promoBanner = document.getElementById('promo-banner');
  const promoBannerMinimized = document.getElementById('promo-banner-minimized');

  if (promoBanner && promoBannerMinimized) {
    promoBanner.classList.remove('minimized');
    promoBannerMinimized.classList.remove('visible');
    // Store preference in localStorage
    localStorage.setItem('promoBannerState', 'expanded');
  }
}

// Check banner state on page load
document.addEventListener('DOMContentLoaded', function() {
  const promoBannerState = localStorage.getItem('promoBannerState');
  const promoBanner = document.getElementById('promo-banner');
  const promoBannerMinimized = document.getElementById('promo-banner-minimized');

  // Default to minimized unless user has expanded it
  if (promoBannerState === 'expanded' && promoBanner && promoBannerMinimized) {
    promoBanner.classList.remove('minimized');
    promoBannerMinimized.classList.remove('visible');
  } else if (promoBanner && promoBannerMinimized) {
    // Show minimized by default
    promoBanner.classList.add('minimized');
    promoBannerMinimized.classList.add('visible');
  }
});

// Close promotional banner function
function closePromoBanner() {
  const promoBanner = document.getElementById('promo-banner');
  if (promoBanner) {
    promoBanner.classList.add('hidden');
    // Store preference in localStorage so it stays closed
    localStorage.setItem('promoBannerClosed', 'true');
  }
}

// Check if promo banner was previously closed
document.addEventListener('DOMContentLoaded', function() {
  const promoBannerClosed = localStorage.getItem('promoBannerClosed');
  if (promoBannerClosed === 'true') {
    const promoBanner = document.getElementById('promo-banner');
    if (promoBanner) {
      promoBanner.classList.add('hidden');
    }
  }
});

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

// Service Modal Logic
const serviceData = {
  electrical_installations: {
    image: 'images/projects/1.webp',
    titleKey: 'electrical_installations_title',
    descriptionKey: 'modal_installations_description',
    featuresKey: 'modal_installations_features'
  },
  electrical_maintenance: {
    image: 'images/october/box_1.jpg',
    titleKey: 'electrical_maintenance_title',
    descriptionKey: 'modal_maintenance_description',
    featuresKey: 'modal_maintenance_features'
  },
  led_lighting: {
    image: 'images/october/light_1.jpg',
    titleKey: 'led_lighting_title',
    descriptionKey: 'modal_lighting_description',
    featuresKey: 'modal_lighting_features'
  }
};

function openServiceModal(serviceType) {
  const modal = document.getElementById('service-modal');
  const data = serviceData[serviceType];

  if (!data) return;

  // Get current language
  const currentLang = document.documentElement.lang || 'es';
  const dict = translations[currentLang] || translations['es'] || {};

  // Set modal content
  document.getElementById('modal-service-image').src = data.image;
  document.getElementById('modal-service-image').alt = dict[data.titleKey] || '';
  document.getElementById('modal-service-title').textContent = dict[data.titleKey] || '';
  document.getElementById('modal-service-description').textContent = dict[data.descriptionKey] || '';

  // Set features list
  const featuresList = document.getElementById('modal-service-features');
  featuresList.innerHTML = '';
  const features = dict[data.featuresKey] || [];
  if (Array.isArray(features)) {
    features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
  }

  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
  const modal = document.getElementById('service-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('service-modal');
  if (event.target === modal) {
    closeServiceModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeServiceModal();
  }
});

// Attach modal triggers to service buttons
document.addEventListener('DOMContentLoaded', function() {
  const serviceButtons = document.querySelectorAll('.service-more-btn');
  serviceButtons.forEach((btn, index) => {
    const serviceTypes = ['electrical_installations', 'electrical_maintenance', 'led_lighting'];
    btn.addEventListener('click', () => openServiceModal(serviceTypes[index]));
  });
});
