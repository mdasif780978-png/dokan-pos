import { useEffect, useRef, useState } from 'react';
import { Camera, Check } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { NumPad } from '../../components/NumPad';
import { Segmented } from '../../components/Segmented';
import { useShowError } from '../../components/Feedback';
import { useI18n } from '../../i18n/I18nProvider';
import { kgForAmount, round2, round3 } from '../../domain/billing';
import { parseNum } from '../../lib/format';
import { loadJSON, saveJSON } from '../../lib/storage';
import { AppError } from '../../lib/errors';
import { useWeightReaders } from '../../vision/registry';

const WEIGHT_PRESETS_G = [250, 500, 1000, 2000, 5000];
const TAKA_PRESETS = [10, 20, 50, 100, 200];

const initialFor = (kg) => {
  if (!(kg > 0)) return { mode: loadJSON('dokan.weightMode', 'kg'), value: '' };
  return kg < 1 ? { mode: 'g', value: String(Math.round(kg * 1000)) } : { mode: 'kg', value: String(kg) };
};

/**
 * Enter the weight of a loose item in kg, grams, or as a Taka amount
 * ("৫০ টাকার পেঁয়াজ"). Live price is shown while typing.
 */
export function WeightDialog({ product, initialKg, editing, onSubmit, onClose }) {
  const { t, lang, name, money, qty, digits, unitPrice } = useI18n();
  const showError = useShowError();
  const readers = useWeightReaders();
  const [{ mode, value }, setState] = useState(() => initialFor(initialKg));
  const [readingId, setReadingId] = useState(null);
  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const price = Number(product.price) || 0;
  const n = parseNum(value);
  const kg = mode === 'kg' ? round3(n) : mode === 'g' ? round3(n / 1000) : kgForAmount(n, price);
  const amount = round2(kg * price);

  const setValue = (v) => setState((s) => ({ ...s, value: v }));
  const changeMode = (m) => {
    if (m === mode) return;
    let next = '';
    if (kg > 0) next = m === 'kg' ? String(kg) : m === 'g' ? String(Math.round(kg * 1000)) : String(amount);
    if (m !== 'taka') saveJSON('dokan.weightMode', m);
    setState({ mode: m, value: next });
  };
  const preset = (g) => setState(g < 1000 ? { mode: 'g', value: String(g) } : { mode: 'kg', value: String(g / 1000) });

  const submit = () => {
    if (!(kg > 0)) return showError(new AppError('err.weightRequired'));
    return onSubmit(kg);
  };

  const readFrom = async (reader) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setReadingId(reader.id);
    try {
      const { grams } = await reader.readWeight({ product, signal: ctrl.signal });
      if (!ctrl.signal.aborted && grams > 0) setState({ mode: 'g', value: String(Math.round(grams)) });
    } catch (e) {
      if (!ctrl.signal.aborted) showError(e);
    } finally {
      setReadingId(null);
    }
  };

  const unitLabel = mode === 'kg' ? t('unit.kg') : mode === 'g' ? t('unit.g') : t('unit.taka');

  return (
    <Modal
      title={name(product)}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-lg btn-primary" onClick={submit}>
            <Check size={26} /> {editing ? t('weight.update') : t('weight.add')}
          </button>
        </>
      }
    >
      <div className="entry-layout">
        <div className="entry-info">
          <div className="entry-price">{unitPrice('loose', price)}</div>
          <Segmented
            options={[
              { value: 'kg', label: t('weight.modeKg') },
              { value: 'g', label: t('weight.modeG') },
              { value: 'taka', label: t('weight.modeTaka') },
            ]}
            value={mode}
            onChange={changeMode}
          />
          <div className="readout">
            <span className="readout-value">{digits(value || '0')}</span>
            <span className="readout-unit">{unitLabel}</span>
          </div>
          <div className="entry-result">
            {mode === 'taka' ? (
              <>
                {t('weight.weight')}: <strong>{kg > 0 ? qty('loose', kg) : '—'}</strong>
              </>
            ) : (
              <>
                {t('weight.price')}: <strong>{money(amount)}</strong>
              </>
            )}
          </div>
          <div className="presets">
            {mode === 'taka'
              ? TAKA_PRESETS.map((v) => (
                  <button key={v} type="button" className="btn preset" onClick={() => setValue(String(v))}>
                    {money(v)}
                  </button>
                ))
              : WEIGHT_PRESETS_G.map((g) => (
                  <button key={g} type="button" className="btn preset" onClick={() => preset(g)}>
                    {qty('loose', g / 1000)}
                  </button>
                ))}
          </div>
          {readers.map((r) => (
            <button key={r.id} type="button" className="btn btn-lg btn-ai" disabled={!!readingId} onClick={() => readFrom(r)}>
              <Camera size={24} /> {t('weight.readFrom', { name: r.label?.[lang] || r.id })}
              {readingId === r.id && '…'}
            </button>
          ))}
        </div>
        <NumPad
          value={value}
          onChange={setValue}
          onEnter={submit}
          allowDecimal={mode !== 'g'}
          maxDecimals={mode === 'kg' ? 3 : 2}
        />
      </div>
    </Modal>
  );
}
