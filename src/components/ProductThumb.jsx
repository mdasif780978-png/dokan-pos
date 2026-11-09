import { useI18n } from '../i18n/I18nProvider';

const COLORS = ['#e8f3ee', '#fdf0e1', '#e9eefb', '#fbe9ec', '#f1ebfb', '#e6f4f7', '#f5f3dc'];
const INK = ['#006a4e', '#a3570c', '#2d4fa3', '#b3263a', '#6a3fb0', '#0d6f80', '#6b6214'];

const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('bn', { granularity: 'grapheme' }) : null;

/** First visible letter, keeping Bangla vowel signs attached (e.g. "পেঁ" not "প"). */
function firstLetter(text) {
  if (!text) return '?';
  if (segmenter) return segmenter.segment(text)[Symbol.iterator]().next().value?.segment ?? '?';
  return Array.from(text)[0];
}

/** Product photo, or a coloured tile with the first letter when there is no photo. */
export function ProductThumb({ product, className = '' }) {
  const { name } = useI18n();
  if (product.photo) return <img className={`thumb ${className}`} src={product.photo} alt="" draggable="false" />;
  const i = Math.abs(Number(product.id ?? product.productId) || 0) % COLORS.length;
  return (
    <div className={`thumb thumb-letter ${className}`} style={{ background: COLORS[i], color: INK[i] }} aria-hidden="true">
      {firstLetter(name(product))}
    </div>
  );
}
