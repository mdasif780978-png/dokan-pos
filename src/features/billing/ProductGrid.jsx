import { Scale } from 'lucide-react';
import { ProductThumb } from '../../components/ProductThumb';
import { useI18n } from '../../i18n/I18nProvider';

/** Big product tiles. Tap = add to bill (loose items open the weight dialog). */
export function ProductGrid({ products, cartQty, onPick }) {
  const { t, name, unitPrice, qty } = useI18n();
  return (
    <div className="pgrid">
      {products.map((p) => {
        const inCart = cartQty.get(p.id);
        return (
          <button key={p.id} type="button" className={`pcard ${inCart ? 'in-cart' : ''}`} onClick={() => onPick(p)}>
            <ProductThumb product={p} className="pcard-img" />
            {inCart > 0 && <span className="pcard-count">{qty(p.type, inCart)}</span>}
            {p.type === 'loose' && (
              <span className="pcard-tag">
                <Scale size={16} /> {t('type.looseShort')}
              </span>
            )}
            <span className="pcard-name">{name(p)}</span>
            <span className="pcard-price">{unitPrice(p.type, p.price)}</span>
            {(p.stock || 0) <= 0 && <span className="pcard-out">{t('bill.outOfStock')}</span>}
          </button>
        );
      })}
    </div>
  );
}
