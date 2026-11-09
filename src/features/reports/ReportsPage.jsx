import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, ChevronRight, Printer, Receipt as ReceiptIcon } from 'lucide-react';
import { getDayReport } from '../../db/reports';
import { useI18n } from '../../i18n/I18nProvider';
import { usePrint } from '../../print/PrintProvider';
import { EmptyState } from '../../components/EmptyState';
import { dayKey, dayRange, formatDate, formatTime, shiftDay } from '../../lib/format';

export default function ReportsPage() {
  const { t, lang, money, num, qty, name } = useI18n();
  const print = usePrint();
  const today = dayKey();
  const [day, setDay] = useState(today);
  const report = useLiveQuery(() => getDayReport(day), [day]);

  const stats = report && [
    { label: t('report.totalSales'), value: money(report.totalSales), cls: 'stat-main' },
    { label: t('report.bills'), value: num(report.billCount) },
    { label: t('report.cash'), value: money(report.cashFromSales) },
    { label: t('report.credit'), value: money(report.creditGiven), cls: report.creditGiven > 0 ? 'stat-due' : '' },
    { label: t('report.duePayments'), value: money(report.duePayments) },
    { label: t('report.cashInHand'), value: money(report.cashInHand), cls: 'stat-ok' },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('report.title')}</h1>
        <span className="spacer" />
        <div className="day-picker">
          <button type="button" className="btn btn-lg" onClick={() => setDay(shiftDay(day, -1))} aria-label={t('report.prevDay')}>
            <ChevronLeft size={28} />
          </button>
          <input
            type="date"
            value={day}
            max={today}
            onChange={(e) => e.target.value && setDay(e.target.value)}
            aria-label={t('report.title')}
          />
          <button type="button" className="btn btn-lg" disabled={day >= today} onClick={() => setDay(shiftDay(day, 1))} aria-label={t('report.nextDay')}>
            <ChevronRight size={28} />
          </button>
          {day !== today && (
            <button type="button" className="btn btn-lg" onClick={() => setDay(today)}>
              {t('common.today')}
            </button>
          )}
        </div>
      </header>
      <p className="muted day-label">{formatDate(dayRange(day)[0], lang)}</p>

      {report && (
        <>
          <div className="stat-cards report-stats">
            {stats.map((s) => (
              <div key={s.label} className={`stat-card ${s.cls || ''}`}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
          {report.discount > 0 && (
            <p className="muted">
              {t('report.discount')}: {money(report.discount)}
            </p>
          )}

          {report.billCount === 0 && report.duePayments === 0 ? (
            <EmptyState icon={ReceiptIcon} text={t('report.noSales')} />
          ) : (
            <div className="report-columns">
              <section className="panel">
                <h2 className="panel-title">{t('report.topItems')}</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t('receipt.item')}</th>
                      <th className="num">{t('report.qty')}</th>
                      <th className="num">{t('report.amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topItems.map((item, i) => (
                      <tr key={`${item.productId}-${i}`}>
                        <td>{num(i + 1)}</td>
                        <td>{name(item)}</td>
                        <td className="num">{qty(item.type, item.qty)}</td>
                        <td className="num">{money(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="panel">
                <h2 className="panel-title">{t('report.billList')}</h2>
                <div className="list">
                  {report.sales.map((s) => (
                    <div key={s.id} className="list-row static compact">
                      <span className="list-main">
                        <span className="list-title">
                          #{num(s.id, { max: 0 })} · {money(s.total)}
                        </span>
                        <span className="list-sub">
                          {formatTime(s.createdAt, lang)} · {s.customerName || t('report.walkIn')}
                          {s.due > 0 && <span className="due-text"> · {t('khata.due')} {money(s.due)}</span>}
                        </span>
                      </span>
                      <button type="button" className="btn" onClick={() => print(s)}>
                        <Printer size={22} /> {t('report.reprint')}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
