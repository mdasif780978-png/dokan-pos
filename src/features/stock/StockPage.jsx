import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CircleCheck, PackagePlus, Search, TriangleAlert } from 'lucide-react';
import { db } from '../../db/db';
import { adjustStock, isLowStock, matchesSearch } from '../../db/products';
import { round3 } from '../../domain/billing';
import { useI18n } from '../../i18n/I18nProvider';
import { useToast } from '../../components/Feedback';
import { NumberDialog } from '../../components/NumberDialog';
import { ProductThumb } from '../../components/ProductThumb';

function StockRow({ product, onAdd }) {
  const { t, name, qty } = useI18n();
  const low = isLowStock(product);
  return (
    <div className={`list-row static ${low ? 'list-row-low' : ''}`}>
      <ProductThumb product={product} className="list-thumb" />
      <span className="list-main">
        <span className="list-title">{name(product)}</span>
        <span className="list-sub">{t('stock.alertAt', { qty: qty(product.type, product.lowStock ?? 0) })}</span>
      </span>
      <span className={`stock-qty ${low ? 'low-text' : ''}`}>{qty(product.type, product.stock || 0)}</span>
      <button type="button" className="btn btn-lg" onClick={() => onAdd(product)}>
        <PackagePlus size={24} /> {t('stock.addStock')}
      </button>
    </div>
  );
}

export default function StockPage() {
  const { t, lang, name, num, qty } = useI18n();
  const toast = useToast();
  const products = useLiveQuery(() => db.products.toArray(), [], []);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(null);

  const low = useMemo(
    () => products.filter(isLowStock).sort((a, b) => (a.stock || 0) / (a.lowStock || 1) - (b.stock || 0) / (b.lowStock || 1)),
    [products],
  );
  const all = useMemo(
    () =>
      products
        .filter((p) => matchesSearch(p, query))
        .sort((a, b) => name(a).localeCompare(name(b), lang === 'bn' ? 'bn' : 'en')),
    [products, query, name, lang],
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('stock.title')}</h1>
      </header>

      <section className={`panel ${low.length ? 'panel-warn' : 'panel-ok'}`}>
        <h2 className="panel-title">
          {low.length ? <TriangleAlert size={28} /> : <CircleCheck size={28} />}
          {low.length ? `${t('stock.low')} — ${t('stock.lowCount', { n: num(low.length) })}` : t('stock.allGood')}
        </h2>
        {low.length > 0 && (
          <div className="list">
            {low.map((p) => (
              <StockRow key={p.id} product={p} onAdd={setAdding} />
            ))}
          </div>
        )}
      </section>

      <h2 className="section-title">{t('stock.all')}</h2>
      <div className="toolbar">
        <label className="search">
          <Search size={26} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('common.search')} />
        </label>
      </div>
      <div className="list">
        {all.map((p) => (
          <StockRow key={p.id} product={p} onAdd={setAdding} />
        ))}
      </div>

      {adding && (
        <NumberDialog
          title={name(adding)}
          info={
            <div className="entry-price">
              {t('stock.current')}: {qty(adding.type, adding.stock || 0)}
              <div className="muted small">{t('stock.addTitle')}</div>
            </div>
          }
          unit={adding.type === 'loose' ? t('unit.kg') : t('unit.pcs')}
          allowDecimal={adding.type === 'loose'}
          maxDecimals={3}
          presets={adding.type === 'loose' ? [5, 10, 25, 50] : [6, 12, 24, 48]}
          formatPreset={(n) => qty(adding.type, n)}
          preview={(n) => (
            <>
              {t('stock.after')}: <strong>{qty(adding.type, round3((adding.stock || 0) + n))}</strong>
            </>
          )}
          submitLabel={t('stock.addStock')}
          onClose={() => setAdding(null)}
          onSubmit={async (n) => {
            await adjustStock(adding.id, n);
            toast(t('stock.added'), 'success');
            setAdding(null);
          }}
        />
      )}
    </div>
  );
}
