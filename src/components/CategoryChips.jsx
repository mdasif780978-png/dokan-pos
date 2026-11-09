import { useI18n } from '../i18n/I18nProvider';

/** Horizontal, scrollable category filter. value '' = all. */
export function CategoryChips({ categories, value, onChange }) {
  const { t } = useI18n();
  if (!categories.length) return null;
  return (
    <div className="chips" role="tablist">
      {['', ...categories].map((c) => (
        <button
          key={c || '__all'}
          type="button"
          role="tab"
          aria-selected={value === c}
          className={`chip ${value === c ? 'chip-active' : ''}`}
          onClick={() => onChange(c)}
        >
          {c || t('common.all')}
        </button>
      ))}
    </div>
  );
}

/** Categories ordered by how many products use them. */
export function categoriesOf(products) {
  const counts = new Map();
  for (const p of products || []) if (p.category) counts.set(p.category, (counts.get(p.category) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
}
