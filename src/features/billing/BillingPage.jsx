import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Package, ScanBarcode, Search, Sparkles } from 'lucide-react';
import { db } from '../../db/db';
import { findByBarcode, matchesSearch } from '../../db/products';
import { useSettings } from '../../db/settings';
import { computeTotals } from '../../domain/billing';
import { useI18n } from '../../i18n/I18nProvider';
import { useConfirm, useShowError, useToast } from '../../components/Feedback';
import { CategoryChips, categoriesOf } from '../../components/CategoryChips';
import { EmptyState } from '../../components/EmptyState';
import { LazyScanner } from '../../components/LazyScanner';
import { NumberDialog } from '../../components/NumberDialog';
import { Modal } from '../../components/Modal';
import { ProductThumb } from '../../components/ProductThumb';
import { useBarcodeWedge } from '../../hooks/useBarcodeWedge';
import { useItemRecognizers } from '../../vision/registry';
import { useCart } from './useCart';
import { ProductGrid } from './ProductGrid';
import { CartPanel } from './CartPanel';
import { WeightDialog } from './WeightDialog';
import { PaymentDialog } from './PaymentDialog';
import { SaleDoneDialog } from './SaleDoneDialog';

/** Line in the cart → product-like object for the dialogs (keeps the price the line was added at). */
const lineAsProduct = (line) => ({ id: line.productId, nameBn: line.nameBn, nameEn: line.nameEn, type: line.type, price: line.unitPrice });

