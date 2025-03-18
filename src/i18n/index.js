/**
 * Internationalization Configuration
 * This file sets up i18next for multi-language support in the application.
 * It configures language detection, translation resources, and fallback options.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import zhTranslations from "./locales/zh.json";

// Initialize i18next with plugins and configuration
i18n
  // Auto-detect user's preferred language
  .use(LanguageDetector)
  // Connect with React
  .use(initReactI18next)
  // Configure i18next
  .init({
    // Define translation resources
    resources: {
      en: {
        translation: enTranslations,
      },
      zh: {
        translation: zhTranslations,
      },
    },
    // Default language if detection fails
    fallbackLng: "en",
    // Don't escape HTML in translations
    interpolation: {
      escapeValue: false,
    },
    // Language detection configuration
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
