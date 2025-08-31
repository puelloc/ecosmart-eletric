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
  const initialLang = urlParams.get("lang") || "en";
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
