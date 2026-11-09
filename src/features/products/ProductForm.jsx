import { useRef, useState } from 'react';
import { ImagePlus, ScanBarcode, Trash2, X } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Segmented } from '../../components/Segmented';
import { LazyScanner } from '../../components/LazyScanner';
import { useConfirm, useShowError, useToast } from '../../components/Feedback';
import { useI18n } from '../../i18n/I18nProvider';
import { DEFAULT_LOW_STOCK, deleteProduct, saveProduct } from '../../db/products';
import { fileToThumbnail } from '../../lib/image';
import { ICON_KEYS, ITEM_ICONS, ItemIcon } from '../../components/itemIcons';
import { ProductThumb } from '../../components/ProductThumb';

const DEFAULT_CATEGORIES = ['চাল-ডাল', 'মুদি', 'তেল', 'মসলা', 'সবজি', 'ডিম-দুধ', 'নাস্তা', 'পানীয়', 'প্রসাধনী', 'ধোয়ামোছা'];

const toForm = (p) => ({
  id: p?.id,
  nameBn: p?.nameBn ?? '',
  nameEn: p?.nameEn ?? '',
  category: p?.category ?? '',
  type: p?.type ?? 'packaged',
  price: p?.price != null ? String(p.price) : '',
  barcode: p?.barcode ?? '',
  stock: p?.stock != null ? String(p.stock) : '',
  lowStock: p?.lowStock != null ? String(p.lowStock) : '',
  photo: p?.photo,
  icon: p?.icon,
});

/** Add / edit a product. `product` undefined = new product. */
export function ProductForm({ product, categories, onClose }) {
  const { t, lang, name } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();
  const showError = useShowError();
  const [form, setForm] = useState(() => toForm(product));
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const loose = form.type === 'loose';
  const allCategories = [...new Set([...categories, ...DEFAULT_CATEGORIES])];

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const photo = await fileToThumbnail(file);
      setForm((f) => ({ ...f, photo }));
    } catch (err) {
      showError(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProduct(form);
      toast(t('common.saved'), 'success');
      onClose();
    } catch (err) {
      showError(err);
      setSaving(false);
    }
  };

  const remove = async () => {
    const ok = await confirm({
      message: t('products.deleteConfirm', { name: name(product) }),
      danger: true,
      confirmText: t('common.delete'),
    });
    if (!ok) return;
    await deleteProduct(product.id);
    toast(t('common.deleted'));
    onClose();
  };

  return (
    <Modal
      title={product ? t('products.edit') : t('products.add')}
      size="lg"
      onClose={onClose}
      footer={
        <>
          {product && (
            <button type="button" className="btn btn-lg btn-danger-ghost" onClick={remove}>
              <Trash2 size={24} /> {t('common.delete')}
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="product-form" className="btn btn-lg btn-primary" disabled={saving}>
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="product-form" className="form product-form" onSubmit={submit}>
        <div className="photo-field">
          {form.photo ? (
            <div className="photo-preview">
              <img src={form.photo} alt="" />
              <button type="button" className="icon-btn photo-remove" aria-label={t('form.removePhoto')} onClick={() => setForm((f) => ({ ...f, photo: undefined }))}>
                <X size={22} />
              </button>
            </div>
          ) : form.icon ? (
            <ProductThumb product={form} className="photo-icon-preview" />
          ) : (
            <button type="button" className="photo-placeholder" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={40} />
              <span>{t('form.addPhoto')}</span>
            </button>
          )}
          {(form.photo || form.icon) && (
            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={22} /> {t('form.addPhoto')}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
          {!form.photo && (
            <div className="field-block">
              <span>{t('form.icon')}</span>
              <div className="icon-picker">
                <button
                  type="button"
                  className={`icon-pick icon-pick-none ${!form.icon ? 'selected' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, icon: undefined }))}
                  title={t('form.noIcon')}
                  aria-label={t('form.noIcon')}
                >
                  <X size={18} />
                </button>
                {ICON_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`icon-pick ${form.icon === key ? 'selected' : ''}`}
                    style={{ background: ITEM_ICONS[key].bg }}
                    onClick={() => setForm((f) => ({ ...f, icon: key }))}
                    title={ITEM_ICONS[key].label[lang]}
                    aria-label={ITEM_ICONS[key].label[lang]}
                  >
                    <ItemIcon name={key} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-fields">
          <label className="field-block">
            <span>{t('form.nameBn')}</span>
            <input value={form.nameBn} onChange={set('nameBn')} lang="bn" placeholder="যেমন: মসুর ডাল" />
          </label>
          <label className="field-block">
            <span>{t('form.nameEn')}</span>
            <input value={form.nameEn} onChange={set('nameEn')} lang="en" placeholder="e.g. Red Lentil" />
          </label>
          <label className="field-block">
            <span>{t('form.category')}</span>
            <input value={form.category} onChange={set('category')} list="category-list" />
            <datalist id="category-list">
              {allCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <div className="field-block">
            <span>{t('form.type')}</span>
            <Segmented
              options={[
                { value: 'loose', label: t('type.loose') },
                { value: 'packaged', label: t('type.packaged') },
              ]}
              value={form.type}
              onChange={(type) => setForm((f) => ({ ...f, type }))}
            />
          </div>

          <div className="form-row">
            <label className="field-block">
              <span>{loose ? t('form.pricePerKg') : t('form.pricePerPc')}</span>
              <input value={form.price} onChange={set('price')} inputMode="decimal" required />
            </label>
            <label className="field-block">
              <span>{loose ? t('form.stockKg') : t('form.stockPcs')}</span>
              <input value={form.stock} onChange={set('stock')} inputMode="decimal" placeholder="0" />
            </label>
          </div>

          <div className="form-row">
            <label className="field-block">
              <span>{t('form.barcode')}</span>
              <div className="input-with-btn">
                <input value={form.barcode} onChange={set('barcode')} inputMode="numeric" />
                <button type="button" className="btn" onClick={() => setScanning(true)} aria-label={t('form.scanBarcode')}>
                  <ScanBarcode size={24} />
                </button>
              </div>
            </label>
            <label className="field-block">
              <span>{t('form.lowStock')}</span>
              <input value={form.lowStock} onChange={set('lowStock')} inputMode="decimal" placeholder={String(DEFAULT_LOW_STOCK[form.type])} />
            </label>
          </div>
        </div>
      </form>

      {scanning && (
        <LazyScanner
          title={t('form.barcode')}
          onClose={() => setScanning(false)}
          onScan={(code) => setForm((f) => ({ ...f, barcode: code }))}
        />
      )}
    </Modal>
  );
}
