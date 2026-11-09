/**
 * Builds the favicon and the home-screen / Android splash icons from
 * src/brand/logo-mark.svg (the single source of the logo).
 *
 * Only needed when the logo changes. Requires Playwright (not a project dependency):
 *   npx -y playwright@1 install chromium
 *   npm install --no-save playwright@1 && node scripts/make-icons.cjs
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const GREEN = '#006a4e';
const mark = fs.readFileSync(path.join(root, 'src/brand/logo-mark.svg'), 'utf8');
const inner = mark.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '');

// Rounded-square icon (favicon, "any" purpose icons).
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${GREEN}"/>
  <g transform="translate(256 254) scale(0.94) translate(-256 -254)">${inner}</g>
</svg>
`;
// Full-bleed icon: Android crops maskable icons to a circle/squircle, so keep the logo in the 80% safe zone.
const fullBleed = (scale) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${GREEN}"/>
  <g transform="translate(256 254) scale(${scale}) translate(-256 -254)">${inner}</g>
</svg>`;

fs.writeFileSync(path.join(root, 'public/favicon.svg'), rounded);

const jobs = [
  ['icon-192.png', 192, rounded],
  ['icon-512.png', 512, rounded],
  ['icon-maskable-512.png', 512, fullBleed(0.72)],
  ['apple-touch-icon.png', 180, fullBleed(0.8)],
];

(async () => {
  const browser = await chromium.launch();
  for (const [name, size, svg] of jobs) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await page.screenshot({ path: path.join(root, 'public/icons', name), omitBackground: true });
    await page.close();
  }
  await browser.close();
  console.log('Icons written to public/icons and public/favicon.svg');
})();