export default function BillingPage() {
  const { t, lang, name, qty } = useI18n();
  const settings = useSettings();
  const toast = useToast();
  const confirm = useConfirm();
  const showError = useShowError();
  const recognizers = useItemRecognizers();
  const [cart, dispatch] = useCart();
  const products = useLiveQuery(() => db.products.toArray(), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  // Only one dialog at a time: { kind: 'weight'|'qty'|'pay'|'scan'|'done'|'ai', ... }
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);

  const sorted = useMemo(
    () => (products || []).slice().sort((a, b) => name(a).localeCompare(name(b), lang === 'bn' ? 'bn' : 'en')),
    [products, name, lang],
  );
  const categories = useMemo(() => categoriesOf(products), [products]);
  const visible = sorted.filter((p) => (!category || p.category === category) && matchesSearch(p, query));
  const cartQty = useMemo(() => new Map(cart.lines.map((l) => [l.productId, l.qty])), [cart.lines]);
  const totals = computeTotals(cart.lines, { ...cart, roundTotal: settings.roundTotal });

  const addPackaged = (product, n = 1) => {
    dispatch({ type: 'add', product, qty: n });
  };

  /** Tap on a product tile. */
  const pick = (product) => {
    if (product.type === 'loose') setDialog({ kind: 'weight', product });
    else addPackaged(product);
  };

  const handleBarcode = async (code) => {
    const product = await findByBarcode(code);
    if (!product) return toast(t('bill.notFound', { code }), 'error');
    if (product.type === 'loose') return setDialog({ kind: 'weight', product });
    addPackaged(product);
    return toast(t('bill.added', { name: name(product) }), 'success');
  };
  useBarcodeWedge(handleBarcode, !dialog);

  const onSearchKey = async (e) => {
    if (e.key !== 'Enter' || !query.trim()) return;
    const code = query.trim();
    if (await findByBarcode(code)) {
      await handleBarcode(code);
      setQuery('');
    } else if (visible.length === 1) {
      pick(visible[0]);
      setQuery('');
    }
  };

  const editLine = (line) =>
    setDialog({ kind: line.type === 'loose' ? 'weight' : 'qty', product: lineAsProduct(line), initial: line.qty, editing: true });

  const clearCart = async () => {
    if (await confirm({ message: t('bill.clearConfirm'), danger: true, confirmText: t('bill.clear') })) dispatch({ type: 'clear' });
  };

  const runRecognizer = async (recognizer) => {
    try {
      const results = await recognizer.recognize({ products: products || [], signal: new AbortController().signal });
      const byId = new Map((products || []).map((p) => [p.id, p]));
      const candidates = results.map((r) => ({ ...r, product: byId.get(r.productId) })).filter((r) => r.product);
      setDialog({ kind: 'ai', candidates });
    } catch (e) {
      showError(e);
    }
  };

  return (
    <div className="billing">
      <section className="billing-products">
        <div className="toolbar">
          <label className="search">
            <Search size={26} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKey}
              placeholder={t('common.search')}
              enterKeyHint="search"
            />
          </label>
          <button type="button" className="btn btn-lg btn-scan" onClick={() => setDialog({ kind: 'scan' })}>
            <ScanBarcode size={28} /> {t('bill.scan')}
          </button>
          {recognizers.map((r) => (
            <button key={r.id} type="button" className="btn btn-lg btn-ai" onClick={() => runRecognizer(r)}>
              <Sparkles size={26} /> {r.label?.[lang] || r.id}
            </button>
          ))}
        </div>
        <CategoryChips categories={categories} value={category} onChange={setCategory} />
        <div className="scroll-area">
          {products && products.length === 0 ? (
            <EmptyState icon={Package} text={t('bill.noProducts')} />
          ) : (
            <ProductGrid products={visible} cartQty={cartQty} onPick={pick} />
          )}
        </div>
      </section>

      <CartPanel
        cart={cart}
        totals={totals}
        onEditLine={editLine}
        onSetQty={(line, n) => dispatch({ type: 'setQty', productId: line.productId, qty: n })}
        onRemove={(line) => dispatch({ type: 'remove', productId: line.productId })}
        onClear={clearCart}
        onPay={() => setDialog({ kind: 'pay' })}
      />

      {dialog?.kind === 'weight' && (
        <WeightDialog
          product={dialog.product}
          initialKg={dialog.initial}
          editing={dialog.editing}
          onClose={close}
          onSubmit={(kg) => {
            dispatch(dialog.editing ? { type: 'setQty', productId: dialog.product.id, qty: kg } : { type: 'add', product: dialog.product, qty: kg });
            close();
          }}
        />
      )}

      {dialog?.kind === 'qty' && (
        <NumberDialog
          title={name(dialog.product)}
          info={<div className="entry-price">{t('qty.title')}</div>}
          unit={t('unit.pcs')}
          initial={dialog.initial}
          allowDecimal={false}
          presets={[1, 2, 3, 4, 5, 6, 10, 12]}
          formatPreset={(n) => qty('packaged', n)}
          submitLabel={t('weight.update')}
          onClose={close}
          onSubmit={(n) => {
            dispatch({ type: 'setQty', productId: dialog.product.id, qty: n });
            close();
          }}
        />
      )}

      {dialog?.kind === 'scan' && <LazyScanner continuous onScan={handleBarcode} onClose={close} />}

      {dialog?.kind === 'pay' && (
        <PaymentDialog
          cart={cart}
          dispatch={dispatch}
          onClose={close}
          onDone={(sale) => {
            dispatch({ type: 'clear' });
            setDialog({ kind: 'done', sale });
          }}
        />
      )}

      {dialog?.kind === 'done' && <SaleDoneDialog sale={dialog.sale} onClose={close} />}

      {dialog?.kind === 'ai' && (
        <Modal title={t('bill.aiSuggest')} size="lg" onClose={close}>
          <div className="pgrid">
            {dialog.candidates.map(({ product, confidence, grams }) => (
              <button
                key={product.id}
                type="button"
                className="pcard"
                onClick={() => {
                  if (product.type === 'loose') setDialog({ kind: 'weight', product, initial: grams ? grams / 1000 : undefined });
                  else {
                    addPackaged(product);
                    close();
                  }
                }}
              >
                <ProductThumb product={product} className="pcard-img" />
                <span className="pcard-name">{name(product)}</span>
                <span className="muted">{Math.round((confidence || 0) * 100)}%</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
