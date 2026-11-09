/**
 * Simple flat grocery icons, drawn as SVG and bundled with the app, so they
 * work with no internet. A product stores only the icon key (e.g. icon: 'onion').
 * A photo, if added, is shown instead of the icon.
 * All drawings use a 64×64 viewBox.
 */

const bowl = (mound, dots, bowlColor = '#c8693a', rim = '#a9532b') => (
  <>
    <ellipse cx="32" cy="34" rx="21" ry="13" fill={mound} />
    {dots}
    <path d="M9 33h46a23 20 0 0 1-46 0z" fill={bowlColor} />
    <path d="M9 33h46" stroke={rim} strokeWidth="2.5" strokeLinecap="round" />
    <rect x="23" y="51" width="18" height="5" rx="2.5" fill={rim} />
  </>
);

const grain = (cx, cy, rot, fill) => (
  <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="2.6" ry="1.2" fill={fill} transform={`rotate(${rot} ${cx} ${cy})`} />
);

const sack = (body, band, tie, extra) => (
  <>
    <path d="M17 23c-8 9-11 22-6 31 1 3 4 4 7 4h28c3 0 6-1 7-4 5-9 2-22-6-31z" fill={body} />
    <path d="M19 24c3-8 8-12 13-12s10 4 13 12z" fill={body} stroke={tie} strokeWidth="1.5" />
    <rect x="17" y="20" width="30" height="5.5" rx="2.75" fill={tie} />
    <rect x="9" y="35" width="46" height="13" rx="2" fill={band} />
    {extra}
  </>
);

const bottle = (liquid, label, cap) => (
  <>
    <rect x="27" y="5" width="10" height="7" rx="2" fill={cap} />
    <path d="M28 12h8v5c0 3 9 6 9 15v22c0 3-2 5-5 5H24c-3 0-5-2-5-5V32c0-9 9-12 9-15z" fill={liquid} />
    <rect x="19" y="33" width="26" height="15" fill={label} />
    <path d="M24 30c0-4 3-6 5-7" stroke="#fff" strokeOpacity=".6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="40.5" r="4" fill="#fff" fillOpacity=".85" />
  </>
);

const packet = (body, crimp, band, content) => (
  <>
    <rect x="15" y="11" width="34" height="46" rx="4" fill={body} />
    <path d="M15 11h34v5l-4.25-3-4.25 3-4.25-3-4.25 3-4.25-3-4.25 3-4.25-3-4.25 3z" fill={crimp} />
    <rect x="15" y="29" width="34" height="16" fill={band} />
    {content}
  </>
);

