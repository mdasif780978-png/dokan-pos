import { describe, expect, it } from 'vitest';
import { dayKey, formatMoney, parseNum, shiftDay, toBnDigits } from './format';

describe('format', () => {
  it('converts digits both ways', () => {
    expect(toBnDigits('1234.5')).toBe('১২৩৪.৫');
    expect(parseNum('১২৩.৫')).toBe(123.5);
    expect(parseNum('1,250')).toBe(1250);
    expect(parseNum('abc')).toBe(0);
  });

  it('formats Taka with lakh grouping', () => {
    expect(formatMoney(123456.5, 'bn')).toBe('৳১,২৩,৪৫৬.৫');
    expect(formatMoney(123456.5, 'en')).toBe('৳1,23,456.5');
  });

  it('builds local day keys', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('dates', () => {
  it('writes AM/PM in Bangla', async () => {
    const { formatDateTime } = await import('./format');
    const s = formatDateTime(new Date(2026, 10, 9, 15, 5).getTime(), 'bn');
    expect(s).toContain('পিএম');
    expect(s).not.toMatch(/[AP]M/);
  });
});
