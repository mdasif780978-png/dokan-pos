import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Barcode, Package, Plus, Search } from 'lucide-react';
import { db } from '../../db/db';
import { isLowStock, matchesSearch } from '../../db/products';
import { loadDemoItems } from '../../db/demoItems';
import { useI18n } from '../../i18n/I18nProvider';
import { useToast } from '../../components/Feedback';
import { CategoryChips, categoriesOf } from '../../components/CategoryChips';
import { EmptyState } from '../../components/EmptyState';
import { ProductThumb } from '../../components/ProductThumb';
import { ProductForm } from './ProductForm';

export default function ProductsPage() {
  const { t, lang, name, num, qty, unitPrice } = useI18n();
  const toast = useToast();
  const products = useLiveQuery(() => db.products.toArray(), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {product} = edit

  const categories = useMemo(() => categoriesOf(products), [products]);
  const visible = useMemo(
    () =>
      (products || [])
        .filter((p) => (!category || p.category === category) && matchesSearch(p, query))
        .sort((a, b) => name(a).localeCompare(name(b), lang === 'bn' ? 'bn' : 'en')),
    [products, category, query, name, lang],
  );

  const loadSamples = async () => {
    const added = await loadDemoItems();
    toast(t('auth.demoLoaded', { n: num(added) }), 'success');
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('products.title')}</h1>
        {products?.length > 0 && <span className="muted">{t('products.count', { n: num(products.length) })}</span>}
        <span className="spacer" />
        <button type="button" className="btn btn-lg btn-primary" onClick={() => setEditing({})}>
          <Plus size={26} /> {t('products.add')}
        </button>
      </header>

      {products?.length > 0 && (
        <>
          <div className="toolbar">
            <label className="search">
              <Search size={26} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('common.search')} />
            </label>
          </div>
          <CategoryChips categories={categories} value={category} onChange={setCategory} />
        </>
      )}

      {products && products.length === 0 ? (
        <EmptyState icon={Package} text={t('products.empty')}>
          <div className="row-gap">
            <button type="button" className="btn btn-lg btn-primary" onClick={() => setEditing({})}>
              <Plus size={26} /> {t('products.add')}
            </button>
            <button type="button" className="btn btn-lg" onClick={loadSamples}>
              {t('products.loadSample')}
            </button>
          </div>
        </EmptyState>
      ) : (
        <div className="list">
          {visible.map((p) => (
            <button key={p.id} type="button" className="list-row" onClick={() => setEditing({ product: p })}>
              <ProductThumb product={p} className="list-thumb" />
              <span className="list-main">
                <span className="list-title">{name(p)}</span>
                <span className="list-sub">
                  {lang === 'bn' ? p.nameEn : p.nameBn}
                  {p.category && ` · ${p.category}`}
                  {p.barcode && (
                    <>
                      {' · '}
                      <Barcode size={16} className="inline-icon" /> {p.barcode}
                    </>
                  )}
                </span>
              </span>
              <span className="list-side">
                <span className="list-price">{unitPrice(p.type, p.price)}</span>
                <span className={isLowStock(p) ? 'low-text' : 'muted'}>
                  {t('nav.stock')}: {qty(p.type, p.stock || 0)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {editing && <ProductForm product={editing.product} categories={categories} onClose={() => setEditing(null)} />}
    </div>
  );
}
