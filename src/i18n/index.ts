/**
 * Vybzzz Internationalization System
 * Supports 13 languages: FR, EN, ES, PT, IT, KO, JA, ZH, AR, DE, BN, HI
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Import all locale files
import fr from './locales/fr';
import en from './locales/en';
import es from './locales/es';
import pt from './locales/pt';
import it from './locales/it';
import ko from './locales/ko';
import ja from './locales/ja';
import zh from './locales/zh';
import ar from './locales/ar';
import de from './locales/de';
import bn from './locales/bn';
import hi from './locales/hi';

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'ko' | 'ja' | 'zh' | 'ar' | 'de' | 'bn' | 'hi';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, flag: '🇧🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, flag: '🇩🇪' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', rtl: false, flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' },
];

const translations: Record<SupportedLanguage, typeof fr> = {
  fr,
  en,
  es,
  pt,
  it,
  ko,
  ja,
  zh,
  ar,
  de,
  bn,
  hi,
};

const STORAGE_KEY = '@vybzzz_language';
const DEFAULT_LANGUAGE: SupportedLanguage = 'fr';

interface I18nContextType {
  language: SupportedLanguage;
  languageInfo: LanguageInfo;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper to get nested translation value
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return key if translation not found
    }
  }
  return typeof value === 'string' ? value : path;
};

// Replace params in translation string
const interpolate = (str: string, params?: Record<string, string | number>): string => {
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() ?? `{{${key}}}`;
  });
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.some(l => l.code === saved)) {
        setLanguageState(saved as SupportedLanguage);
        updateRTL(saved as SupportedLanguage);
      }
    } catch (error) {
      console.warn('Failed to load language preference:', error);
    }
  };

  const updateRTL = (lang: SupportedLanguage) => {
    const langInfo = LANGUAGES.find(l => l.code === lang);
    if (langInfo) {
      I18nManager.forceRTL(langInfo.rtl);
    }
  };

  const setLanguage = async (lang: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      setLanguageState(lang);
      updateRTL(lang);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language], key);
    return interpolate(translation, params);
  };

  const languageInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const isRTL = languageInfo.rtl;

  return React.createElement(
    I18nContext.Provider,
    { value: { language, languageInfo, t, setLanguage, isRTL } },
    children
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

export default { I18nProvider, useTranslation, LANGUAGES };
