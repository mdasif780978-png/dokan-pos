# দোকান হিসাব — Dokan Hishab

An offline-first Progressive Web App (PWA) for small grocery shops in Bangladesh.
It covers billing, stock, the baki khata (credit book) and daily reports. It runs
completely without internet and installs on an Android tablet with
**Add to Home Screen**.

- **React 19 + Vite 8**
- **IndexedDB via Dexie.** All data stays on the tablet. There is no server and no account.
- **Service worker (vite-plugin-pwa / Workbox).** The whole app, including the
  Bangla font, is precached, so it opens and works with no internet.
- **html5-qrcode** for camera barcode scanning. On Android Chrome it uses the
  fast built-in `BarcodeDetector`. USB and Bluetooth barcode guns also work.
- The UI is Bangla first, with an English toggle, large text and big touch
  buttons. It is laid out for a 10-inch tablet and also works in portrait and
  on phones.

## Features (v1)

| Screen | What it does |
|---|---|
| **Splash** | An animated logo and app name each time the app opens (about 2 seconds, tap to skip). The same logo is the home-screen icon, and Android's launch screen uses the same green. |
| **Sign in** | First run: shop name, owner name, mobile number and a 4–6 digit PIN. After that the app stays signed in until **Log out**; then it asks for the PIN only. The PIN is stored hashed (PBKDF2). 5 wrong tries lock sign-in for 1 minute. Works offline. See `src/auth/README.md`. |
| **বিক্রি / Billing** | Tap products, or scan barcodes with the camera or a scanner gun. For loose items you enter the weight in **kg**, **grams** or **Taka** ("৫০ টাকার পেঁয়াজ"), and the price is calculated as you type. The screen shows the running total, discount (৳ or %), cash received, change, and the amount that goes to baki. |
| **Receipt** | Bangla receipt sized for **58 mm** (or 80 mm) thermal paper, printed through the normal browser print dialog. The shop name is at the top. Bills can be reprinted from the report or the khata. |
| **Demo items** | 20 common items (rice, dal, atta, sugar, salt, oil, onion, potato, garlic, egg, tea, biscuit, noodles, soap, detergent…) with Bangla + English names, typical Taka prices and starting stock. They are added after the first sign-in, and again from Settings at any time. Each has a built-in offline icon; add a photo to replace it. |
| **পণ্য / Products** | Name in Bangla and English, photo (taken with the camera, auto-shrunk) or a built-in icon, category, type (loose per kg / packaged per piece), price, optional barcode, stock and low-stock alert level. |
| **স্টক / Stock** | Stock goes down automatically with every sale. A low-stock warning list (also shown as a badge in the menu) has quick "add stock" buttons for when new goods arrive. |
| **বাকি খাতা / Credit** | Customers with name and phone. Credit sales go to the khata automatically. You can record payments or add old dues by hand, and see each customer's due and full history. |
| **রিপোর্ট / Report** | For any day: total sales, number of bills, cash vs credit, dues collected, expected cash in the drawer, top-selling items and the list of bills. |
| **সেটিংস / Settings** | Owner account (change PIN, log out), shop name, address and phone, currency symbol (৳), receipt footer, paper width, rounding to whole Taka, language, test print, backup download/restore, **Load demo items**, and **Clear all data** (asks for the PIN). |

---

## 1. Run it locally

You need **Node.js 20.19+ or 22.12+** (check with `node -v`). Download it from https://nodejs.org (LTS).

```bash
cd dokan-pos
```

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. The service worker is **not** active in dev mode, so to test offline mode and installation use the production build:

```bash
npm run build
```

```bash
npm run preview
```

Open http://localhost:4173. To check offline mode, open DevTools → Network → set **Offline**, then reload. The app still loads.

Run the unit tests (billing math, sale → stock → khata transaction, reports):

```bash
npm test
```

### Try it on the tablet over Wi-Fi (optional)

The camera only works on **HTTPS** or `localhost`, so the easiest real-device test is the free Vercel deployment below. To just look at the layout on the tablet over your Wi-Fi:

```bash
npm run preview -- --host
```

Then open the `Network:` address it prints on the tablet. The camera scanner and setting a PIN won't work there, because that address isn't HTTPS. Use the Vercel link for real testing.

---

## 2. Deploy free on Vercel

### Option A: through GitHub (recommended, and it updates automatically)

1. Create a free account at https://github.com and make a new **empty** repository, e.g. `dokan-pos`.
2. Push the code from the `dokan-pos` folder (replace `YOUR-NAME`):

   ```bash
   git init
   ```

   ```bash
   git add .
   ```

   ```bash
   git commit -m "Dokan Hishab v1"
   ```

   ```bash
   git branch -M main
   ```

   ```bash
   git remote add origin https://github.com/YOUR-NAME/dokan-pos.git
   ```

   ```bash
   git push -u origin main
   ```

3. Go to https://vercel.com and sign up free with **Continue with GitHub**.
4. Click **Add New… → Project**, then pick the `dokan-pos` repository and click **Import**.
5. Vercel detects **Vite** on its own (Build: `npm run build`, Output: `dist`; `vercel.json` sets this too). Click **Deploy**.
6. After about a minute you get a link like `https://dokan-pos.vercel.app`. Open it on the tablet.

