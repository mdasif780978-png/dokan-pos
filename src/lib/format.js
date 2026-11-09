/**
 * Number, money, weight and date formatting.
 * Bangla mode uses Bangla digits (০-৯) and lakh grouping (১,২৩,৪৫৬).
 */

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

export const toBnDigits = (value) => String(value).replace(/\d/g, (d) => BN_DIGITS[d]);
export const toEnDigits = (value) =>
  String(value).replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

/** Parse user input that may contain Bangla digits or commas. Returns 0 for invalid input. */
export function parseNum(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const s = toEnDigits(value ?? '').replace(/,/g, '').trim();
  if (!s) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

const locale = (lang) => (lang === 'bn' ? 'bn-BD' : 'en-IN');
const nfCache = new Map();

export function formatNum(n, lang, { min = 0, max = 2 } = {}) {
  const key = `${lang}|${min}|${max}`;
  let nf = nfCache.get(key);
  if (!nf) {
    nf = new Intl.NumberFormat(locale(lang), { minimumFractionDigits: min, maximumFractionDigits: max });
    nfCache.set(key, nf);
  }
  return nf.format(n || 0);
}

export function formatMoney(n, lang, symbol = '৳') {
  const value = n || 0;
  return `${value < 0 ? '-' : ''}${symbol}${formatNum(Math.abs(value), lang)}`;
}

export function formatDateTime(ts, lang, opts = { dateStyle: 'medium', timeStyle: 'short' }) {
  const text = new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', opts).format(new Date(ts));
  // The bn locale still writes "AM"/"PM" in Latin letters.
  return lang === 'bn' ? text.replace(/\bAM\b/, 'এএম').replace(/\bPM\b/, 'পিএম') : text;
}

export function formatTime(ts, lang) {
  return formatDateTime(ts, lang, { hour: 'numeric', minute: '2-digit' });
}

export function formatDate(ts, lang) {
  return formatDateTime(ts, lang, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
}

/** Local calendar day key, e.g. "2026-11-09". Used to group sales by day. */
export function dayKey(date = new Date()) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** [start, end) timestamps of a local day key. */
export function dayRange(key) {
  const [y, m, d] = key.split('-').map(Number);
  const start = new Date(y, m - 1, d).getTime();
  const end = new Date(y, m - 1, d + 1).getTime();
  return [start, end];
}

export function shiftDay(key, delta) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + delta));
}
