import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

export const SUPPORTED_LOCALES = ['uz', 'ru', 'en'];
export const DEFAULT_LOCALE = 'uz';
export const LOCALE_NAMES = { uz: "O'zbekcha", ru: 'Русский', en: 'English' };
const FLAG_BASE = import.meta.env.BASE_URL;
export const LOCALE_FLAGS = { uz: `${FLAG_BASE}flags/uz.svg`, ru: `${FLAG_BASE}flags/ru.svg`, en: `${FLAG_BASE}flags/en.svg` };

const DICTS = { uz, ru, en };

const I18nContext = createContext({ locale: DEFAULT_LOCALE, t: (k) => k });

export function I18nProvider({ children }) {
  const { locale: rawLocale } = useParams();
  const locale = SUPPORTED_LOCALES.includes(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const value = useMemo(() => {
    const dict = DICTS[locale] || DICTS[DEFAULT_LOCALE];
    const t = (key, replace = {}) => {
      let value = dict[key] ?? key;
      Object.entries(replace).forEach(([k, v]) => {
        value = value.replace(`:${k}`, v);
      });
      return value;
    };
    return { locale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function localePath(locale, path = '') {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean === '' ? `/${locale}` : `/${locale}/${clean}`;
}

export function pickLocalized(field, locale) {
  if (!field || typeof field !== 'object') return '';
  if (field[locale]) return field[locale];
  if (field[DEFAULT_LOCALE]) return field[DEFAULT_LOCALE];
  const first = Object.values(field).find((v) => v);
  return first || '';
}