From then on, every `git push` to `main` redeploys automatically. The app on the tablet shows **"অ্যাপের নতুন ভার্সন এসেছে — আপডেট করুন"**, so the shopkeeper decides when to update and a bill in progress is never interrupted.

### Option B: from your computer with the Vercel CLI

```bash
npm install -g vercel
```

```bash
vercel login
```

```bash
vercel --prod
```

Answer the questions with the defaults. It prints your live URL.

> `vercel.json` already handles the important parts. All routes fall back to
> `index.html` (so `/khata/3` works on reload), `sw.js` is never cached by the
> CDN (so updates arrive), and hashed assets are cached forever.

---

## 3. Install on the Android tablet

1. Open your Vercel URL in **Chrome** on the tablet (with internet, once).
2. Wait for the message **"অ্যাপটি এখন ইন্টারনেট ছাড়াও চলবে"** (*the app now works without internet*).
3. Tap **⋮ → Add to Home screen / Install app**, or go to **সেটিংস → হোম স্ক্রিনে ইনস্টল করুন**.
4. Open it from the home screen icon. It runs full-screen like a normal app, with or without internet.
5. The first time, create the owner account (shop name, owner name, mobile, PIN). The 20 demo items are added automatically, so edit their prices to match your shop.
6. Allow the camera when you tap **স্ক্যান** the first time.

**Forgot the PIN?** It can't be recovered, because there is no server. On the PIN
screen, **পিন ভুলে গেছেন?** (Forgot PIN?) lets you erase the device and start again;
then restore your latest backup file.

**Keep your data safe.** All data lives only on that tablet. Installing the app
makes the browser keep its storage, and Settings shows whether storage is
persistent. Still, use **সেটিংস → ব্যাকআপ ডাউনলোড** regularly and keep the file
on Google Drive or WhatsApp. **ব্যাকআপ থেকে ফেরত আনুন** restores it on any
device. Clearing Chrome's site data or uninstalling the app deletes the data.

## 4. Thermal printer (58 mm) setup

The receipt is printed through Android's print system. Because of that, Bangla
text prints correctly. Most cheap printers' raw text mode can't print Bangla
at all.

1. Pair the Bluetooth printer in Android Settings (or connect it by USB OTG).
2. Install a **print service** that supports your printer. Two options:
   - **RawBT** (Play Store) works with most 58 mm ESC/POS printers. In RawBT,
     select your printer and paper width **58 mm**, then turn on its print
     service under *Android Settings → Connected devices → Printing*.
   - Your printer brand's own print-service plugin, if it has one.
3. In the app, go to **সেটিংস → টেস্ট প্রিন্ট**. In the print dialog choose your
   printer. The app sets the page to exactly 58 mm wide and one receipt long.
   If the text is too small or too large, adjust the scale in the print
   service settings.
4. For 80 mm printers, set **প্রিন্টার কাগজের মাপ → 80 mm** in Settings.

---

## Project structure

```
src/
  brand/                   logo-mark.svg (the logo) + Logo.jsx
  auth/                    Offline owner account: PIN hashing, lockout, AuthProvider (Supabase-ready, see its README)
  domain/billing.js        Pure billing math: cart reducer, totals, discount, rounding, change (unit-tested)
  db/                      Dexie database and data functions
    db.js                  schema (products, customers, ledger, sales, settings)
    sales.js               createSale(): bill + stock reduction + khata in ONE transaction
    products.js, customers.js, reports.js, settings.js
    backup.js              backup download/restore + clearAllData()
    demoItems.js           the 20 demo grocery items
  features/                One folder per screen
    auth/  billing/  products/  stock/  khata/  reports/  settings/
  components/              Shared UI: Splash, Modal, NumPad, BarcodeScanner, NumberDialog, toasts/confirm,
                           itemIcons.jsx (the offline grocery icons)…
  print/                   Receipt.jsx (58/80 mm layout) + PrintProvider (browser print)
  i18n/                    strings.js (all Bangla + English text), I18nProvider (digits, ৳, kg/g)
  vision/                  Plug-in point for the future camera-AI module (see below)
  styles/                  app.css (tablet UI) + print.css (receipt)
```

### Adding the camera AI module later

`src/vision/registry.js` defines two plug-in types:

- **WeightReader**: reads the weight from a normal scale's display. When one
  is registered, a "Read from camera" button appears in the weight dialog.
- **ItemRecognizer**: recognises the product on the counter. Its button
  appears in the billing toolbar and shows suggestions as large tiles.

Nothing is registered in v1, so no AI buttons show. To add one, write the
module and register it in `src/vision/index.js`. Billing, stock and receipt
code stays unchanged. See `src/vision/README.md` for the interfaces and notes
on keeping models available offline.

### Changing the logo

Edit `src/brand/logo-mark.svg`, then rebuild the favicon and home-screen icons
(this needs Playwright's Chromium, which is not a project dependency):

```bash
npx -y playwright@1 install chromium
```

```bash
npm install --no-save playwright@1 && node scripts/make-icons.cjs
```

### Changing the database later

Add a new `db.version(3).stores({...})` (with an `.upgrade()` if needed) in
`src/db/db.js`. Never edit the existing versions (1 = shop data, 2 = sign-in),
because tablets already have data in them.
