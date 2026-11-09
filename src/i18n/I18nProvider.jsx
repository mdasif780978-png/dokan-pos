import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { strings } from './strings';
import { formatMoney, formatNum, toBnDigits } from '../lib/format';
import { loadJSON, saveJSON } from '../lib/storage';
import { AppError } from '../lib/errors';
import { useSettings } from '../db/settings';

const interpolate = (text, vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`)) : text;

/**
 * Build translation + formatting helpers for a language.
 * Exported separately so the receipt can always be printed in Bangla.
 */
export function makeI18n(lang, currency = '৳') {
  const dict = strings[lang] || strings.bn;
  const t = (key, vars) => interpolate(dict[key] ?? strings.bn[key] ?? key, vars);
  const num = (n, opts) => formatNum(n, lang, opts);
  const digits = (s) => (lang === 'bn' ? toBnDigits(s ?? '') : String(s ?? ''));
  const money = (n) => formatMoney(n, lang, currency);

  /** "৫০০ গ্রাম", "২.৫ কেজি", "৩ পিস" */
  const qty = (type, q) => {
    if (type !== 'loose') return `${num(q, { max: 0 })} ${t('unit.pcs')}`;
    if (q !== 0 && Math.abs(q) < 1) return `${num(q * 1000, { max: 0 })} ${t('unit.g')}`;
    return `${num(q, { max: 3 })} ${t('unit.kg')}`;
  };
  /** "৳৮০/কেজি" */
  const unitPrice = (type, price) => `${money(price)}${t(type === 'loose' ? 'unit.perKg' : 'unit.perPc')}`;
  const name = (item) => (lang === 'en' ? item.nameEn || item.nameBn : item.nameBn || item.nameEn) || '—';
  const errorText = (err) =>
    err instanceof AppError ? t(err.code, err.vars) : t('err.generic', { msg: err?.message || String(err) });

  return { lang, currency, t, num, digits, money, qty, unitPrice, name, errorText };
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => (loadJSON('dokan.lang', 'bn') === 'en' ? 'en' : 'bn'));
  const { currency } = useSettings();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    saveJSON('dokan.lang', next);
  }, []);

  const value = useMemo(
    () => ({ ...makeI18n(lang, currency), setLang, toggleLang: () => setLang(lang === 'bn' ? 'en' : 'bn') }),
    [lang, currency, setLang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