export const ITEM_ICONS = {
  rice: {
    label: { bn: 'চাল', en: 'Rice' },
    bg: '#eef4ea',
    svg: bowl('#fffdf6', [grain(23, 28, -20, '#e8dfc4'), grain(31, 25, 10, '#e8dfc4'), grain(39, 28, 30, '#e8dfc4'), grain(27, 31, 60, '#e8dfc4'), grain(36, 31, -40, '#e8dfc4')]),
  },
  riceSack: {
    label: { bn: 'চালের বস্তা', en: 'Rice sack' },
    bg: '#f6efe0',
    svg: sack('#efe2c2', '#2f8f5b', '#b89a62', <>{grain(27, 41, -15, '#fff')}{grain(33, 40, 15, '#fff')}{grain(39, 42, -30, '#fff')}</>),
  },
  lentil: {
    label: { bn: 'ডাল', en: 'Lentil' },
    bg: '#fdeee4',
    svg: bowl('#e8762f', [[22, 29], [29, 25], [36, 26], [42, 30], [27, 31], [34, 31]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#c4561b" />), '#7a8f99', '#5d717b'),
  },
  atta: {
    label: { bn: 'আটা / ময়দা', en: 'Flour' },
    bg: '#f8f1e1',
    svg: sack('#fbf7ee', '#e0a02f', '#c9b48a', (
      <g fill="#fff">
        <path d="M32 46V36" stroke="#fff" strokeWidth="1.6" />
        <ellipse cx="29.5" cy="38.5" rx="1.8" ry="1" transform="rotate(-40 29.5 38.5)" />
        <ellipse cx="34.5" cy="38.5" rx="1.8" ry="1" transform="rotate(40 34.5 38.5)" />
        <ellipse cx="29.5" cy="42" rx="1.8" ry="1" transform="rotate(-40 29.5 42)" />
        <ellipse cx="34.5" cy="42" rx="1.8" ry="1" transform="rotate(40 34.5 42)" />
      </g>
    )),
  },
  sugar: {
    label: { bn: 'চিনি', en: 'Sugar' },
    bg: '#eaf2f8',
    svg: (
      <>
        <ellipse cx="32" cy="52" rx="24" ry="5" fill="#c9d9e8" />
        {[[12, 32], [32, 32], [22, 15]].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <rect x={x} y={y} width="20" height="18" rx="3" fill="#ffffff" stroke="#b9cde0" strokeWidth="1.5" />
            <path d={`M${x + 4} ${y + 5}h12`} stroke="#dce8f3" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </>
    ),
  },
  onion: {
    label: { bn: 'পেঁয়াজ', en: 'Onion' },
    bg: '#f8e9ef',
    svg: (
      <>
        <path d="M32 14c-2 6-14 11-16 23-2 12 7 20 16 20s18-8 16-20c-2-12-14-17-16-23z" fill="#b8456f" />
        <path d="M32 15c-2 9-7 16-7 25s3 14 7 17M32 15c2 9 7 16 7 25s-3 14-7 17" stroke="#e48fb0" strokeWidth="2" fill="none" />
        <path d="M32 15V8M32 9c-1-2-4-3-6-3M32 9c1-2 4-3 6-3" stroke="#5f9e45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M27 58l-1 3M32 58v3M37 58l1 3" stroke="#9c7b58" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  potato: {
    label: { bn: 'আলু', en: 'Potato' },
    bg: '#f6eee2',
    svg: (
      <>
        <path d="M11 37c-2-10 7-19 20-19 12 0 21 6 20 15s-7 17-19 17c-11 1-19-4-21-13z" fill="#c9995a" />
        <path d="M18 30c3-5 9-8 15-8" stroke="#dcb57f" strokeWidth="3" strokeLinecap="round" fill="none" />
        {[[22, 36], [33, 32], [41, 39], [29, 43]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.7" fill="#9b6c36" />)}
      </>
    ),
  },
  garlic: {
    label: { bn: 'রসুন', en: 'Garlic' },
    bg: '#f2f0ea',
    svg: (
      <>
        <path d="M32 13c-1 6-4 9-10 13-8 5-10 13-7 20 3 8 10 11 17 11s14-3 17-11c3-7 1-15-7-20-6-4-9-7-10-13z" fill="#fbf8f2" stroke="#d6cbb7" strokeWidth="1.6" />
        <path d="M32 19c-4 8-8 15-8 25s4 11 8 13M32 19c4 8 8 15 8 25s-4 11-8 13" stroke="#d6cbb7" strokeWidth="1.6" fill="none" />
        <path d="M32 13V7" stroke="#c4b496" strokeWidth="3" strokeLinecap="round" />
        <path d="M26 58l-1 3M32 58v3M38 58l1 3" stroke="#b39f7e" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  ginger: {
    label: { bn: 'আদা', en: 'Ginger' },
    bg: '#f7eedf',
    svg: (
      <>
        <path d="M9 40c0-5 5-8 10-7 1-7 8-10 13-6 3-6 12-6 14 1 5-1 10 4 9 10-1 5-6 7-10 6-2 6-10 8-15 5-4 5-13 3-15-2-4 0-6-3-6-7z" fill="#d9a466" />
        <path d="M20 37c2 2 2 5 0 7M33 31c2 3 2 6 0 9M45 34c2 2 2 5 0 7" stroke="#b5823f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  chili: {
    label: { bn: 'কাঁচা মরিচ', en: 'Green chili' },
    bg: '#e8f3e6',
    svg: (
      <>
        <path d="M15 19c4 0 6 3 8 8 4 12 12 21 27 25 3 1 2 5-1 5-20 0-33-13-37-31-1-4 0-7 3-7z" fill="#3d9b3d" />
        <path d="M17 24c3 10 9 19 19 24" stroke="#6cc06c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M14 19c-1-4 1-8 6-10" stroke="#2b6a2b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  oil: {
    label: { bn: 'সয়াবিন তেল', en: 'Soybean oil' },
    bg: '#fdf6dc',
    svg: bottle('#f2c230', '#d83a3a', '#c8102e'),
  },
  mustardOil: {
    label: { bn: 'সরিষার তেল', en: 'Mustard oil' },
    bg: '#fbf0d9',
    svg: bottle('#c9860f', '#2f7d3b', '#2f7d3b'),
  },
  salt: {
    label: { bn: 'লবণ', en: 'Salt' },
    bg: '#e7eefa',
    svg: packet('#2e6fd0', '#2459a8', '#ffffff', [[24, 35], [31, 39], [38, 34], [27, 41], [40, 41]].map(([x, y]) => (
      <rect key={`${x}${y}`} x={x} y={y} width="3.5" height="3.5" fill="#2e6fd0" transform={`rotate(45 ${x + 1.75} ${y + 1.75})`} />
    ))),
  },
  tea: {
    label: { bn: 'চা পাতা', en: 'Tea' },
    bg: '#e5f3eb',
    svg: packet('#2f8f5b', '#21704a', '#f3e6b8', (
      <>
        <path d="M24 42c0-8 7-12 16-11 0 9-7 13-16 11z" fill="#2f8f5b" />
        <path d="M25 41c4-3 8-6 13-8" stroke="#f3e6b8" strokeWidth="1.3" fill="none" />
      </>
    )),
  },
  egg: {
    label: { bn: 'ডিম', en: 'Egg' },
    bg: '#fbf4e8',
    svg: (
      <>
        <ellipse cx="32" cy="55" rx="21" ry="3.5" fill="#000" fillOpacity=".08" />
        <ellipse cx="24" cy="36" rx="11" ry="14.5" fill="#efd9b8" />
        <ellipse cx="40" cy="38" rx="11" ry="14.5" fill="#fbf2e3" stroke="#e6d2b0" strokeWidth="1.2" />
        <ellipse cx="36" cy="32" rx="3" ry="4.5" fill="#fff" />
        <ellipse cx="20" cy="30" rx="2.5" ry="4" fill="#f8ead4" />
      </>
    ),
  },
  biscuit: {
    label: { bn: 'বিস্কুট', en: 'Biscuit' },
    bg: '#fbefdd',
    svg: (
      <>
        <rect x="17" y="10" width="38" height="34" rx="6" fill="#cf8f45" />
        <rect x="9" y="20" width="38" height="34" rx="6" fill="#e5aa5c" />
        <rect x="12.5" y="23.5" width="31" height="27" rx="4" fill="none" stroke="#c88a3e" strokeWidth="1.4" strokeDasharray="2 2.6" />
        {[[20, 31], [28, 31], [36, 31], [20, 39], [28, 39], [36, 39], [24, 46], [32, 46]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill="#a96d2a" />)}
      </>
    ),
  },
  noodles: {
    label: { bn: 'নুডলস', en: 'Noodles' },
    bg: '#fdebe7',
    svg: (
      <>
        <path d="M40 4l-8 30M49 6L36 34" stroke="#8b5a2b" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M14 33c2-6 5 2 8-3s5 3 8-2 5 3 8-2 5 3 8-2 4 4 5 6" stroke="#f2c14e" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M9 33h46a23 20 0 0 1-46 0z" fill="#d9483b" />
        <path d="M14 40h36" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
        <rect x="23" y="51" width="18" height="5" rx="2.5" fill="#a8352b" />
      </>
    ),
  },
  soap: {
    label: { bn: 'সাবান', en: 'Soap' },
    bg: '#fbe9f1',
    svg: (
      <>
        <rect x="8" y="28" width="40" height="24" rx="10" fill="#f08db5" />
        <rect x="13" y="31" width="30" height="7" rx="3.5" fill="#f6b6d0" />
        {[[48, 20, 7], [38, 13, 4], [55, 32, 3.5]].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#e3f3fc" stroke="#94cdee" strokeWidth="1.5" />
        ))}
      </>
    ),
  },
  detergent: {
    label: { bn: 'ডিটারজেন্ট', en: 'Detergent' },
    bg: '#e5f0fb',
    svg: (
      <>
        <rect x="13" y="14" width="38" height="44" rx="3" fill="#1f7bd6" />
        <rect x="13" y="14" width="38" height="9" fill="#1663b0" />
        <path d="M26 14v-4h12v4" stroke="#1663b0" strokeWidth="3" fill="none" />
        <circle cx="32" cy="40" r="10" fill="#fff" />
        <path d="M26 41c2 4 8 5 11 1" stroke="#1f7bd6" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="30" r="3" fill="#bfe0ff" />
        <circle cx="20" cy="50" r="2.4" fill="#bfe0ff" />
      </>
    ),
  },
  milk: {
    label: { bn: 'গুঁড়া দুধ', en: 'Milk powder' },
    bg: '#eaf1fa',
    svg: (
      <>
        <rect x="16" y="14" width="32" height="42" rx="3" fill="#ffffff" stroke="#c4d2e2" strokeWidth="1.5" />
        <ellipse cx="32" cy="14" rx="16" ry="4.5" fill="#1f6fbf" />
        <rect x="16" y="28" width="32" height="16" fill="#1f6fbf" />
        <path d="M32 31c3 4 5 6 5 8a5 5 0 0 1-10 0c0-2 2-4 5-8z" fill="#fff" />
        <ellipse cx="32" cy="56" rx="16" ry="3" fill="#c4d2e2" />
      </>
    ),
  },
};

export const ICON_KEYS = Object.keys(ITEM_ICONS);

/** The bare SVG for an icon key, or null for an unknown key. */
export function ItemIcon({ name, className = '' }) {
  const icon = ITEM_ICONS[name];
  if (!icon) return null;
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {icon.svg}
    </svg>
  );
}
